import {
  MealHistoryEntry,
  HistoryEntry,
} from "../../../../services/mealsHistoryService";

export interface ConsumptionItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
  type: "meal" | "supplement";
  mealHistoryEntry?: MealHistoryEntry | HistoryEntry;
}
