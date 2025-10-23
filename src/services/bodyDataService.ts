import AsyncStorage from "@react-native-async-storage/async-storage";
import { userStorage } from "./userStorage";
import { goalsService } from "./goalsService";
import { Measurements } from "../types/auth";
import { UserBodyData, processUserBodyData } from "../utils/bodyCalculations";
import { dailyDataStorage, DailyWeightData } from "./dailyDataStorage";

const WEIGHT_HISTORY_KEY = "@MyCycle:weightHistory";
const MEASUREMENTS_HISTORY_KEY = "@MyCycle:measurementsHistory";

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
  notes?: string;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  measurements: Measurements;
  notes?: string;
}

export interface ProcessedBodyData {
  currentWeight?: number;
  targetWeight?: number;
  bmi?: number;
  bmiClassification?: {
    category: string;
    color: string;
  };
  bodyFatPercentage?: number;
  bodyFatClassification?: {
    category: string;
    color: string;
  };
  muscleMass?: number;
  idealWeight?: number;
  measurements?: Measurements;
}

class BodyDataService {
  // Weight History Management
  async getWeightHistory(): Promise<WeightEntry[]> {
    try {
      const history = await AsyncStorage.getItem(WEIGHT_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error getting weight history:", error);
      return [];
    }
  }

  async addWeightEntry(entry: Omit<WeightEntry, "id">): Promise<void> {
    try {
      const history = await this.getWeightHistory();
      const newEntry: WeightEntry = {
        ...entry,
        id: Date.now().toString(),
      };

      // Remove entry with same date if exists
      const filteredHistory = history.filter(
        (item) => item.date !== entry.date
      );
      filteredHistory.push(newEntry);

      // Sort by date (newest first)
      filteredHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      await AsyncStorage.setItem(
        WEIGHT_HISTORY_KEY,
        JSON.stringify(filteredHistory)
      );

      // Salvar dados de peso no storage para a tela home
      await this.updateDailyWeightData(newEntry);
    } catch (error) {
      console.error("Error adding weight entry:", error);
      throw error;
    }
  }

  // Measurements History Management
  async getMeasurementsHistory(): Promise<MeasurementEntry[]> {
    try {
      const history = await AsyncStorage.getItem(MEASUREMENTS_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error getting measurements history:", error);
      return [];
    }
  }

  async addMeasurementEntry(
    entry: Omit<MeasurementEntry, "id">
  ): Promise<void> {
    try {
      const history = await this.getMeasurementsHistory();
      const newEntry: MeasurementEntry = {
        ...entry,
        id: Date.now().toString(),
      };

      // Remove entry with same date if exists
      const filteredHistory = history.filter(
        (item) => item.date !== entry.date
      );
      filteredHistory.push(newEntry);

      // Sort by date (newest first)
      filteredHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      await AsyncStorage.setItem(
        MEASUREMENTS_HISTORY_KEY,
        JSON.stringify(filteredHistory)
      );
    } catch (error) {
      console.error("Error adding measurement entry:", error);
      throw error;
    }
  }

  // Get processed body data with calculations
  async getProcessedBodyData(): Promise<ProcessedBodyData> {
    try {
      // Get user profile
      const user = await userStorage.getUserProfile();
      if (!user) {
        return {};
      }

      // Get goals
      const goals = await goalsService.getGoals();

      // Get latest weight and measurements
      const weightHistory = await this.getWeightHistory();
      const measurementsHistory = await this.getMeasurementsHistory();

      const latestWeight = weightHistory[0];
      const latestMeasurements = measurementsHistory[0];

      // Prepare user data for calculations
      const userData: UserBodyData = {
        weight: latestWeight?.weight || user.measurements?.weight || 70,
        height: user.measurements?.height || 170,
        age: user.birth_date ? this.calculateAge(user.birth_date) : 30,
        gender: (user.gender as "male" | "female") || "male",
        measurements:
          latestMeasurements?.measurements || user.measurements
            ? {
                neck:
                  latestMeasurements?.measurements?.neck ||
                  user.measurements?.neck ||
                  0,
                waist:
                  latestMeasurements?.measurements?.waist ||
                  user.measurements?.waist ||
                  0,
                hip:
                  latestMeasurements?.measurements?.hip ||
                  user.measurements?.hip,
              }
            : undefined,
      };

      // Calculate metrics
      const processedData = processUserBodyData(userData);

      return {
        currentWeight: userData.weight,
        targetWeight: goals?.targetWeight,
        bmi: processedData.bmi,
        bmiClassification: processedData.bmiClassification,
        bodyFatPercentage: processedData.bodyFatPercentage ?? undefined,
        bodyFatClassification: processedData.bodyFatClassification ?? undefined,
        muscleMass: processedData.muscleMass ?? undefined,
        idealWeight: processedData.idealWeight,
        measurements: latestMeasurements?.measurements || user.measurements,
      };
    } catch (error) {
      console.error("Error getting processed body data:", error);
      return {};
    }
  }

  // Get weight data for a specific period
  async getWeightDataForPeriod(days: number | null): Promise<{
    oldest?: WeightEntry;
    latest?: WeightEntry;
    history: WeightEntry[];
  }> {
    try {
      const history = await this.getWeightHistory();

      if (days === null) {
        // Return all data
        return {
          oldest: history[history.length - 1],
          latest: history[0],
          history,
        };
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const filteredHistory = history.filter(
        (entry) => new Date(entry.date) >= cutoffDate
      );

      return {
        oldest: filteredHistory[filteredHistory.length - 1],
        latest: filteredHistory[0],
        history: filteredHistory,
      };
    } catch (error) {
      console.error("Error getting weight data for period:", error);
      return { history: [] };
    }
  }

  // Get measurements data for a specific period
  async getMeasurementsDataForPeriod(days: number | null): Promise<{
    oldest?: MeasurementEntry;
    latest?: MeasurementEntry;
    history: MeasurementEntry[];
  }> {
    try {
      const history = await this.getMeasurementsHistory();

      if (days === null) {
        // Return all data
        return {
          oldest: history[history.length - 1],
          latest: history[0],
          history,
        };
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const filteredHistory = history.filter(
        (entry) => new Date(entry.date) >= cutoffDate
      );

      return {
        oldest: filteredHistory[filteredHistory.length - 1],
        latest: filteredHistory[0],
        history: filteredHistory,
      };
    } catch (error) {
      console.error("Error getting measurements data for period:", error);
      return { history: [] };
    }
  }

  private calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  async updateDailyWeightData(weightEntry: WeightEntry): Promise<void> {
    try {
      const weightData: DailyWeightData = {
        date: weightEntry.date,
        weight: weightEntry.weight,
        bodyFat: weightEntry.bodyFat,
        muscleMass: weightEntry.muscleMass,
        bmi: weightEntry.bmi,
        lastUpdated: new Date().toISOString(),
      };

      await dailyDataStorage.setDailyWeightData(weightData);
    } catch (error) {
      console.error("Error updating daily weight data:", error);
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WEIGHT_HISTORY_KEY);
      await AsyncStorage.removeItem(MEASUREMENTS_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing body data:", error);
      throw error;
    }
  }
}

export const bodyDataService = new BodyDataService();
