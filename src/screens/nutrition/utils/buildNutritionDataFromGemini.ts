import type { MealPhotoAnalysisResult } from "../../../types/mealPhotoAiAnalysis";
import type { NutritionData } from "../../../services/mealsHistoryService";

export function hasAiDetectedFood(
  analysis: MealPhotoAnalysisResult
): boolean {
  const ingredients = analysis.nutrition_data?.ingredients;
  if (
    ingredients?.some(
      (i) =>
        (typeof i?.name === "string" && i.name.trim().length > 0) ||
        (Number(i?.quantity) > 0 && typeof i?.name === "string")
    )
  ) {
    return true;
  }
  const itens = analysis.itens;
  if (
    itens?.some((s) => typeof s === "string" && s.trim().length > 0)
  ) {
    return true;
  }
  return false;
}

export function buildNutritionDataFromGemini(
  analysis: MealPhotoAnalysisResult
): NutritionData {
  const nd = analysis.nutrition_data;
  const ingredients =
    nd?.ingredients?.map((ing) => ({
      name: ing.name ?? "",
      quantity: Number(ing.quantity) || 0,
      unit: ing.unit || "g",
      calories: Number(ing.calories) || 0,
      protein: Number(ing.protein) || 0,
      carbs: Number(ing.carbs) || 0,
      fat: Number(ing.fat) || 0,
    })) ?? [];

  return {
    total_calories:
      Number(nd?.total_calories) || Number(analysis.calorias_totais) || 0,
    total_protein:
      Number(nd?.total_protein) ||
      Number(analysis.macros?.proteina) ||
      0,
    total_carbs:
      Number(nd?.total_carbs) || Number(analysis.macros?.carbo) || 0,
    total_fat:
      Number(nd?.total_fat) || Number(analysis.macros?.gordura) || 0,
    total_fiber: Number(nd?.total_fiber) || 0,
    total_sodium: Number(nd?.total_sodium) || 0,
    total_sugar: Number(nd?.total_sugar) || 0,
    ingredients,
  };
}
