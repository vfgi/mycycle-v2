import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  LocalNotification,
  NotificationPermission,
} from "../types/notifications";
import { notificationStorage } from "./notificationStorage";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  // Permission Management
  async requestPermissions(): Promise<NotificationPermission> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return {
        granted: finalStatus === "granted",
        canAskAgain: finalStatus !== "denied",
        status: finalStatus,
      };
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return {
        granted: false,
        canAskAgain: false,
        status: "denied",
      };
    }
  }

  async getPermissions(): Promise<NotificationPermission> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return {
        granted: status === "granted",
        canAskAgain: status !== "denied",
        status,
      };
    } catch (error) {
      console.error("Error getting notification permissions:", error);
      return {
        granted: false,
        canAskAgain: false,
        status: "denied",
      };
    }
  }

  // Local Notification Management
  async scheduleNotification(notification: LocalNotification): Promise<string> {
    try {
      const permissions = await this.getPermissions();
      if (!permissions.granted) {
        throw new Error("Notification permissions not granted");
      }

      const currentTime = new Date();
      const timeDiffInSeconds = Math.floor(
        (notification.scheduledTime.getTime() - currentTime.getTime()) / 1000
      );

      // Garantir que o tempo seja no futuro (mínimo 1 segundo)
      const triggerSeconds = Math.max(1, timeDiffInSeconds);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: triggerSeconds,
          repeats: false,
        },
      });

      // Save to storage
      const notificationWithId = { ...notification, id: notificationId };
      await notificationStorage.saveNotification(notificationWithId);

      return notificationId;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      throw error;
    }
  }

  // Schedule daily recurring notification (for supplements, medications, etc)
  async scheduleDailyNotification(
    notification: LocalNotification,
    hour: number,
    minute: number
  ): Promise<string> {
    try {
      const permissions = await this.getPermissions();
      if (!permissions.granted) {
        throw new Error("Notification permissions not granted");
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hour,
          minute: minute,
          repeats: true,
        },
      });

      // Calcular a próxima ocorrência para salvar no storage
      const now = new Date();
      const nextOccurrence = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0,
        0
      );

      // Se o horário já passou hoje, agendar para amanhã
      if (nextOccurrence <= now) {
        nextOccurrence.setDate(nextOccurrence.getDate() + 1);
      }

      // Save to storage with correct scheduledTime
      const notificationWithId = {
        ...notification,
        id: notificationId,
        scheduledTime: nextOccurrence,
      };
      await notificationStorage.saveNotification(notificationWithId);

      return notificationId;
    } catch (error) {
      console.error("Error scheduling daily notification:", error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await notificationStorage.deleteNotification(notificationId);
    } catch (error) {
      console.error("Error canceling notification:", error);
      throw error;
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await notificationStorage.clearAllNotifications();
    } catch (error) {
      console.error("Error canceling all notifications:", error);
      throw error;
    }
  }

  async updateNotificationStatus(
    notificationId: string,
    isActive: boolean
  ): Promise<void> {
    try {
      if (isActive) {
        // Re-schedule the notification
        const notification = await notificationStorage.getNotification(
          notificationId
        );
        if (notification) {
          await this.scheduleNotification(notification);
        }
      } else {
        // Cancel the notification
        await this.cancelNotification(notificationId);
      }

      await notificationStorage.updateNotificationStatus(
        notificationId,
        isActive
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
      throw error;
    }
  }

  async getAllScheduledNotifications(): Promise<LocalNotification[]> {
    try {
      return await notificationStorage.getAllNotifications();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }

  // Notification Categories
  async createNotificationCategories(): Promise<void> {
    try {
      await Notifications.setNotificationCategoryAsync("workout", [
        {
          identifier: "start_workout",
          buttonTitle: "Iniciar Treino",
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: "snooze",
          buttonTitle: "Adiar 10min",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      await Notifications.setNotificationCategoryAsync("nutrition", [
        {
          identifier: "log_meal",
          buttonTitle: "Registrar Refeição",
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: "snooze",
          buttonTitle: "Adiar 15min",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating notification categories:", error);
    }
  }

  // Push Notification Setup (for OneSignal integration)
  async setupPushNotifications(): Promise<void> {
    try {
      // This will be implemented when OneSignal is integrated
      console.log("Push notifications setup - OneSignal integration pending");
    } catch (error) {
      console.error("Error setting up push notifications:", error);
      throw error;
    }
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    try {
      await this.createNotificationCategories();
      await this.setupPushNotifications();
    } catch (error) {
      console.error("Error initializing notification service:", error);
    }
  }
}

export const notificationService = new NotificationService();
