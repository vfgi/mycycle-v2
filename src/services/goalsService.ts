import { goalsStorage } from "./goalsStorage";
import { userStorage } from "./userStorage";
import { Goals } from "../types/goals";

function profileHasGoals(goals: unknown): goals is Goals {
  if (!goals || typeof goals !== "object") return false;
  const g = goals as Partial<Goals> & { objective?: unknown };
  if (g.objective != null && String(g.objective).trim() !== "") return true;
  const keys: (keyof Goals)[] = [
    "targetWeight",
    "targetBodyFat",
    "targetCalories",
    "targetProtein",
    "targetCarbs",
    "targetFat",
    "weeklyWorkouts",
    "dailyExercises",
    "waterIntake",
  ];
  return keys.some((k) => typeof g[k] === "number" && !Number.isNaN(g[k] as number));
}

export class GoalsService {
  async getGoals(): Promise<Goals | null> {
    try {
      const profile = await userStorage.getUserProfile();
      if (profile?.goals && profileHasGoals(profile.goals)) {
        return profile.goals as Goals;
      }
      return await goalsStorage.getGoals();
    } catch (error) {
      console.error("Error getting goals:", error);
      return null;
    }
  }

  async saveGoals(goals: Goals): Promise<void> {
    try {
      await goalsStorage.setGoals(goals);
    } catch (error) {
      console.error("Error saving goals:", error);
      throw error;
    }
  }
}

export const goalsService = new GoalsService();
