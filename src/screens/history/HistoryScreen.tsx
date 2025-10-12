import React from "react";
import { ScrollView } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer, DailyTipCard, AnimatedTabs } from "../../components";
import { ConsumptionTab } from "./components/ConsumptionTab";
import { WorkoutTab } from "./components/WorkoutTab";
import { WeightTab } from "./components/WeightTab";

export const HistoryScreen: React.FC = () => {
  const { t } = useTranslation();

  const tabData = [
    {
      id: "consumption",
      title: t("history.tabs.consumption"),
      icon: (
        <Ionicons
          name="restaurant-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: <ConsumptionTab />,
    },
    {
      id: "workout",
      title: t("history.tabs.workout"),
      icon: (
        <Ionicons
          name="barbell-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: <WorkoutTab />,
    },
    {
      id: "weight",
      title: t("history.tabs.weight"),
      icon: (
        <Ionicons
          name="scale-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: <WeightTab />,
    },
  ];

  return (
    <SafeContainer paddingHorizontal={0} paddingTop={0} paddingBottom={0}>
      <VStack space="lg" paddingHorizontal="$4" p="$4">
        <DailyTipCard />
      </VStack>

      <AnimatedTabs
        tabs={tabData}
        reduceMotion="never"
        containerStyle={{ flex: 1 }}
      />
    </SafeContainer>
  );
};
