import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "selected_language";

export const languageStorage = {
  async getSelectedLanguage(): Promise<string | null> {
    try {
      const language = await AsyncStorage.getItem(LANGUAGE_KEY);
      return language;
    } catch (error) {
      console.error("Error getting selected language from storage:", error);
      return null;
    }
  },

  async setSelectedLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error setting selected language to storage:", error);
    }
  },

  async clearSelectedLanguage(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LANGUAGE_KEY);
    } catch (error) {
      console.error("Error clearing selected language from storage:", error);
    }
  },
};
