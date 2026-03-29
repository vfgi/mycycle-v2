const GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

const CONSUMPTION_EXAMPLE = `Exemplo de estrutura de consumo (nutrition_data) usada no app ao registrar refeição:
{
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number,
  "total_fiber": number,
  "total_sodium": number,
  "total_sugar": number,
  "ingredients": [
    {
      "name": string,
      "quantity": number,
      "unit": string,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ]
}`;

const buildPrompt = () =>
  `Analise a imagem desta refeição. Identifique os produtos e estime calorias e macros.
Retorne um JSON estrito com:
- "prato": string (nome ou descrição curta do prato)
- "itens": array de strings (alimentos identificados)
- "calorias_totais": number
- "macros": objeto com "proteina", "carbo", "gordura" (numbers em gramas quando aplicável; use 0 se desconhecido)
- "nutrition_data": objeto no mesmo formato do exemplo abaixo, alinhando totais e ingredientes à sua análise.

${CONSUMPTION_EXAMPLE}`;

export type GeminiMealAnalysisResult = {
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

export async function analyzeMealPhotoWithGemini(
  apiKey: string,
  base64Image: string,
  mimeType: string
): Promise<GeminiMealAnalysisResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [
      {
        parts: [
          { text: buildPrompt() },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await response.json();

  if (!response.ok) {
    const msg =
      typeof raw?.error?.message === "string"
        ? raw.error.message
        : `HTTP ${response.status}`;
    throw new Error(msg);
  }

  const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Empty model response");
  }

  return JSON.parse(text) as GeminiMealAnalysisResult;
}
