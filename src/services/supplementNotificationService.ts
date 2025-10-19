import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const SUPPLEMENT_NOTIFICATIONS_KEY = "@mycycle:supplementNotifications";

export interface SupplementNotification {
  supplementId: string;
  notificationId: string;
  time: string;
  supplementName: string;
}

class SupplementNotificationService {
  async getSupplementNotifications(
    supplementId: string
  ): Promise<SupplementNotification[]> {
    try {
      const data = await AsyncStorage.getItem(SUPPLEMENT_NOTIFICATIONS_KEY);
      if (!data) return [];

      const allNotifications: SupplementNotification[] = JSON.parse(data);
      return allNotifications.filter((n) => n.supplementId === supplementId);
    } catch (error) {
      console.error("Error getting supplement notifications:", error);
      return [];
    }
  }

  async getAllSupplementNotifications(): Promise<SupplementNotification[]> {
    try {
      const data = await AsyncStorage.getItem(SUPPLEMENT_NOTIFICATIONS_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error("Error getting all supplement notifications:", error);
      return [];
    }
  }

  async scheduleSupplementNotification(
    supplementId: string,
    supplementName: string,
    time: string
  ): Promise<string> {
    try {
      const [hours, minutes] = time.split(":").map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Hora de tomar seu suplemento! 💊",
          body: `Não esqueça de tomar ${supplementName}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });

      const notification: SupplementNotification = {
        supplementId,
        notificationId,
        time,
        supplementName,
      };

      const allNotifications = await this.getAllSupplementNotifications();
      allNotifications.push(notification);

      await AsyncStorage.setItem(
        SUPPLEMENT_NOTIFICATIONS_KEY,
        JSON.stringify(allNotifications)
      );

      return notificationId;
    } catch (error) {
      console.error("Error scheduling supplement notification:", error);
      throw error;
    }
  }

  async cancelSupplementNotifications(supplementId: string): Promise<void> {
    try {
      const notifications = await this.getSupplementNotifications(supplementId);

      for (const notification of notifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.notificationId
        );
      }

      const allNotifications = await this.getAllSupplementNotifications();
      const filtered = allNotifications.filter(
        (n) => n.supplementId !== supplementId
      );

      await AsyncStorage.setItem(
        SUPPLEMENT_NOTIFICATIONS_KEY,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error("Error canceling supplement notifications:", error);
      throw error;
    }
  }

  async updateSupplementNotifications(
    supplementId: string,
    supplementName: string,
    times: string[]
  ): Promise<void> {
    try {
      await this.cancelSupplementNotifications(supplementId);

      for (const time of times) {
        await this.scheduleSupplementNotification(
          supplementId,
          supplementName,
          time
        );
      }
    } catch (error) {
      console.error("Error updating supplement notifications:", error);
      throw error;
    }
  }
}

export const supplementNotificationService =
  new SupplementNotificationService();
