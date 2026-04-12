import { apiService } from "./api";
import type { MealPhotoAnalysisResult } from "../types/mealPhotoAiAnalysis";

export type MealPhotoFile = {
  uri: string;
  mimeType: string;
};

function fileNameForMime(mimeType: string): string {
  if (mimeType.includes("png")) return "meal-photo.png";
  if (mimeType.includes("webp")) return "meal-photo.webp";
  if (mimeType.includes("heic")) return "meal-photo.heic";
  return "meal-photo.jpg";
}

export async function analyzeMealPhoto(
  photo: MealPhotoFile,
  language: string
): Promise<MealPhotoAnalysisResult> {
  const filePart = {
    uri: photo.uri,
    type: photo.mimeType,
    name: fileNameForMime(photo.mimeType),
  };
  const formData = new FormData();
  formData.append("photo", filePart as any);
  formData.append("language", language);
  const rawParts = (formData as any)._parts as unknown[] | undefined;
  console.log("[aiMealPhoto] enviando", {
    language,
    photoField: filePart,
    formDataParts: Array.isArray(rawParts)
      ? rawParts.map((row) => {
          const r = row as [string, unknown];
          const key = r[0];
          const val = r[1];
          if (val && typeof val === "object" && val !== null && "uri" in val) {
            const o = val as { uri?: string; type?: string; name?: string };
            return [key, { uri: o.uri, type: o.type, name: o.name }];
          }
          return [key, val];
        })
      : rawParts,
  });

  const res = await apiService.postMultipart<MealPhotoAnalysisResult>(
    "/ai/analyze-meal-photo",
    formData
  );

  if (res.error) {
    console.log("[aiMealPhoto] resposta com erro", {
      error: res.error,
      message: res.message,
    });
    throw new Error(res.error);
  }

  if (res.data == null || typeof res.data !== "object") {
    throw new Error("Invalid analysis response");
  }

  return res.data;
}
