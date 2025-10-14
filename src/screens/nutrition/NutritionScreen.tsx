import React from "react";
import { VStack } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import {
  SafeContainer,
  DailyContentCard,
  AnimatedTabs,
} from "../../components";
import { FoodTab } from "./components/FoodTab";
import { SupplementsTab } from "./components/SupplementsTab";

export const NutritionScreen: React.FC = () => {
  const { t } = useTranslation();

  const tabData = [
    {
      id: "food",
      title: t("nutrition.tabs.food"),
      icon: (
        <Ionicons
          name="restaurant-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: <FoodTab />,
    },
    {
      id: "supplements",
      title: t("nutrition.tabs.supplements"),
      icon: (
        <Ionicons
          name="medical-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: <SupplementsTab />,
    },
  ];

  return (
    <SafeContainer paddingHorizontal={0} paddingTop={0} paddingBottom={0}>
      <VStack space="lg" paddingHorizontal="$4" p="$4">
        <DailyContentCard />
      </VStack>

      <AnimatedTabs
        tabs={tabData}
        reduceMotion="never"
        containerStyle={{ flex: 1 }}
      />
    </SafeContainer>
  );
};
