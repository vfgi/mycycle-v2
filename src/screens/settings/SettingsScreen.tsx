import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Switch,
  Divider,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import { LanguageSelectorModal } from "./LanguageSelectorModal";
import { getCurrentLanguage } from "../../i18n";
import { useNavigation } from "@react-navigation/native";
import { notificationService } from "../../services/notificationService";

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [remindersCount, setRemindersCount] = useState(0);

  useEffect(() => {
    loadRemindersCount();
  }, []);

  const loadRemindersCount = async () => {
    try {
      const notifications =
        await notificationService.getAllScheduledNotifications();
      setRemindersCount(notifications.length);
    } catch (error) {
      console.error("Error loading reminders count:", error);
    }
  };

  const getCurrentLanguageName = (): string => {
    const currentLang = getCurrentLanguage();
    switch (currentLang) {
      case "pt-BR":
        return "Português (Brasil)";
      case "pt-PT":
        return "Português (Portugal)";
      case "en":
        return "English";
      case "es":
        return "Español";
      default:
        return "English";
    }
  };

  const getRemindersText = (count: number): string => {
    if (count === 0) {
      return t("notifications.noRemindersShort");
    }

    const reminderWord =
      count === 1 ? t("notifications.reminder") : t("notifications.reminders");

    return `${count} ${reminderWord}`;
  };

  const settingsSections = [
    {
      title: t("settings.account"),
      items: [
        {
          key: "security",
          icon: "lock-closed-outline",
          label: t("settings.security"),
          action: "navigate",
          children: t("settings.changePassword"),
        },
      ],
    },
    {
      title: t("settings.preferences"),
      items: [
        {
          key: "notifications",
          icon: "notifications-outline",
          label: t("settings.notifications"),
          action: "navigate",
          children: getRemindersText(remindersCount),
        },
        {
          key: "language",
          icon: "language-outline",
          label: t("settings.language"),
          action: "dialog",
          children: getCurrentLanguageName(),
        },
      ],
    },
    {
      title: t("settings.app"),
      items: [
        {
          key: "about",
          icon: "information-circle-outline",
          label: t("settings.about"),
          action: "navigate",
        },
      ],
    },
  ];

  const handleItemPress = (item: any) => {
    if (item.action === "navigate") {
      if (item.key === "security") {
        navigation.navigate("ChangePassword" as never);
      } else if (item.key === "notifications") {
        navigation.navigate("Notifications" as never);
      }
    } else if (item.action === "dialog") {
      if (item.key === "language") {
        setIsLanguageDialogOpen(true);
      }
    }
  };

  const renderSettingItem = (item: any) => {
    return (
      <VStack key={item.key}>
        <Pressable
          onPress={() => handleItemPress(item)}
          p="$4"
          borderRadius="$md"
          $pressed={{
            bg: FIXED_COLORS.background[700],
          }}
        >
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" space="md" flex={1}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={FIXED_COLORS.text[50]}
              />
              <VStack flex={1}>
                <Text color={FIXED_COLORS.text[50]} fontSize="$md">
                  {item.label}
                </Text>
                {item.children && (
                  <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                    {item.children}
                  </Text>
                )}
              </VStack>
            </HStack>

            {item.action === "toggle" ? (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{
                  false: FIXED_COLORS.background[600],
                  true: FIXED_COLORS.primary[600],
                }}
                thumbColor={
                  item.value ? FIXED_COLORS.primary[50] : FIXED_COLORS.text[400]
                }
              />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={FIXED_COLORS.text[400]}
              />
            )}
          </HStack>
        </Pressable>
      </VStack>
    );
  };

  return (
    <SafeContainer>
      <ScrollView style={{ flex: 1 }}>
        <VStack flex={1} p="$0" space="lg">
          {settingsSections.map((section, sectionIndex) => (
            <VStack key={section.title} space="sm">
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                fontWeight="$semibold"
                textTransform="uppercase"
                letterSpacing="$sm"
                mb="$2"
              >
                {section.title}
              </Text>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$lg"
                space="xs"
              >
                {section.items.map((item, itemIndex) => (
                  <VStack key={item.key}>
                    {renderSettingItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <Divider bg={FIXED_COLORS.background[700]} mx="$4" />
                    )}
                  </VStack>
                ))}
              </VStack>
            </VStack>
          ))}
        </VStack>
      </ScrollView>

      <LanguageSelectorModal
        isOpen={isLanguageDialogOpen}
        onClose={() => setIsLanguageDialogOpen(false)}
      />
    </SafeContainer>
  );
};
