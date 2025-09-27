import React from "react";
import { View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { VStack, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../theme/colors";

interface CircularChartData {
  calories: {
    current: number;
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
}

interface CircularChartProps {
  data: CircularChartData;
  size?: number;
}

export const CircularChart: React.FC<CircularChartProps> = ({
  data,
  size = 200,
}) => {
  const center = size / 2;
  const strokeWidth = 12;

  // Raios dos círculos (do maior para o menor)
  const caloriesRadius = center - strokeWidth; // Maior - Calorias
  const weightRadius = center - strokeWidth * 2.5; // Meio - Peso
  const exerciseRadius = center - strokeWidth * 4; // Menor - Exercícios

  // Calcular circunferências
  const caloriesCircumference = 2 * Math.PI * caloriesRadius;
  const weightCircumference = 2 * Math.PI * weightRadius;
  const exerciseCircumference = 2 * Math.PI * exerciseRadius;

  // Calcular porcentagens (sem limitar para permitir valores acima da meta)
  const caloriesPercentage = (data.calories.current / data.calories.goal) * 100;
  const weightPercentage = (data.weight.current / data.weight.goal) * 100;
  const exercisePercentage = (data.exercise.current / data.exercise.goal) * 100;

  // Calcular stroke-dasharray para cada círculo (limitando visualmente a 100%)
  const caloriesProgress =
    (Math.min(caloriesPercentage, 100) / 100) * caloriesCircumference;

  const weightProgress =
    (Math.min(weightPercentage, 100) / 100) * weightCircumference;
  const exerciseProgress =
    (Math.min(exercisePercentage, 100) / 100) * exerciseCircumference;

  // Determinar cor das calorias baseada na porcentagem
  const getCaloriesColor = (percentage: number) => {
    if (percentage <= 75) return FIXED_COLORS.success[500]; // Verde
    if (percentage <= 100) return FIXED_COLORS.warning[500]; // Amarelo
    return FIXED_COLORS.error[500]; // Vermelho
  };

  const caloriesColor = getCaloriesColor(caloriesPercentage);
  const weightColor = FIXED_COLORS.primary[500]; // Sempre verde
  const exerciseColor = FIXED_COLORS.secondary[300]; // Azul

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* CÍRCULO MAIOR - CALORIAS */}
        {/* Círculo de fundo - Calorias */}
        <Circle
          cx={center}
          cy={center}
          r={caloriesRadius}
          stroke={FIXED_COLORS.background[700]}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Círculo de progresso - Calorias */}
        <Circle
          cx={center}
          cy={center}
          r={caloriesRadius}
          stroke={caloriesColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${caloriesProgress} ${
            caloriesCircumference - caloriesProgress
          }`}
          strokeDashoffset={-caloriesCircumference / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* CÍRCULO MÉDIO - PESO */}
        {/* Círculo de fundo - Peso */}
        <Circle
          cx={center}
          cy={center}
          r={weightRadius}
          stroke={FIXED_COLORS.background[700]}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Círculo de progresso - Peso */}
        <Circle
          cx={center}
          cy={center}
          r={weightRadius}
          stroke={weightColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${weightProgress} ${
            weightCircumference - weightProgress
          }`}
          strokeDashoffset={-weightCircumference / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* CÍRCULO MENOR - EXERCÍCIOS */}
        {/* Círculo de fundo - Exercício */}
        <Circle
          cx={center}
          cy={center}
          r={exerciseRadius}
          stroke={FIXED_COLORS.background[700]}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Círculo de progresso - Exercício */}
        <Circle
          cx={center}
          cy={center}
          r={exerciseRadius}
          stroke={exerciseColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${exerciseProgress} ${
            exerciseCircumference - exerciseProgress
          }`}
          strokeDashoffset={-exerciseCircumference / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
    </View>
  );
};
