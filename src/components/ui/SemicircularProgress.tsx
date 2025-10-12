import React from "react";
import { View, StyleSheet } from "react-native";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle } from "react-native-svg";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";

interface SemicircularProgressProps {
  title: string;
  currentValue: number;
  goalValue?: number;
  unit: string;
  colors?: string[];
  icon?: React.ReactNode;
}

export const SemicircularProgress: React.FC<SemicircularProgressProps> = ({
  title,
  currentValue,
  goalValue,
  unit,
  colors = [FIXED_COLORS.primary[500], FIXED_COLORS.secondary[300]],
  icon,
}) => {
  const { t } = useTranslation();
  const safeGoalValue = goalValue || 2000;
  const percentage = Math.min((currentValue / safeGoalValue) * 100, 100);
  const radius = 90;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * Math.PI; // Semicírculo
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Coordenadas para o semicírculo (com padding)
  const centerX = radius + 10;
  const centerY = radius;

  return (
    <LinearGradient
      colors={colors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <VStack space="md" alignItems="center">
        {/* Header com título e ícone */}
        <HStack alignItems="center" space="sm">
          {icon && (
            <Box
              bg={FIXED_COLORS.background[0]}
              borderRadius="$full"
              p="$1.5"
              opacity={0.9}
            >
              {icon}
            </Box>
          )}
          <Text
            color={FIXED_COLORS.background[0]}
            fontSize="$md"
            fontWeight="$bold"
          >
            {title}
          </Text>
        </HStack>

        {/* Progresso semicircular */}
        <VStack alignItems="center" space="sm">
          <View style={styles.progressContainer}>
            <Svg height={radius + 30} width={radius * 2 + 20}>
              {/* Círculo de fundo (semicírculo) */}
              <Path
                d={`M ${
                  strokeWidth + 10
                } ${centerY} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
                  radius * 2 - strokeWidth + 10
                } ${centerY}`}
                fill="none"
                stroke={FIXED_COLORS.background[0]}
                strokeWidth={strokeWidth}
                strokeOpacity={0.3}
              />

              {/* Círculo de progresso (semicírculo) */}
              <Path
                d={`M ${
                  strokeWidth + 10
                } ${centerY} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${
                  radius * 2 - strokeWidth + 10
                } ${centerY}`}
                fill="none"
                stroke={FIXED_COLORS.background[0]}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeOpacity={0.9}
              />
            </Svg>

            {/* Valor central */}
            <View style={styles.centerContent}>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$2xl"
                fontWeight="$bold"
              >
                {currentValue}
              </Text>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$sm"
                opacity={0.8}
              >
                {unit}
              </Text>
            </View>
          </View>

          {/* Labels nas pontas */}
          <HStack justifyContent="space-between" width="100%" px="$2">
            {/* Percentual */}
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$sm"
              fontWeight="$semibold"
              opacity={0.9}
            >
              {percentage.toFixed(0)}% {t("common.ofGoal")}
            </Text>
            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$2xs"
                opacity={0.7}
              >
                {t("common.goal")}
              </Text>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                {safeGoalValue}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    shadowColor: FIXED_COLORS.background[950],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: "40%",
    width: "100%",
  },
});

export default SemicircularProgress;
