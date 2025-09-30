import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { VStack, HStack, Text, Image } from "@gluestack-ui/themed";
import { FontAwesome } from "@expo/vector-icons";
import { SafeContainer } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { StatsTab } from "./StatsTab";
import { ConnectionsTab } from "./ConnectionsTab";
import { UserDataTab } from "./UserDataTab";

type TabType = "stats" | "connections" | "userData";

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("userData");

  const TabButton: React.FC<{
    tab: TabType;
    label: string;
  }> = ({ tab, label }) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(tab)}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderBottomWidth: 2,
          borderBottomColor: isActive
            ? FIXED_COLORS.primary[600]
            : "transparent",
        }}
      >
        <Text
          color={isActive ? FIXED_COLORS.primary[600] : FIXED_COLORS.text[400]}
          fontSize="$sm"
          fontWeight={isActive ? "$bold" : "$normal"}
          textAlign="center"
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "userData":
        return <UserDataTab />;
      case "stats":
        return <StatsTab />;
      case "connections":
        return <ConnectionsTab />;
    }
  };

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <VStack flex={1}>
        <VStack alignItems="center" space="sm" pt="$4" px="$6" pb="$4">
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              alt="Profile"
              width={100}
              height={100}
              borderRadius={50}
              resizeMode="cover"
            />
          ) : (
            <VStack
              bg={FIXED_COLORS.background[700]}
              width={100}
              height={100}
              borderRadius={50}
              alignItems="center"
              justifyContent="center"
            >
              <FontAwesome
                name="user-circle"
                size={70}
                color={FIXED_COLORS.primary[600]}
              />
            </VStack>
          )}

          <VStack alignItems="center" space="xs">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
            >
              {user?.name || "Usuário"}
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              {user?.email || "email@exemplo.com"}
            </Text>
          </VStack>
        </VStack>

        <HStack
          borderBottomWidth={1}
          borderBottomColor={FIXED_COLORS.background[700]}
          px="$6"
        >
          <TabButton tab="userData" label={t("profile.tabs.userData")} />
          <TabButton tab="stats" label={t("profile.tabs.stats")} />
          <TabButton tab="connections" label={t("profile.tabs.connections")} />
        </HStack>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <VStack px="$6" pt="$4">
            {renderTabContent()}
          </VStack>
        </ScrollView>
      </VStack>
    </SafeContainer>
  );
};
