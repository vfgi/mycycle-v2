export type MealPhotoAnalysisResult = {
  prato?: string;
  itens?: string[];
  calorias_totais?: number;
  macros?: {
    proteina?: number;
    carbo?: number;
    gordura?: number;
  };
  nutrition_data?: {
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    total_fiber: number;
    total_sodium: number;
    total_sugar: number;
    ingredients: Array<{
      name: string;
      quantity: number;
      unit: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
  };
};
