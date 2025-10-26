import { z } from "zod";

export const mealSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  meal_type: z.enum(
    ["breakfast", "lunch", "dinner", "snack"],
    "Selecione o tipo de refeição"
  ),
  description: z.string().optional(),
});

export type MealFormData = z.infer<typeof mealSchema>;

export interface IngredientTemplate {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface SelectedIngredient {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  quantity: number;
  template?: IngredientTemplate;
}
