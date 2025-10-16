import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

export interface LegacyNotification {
  identifier: string;
  content: {
    title: string;
    body: string;
    data?: Record<string, any>;
  };
  trigger: any;
}

export function useLegacyNotifications() {
  const [legacyNotifications, setLegacyNotifications] = useState<
    LegacyNotification[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLegacyNotifications = async () => {
    try {
      setIsLoading(true);
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      setLegacyNotifications(scheduledNotifications as LegacyNotification[]);
    } catch (error) {
      console.error("Error loading legacy notifications:", error);
      setLegacyNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelLegacyNotification = async (notificationId: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await loadLegacyNotifications(); // Recarregar lista
      return true;
    } catch (error) {
      console.error("Error canceling legacy notification:", error);
      return false;
    }
  };

  const cancelAllLegacyNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await loadLegacyNotifications(); // Recarregar lista
      return true;
    } catch (error) {
      console.error("Error canceling all legacy notifications:", error);
      return false;
    }
  };

  const getTriggerDescription = (trigger: any): string => {
    if (!trigger) return "Desconhecido";

    if (trigger.type === "daily" || trigger.type === 1) {
      const hour = trigger.hour?.toString().padStart(2, "0") || "00";
      const minute = trigger.minute?.toString().padStart(2, "0") || "00";
      return `Diário às ${hour}:${minute}`;
    }

    if (trigger.type === "calendar" || trigger.type === 2) {
      const hour = trigger.hour?.toString().padStart(2, "0") || "00";
      const minute = trigger.minute?.toString().padStart(2, "0") || "00";
      const weekdays = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      const dayName = trigger.weekday
        ? weekdays[trigger.weekday - 1]
        : "Desconhecido";
      return `${dayName} às ${hour}:${minute}`;
    }

    if (trigger.type === "timeInterval" || trigger.type === 0) {
      const seconds = trigger.seconds || 0;
      if (seconds < 60) return `Em ${seconds} segundos`;
      if (seconds < 3600) return `Em ${Math.floor(seconds / 60)} minutos`;
      return `Em ${Math.floor(seconds / 3600)} horas`;
    }

    return "Agendado";
  };

  useEffect(() => {
    loadLegacyNotifications();
  }, []);

  return {
    legacyNotifications,
    isLoading,
    loadLegacyNotifications,
    cancelLegacyNotification,
    cancelAllLegacyNotifications,
    getTriggerDescription,
  };
}

