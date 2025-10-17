import React, { useState, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Switch,
  Divider,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import { useToast } from "../../hooks/useToast";
import {
  LocalNotification,
  NotificationSettings,
} from "../../types/notifications";
import { notificationService } from "../../services/notificationService";
import { notificationStorage } from "../../services/notificationStorage";
import { useNavigation } from "@react-navigation/native";
import { CreateReminderModal } from "./CreateReminderModal";
import { useOneSignal } from "../../hooks/useOneSignal";
import { useLegacyNotifications } from "../../hooks/useLegacyNotifications";

export const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showError, showSuccess } = useToast();
  const {
    user: oneSignalUser,
    updatePreferences,
    enableNotifications,
    disableNotifications,
  } = useOneSignal();
  const {
    legacyNotifications,
    isLoading: isLoadingLegacy,
    loadLegacyNotifications,
    cancelLegacyNotification,
    cancelAllLegacyNotifications,
    getTriggerDescription,
  } = useLegacyNotifications();
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    localEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [notificationsData, settingsData] = await Promise.all([
        notificationService.getAllScheduledNotifications(),
        notificationStorage.getNotificationSettings(),
      ]);
      setNotifications(notificationsData);
      setSettings(settingsData);
    } catch (error) {
      console.error("Error loading notification data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotification = async (
    notificationId: string,
    isActive: boolean
  ) => {
    try {
      await notificationService.updateNotificationStatus(
        notificationId,
        isActive
      );
      await loadData();
    } catch (error) {
      console.error("Error toggling notification:", error);
      showError(t("notifications.toggleError"));
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    Alert.alert(
      t("notifications.confirmDelete"),
      t("notifications.confirmDeleteMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await notificationService.cancelNotification(notificationId);
              await loadData();
              showSuccess(t("notifications.deleteSuccess"));
            } catch (error) {
              console.error("Error deleting notification:", error);
              showError(t("notifications.deleteError"));
            }
          },
        },
      ]
    );
  };

  const handleDeleteLegacyNotification = async (notificationId: string) => {
    Alert.alert(
      t("notifications.deleteLegacyTitle"),
      t("notifications.deleteLegacyMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const success = await cancelLegacyNotification(notificationId);
              if (success) {
                showSuccess(t("notifications.legacyDeleteSuccess"));
              } else {
                showError(t("notifications.legacyDeleteError"));
              }
            } catch (error) {
              console.error("Error deleting legacy notification:", error);
              showError(t("notifications.legacyDeleteError"));
            }
          },
        },
      ]
    );
  };

  const handleDeleteAllLegacyNotifications = async () => {
    Alert.alert(
      t("notifications.deleteAllLegacyTitle"),
      t("notifications.deleteAllLegacyMessage", {
        count: legacyNotifications.length,
      }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const success = await cancelAllLegacyNotifications();
              if (success) {
                showSuccess(t("notifications.allLegacyDeleteSuccess"));
              } else {
                showError(t("notifications.allLegacyDeleteError"));
              }
            } catch (error) {
              console.error("Error deleting all legacy notifications:", error);
              showError(t("notifications.allLegacyDeleteError"));
            }
          },
        },
      ]
    );
  };

  const handleSettingsChange = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    try {
      const newSettings = { ...settings, [key]: value };
      await notificationStorage.saveNotificationSettings(newSettings);
      setSettings(newSettings);

      // Controlar OneSignal para push notifications
      if (key === "pushEnabled") {
        if (value) {
          await enableNotifications();
          showSuccess("Push notifications habilitadas");
        } else {
          await disableNotifications();
          showSuccess("Push notifications desabilitadas");
        }
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      showError(t("notifications.settingsError"));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderNotificationItem = (notification: LocalNotification) => (
    <VStack
      key={notification.id}
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      p="$4"
      mb="$3"
    >
      <HStack alignItems="center" justifyContent="space-between">
        <VStack flex={1} space="xs">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$md"
            fontWeight="$semibold"
          >
            {notification.title}
          </Text>
          <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
            {notification.body}
          </Text>
          <Text color={FIXED_COLORS.text[500]} fontSize="$xs">
            {formatDate(notification.scheduledTime)}
          </Text>
        </VStack>

        <HStack alignItems="center" space="md">
          <Switch
            value={notification.isActive}
            onValueChange={(value) =>
              handleToggleNotification(notification.id, value)
            }
            trackColor={{
              false: FIXED_COLORS.background[600],
              true: FIXED_COLORS.primary[600],
            }}
            thumbColor={
              notification.isActive
                ? FIXED_COLORS.primary[50]
                : FIXED_COLORS.text[400]
            }
          />

          <Pressable onPress={() => handleDeleteNotification(notification.id)}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={FIXED_COLORS.error[500]}
            />
          </Pressable>
        </HStack>
      </HStack>
    </VStack>
  );

  return (
    <SafeContainer>
      <ScrollView style={{ flex: 1 }}>
        <VStack flex={1} space="lg">
          {/* Header */}
          <HStack alignItems="center" justifyContent="space-between" mb="$4">
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={FIXED_COLORS.text[50]}
              />
            </Pressable>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
            >
              {t("notifications.title")}
            </Text>
            <VStack w="$6" />
          </HStack>

          {/* Settings Section */}
          <VStack
            bg={FIXED_COLORS.background[800]}
            borderRadius="$lg"
            p="$4"
            space="md"
          >
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$sm"
              fontWeight="$semibold"
              textTransform="uppercase"
            >
              {t("notifications.settings")}
            </Text>

            <VStack space="md">
              <HStack alignItems="center" justifyContent="space-between">
                <VStack>
                  <Text color={FIXED_COLORS.text[50]} fontSize="$md">
                    {t("notifications.pushNotifications")}
                  </Text>
                  <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                    {t("notifications.pushNotificationsDesc")}
                  </Text>
                </VStack>
                <Switch
                  value={settings.pushEnabled}
                  onValueChange={(value) =>
                    handleSettingsChange("pushEnabled", value)
                  }
                  trackColor={{
                    false: FIXED_COLORS.background[600],
                    true: FIXED_COLORS.primary[600],
                  }}
                  thumbColor={
                    settings.pushEnabled
                      ? FIXED_COLORS.primary[50]
                      : FIXED_COLORS.text[400]
                  }
                />
              </HStack>

              <Divider bg={FIXED_COLORS.background[700]} />

              <HStack alignItems="center" justifyContent="space-between">
                <VStack>
                  <Text color={FIXED_COLORS.text[50]} fontSize="$md">
                    {t("notifications.localNotifications")}
                  </Text>
                  <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                    {t("notifications.localNotificationsDesc")}
                  </Text>
                </VStack>
                <Switch
                  value={settings.localEnabled}
                  onValueChange={(value) =>
                    handleSettingsChange("localEnabled", value)
                  }
                  trackColor={{
                    false: FIXED_COLORS.background[600],
                    true: FIXED_COLORS.primary[600],
                  }}
                  thumbColor={
                    settings.localEnabled
                      ? FIXED_COLORS.primary[50]
                      : FIXED_COLORS.text[400]
                  }
                />
              </HStack>
            </VStack>
          </VStack>

          {/* Notifications List */}
          <VStack space="md">
            <HStack alignItems="center" justifyContent="space-between">
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                fontWeight="$semibold"
                textTransform="uppercase"
              >
                {t("notifications.scheduledReminders")}
              </Text>
              {/* // For testing purposes: Add reminder button */}
              {/* <Button
                size="sm"
                variant="outline"
                borderColor={FIXED_COLORS.primary[600]}
                onPress={() => setIsCreateModalOpen(true)}
              >
                <ButtonText color={FIXED_COLORS.primary[600]}>
                  {t("notifications.addReminder")}
                </ButtonText>
              </Button> */}
            </HStack>

            {notifications.length === 0 ? (
              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$lg"
                p="$6"
                alignItems="center"
                space="md"
              >
                <Ionicons
                  name="notifications-outline"
                  size={48}
                  color={FIXED_COLORS.text[400]}
                />
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$md"
                  textAlign="center"
                >
                  {t("notifications.noReminders")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[500]}
                  fontSize="$sm"
                  textAlign="center"
                >
                  {t("notifications.noRemindersDesc")}
                </Text>
              </VStack>
            ) : (
              notifications.map(renderNotificationItem)
            )}
          </VStack>

          {/* Legacy Notifications Section */}
          {legacyNotifications.length > 0 && (
            <VStack space="md" mt="$6">
              <HStack alignItems="center" justifyContent="space-between">
                <VStack flex={1}>
                  <Text
                    color={FIXED_COLORS.warning[400]}
                    fontSize="$sm"
                    fontWeight="$semibold"
                    textTransform="uppercase"
                  >
                    ⚠️ {t("notifications.legacyNotifications")} (
                    {legacyNotifications.length})
                  </Text>
                  <Text color={FIXED_COLORS.text[500]} fontSize="$xs" mt="$1">
                    {t("notifications.legacyNotificationsDesc")}
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor={FIXED_COLORS.error[600]}
                  onPress={handleDeleteAllLegacyNotifications}
                >
                  <ButtonText color={FIXED_COLORS.error[600]}>
                    {t("notifications.deleteAllLegacy")}
                  </ButtonText>
                </Button>
              </HStack>

              {legacyNotifications.map((notification) => (
                <VStack
                  key={notification.identifier}
                  bg={FIXED_COLORS.background[800]}
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor={FIXED_COLORS.warning[700]}
                  p="$4"
                >
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack flex={1} space="xs">
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$md"
                        fontWeight="$semibold"
                      >
                        {notification.content.title}
                      </Text>
                      <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                        {notification.content.body}
                      </Text>
                      <Text
                        color={FIXED_COLORS.warning[400]}
                        fontSize="$xs"
                        fontWeight="$medium"
                      >
                        {getTriggerDescription(notification.trigger)}
                      </Text>
                      {notification.content.data && (
                        <Text
                          color={FIXED_COLORS.text[500]}
                          fontSize="$xs"
                          fontStyle="italic"
                        >
                          {notification.content.data.medicationId
                            ? `Medicamento ID: ${notification.content.data.medicationId}`
                            : notification.content.data.supplementId
                            ? `Suplemento ID: ${notification.content.data.supplementId}`
                            : ""}
                        </Text>
                      )}
                    </VStack>

                    <Pressable
                      onPress={() =>
                        handleDeleteLegacyNotification(notification.identifier)
                      }
                      p="$2"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={FIXED_COLORS.error[500]}
                      />
                    </Pressable>
                  </HStack>
                </VStack>
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>

      <CreateReminderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadData}
      />
    </SafeContainer>
  );
};
