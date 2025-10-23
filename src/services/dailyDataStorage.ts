import AsyncStorage from "@react-native-async-storage/async-storage";

const DAILY_DATA_KEY = "@MyCycle:dailyData";

export interface DailyConsumptionData {
  date: string; // YYYY-MM-DD format
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  water: number;
  lastUpdated: string;
}

export interface DailyWeightData {
  date: string; // YYYY-MM-DD format
  weight: number; // in kg
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
  lastUpdated: string;
}

export interface DailyExerciseData {
  date: string; // YYYY-MM-DD format
  exercisesCompleted: number;
  totalExercises: number;
  totalDuration: number; // in seconds
  caloriesBurned: number;
  lastUpdated: string;
}

export interface DailyData {
  consumption: DailyConsumptionData | null;
  weight: DailyWeightData | null;
  exercise: DailyExerciseData | null;
}

class DailyDataStorage {
  async getDailyData(date: string): Promise<DailyData> {
    try {
      const key = `${DAILY_DATA_KEY}:${date}`;
      const data = await AsyncStorage.getItem(key);
      return data
        ? JSON.parse(data)
        : { consumption: null, weight: null, exercise: null };
    } catch (error) {
      console.error("Error getting daily data from storage:", error);
      return { consumption: null, weight: null, exercise: null };
    }
  }

  async setDailyConsumptionData(data: DailyConsumptionData): Promise<void> {
    try {
      const key = `${DAILY_DATA_KEY}:${data.date}`;
      const existingData = await this.getDailyData(data.date);

      const updatedData: DailyData = {
        ...existingData,
        consumption: data,
      };

      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving daily consumption data:", error);
      throw error;
    }
  }

  async setDailyWeightData(data: DailyWeightData): Promise<void> {
    try {
      const key = `${DAILY_DATA_KEY}:${data.date}`;
      const existingData = await this.getDailyData(data.date);

      const updatedData: DailyData = {
        ...existingData,
        weight: data,
      };

      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving daily weight data:", error);
      throw error;
    }
  }

  async setDailyExerciseData(data: DailyExerciseData): Promise<void> {
    try {
      const key = `${DAILY_DATA_KEY}:${data.date}`;
      const existingData = await this.getDailyData(data.date);

      const updatedData: DailyData = {
        ...existingData,
        exercise: data,
      };

      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving daily exercise data:", error);
      throw error;
    }
  }

  async updateDailyData(
    date: string,
    updates: Partial<DailyData>
  ): Promise<void> {
    try {
      const key = `${DAILY_DATA_KEY}:${date}`;
      const existingData = await this.getDailyData(date);

      const updatedData: DailyData = {
        ...existingData,
        ...updates,
      };

      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error updating daily data:", error);
      throw error;
    }
  }

  async clearDailyData(date: string): Promise<void> {
    try {
      const key = `${DAILY_DATA_KEY}:${date}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error clearing daily data:", error);
      throw error;
    }
  }

  async clearAllDailyData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const dailyDataKeys = keys.filter((key) =>
        key.startsWith(DAILY_DATA_KEY)
      );
      await AsyncStorage.multiRemove(dailyDataKeys);
    } catch (error) {
      console.error("Error clearing all daily data:", error);
      throw error;
    }
  }
}

export const dailyDataStorage = new DailyDataStorage();
