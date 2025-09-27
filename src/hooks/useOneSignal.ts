import { useEffect, useState } from 'react';
import { oneSignalService, OneSignalUser, PushNotificationPreferences } from '../services/oneSignalService';

export const useOneSignal = () => {
  const [user, setUser] = useState<OneSignalUser>(oneSignalService.getUserInfo());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeOneSignal();
  }, []);

  const initializeOneSignal = async () => {
    try {
      setIsLoading(true);
      await oneSignalService.initialize();
      setUser(oneSignalService.getUserInfo());
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing OneSignal in hook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (preferences: Partial<PushNotificationPreferences>) => {
    try {
      await oneSignalService.setUserPreferences(preferences);
      setUser(oneSignalService.getUserInfo());
    } catch (error) {
      console.error('Error updating OneSignal preferences:', error);
      throw error;
    }
  };

  const setUserId = async (userId: string) => {
    try {
      await oneSignalService.setUserId(userId);
      setUser(oneSignalService.getUserInfo());
    } catch (error) {
      console.error('Error setting OneSignal user ID:', error);
      throw error;
    }
  };

  const setUserEmail = async (email: string) => {
    try {
      await oneSignalService.setUserEmail(email);
      setUser(oneSignalService.getUserInfo());
    } catch (error) {
      console.error('Error setting OneSignal user email:', error);
      throw error;
    }
  };

  const enableNotifications = async () => {
    try {
      const success = await oneSignalService.enableNotifications();
      if (success) {
        setUser(oneSignalService.getUserInfo());
      }
      return success;
    } catch (error) {
      console.error('Error enabling OneSignal notifications:', error);
      throw error;
    }
  };

  const disableNotifications = async () => {
    try {
      const success = await oneSignalService.disableNotifications();
      if (success) {
        setUser(oneSignalService.getUserInfo());
      }
      return success;
    } catch (error) {
      console.error('Error disabling OneSignal notifications:', error);
      throw error;
    }
  };

  const requestPermissions = async () => {
    try {
      const granted = await oneSignalService.requestPermissions();
      setUser(oneSignalService.getUserInfo());
      return granted;
    } catch (error) {
      console.error('Error requesting OneSignal permissions:', error);
      throw error;
    }
  };

  const getDeviceState = async () => {
    try {
      return await oneSignalService.getDeviceState();
    } catch (error) {
      console.error('Error getting OneSignal device state:', error);
      throw error;
    }
  };

  const sendTestNotification = async () => {
    try {
      await oneSignalService.sendTestNotification();
    } catch (error) {
      console.error('Error sending OneSignal test notification:', error);
      throw error;
    }
  };

  return {
    user,
    isInitialized,
    isLoading,
    updatePreferences,
    setUserId,
    setUserEmail,
    enableNotifications,
    disableNotifications,
    requestPermissions,
    getDeviceState,
    sendTestNotification,
  };
};
