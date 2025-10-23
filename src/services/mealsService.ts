import { apiService } from "./api";
import { dailyDataStorage, DailyConsumptionData } from "./dailyDataStorage";

export interface Ingredient {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs?: number;
  fat: number;
  fiber: number;
  sodium?: number;
  image_url?: string;
  quantity: number;
  order: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  ingredients: Ingredient[];
  last_consumed_at?: string; // Data da última vez que foi consumida
}

export interface NutritionDay {
  day: string;
  value: number;
  status: "below_target" | "on_target" | "above_target";
}

export interface NutritionSummary {
  average: number;
  goal: number;
  days: NutritionDay[];
}

export interface MealsResponse {
  meals: Meal[];
  nutrition_summary: {
    calories: NutritionSummary;
    protein: NutritionSummary;
    carbs: NutritionSummary;
    fat: NutritionSummary;
    start_date: string;
    end_date: string;
  };
}

export interface CreateMealPayload {
  name: string;
  description?: string;
  ingredients: Ingredient[];
}

class MealsService {
  async getMeals(date?: string): Promise<Meal[]> {
    try {
      const endpoint = date ? `/meals?date=${date}` : "/meals";

      if (date) {
        // Para endpoints com data, retorna MealsResponse
        const response = await apiService.get<MealsResponse>(endpoint);

        if (response.error) {
          console.error("Error fetching meals:", response.error);
          return [];
        }

        const meals = response.data?.meals || [];
        return meals;
      } else {
        // Para endpoint sem data, retorna array direto
        const response = await apiService.get<Meal[]>(endpoint);
        if (response.error) {
          console.error("Error fetching meals:", response.error);
          return [];
        }
        return response.data || [];
      }
    } catch (error) {
      console.error("Error in getMeals:", error);
      return [];
    }
  }

  async getMealsWithNutrition(date: string): Promise<MealsResponse | null> {
    try {
      const response = await apiService.get<MealsResponse>(
        `/meals?date=${date}`
      );

      if (response.error) {
        return null;
      }

      const data = response.data;
      if (data) {
        // Salvar dados de consumo no storage para a tela home
        await this.updateDailyConsumptionData(data, date);
      }

      return data || null;
    } catch (error) {
      console.error("Error in getMealsWithNutrition:", error);
      return null;
    }
  }

  async createMeal(payload: CreateMealPayload): Promise<Meal | null> {
    try {
      const response = await apiService.post<Meal>("/meals", payload);

      if (response.error) {
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in createMeal:", error);
      return null;
    }
  }

  async updateMeal(
    mealId: string,
    payload: CreateMealPayload
  ): Promise<Meal | null> {
    try {
      const response = await apiService.put<Meal>(`/meals/${mealId}`, payload);

      if (response.error) {
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in updateMeal:", error);
      return null;
    }
  }

  async deleteMeal(mealId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/meals/${mealId}`);

      if (response.error) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteMeal:", error);
      return false;
    }
  }

  async updateMealStatus(
    mealId: string,
    isActive: boolean
  ): Promise<Meal | null> {
    try {
      const response = await apiService.patch<Meal>(`/meals/${mealId}`, {
        is_active: isActive,
      });

      if (response.error) {
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in updateMealStatus:", error);
      return null;
    }
  }

  async updateDailyConsumptionData(
    data: MealsResponse,
    date: string
  ): Promise<void> {
    try {
      const consumptionData: DailyConsumptionData = {
        date,
        calories: Math.round(
          data.nutrition_summary.calories.days[
            data.nutrition_summary.calories.days.length - 1
          ]?.value || 0
        ),
        protein:
          data.nutrition_summary.protein.days[
            data.nutrition_summary.protein.days.length - 1
          ]?.value || 0,
        carbs:
          data.nutrition_summary.carbs.days[
            data.nutrition_summary.carbs.days.length - 1
          ]?.value || 0,
        fat:
          data.nutrition_summary.fat.days[
            data.nutrition_summary.fat.days.length - 1
          ]?.value || 0,
        fiber: 0,
        sodium: 0,
        sugar: 0,
        water: 2.0,
        lastUpdated: new Date().toISOString(),
      };

      await dailyDataStorage.setDailyConsumptionData(consumptionData);
    } catch (error) {
      console.error("Error updating daily consumption data:", error);
    }
  }

  calculateMealTotals(meal: Meal) {
    const totals = meal.ingredients.reduce(
      (acc, ingredient) => {
        // Os valores já vêm como totais da API, não precisamos multiplicar
        return {
          calories: acc.calories + (ingredient.calories || 0),
          protein: acc.protein + (ingredient.protein || 0),
          carbs: acc.carbs + (ingredient.carbs || 0),
          fat: acc.fat + (ingredient.fat || 0),
          fiber: acc.fiber + (ingredient.fiber || 0),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
      fiber: Math.round(totals.fiber * 10) / 10,
    };
  }
}

export const mealsService = new MealsService();
