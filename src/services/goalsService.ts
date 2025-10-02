import { apiService } from "./api";
import { goalsStorage } from "./goalsStorage";
import { Goals } from "../types/goals";

export class GoalsService {
  async getGoals(): Promise<Goals | null> {
    try {
      const goalsFromStorage = await goalsStorage.getGoals();
      return goalsFromStorage;
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
