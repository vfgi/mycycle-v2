import { apiService } from "./api";
import { dailyDataStorage } from "./dailyDataStorage";

export interface IngredientHistory {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionData {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  total_sodium: number;
  total_sugar: number;
  ingredients: IngredientHistory[];
}

export interface SupplementData {
  name: string;
  time: string;
  amount: string;
  protein: string;
  calories: string;
  frequency: string;
  description: string;
  carbohydrates?: string;
}

export interface HistoryEntry {
  id: string;
  supplement_id?: string;
  meal_id?: string;
  client_id: string;
  recorded_by_user_id: string;
  recorded_by_user_type: string;
  supplement_data?: SupplementData;
  nutrition_data?: NutritionData;
  notes: string;
  recorded_at: string;
  timezone: string;
  type: "meal" | "supplement";
}

export interface NutritionSummary {
  calories: {
    average: number;
    goal: number;
    days: Array<{ day: string; value: number; status: string }>;
  };
  protein: {
    average: number;
    goal: number;
    days: Array<{ day: string; value: number; status: string }>;
  };
  carbs: {
    average: number;
    goal: number;
    days: Array<{ day: string; value: number; status: string }>;
  };
  fat: {
    average: number;
    goal: number;
    days: Array<{ day: string; value: number; status: string }>;
  };
  start_date: string;
  end_date: string;
}

export interface SimplifiedNutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  meals_count: number;
}

export interface HistoryResponse {
  history: HistoryEntry[];
  nutrition_summary: SimplifiedNutritionSummary;
}

export interface MealHistoryRequest {
  meal_id: string;
  recorded_at: string;
  timezone: string;
  nutrition_data: NutritionData;
  notes?: string;
}

export interface RemoveMealHistoryRequest {
  meal_id: string;
  date: string;
  client_id?: string;
}

export interface RemoveMealHistoryByIdRequest {
  historyId: string;
}

export interface MealHistoryEntry {
  id: string;
  meal_id: string;
  client_id: string;
  recorded_by_user_id: string;
  recorded_by_user_type: string;
  notes: string;
  recorded_at: string;
  timezone: string;
  nutrition_data: NutritionData;
  ingredients?: IngredientHistory[];
}

class MealsHistoryService {
  async addMealToHistory(mealHistory: MealHistoryRequest): Promise<void> {
    const response = await apiService.post<void>("/meals/history", mealHistory);

    if (response.error) {
      throw new Error(response.error);
    }
  }

  async removeMealFromHistory(
    removeData: RemoveMealHistoryRequest
  ): Promise<void> {
    const requestBody = {
      meal_id: removeData.meal_id,
      date: removeData.date,
    };

    const response = await apiService.delete<void>(
      "/meals/history/remove",
      requestBody
    );

    if (response.error) {
      throw new Error(response.error);
    }
  }

  async getMealHistoryByDay(
    clientId: string,
    date: string
  ): Promise<MealHistoryEntry[]> {
    const response = await apiService.get<MealHistoryEntry[]>(
      `/meals/history/client/${clientId}/day?date=${date}`
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Invalid server response");
    }

    return response.data;
  }

  async getHistoryByDay(
    clientId: string,
    date: string
  ): Promise<HistoryResponse | null> {
    const response = await apiService.get<HistoryResponse>(
      `/meals/history/client/${clientId}/day?date=${date}`
    );

    if (response.error) {
      console.error("Error fetching history:", response.error);
      return null;
    }

    if (!response.data) {
      return null;
    }

    // Atualizar storage com dados de consumo
    await dailyDataStorage.setDailyConsumptionData({
      date,
      calories: response.data.nutrition_summary.calories,
      protein: response.data.nutrition_summary.protein,
      carbs: response.data.nutrition_summary.carbs,
      fat: response.data.nutrition_summary.fat,
      fiber: response.data.nutrition_summary.fiber,
      sodium: response.data.nutrition_summary.sodium,
      sugar: response.data.nutrition_summary.sugar,
      water: 2.0,
      lastUpdated: new Date().toISOString(),
    });

    return response.data;
  }

  async updateDailyDataStorage(
    clientId: string,
    date: string,
    history: HistoryResponse
  ): Promise<void> {
    await dailyDataStorage.setDailyConsumptionData({
      date,
      calories: history.nutrition_summary.calories,
      protein: history.nutrition_summary.protein,
      carbs: history.nutrition_summary.carbs,
      fat: history.nutrition_summary.fat,
      fiber: history.nutrition_summary.fiber,
      sodium: history.nutrition_summary.sodium,
      sugar: history.nutrition_summary.sugar,
      water: 2.0,
      lastUpdated: new Date().toISOString(),
    });
  }
}

export const mealsHistoryService = new MealsHistoryService();
