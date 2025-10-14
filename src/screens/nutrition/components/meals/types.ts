export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  calories_per_unit?: number;
  protein_per_unit?: number;
  carbs_per_unit?: number;
  fat_per_unit?: number;
}

export interface Meal {
  id: string;
  name: string;
  description?: string;
  meal_type: "breakfast" | "snack" | "lunch" | "dinner";
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions?: string;
  preparation_time?: number;
  cooking_time?: number;
  difficulty?: "easy" | "medium" | "hard";
  image: any; // Para imagens locais
  is_consumed?: boolean;
  active: boolean;
}

export interface DietPlan {
  name: string;
  description: string;
  is_active: boolean;
  meals: Meal[];
}
