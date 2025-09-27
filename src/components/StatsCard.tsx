import React from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Progress,
  ProgressFilledTrack,
} from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";
import { useUnits } from "../contexts/UnitsContext";
import { CircularChart } from "./CircularChart";

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
  const { getMacroUnit } = useUnits();

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const StatItem: React.FC<{
    label: string;
    current: number;
    goal: number;
    unit: string;
    showProgress?: boolean;
  }> = ({ label, current, goal, unit, showProgress = true }) => (
    <VStack space="xs" flex={1}>
      <HStack alignItems="center" space="xs">
        <Text color={FIXED_COLORS.text[50]} fontSize="$lg" fontWeight="$bold">
          {current}
        </Text>
        <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
          / {goal} {unit}
        </Text>
      </HStack>
      <Text color={FIXED_COLORS.text[300]} fontSize="$xs" fontWeight="$small">
        {label}
      </Text>
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
      <HStack alignItems="center" space="xs"></HStack>
      <Text color={FIXED_COLORS.text[50]} fontSize="$xs" fontWeight="$small">
        {shortLabel} - {current}/{goal}
        {unit}
      </Text>
      <Progress
        value={getProgressPercentage(current, goal)}
        size="sm"
        bg={FIXED_COLORS.background[700]}
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
      mx="$4"
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
            goal={data.calories.goal}
            unit="kcal"
          />
          <StatItem
            label="Peso Atual"
            current={data.weight.current}
            goal={data.weight.goal}
            unit="kg"
            showProgress={false}
          />
          <StatItem
            label="Exercícios Realizados"
            current={data.exercise.current}
            goal={data.exercise.goal}
            unit="exercícios"
          />
        </VStack>

        {/* Coluna Direita - Gráfico */}
        <VStack alignItems="center" space="xs">
          <CircularChart
            data={{
              calories: {
                current: data.calories.consumed,
                goal: data.calories.goal,
              },
              weight: data.weight,
              exercise: data.exercise,
            }}
            size={170}
          />
        </VStack>
      </HStack>

      {/* Macronutrientes */}
      <VStack space="xs">
        <HStack space="xs" justifyContent="space-between">
          <MacroItem
            shortLabel={t("macros.protein.short")}
            current={data.macros.protein.current}
            goal={data.macros.protein.goal}
            unit={getMacroUnit()}
            color={FIXED_COLORS.primary[600]}
          />
          <MacroItem
            shortLabel={t("macros.carbs.short")}
            current={data.macros.carbs.current}
            goal={data.macros.carbs.goal}
            unit={getMacroUnit()}
            color={FIXED_COLORS.warning[500]}
          />
          <MacroItem
            shortLabel={t("macros.fat.short")}
            current={data.macros.fat.current}
            goal={data.macros.fat.goal}
            unit={getMacroUnit()}
            color={FIXED_COLORS.error[500]}
          />
        </HStack>
      </VStack>
    </VStack>
  );
};
