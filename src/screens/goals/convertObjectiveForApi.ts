import { ObjectiveType } from "../../types/goals";

export function convertObjectiveForAPI(
  objective?: ObjectiveType
): string | undefined {
  if (!objective) return undefined;

  const objectiveMap: Record<ObjectiveType, string> = {
    weightLoss: "weight_loss",
    hypertrophy: "hypertrophy",
    definition: "definition",
  };

  return objectiveMap[objective];
}
