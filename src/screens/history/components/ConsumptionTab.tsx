import React, { useState, useEffect } from "react";
import { VStack, Text, HStack, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  ExpandableCalendarComponent,
  SemicircularProgress,
  MacroProgressCard,
} from "../../../components";
import { ScrollView } from "react-native-gesture-handler";
import { goalsService } from "../../../services/goalsService";
import { Goals } from "../../../types/goals";
import { consumptionMockData, ConsumptionItemsList } from "./consumption";

export const ConsumptionTab: React.FC = () => {
  const { t } = useTranslation();

  const allMockData = {
    "2025-10-12": {
      calories: 1850,
      protein: 120,
      carbs: 180,
      fat: 65,
      water: 2.1,
    },
    "2025-10-11": {
      calories: 1920,
      protein: 115,
      carbs: 195,
      fat: 70,
      water: 1.8,
    },
    "2025-10-10": {
      calories: 1780,
      protein: 110,
      carbs: 170,
      fat: 62,
      water: 2.3,
    },
    "2025-10-09": {
      calories: 1650,
      protein: 105,
      carbs: 160,
      fat: 58,
      water: 2.0,
    },
    "2025-10-08": {
      calories: 1900,
      protein: 125,
      carbs: 185,
      fat: 68,
      water: 2.2,
    },
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [goals, setGoals] = useState<Goals | null>(null);

  console.log("🍽️ ConsumptionTab - selectedDate atual:", selectedDate);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const userGoals = await goalsService.getGoals();
      setGoals(userGoals);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const handleDayPress = (day: any) => {
    console.log("🍽️ ConsumptionTab - Dia clicado:", day.dateString);
    setSelectedDate(day.dateString);
  };

  const selectedData = allMockData[selectedDate as keyof typeof allMockData];
  const selectedItems =
    consumptionMockData[selectedDate as keyof typeof consumptionMockData] || [];

  const getMarkedDates = () => {
    const marked: any = {};
    Object.keys(allMockData).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: FIXED_COLORS.primary[500],
      };
    });
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
            paddingTop: 16,
            paddingBottom: 40,
            paddingHorizontal: 16,
            marginBottom: 40,
          }}
        >
          {selectedData ? (
            <VStack space="md">
              {/* Card principal de calorias */}
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

              {/* Cards de macronutrientes lado a lado */}
              <HStack space="md">
                <MacroProgressCard
                  title={t("history.consumption.protein")}
                  currentValue={selectedData.protein}
                  goalValue={goals?.targetProtein || 120}
                  unit="g"
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
                  currentValue={selectedData.carbs}
                  goalValue={goals?.targetCarbs || 180}
                  unit="g"
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

              {/* Lista de itens consumidos */}
              <ConsumptionItemsList items={selectedItems} />
            </VStack>
          ) : (
            <Box
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              p="$4"
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
    </VStack>
  );
};
