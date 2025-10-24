import React, { useState, useEffect } from "react";
import { VStack, Text, HStack, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import {
  ExpandableCalendarComponent,
  SemicircularProgress,
  MacroProgressCard,
} from "../../../components";
import { ScrollView } from "react-native-gesture-handler";
import { goalsService } from "../../../services/goalsService";
import {
  mealsHistoryService,
  HistoryResponse,
} from "../../../services/mealsHistoryService";
import { useAuth } from "../../../contexts/AuthContext";
import { Goals } from "../../../types/goals";
import { ConsumptionItemsList, MealHistoryDetailsDrawer } from "./consumption";

export const ConsumptionTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { convertMacronutrient, getMacroUnit } = useUnits();

  // Usar data local ao invés de UTC
  const today = new Date();
  const todayLocal = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [goals, setGoals] = useState<Goals | null>(null);
  const [historyData, setHistoryData] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMealHistory, setSelectedMealHistory] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    loadHistoryData();
  }, [selectedDate, user?.id]);

  const loadGoals = async () => {
    try {
      const userGoals = await goalsService.getGoals();
      setGoals(userGoals);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) {
        console.error("User ID not available");
        return;
      }
      const data = await mealsHistoryService.getHistoryByDay(
        user.id,
        selectedDate
      );
      setHistoryData(data);
    } catch (error) {
      console.error("Error loading history data:", error);
      setHistoryData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleMealPress = (historyEntry: any) => {
    setSelectedMealHistory(historyEntry);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMealHistory(null);
  };

  const selectedData = React.useMemo(() => {
    if (!historyData || historyData.history.length === 0) {
      return null;
    }

    return {
      calories: historyData.nutrition_summary.calories,
      protein: historyData.nutrition_summary.protein,
      carbs: historyData.nutrition_summary.carbs,
      fat: historyData.nutrition_summary.fat,
      fiber: historyData.nutrition_summary.fiber,
      sodium: historyData.nutrition_summary.sodium,
      sugar: historyData.nutrition_summary.sugar,
      water: 2.0,
    };
  }, [historyData]);

  const selectedItems = React.useMemo(() => {
    if (!historyData) return [];

    return historyData.history.map((entry) => {
      let name = "";
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;

      if (entry.type === "meal" && entry.nutrition_data) {
        name = entry.notes || "Refeição";
        calories = entry.nutrition_data.total_calories;
        protein = entry.nutrition_data.total_protein;
        carbs = entry.nutrition_data.total_carbs;
        fat = entry.nutrition_data.total_fat;
      } else if (entry.type === "supplement" && entry.supplement_data) {
        name = entry.supplement_data.name;
        const caloriesStr = (entry.supplement_data.calories || "0").replace(
          /[^\d.-]/g,
          ""
        );
        calories = parseInt(caloriesStr) || 0;
        const proteinStr = (entry.supplement_data.protein || "0").replace(
          /[^\d.-]/g,
          ""
        );
        protein = parseFloat(proteinStr) || 0;
      }

      const mealType = (entry.notes?.split("-")[0]?.toLowerCase().trim() ||
        "lunch") as any;

      return {
        id: entry.id,
        name,
        quantity: 1,
        unit: "porção",
        calories,
        protein,
        carbs,
        fat,
        mealType,
        time: new Date(entry.recorded_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: entry.type,
        mealHistoryEntry: entry,
      };
    });
  }, [historyData]);

  const getMarkedDates = () => {
    const marked: any = {};
    if (selectedData && selectedData.calories > 0) {
      marked[selectedDate] = {
        marked: true,
        dotColor: FIXED_COLORS.primary[500],
      };
    }
    return marked;
  };

  return (
    <VStack flex={1}>
      <ExpandableCalendarComponent
        selectedDate={selectedDate}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingTop: 0,
            paddingBottom: 40,
            paddingHorizontal: 16,
          }}
        >
          {isLoading ? (
            <VStack alignItems="center" justifyContent="center" py="$8">
              <Text color={FIXED_COLORS.text[400]} fontSize="$md">
                {t("common.loading")}...
              </Text>
            </VStack>
          ) : selectedData ? (
            <VStack space="md">
              <SemicircularProgress
                title={t("history.consumption.caloriesConsumption")}
                currentValue={selectedData.calories}
                goalValue={goals?.targetCalories}
                unit="kcal"
                colors={[
                  FIXED_COLORS.primary[500],
                  FIXED_COLORS.secondary[300],
                ]}
                icon={
                  <Ionicons
                    name="flame-outline"
                    size={20}
                    color={FIXED_COLORS.primary[500]}
                  />
                }
              />

              <HStack space="md">
                <MacroProgressCard
                  title={t("history.consumption.protein")}
                  currentValue={
                    convertMacronutrient(selectedData.protein).value
                  }
                  goalValue={
                    convertMacronutrient(goals?.targetProtein || 120).value
                  }
                  unit={getMacroUnit()}
                  colors={[
                    FIXED_COLORS.success[500],
                    FIXED_COLORS.success[600],
                  ]}
                  icon={
                    <Ionicons
                      name="fitness-outline"
                      size={16}
                      color={FIXED_COLORS.success[500]}
                    />
                  }
                />

                <MacroProgressCard
                  title={t("history.consumption.carbs")}
                  currentValue={convertMacronutrient(selectedData.carbs).value}
                  goalValue={
                    convertMacronutrient(goals?.targetCarbs || 180).value
                  }
                  unit={getMacroUnit()}
                  colors={[
                    FIXED_COLORS.warning[500],
                    FIXED_COLORS.warning[600],
                  ]}
                  icon={
                    <Ionicons
                      name="leaf-outline"
                      size={16}
                      color={FIXED_COLORS.warning[500]}
                    />
                  }
                />
              </HStack>

              <ConsumptionItemsList
                items={selectedItems}
                onItemPress={handleMealPress}
              />
            </VStack>
          ) : (
            <Box
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              p="$4"
              mt="$4"
              borderWidth={1}
              borderColor={FIXED_COLORS.background[700]}
              borderStyle="dashed"
            >
              <VStack alignItems="center" space="sm">
                <Ionicons
                  name="calendar-outline"
                  size={32}
                  color={FIXED_COLORS.text[400]}
                />
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  textAlign="center"
                >
                  {t("history.consumption.noDataForDate")}
                </Text>
              </VStack>
            </Box>
          )}
        </ScrollView>
      </ExpandableCalendarComponent>

      <MealHistoryDetailsDrawer
        mealHistory={selectedMealHistory}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </VStack>
  );
};
