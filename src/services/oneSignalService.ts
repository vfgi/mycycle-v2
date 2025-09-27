import { ENV } from "../config/environment";
import Constants from "expo-constants";

// Detectar se está no Expo Go
const isExpoGo = Constants.appOwnership === "expo";

// Importação condicional do OneSignal
let OneSignal: any = null;
if (!isExpoGo) {
  try {
    OneSignal = require("react-native-onesignal").default;
  } catch (error) {
    console.warn("OneSignal not available, running in mock mode", error);
  }
}

export interface PushNotificationPreferences {
  enabled: boolean;
  workoutReminders: boolean;
  nutritionReminders: boolean;
  generalUpdates: boolean;
  marketingOffers: boolean;
}

export interface OneSignalUser {
  userId?: string;
  pushToken?: string;
  subscribed: boolean;
  preferences: PushNotificationPreferences;
}

class OneSignalService {
  private initialized = false;
  private user: OneSignalUser = {
    subscribed: false,
    preferences: {
      enabled: true,
      workoutReminders: true,
      nutritionReminders: true,
      generalUpdates: true,
      marketingOffers: false,
    },
  };

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Se está no Expo Go ou OneSignal não está disponível, usar modo mock
      if (isExpoGo || !OneSignal) {
        this.initialized = true;
        this.user.subscribed = true;
        this.user.userId = "mock-user-id";
        this.user.pushToken = "mock-push-token";
        return;
      }

      if (!ENV.ONESIGNAL_APP_ID) {
        console.warn("OneSignal App ID not configured");
        return;
      }

      // Configurar OneSignal
      OneSignal.setAppId(ENV.ONESIGNAL_APP_ID);

      // Configurar handlers
      this.setupEventHandlers();

      // Solicitar permissões
      await this.requestPermissions();

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing OneSignal:", error);
    }
  }

  private setupEventHandlers(): void {
    if (!OneSignal) {
      return;
    }

    // Handler para quando receber uma notificação
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notificationReceivedEvent: any) => {
        const notification = notificationReceivedEvent.getNotification();

        // Decidir se mostra a notificação ou não
        notificationReceivedEvent.complete(notification);
      }
    );

    // Handler para quando clicar em uma notificação
    OneSignal.setNotificationOpenedHandler((notification: any) => {
      // Aqui você pode navegar para uma tela específica
      // baseado nos dados da notificação
      const data = notification.notification.additionalData;
      this.handleNotificationTap(data);
    });

    // Handler para mudanças na subscription
    OneSignal.addSubscriptionObserver((event: any) => {
      this.user.subscribed = event.to.isSubscribed;
      this.user.userId = event.to.userId;
      this.user.pushToken = event.to.pushToken;
    });
  }

  private handleNotificationTap(data: any): void {
    // Implementar navegação baseada no tipo de notificação
    if (data?.type) {
      switch (data.type) {
        case "workout":
          // Navegar para tela de treinos
          break;
        case "nutrition":
          // Navegar para tela de nutrição
          break;
        case "reminder":
          // Navegar para lembretes
          break;
        default:
          // Navegar para home
          break;
      }
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (!OneSignal) {
        return true;
      }

      const deviceState = await OneSignal.getDeviceState();

      if (deviceState?.hasNotificationPermission) {
        this.user.subscribed = deviceState.isSubscribed;
        this.user.userId = deviceState.userId;
        this.user.pushToken = deviceState.pushToken;
        return true;
      }

      // Solicitar permissão
      const permission =
        await OneSignal.promptForPushNotificationsWithUserResponse();

      return permission;
    } catch (error) {
      console.error("Error requesting OneSignal permissions:", error);
      return false;
    }
  }

  async setUserPreferences(
    preferences: Partial<PushNotificationPreferences>
  ): Promise<void> {
    try {
      this.user.preferences = { ...this.user.preferences, ...preferences };

      if (!OneSignal) {
        return;
      }

      // Configurar tags no OneSignal baseado nas preferências
      const tags: Record<string, string> = {};

      if (preferences.workoutReminders !== undefined) {
        tags.workout_reminders = preferences.workoutReminders
          ? "true"
          : "false";
      }

      if (preferences.nutritionReminders !== undefined) {
        tags.nutrition_reminders = preferences.nutritionReminders
          ? "true"
          : "false";
      }

      if (preferences.generalUpdates !== undefined) {
        tags.general_updates = preferences.generalUpdates ? "true" : "false";
      }

      if (preferences.marketingOffers !== undefined) {
        tags.marketing_offers = preferences.marketingOffers ? "true" : "false";
      }

      await OneSignal.sendTags(tags);
    } catch (error) {
      console.error("Error setting OneSignal user preferences:", error);
    }
  }

  async setUserId(userId: string): Promise<void> {
    try {
      if (!OneSignal) {
        return;
      }
      await OneSignal.setExternalUserId(userId);
    } catch (error) {
      console.error("Error setting OneSignal external user ID:", error);
    }
  }

  async setUserEmail(email: string): Promise<void> {
    try {
      if (!OneSignal) {
        return;
      }
      await OneSignal.setEmail(email);
    } catch (error) {
      console.error("Error setting OneSignal user email:", error);
    }
  }

  async enableNotifications(): Promise<boolean> {
    try {
      if (!OneSignal) {
        this.user.preferences.enabled = true;
        return true;
      }
      await OneSignal.disablePush(false);
      this.user.preferences.enabled = true;
      return true;
    } catch (error) {
      console.error("Error enabling OneSignal notifications:", error);
      return false;
    }
  }

  async disableNotifications(): Promise<boolean> {
    try {
      if (!OneSignal) {
        this.user.preferences.enabled = false;
        return true;
      }
      await OneSignal.disablePush(true);
      this.user.preferences.enabled = false;
      return true;
    } catch (error) {
      console.error("Error disabling OneSignal notifications:", error);
      return false;
    }
  }

  getUserInfo(): OneSignalUser {
    return { ...this.user };
  }

  async getDeviceState(): Promise<any> {
    try {
      if (!OneSignal) {
        return {
          hasNotificationPermission: true,
          isSubscribed: this.user.subscribed,
          userId: this.user.userId,
          pushToken: this.user.pushToken,
        };
      }
      const deviceState = await OneSignal.getDeviceState();
      return deviceState;
    } catch (error) {
      console.error("Error getting OneSignal device state:", error);
      return null;
    }
  }

  async sendTestNotification(): Promise<void> {
    try {
      if (!OneSignal) {
        return;
      }

      const deviceState = await OneSignal.getDeviceState();
      if (!deviceState?.userId) {
        console.warn("OneSignal: No user ID available for test notification");
        return;
      }

      // Nota: Para enviar notificações, você precisará usar a REST API do OneSignal
      // ou o dashboard administrativo
    } catch (error) {
      console.error("Error sending OneSignal test notification:", error);
    }
  }
}

export const oneSignalService = new OneSignalService();
