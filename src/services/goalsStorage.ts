import AsyncStorage from "@react-native-async-storage/async-storage";
import { Goals } from "../types/goals";

const GOALS_STORAGE_KEY = "@MyCycle:goals";

class GoalsStorage {
  async getGoals(): Promise<Goals | null> {
    try {
      const goals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      return goals ? JSON.parse(goals) : null;
    } catch (error) {
      console.error("Error getting goals from storage:", error);
      return null;
    }
  }

  async setGoals(goals: Goals): Promise<void> {
    try {
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error("Error saving goals to storage:", error);
      throw error;
    }
  }

  async clearGoals(): Promise<void> {
    try {
      await AsyncStorage.removeItem(GOALS_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing goals from storage:", error);
      throw error;
    }
  }
}

export const goalsStorage = new GoalsStorage();
