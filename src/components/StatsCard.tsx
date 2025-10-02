import React, { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Progress,
  ProgressFilledTrack,
} from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";
import { useUnits } from "../contexts/UnitsContext";
import { useAuth } from "../contexts/AuthContext";
import { CircularChart } from "./CircularChart";
import { WeightRegisterDrawer } from "../screens/home/WeightRegisterDrawer";
import { goalsService } from "../services/goalsService";
import { Goals } from "../types/goals";
import { useFocusEffect } from "@react-navigation/native";

interface StatsData {
  calories: {
    consumed: number;
    goal: number;
  };
  weight: {
    current: number;
    goal: number;
  };
  exercise: {
    current: number;
    goal: number;
  };
  macros: {
    protein: {
      current: number;
      goal: number;
    };
    carbs: {
      current: number;
      goal: number;
    };
    fat: {
      current: number;
      goal: number;
    };
  };
}

interface StatsCardProps {
  data?: StatsData;
}

// Mock data
const mockData: StatsData = {
  calories: {
    consumed: 1200,
    goal: 2200,
  },
  weight: {
    current: 99.5,
    goal: 70.0,
  },
  exercise: {
    current: 3,
    goal: 5,
  },
  macros: {
    protein: {
      current: 85,
      goal: 120,
    },
    carbs: {
      current: 150,
      goal: 180,
    },
    fat: {
      current: 45,
      goal: 65,
    },
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({ data = mockData }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getMacroUnit, convertWeight } = useUnits();
  const [isWeightDrawerOpen, setIsWeightDrawerOpen] = useState(false);
  const [goals, setGoals] = useState<Goals | null>(null);

  useEffect(() => {
    loadGoals();
  }, []);

  // Recarrega os goals sempre que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      loadGoals();
    }, [])
  );

  const loadGoals = async () => {
    try {
      const loadedGoals = await goalsService.getGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  // Dados reais dos goals ou fallback para mock data
  const currentWeightKg = user?.measurements?.weight || data.weight.current;
  const goalWeightKg = goals?.targetWeight || data.weight.goal;
  const caloriesGoal = goals?.targetCalories || data.calories.goal;
  const exerciseGoal = goals?.dailyExercises || data.exercise.goal;
  const proteinGoal = goals?.targetProtein || data.macros.protein.goal;
  const carbsGoal = goals?.targetCarbs || data.macros.carbs.goal;
  const fatGoal = goals?.targetFat || data.macros.fat.goal;

  const getProgressPercentage = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getCaloriesColor = (percentage: number) => {
    if (percentage <= 75) return FIXED_COLORS.success[500];
    if (percentage <= 100) return FIXED_COLORS.warning[500];
    return FIXED_COLORS.error[500];
  };

  const caloriesPercentage = getProgressPercentage(
    data.calories.consumed,
    caloriesGoal
  );
  const caloriesColor = getCaloriesColor(caloriesPercentage);
  const weightColor = FIXED_COLORS.primary[500];
  const exerciseColor = FIXED_COLORS.secondary[300];

  const currentWeightConverted = convertWeight(currentWeightKg);
  const goalWeightConverted = convertWeight(goalWeightKg);

  const StatItem: React.FC<{
    label: string;
    current: number;
    goal: number;
    unit: string;
    showProgress?: boolean;
    indicatorColor?: string;
    extraComponent?: React.ReactNode;
  }> = ({
    label,
    current,
    goal,
    unit,
    showProgress = true,
    indicatorColor,
    extraComponent,
  }) => (
    <VStack space="xs" flex={1}>
      <HStack alignItems="center" space="xs">
        {indicatorColor && (
          <Box
            width="$3"
            height="$3"
            borderRadius="$full"
            bg={indicatorColor}
          />
        )}
        <Text color={FIXED_COLORS.text[50]} fontSize="$lg" fontWeight="$bold">
          {current}
        </Text>
        <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
          / {goal} {unit}
        </Text>
      </HStack>
      <HStack alignItems="center" justifyContent="space-between">
        <Text color={FIXED_COLORS.text[300]} fontSize="$xs" fontWeight="$small">
          {label}
        </Text>
        {extraComponent}
      </HStack>
    </VStack>
  );

  const MacroItem: React.FC<{
    shortLabel: string;
    current: number;
    goal: number;
    unit: string;
    color: string;
  }> = ({ shortLabel, current, goal, unit, color }) => (
    <VStack space="xs" flex={1}>
      <Text color={FIXED_COLORS.text[50]} fontSize="$xs" fontWeight="$small">
        {shortLabel} - {current}/{goal}
        {unit}
      </Text>
      <Progress
        value={getProgressPercentage(current, goal)}
        size="sm"
        bg={FIXED_COLORS.background[600]}
      >
        <ProgressFilledTrack bg={color} />
      </Progress>
    </VStack>
  );

  return (
    <VStack
      bg={FIXED_COLORS.background[500]}
      borderRadius="$xl"
      p="$4"
      space="lg"
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={3}
    >
      {/* Layout Principal - Informações à esquerda, Gráfico à direita */}
      <HStack space="lg" alignItems="flex-start">
        {/* Coluna Esquerda - Informações */}
        <VStack space="xs" flex={1}>
          <StatItem
            label="Calorias Consumidas"
            current={data.calories.consumed}
            goal={caloriesGoal}
            unit="kcal"
            indicatorColor={caloriesColor}
          />

          <StatItem
            label="Peso Atual"
            current={currentWeightConverted.value}
            goal={goalWeightConverted.value}
            unit={currentWeightConverted.unit}
            showProgress={false}
            indicatorColor={weightColor}
            extraComponent={
              <TouchableOpacity
                onPress={() => setIsWeightDrawerOpen(true)}
                activeOpacity={0.7}
              >
                <Text
                  color={FIXED_COLORS.warning[500]}
                  fontSize="$xs"
                  fontWeight="$medium"
                  textDecorationLine="underline"
                >
                  {t("weight.register")}
                </Text>
              </TouchableOpacity>
            }
          />

          <StatItem
            label="Exercícios Realizados"
            current={data.exercise.current}
            goal={exerciseGoal}
            unit="exercícios"
            indicatorColor={exerciseColor}
          />
        </VStack>

        {/* Coluna Direita - Gráfico */}
        <VStack alignItems="center" space="xs">
          <CircularChart
            data={{
              calories: {
                current: data.calories.consumed,
                goal: caloriesGoal,
              },
              weight: {
                current: currentWeightKg,
                goal: goalWeightKg,
              },
              exercise: {
                current: data.exercise.current,
                goal: exerciseGoal,
              },
            }}
            size={170}
          />
        </VStack>
      </HStack>

      {/* Macronutrientes */}
      <VStack>
        <HStack space="lg" justifyContent="space-between">
          <MacroItem
            shortLabel={t("macros.protein.short")}
            current={data.macros.protein.current}
            goal={proteinGoal}
            unit={getMacroUnit()}
            color={FIXED_COLORS.primary[600]}
          />
          <MacroItem
            shortLabel={t("macros.carbs.short")}
            current={data.macros.carbs.current}
            goal={carbsGoal}
            unit={getMacroUnit()}
            color={FIXED_COLORS.warning[500]}
          />
          <MacroItem
            shortLabel={t("macros.fat.short")}
            current={data.macros.fat.current}
            goal={fatGoal}
            unit={getMacroUnit()}
            color={FIXED_COLORS.error[500]}
          />
        </HStack>
      </VStack>

      <WeightRegisterDrawer
        isOpen={isWeightDrawerOpen}
        onClose={() => setIsWeightDrawerOpen(false)}
      />
    </VStack>
  );
};
