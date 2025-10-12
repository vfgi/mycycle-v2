import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";

interface WorkoutGoalCardProps {
  title: string;
  currentExercises: number;
  goalExercises?: number;
  currentDuration: number;
  goalDuration?: number;
  colors?: string[];
  icon?: React.ReactNode;
}

export const WorkoutGoalCard: React.FC<WorkoutGoalCardProps> = ({
  title,
  currentExercises,
  goalExercises,
  currentDuration,
  goalDuration,
  colors = [FIXED_COLORS.primary[500], FIXED_COLORS.secondary[300]],
  icon,
}) => {
  const { t } = useTranslation();

  const safeGoalExercises = goalExercises || 6;
  const safeGoalDuration = goalDuration || 45;

  const exercisesPercentage = Math.min(
    (currentExercises / safeGoalExercises) * 100,
    100
  );
  const durationPercentage = Math.min(
    (currentDuration / safeGoalDuration) * 100,
    100
  );

  return (
    <LinearGradient
      colors={colors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 16,
        shadowColor: FIXED_COLORS.background[950],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <VStack space="md">
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

        {/* Estatísticas do treino */}
        <HStack justifyContent="space-between">
          {/* Exercícios */}
          <VStack alignItems="center" space="xs" flex={1}>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$2xl"
              fontWeight="$bold"
            >
              {currentExercises}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.8}
              textAlign="center"
            >
              {t("history.workout.exercises")}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.7}
              textAlign="center"
            >
              {t("common.goal")}: {safeGoalExercises}
            </Text>
          </VStack>

          {/* Separador */}
          <Box
            width={1}
            bg={FIXED_COLORS.background[0]}
            opacity={0.3}
            mx="$3"
          />

          {/* Duração */}
          <VStack alignItems="center" space="xs" flex={1}>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$2xl"
              fontWeight="$bold"
            >
              {currentDuration}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.8}
              textAlign="center"
            >
              {t("history.workout.duration")}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.7}
              textAlign="center"
            >
              {t("common.goal")}: {safeGoalDuration}min
            </Text>
          </VStack>
        </HStack>

        {/* Progresso geral */}
        <VStack space="xs">
          <HStack justifyContent="space-between">
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.8}
            >
              {t("history.workout.exercises")}: {exercisesPercentage.toFixed(0)}
              % {t("common.ofGoal")}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.8}
            >
              {t("history.workout.duration")}: {durationPercentage.toFixed(0)}%{" "}
              {t("common.ofGoal")}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </LinearGradient>
  );
};

export default WorkoutGoalCard;
