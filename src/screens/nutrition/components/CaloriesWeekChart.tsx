import React, { useState, useEffect } from "react";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import { mealsService, MealsResponse } from "../../../services/mealsService";

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
  refreshTrigger?: number; // Prop para forçar refresh
}

export const CaloriesWeekChart: React.FC<CaloriesWeekChartProps> = ({
  data,
  colors = [FIXED_COLORS.warning[500], FIXED_COLORS.background[800]],
  refreshTrigger,
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientType>("calories");
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNutritionData();
  }, []);

  // Reagir ao refreshTrigger para recarregar dados
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadNutritionData();
    }
  }, [refreshTrigger]);

  const loadNutritionData = async () => {
    try {
      setIsLoading(true);
      // Usar data local ao invés de UTC
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const response = await mealsService.getMealsWithNutrition(todayLocal);
      if (response) {
        const weekData: DayData[] =
          response.nutrition_summary.calories.days.map((dayData) => ({
            day: getDayNameByAbbr(dayData.day),
            dayKey: getDayKeyByAbbr(dayData.day),
            calories: dayData.value,
            protein:
              response.nutrition_summary.protein.days.find(
                (d) => d.day === dayData.day
              )?.value || 0,
            carbs:
              response.nutrition_summary.carbs.days.find(
                (d) => d.day === dayData.day
              )?.value || 0,
            fat:
              response.nutrition_summary.fat.days.find(
                (d) => d.day === dayData.day
              )?.value || 0,
            goals: {
              calories: response.nutrition_summary.calories.goal,
              protein: response.nutrition_summary.protein.goal,
              carbs: response.nutrition_summary.carbs.goal,
              fat: response.nutrition_summary.fat.goal,
            },
          }));

        setChartData(weekData);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error("Error loading nutrition data:", error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDayName = (dayOfWeek: number): string => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[dayOfWeek];
  };

  const getDayKey = (dayOfWeek: number): string => {
    const keys = [
      "weekDays.sunday.short",
      "weekDays.monday.short",
      "weekDays.tuesday.short",
      "weekDays.wednesday.short",
      "weekDays.thursday.short",
      "weekDays.friday.short",
      "weekDays.saturday.short",
    ];
    return keys[dayOfWeek];
  };

  const getDayAbbr = (dayOfWeek: number): string => {
    const abbrs = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return abbrs[dayOfWeek];
  };

  const getDayNameByAbbr = (abbr: string): string => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const abbrs = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const index = abbrs.indexOf(abbr);
    return index !== -1 ? days[index] : abbr;
  };

  const getDayKeyByAbbr = (abbr: string): string => {
    const keys = [
      "weekDays.sunday.short",
      "weekDays.monday.short",
      "weekDays.tuesday.short",
      "weekDays.wednesday.short",
      "weekDays.thursday.short",
      "weekDays.friday.short",
      "weekDays.saturday.short",
    ];
    const abbrs = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const index = abbrs.indexOf(abbr);
    return index !== -1 ? keys[index] : abbr;
  };

  // Função para formatar valores e tratar NaN
  const formatValue = (value: number): string => {
    if (isNaN(value) || value === null || value === undefined) {
      return "0";
    }

    return value.toFixed(2);
  };

  // Função para garantir que o valor seja um número válido
  const safeValue = (value: number): number => {
    if (isNaN(value) || value === null || value === undefined) {
      return 0;
    }
    return value;
  };

  // Função para obter valor e meta baseado no nutriente selecionado
  const getValue = (dayData: DayData) => {
    const rawValue = safeValue(dayData[selectedNutrient]);
    // Converter para unidade imperial se necessário (exceto calorias)
    if (selectedNutrient !== "calories") {
      const converted = convertMacronutrient(rawValue);
      return converted.value;
    }
    return rawValue;
  };

  const getGoal = (dayData: DayData) => {
    const rawGoal = safeValue(dayData.goals[selectedNutrient]);
    // Converter para unidade imperial se necessário (exceto calorias)
    if (selectedNutrient !== "calories") {
      const converted = convertMacronutrient(rawGoal);
      return converted.value;
    }
    return rawGoal;
  };

  // Usar dados reais ou dados passados como prop
  const currentData = data || chartData;

  // Encontra o valor máximo para normalizar as barras
  const maxValue = Math.max(
    ...currentData.map((d) => Math.max(getValue(d), getGoal(d))),
    1 // Garantir que maxValue seja pelo menos 1 para evitar divisão por zero
  );
  const chartHeight = 120;

  const getBarHeight = (value: number) => {
    const safeMaxValue = maxValue > 0 ? maxValue : 1;
    return (safeValue(value) / safeMaxValue) * chartHeight;
  };

  const getBarColor = (value: number, goal: number) => {
    const safeValueNum = safeValue(value);
    const safeGoal = safeValue(goal);

    if (safeGoal === 0) return "#6B7280"; // Se não há meta definida, usar cinza

    const percentage = (safeValueNum / safeGoal) * 100;
    if (percentage > 100) return FIXED_COLORS.error[500]; // Muito acima da meta
    if (percentage === 100) return FIXED_COLORS.success[500]; // Meta atingida
    if (percentage >= 80) return FIXED_COLORS.primary[500]; // Próximo da meta
    if (percentage >= 60) return FIXED_COLORS.warning[500]; // Moderado
    return "#6B7280"; // Muito abaixo da meta (cinza)
  };

  const totalValue = currentData.reduce((sum, day) => sum + getValue(day), 0);
  const averageValue =
    currentData.length > 0 ? totalValue / currentData.length : 0;

  // Para a meta semanal, converter se necessário
  const rawWeekGoal = safeValue(currentData[0]?.goals[selectedNutrient] || 0);
  const weekGoal =
    selectedNutrient !== "calories"
      ? convertMacronutrient(rawWeekGoal).value
      : rawWeekGoal;

  // Função para obter unidade baseada no nutriente
  const getUnit = () => {
    switch (selectedNutrient) {
      case "calories":
        return "kcal";
      case "protein":
      case "carbs":
      case "fat":
        return getMacroUnit(); // Usar unidade do sistema de unidades
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

  // Mostrar loading se não há dados
  if (isLoading || currentData.length === 0) {
    return (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, padding: 20 }}
      >
        <VStack
          space="md"
          alignItems="center"
          justifyContent="center"
          minHeight={200}
        >
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("nutrition.food.weeklyNutrients")}
          </Text>
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize="$sm"
            textAlign="center"
          >
            {isLoading ? t("common.loading") : t("nutrition.food.noData")}
          </Text>
        </VStack>
      </LinearGradient>
    );
  }

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
              {formatValue(averageValue)} {getUnit()}
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
              {formatValue(weekGoal)} {getUnit()}
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
            {currentData.map((dayData, index) => {
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
                    {formatValue(value)}
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
