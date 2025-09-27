import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  LocalNotification,
  NotificationSettings,
} from "../types/notifications";

const NOTIFICATION_STORAGE_KEY = "local_notifications";
const NOTIFICATION_SETTINGS_KEY = "notification_settings";

export class NotificationStorage {
  // Local Notifications CRUD
  async getAllNotifications(): Promise<LocalNotification[]> {
    try {
      const notifications = await AsyncStorage.getItem(
        NOTIFICATION_STORAGE_KEY
      );
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  }

  async getNotification(id: string): Promise<LocalNotification | null> {
    try {
      const notifications = await this.getAllNotifications();
      return notifications.find((n) => n.id === id) || null;
    } catch (error) {
      console.error("Error getting notification:", error);
      return null;
    }
  }

  async saveNotification(notification: LocalNotification): Promise<void> {
    try {
      const notifications = await this.getAllNotifications();
      const existingIndex = notifications.findIndex(
        (n) => n.id === notification.id
      );

      if (existingIndex >= 0) {
        notifications[existingIndex] = notification;
      } else {
        notifications.push(notification);
      }

      await AsyncStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Error saving notification:", error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      const notifications = await this.getAllNotifications();
      const filteredNotifications = notifications.filter((n) => n.id !== id);
      await AsyncStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(filteredNotifications)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  async updateNotificationStatus(id: string, isActive: boolean): Promise<void> {
    try {
      const notifications = await this.getAllNotifications();
      const notification = notifications.find((n) => n.id === id);

      if (notification) {
        notification.isActive = isActive;
        await this.saveNotification(notification);
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      throw error;
    }
  }

  // Notification Settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return settings
        ? JSON.parse(settings)
        : {
            pushEnabled: true,
            localEnabled: true,
            soundEnabled: true,
            vibrationEnabled: true,
          };
    } catch (error) {
      console.error("Error getting notification settings:", error);
      return {
        pushEnabled: true,
        localEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
      };
    }
  }

  async saveNotificationSettings(
    settings: NotificationSettings
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving notification settings:", error);
      throw error;
    }
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing notifications:", error);
      throw error;
    }
  }
}

export const notificationStorage = new NotificationStorage();
