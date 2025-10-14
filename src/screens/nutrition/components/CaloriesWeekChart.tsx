import React, { useState } from "react";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface DayData {
  day: string;
  dayKey: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

type NutrientType = "calories" | "protein" | "carbs" | "fat";

interface CaloriesWeekChartProps {
  data?: DayData[];
  colors?: [string, string];
}

// Dados mockados dos últimos 7 dias
const getMockData = (): DayData[] => [
  {
    day: "Dom",
    dayKey: "weekDays.sunday.short",
    calories: 1850,
    protein: 120,
    carbs: 180,
    fat: 65,
    goals: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  },
  {
    day: "Seg",
    dayKey: "weekDays.monday.short",
    calories: 2100,
    protein: 140,
    carbs: 220,
    fat: 75,
    goals: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  },
  {
    day: "Ter",
    dayKey: "weekDays.tuesday.short",
    calories: 1950,
    protein: 135,
    carbs: 200,
    fat: 68,
    goals: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  },
  {
    day: "Qua",
    dayKey: "weekDays.wednesday.short",
    calories: 2300,
    protein: 160,
    carbs: 280,
    fat: 80,
    goals: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  },
  {
    day: "Qui",
    dayKey: "weekDays.thursday.short",
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 70,
    goals: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  },
  {
    day: "Sex",
    dayKey: "weekDays.friday.short",
    calories: 2750,
    protein: 180,
    carbs: 320,
    fat: 95,
    goals: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  },
  {
    day: "Sáb",
    dayKey: "weekDays.saturday.short",
    calories: 1300,
    protein: 85,
    carbs: 120,
    fat: 45,
    goals: { calories: 2200, protein: 150, carbs: 250, fat: 70 },
  },
];

export const CaloriesWeekChart: React.FC<CaloriesWeekChartProps> = ({
  data = getMockData(),
  colors = [FIXED_COLORS.warning[500], FIXED_COLORS.background[800]],
}) => {
  const { t } = useTranslation();
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientType>("calories");

  // Função para obter valor e meta baseado no nutriente selecionado
  const getValue = (dayData: DayData) => dayData[selectedNutrient];
  const getGoal = (dayData: DayData) => dayData.goals[selectedNutrient];

  // Encontra o valor máximo para normalizar as barras
  const maxValue = Math.max(
    ...data.map((d) => Math.max(getValue(d), getGoal(d)))
  );
  const chartHeight = 120;

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  const getBarColor = (value: number, goal: number) => {
    const percentage = (value / goal) * 100;
    if (percentage > 100) return FIXED_COLORS.error[500]; // Muito acima da meta
    if (percentage === 100) return FIXED_COLORS.success[500]; // Meta atingida
    if (percentage >= 80) return FIXED_COLORS.primary[500]; // Próximo da meta
    if (percentage >= 60) return FIXED_COLORS.warning[500]; // Moderado
    return "#6B7280"; // Muito abaixo da meta (cinza)
  };

  const totalValue = data.reduce((sum, day) => sum + getValue(day), 0);
  const averageValue = Math.round(totalValue / data.length);
  const weekGoal = data[0]?.goals[selectedNutrient] || 0;

  // Função para obter unidade baseada no nutriente
  const getUnit = () => {
    switch (selectedNutrient) {
      case "calories":
        return "kcal";
      case "protein":
        return "g";
      case "carbs":
        return "g";
      case "fat":
        return "g";
      default:
        return "";
    }
  };

  // Opções do seletor
  const nutrientOptions = [
    {
      key: "calories" as NutrientType,
      label: t("nutrition.food.nutrients.calories"),
    },
    {
      key: "protein" as NutrientType,
      label: t("nutrition.food.nutrients.protein"),
    },
    {
      key: "carbs" as NutrientType,
      label: t("nutrition.food.nutrients.carbs"),
    },
    { key: "fat" as NutrientType, label: t("nutrition.food.nutrients.fat") },
  ];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 16, padding: 20 }}
    >
      <VStack space="md">
        {/* Seletor de Nutrientes */}
        <VStack space="xs">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("nutrition.food.weeklyNutrients")}
          </Text>
          <HStack justifyContent="center" space="xs" flexWrap="wrap">
            {nutrientOptions.map((option) => (
              <Pressable
                key={option.key}
                onPress={() => setSelectedNutrient(option.key)}
                bg={
                  selectedNutrient === option.key
                    ? FIXED_COLORS.primary[600]
                    : "rgba(255, 255, 255, 0.1)"
                }
                borderRadius="$full"
                px="$3"
                py="$1"
              >
                <Text
                  color={
                    selectedNutrient === option.key
                      ? FIXED_COLORS.text[50]
                      : "rgba(255, 255, 255, 0.7)"
                  }
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </VStack>

        {/* Header com estatísticas */}
        <HStack space="md" alignItems="center" justifyContent="center">
          <VStack alignItems="center">
            <Text
              color="rgba(255, 255, 255, 0.8)"
              fontSize="$xs"
              fontWeight="$medium"
            >
              {t("nutrition.food.average")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$bold"
            >
              {averageValue} {getUnit()}
            </Text>
          </VStack>
          <VStack alignItems="center">
            <Text
              color="rgba(255, 255, 255, 0.8)"
              fontSize="$xs"
              fontWeight="$medium"
            >
              {t("common.goal")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$bold"
            >
              {weekGoal} {getUnit()}
            </Text>
          </VStack>
        </HStack>

        {/* Chart */}
        <VStack space="xs">
          <HStack
            justifyContent="space-between"
            alignItems="flex-end"
            height={chartHeight + 20}
            px="$1"
          >
            {data.map((dayData, index) => {
              const value = getValue(dayData);
              const goal = getGoal(dayData);
              const barHeight = getBarHeight(value);
              const barColor = getBarColor(value, goal);

              return (
                <VStack key={index} alignItems="center" space="xs" flex={1}>
                  {/* Valor do nutriente */}
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$xs"
                    fontWeight="$medium"
                  >
                    {value}
                  </Text>

                  {/* Barra do gráfico */}
                  <Box
                    bg={barColor}
                    width="$6"
                    height={barHeight}
                    borderRadius="$sm"
                    borderTopLeftRadius="$md"
                    borderTopRightRadius="$md"
                    opacity={0.9}
                  />

                  {/* Dia da semana */}
                  <Text
                    color="rgba(255, 255, 255, 0.9)"
                    fontSize="$xs"
                    fontWeight="$semibold"
                  >
                    {t(dayData.dayKey)}
                  </Text>
                </VStack>
              );
            })}
          </HStack>

          {/* Legenda */}
          <HStack justifyContent="center" space="lg" mt="$3">
            <HStack alignItems="center" space="xs">
              <Box
                bg={FIXED_COLORS.success[500]}
                width="$3"
                height="$3"
                borderRadius="$sm"
              />
              <Text color="rgba(255, 255, 255, 0.8)" fontSize="$xs">
                {t("nutrition.food.onTarget")}
              </Text>
            </HStack>
            <HStack alignItems="center" space="xs">
              <Box bg="#6B7280" width="$3" height="$3" borderRadius="$sm" />
              <Text color="rgba(255, 255, 255, 0.8)" fontSize="$xs">
                {t("nutrition.food.belowTarget")}
              </Text>
            </HStack>
            <HStack alignItems="center" space="xs">
              <Box
                bg={FIXED_COLORS.error[500]}
                width="$3"
                height="$3"
                borderRadius="$sm"
              />
              <Text color="rgba(255, 255, 255, 0.8)" fontSize="$xs">
                {t("nutrition.food.aboveTarget")}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </VStack>
    </LinearGradient>
  );
};
