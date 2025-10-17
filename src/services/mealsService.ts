import { apiService } from "./api";

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
  ingredients: Ingredient[];
}

export interface CreateMealPayload {
  name: string;
  description?: string;
  ingredients: Ingredient[];
}

class MealsService {
  async getMeals(): Promise<Meal[]> {
    try {
      const response = await apiService.get<Meal[]>("/meals");

      if (response.error) {
        console.error("Error fetching meals:", response.error);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error in getMeals:", error);
      return [];
    }
  }

  async createMeal(payload: CreateMealPayload): Promise<Meal | null> {
    try {
      const response = await apiService.post<Meal>("/meals", payload);

      if (response.error) {
        console.error("Error creating meal:", response.error);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error("Error in createMeal:", error);
      return null;
    }
  }

  async deleteMeal(mealId: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/meals/${mealId}`);

      if (response.error) {
        console.error("Error deleting meal:", response.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteMeal:", error);
      return false;
    }
  }

  calculateMealTotals(meal: Meal) {
    const totals = meal.ingredients.reduce(
      (acc, ingredient) => {
        const multiplier = ingredient.quantity / 100;
        return {
          calories: acc.calories + (ingredient.calories || 0) * multiplier,
          protein: acc.protein + (ingredient.protein || 0) * multiplier,
          carbs: acc.carbs + (ingredient.carbs || 0) * multiplier,
          fat: acc.fat + (ingredient.fat || 0) * multiplier,
          fiber: acc.fiber + (ingredient.fiber || 0) * multiplier,
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
