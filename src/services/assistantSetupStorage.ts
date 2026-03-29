import AsyncStorage from "@react-native-async-storage/async-storage";

const storageKey = (userId: string) =>
  `@MyCycle:assistantSetupStep:${userId}`;

export const assistantSetupStorage = {
  async getStep(userId: string): Promise<number | null> {
    try {
      const raw = await AsyncStorage.getItem(storageKey(userId));
      if (raw == null) return null;
      const n = parseInt(raw, 10);
      if (Number.isNaN(n) || n < 0 || n > 5) return null;
      return n;
    } catch {
      return null;
    }
  },

  async setStep(userId: string, step: number): Promise<void> {
    try {
      await AsyncStorage.setItem(storageKey(userId), String(step));
    } catch (error) {
      console.error(error);
    }
  },

  async clear(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(storageKey(userId));
    } catch (error) {
      console.error(error);
    }
  },
};
