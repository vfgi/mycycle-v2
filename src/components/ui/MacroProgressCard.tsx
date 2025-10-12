import React from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Progress,
  ProgressFilledTrack,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../../theme/colors";

interface MacroProgressCardProps {
  title: string;
  currentValue: number;
  goalValue?: number;
  unit: string;
  colors?: string[];
  icon?: React.ReactNode;
}

export const MacroProgressCard: React.FC<MacroProgressCardProps> = ({
  title,
  currentValue,
  goalValue,
  unit,
  colors = [FIXED_COLORS.primary[500], FIXED_COLORS.secondary[300]],
  icon,
}) => {
  const safeGoalValue = goalValue || 100; // Valor padrão se não houver meta
  const percentage = Math.min((currentValue / safeGoalValue) * 100, 100);

  console.log(
    `📊 ${title} - Current: ${currentValue}, Goal: ${safeGoalValue}, Percentage: ${percentage}%`
  );

  return (
    <LinearGradient
      colors={colors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flex: 1,
      }}
    >
      <VStack space="sm">
        {/* Header com título e ícone */}
        <HStack alignItems="center" space="xs" justifyContent="space-between">
          <HStack alignItems="center" space="xs" flex={1}>
            {icon && (
              <Box
                bg={FIXED_COLORS.background[0]}
                borderRadius="$full"
                p="$1"
                opacity={0.9}
              >
                {icon}
              </Box>
            )}
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$sm"
              fontWeight="$semibold"
              numberOfLines={1}
            >
              {title}
            </Text>
          </HStack>
        </HStack>

        {/* Valores */}
        <VStack space="xs">
          <HStack alignItems="baseline" space="xs">
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$lg"
              fontWeight="$bold"
            >
              {currentValue}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.8}
            >
              / {safeGoalValue} {unit}
            </Text>
          </HStack>

          {/* Progress Bar */}
          <Progress
            value={Math.round(percentage)}
            max={100}
            size="sm"
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius="$full"
          >
            <ProgressFilledTrack
              bg={FIXED_COLORS.background[0]}
              borderRadius="$full"
            />
          </Progress>

          {/* Percentual */}
          <Text
            color={FIXED_COLORS.background[0]}
            fontSize="$xs"
            fontWeight="$medium"
            opacity={0.8}
            textAlign="right"
          >
            {percentage.toFixed(0)}%
          </Text>
        </VStack>
      </VStack>
    </LinearGradient>
  );
};

export default MacroProgressCard;
