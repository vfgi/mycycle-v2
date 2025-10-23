import React, { useState } from "react";
import { ScrollView } from "react-native";
import { VStack, Text, HStack } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { CaloriesWeekChart } from "./CaloriesWeekChart";
import { MealsList } from "./meals";

export const FoodTab: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleViewAll = () => {
    navigation.navigate("MealsManagement" as never);
  };

  const handleMealConsumptionChange = () => {
    // Incrementar o trigger para forçar refresh do gráfico
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <VStack space="lg" p="$4">
        {/* Calories Week Chart */}
        <CaloriesWeekChart refreshTrigger={refreshTrigger} />

        {/* Meals List */}
        <MealsList
          onViewAll={handleViewAll}
          onMealConsumptionChange={handleMealConsumptionChange}
        />
      </VStack>
    </ScrollView>
  );
};
