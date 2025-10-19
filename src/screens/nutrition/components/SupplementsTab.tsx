import React from "react";
import { ScrollView } from "react-native";
import { VStack, Text, HStack } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { SupplementsHeaderCard } from "./SupplementsHeaderCard";
import { SupplementsList } from "./supplements";

export const SupplementsTab: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleViewAll = () => {
    navigation.navigate("SupplementsManagement" as never);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <VStack space="lg" p="$4">
        {/* Header Card */}
        <SupplementsHeaderCard />

        {/* Supplements List */}
        <SupplementsList onViewAll={handleViewAll} />
      </VStack>
    </ScrollView>
  );
};
