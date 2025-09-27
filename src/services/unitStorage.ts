import AsyncStorage from "@react-native-async-storage/async-storage";

export type UnitSystem = "metric" | "imperial";

interface UnitSettings {
  system: UnitSystem;
}

const UNIT_STORAGE_KEY = "@MyCycle:unitSettings";

class UnitStorage {
  async getUnitSystem(): Promise<UnitSystem> {
    try {
      const settings = await AsyncStorage.getItem(UNIT_STORAGE_KEY);
      if (settings) {
        const parsed: UnitSettings = JSON.parse(settings);
        return parsed.system;
      }
      return "metric"; // Default to metric
    } catch (error) {
      console.error("Error getting unit system:", error);
      return "metric";
    }
  }

  async setUnitSystem(system: UnitSystem): Promise<void> {
    try {
      const settings: UnitSettings = { system };
      await AsyncStorage.setItem(UNIT_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error setting unit system:", error);
      throw error;
    }
  }

  async getUnitSettings(): Promise<UnitSettings> {
    try {
      const settings = await AsyncStorage.getItem(UNIT_STORAGE_KEY);
      if (settings) {
        return JSON.parse(settings);
      }
      return { system: "metric" };
    } catch (error) {
      console.error("Error getting unit settings:", error);
      return { system: "metric" };
    }
  }

  async clearUnitSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(UNIT_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing unit settings:", error);
      throw error;
    }
  }
}

export const unitStorage = new UnitStorage();
