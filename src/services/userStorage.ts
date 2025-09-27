import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/auth";

const USER_PROFILE_KEY = "user_profile";

export class UserStorage {
  async getUserProfile(): Promise<User | null> {
    try {
      const userProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
      console.error("Error getting user profile from storage:", error);
      return null;
    }
  }

  async setUserProfile(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user profile to storage:", error);
      throw error;
    }
  }

  async clearUserProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
    } catch (error) {
      console.error("Error clearing user profile from storage:", error);
      throw error;
    }
  }
}

export const userStorage = new UserStorage();
