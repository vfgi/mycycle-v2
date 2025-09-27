export interface LocalNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  isActive: boolean;
  repeatType?: "none" | "daily" | "weekly" | "monthly";
  category?: string;
  data?: Record<string, any>;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  localEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface NotificationPermission {
  granted: boolean;
  canAskAgain: boolean;
  status: "granted" | "denied" | "undetermined";
}
