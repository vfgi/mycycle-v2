import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { WorkoutExercise } from "./types";

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
}

export const WorkoutExerciseCard: React.FC<WorkoutExerciseCardProps> = ({
  exercise,
}) => {
  const { t } = useTranslation();

  const getMuscleColor = (muscle: string) => {
    const colorMap: Record<string, string> = {
      Peito: FIXED_COLORS.error[500],
      Costas: FIXED_COLORS.success[500],
      Bíceps: FIXED_COLORS.primary[500],
      Tríceps: FIXED_COLORS.secondary[300],
      Ombros: FIXED_COLORS.warning[500],
      Quadríceps: FIXED_COLORS.error[600],
      Posterior: FIXED_COLORS.success[600],
    };
    return colorMap[muscle] || FIXED_COLORS.text[400];
  };

  const formatRestTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  };

  return (
    <Box
      key={exercise.id}
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      p="$3"
      mb="$2"
      borderLeftWidth={4}
      borderLeftColor={getMuscleColor(exercise.muscle)}
    >
      <VStack space="xs">
        <HStack alignItems="center" justifyContent="space-between">
          <VStack flex={1}>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$semibold"
              numberOfLines={1}
            >
              {exercise.name}
            </Text>
            <HStack alignItems="center" space="xs">
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                {exercise.muscle}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                • {exercise.time}
              </Text>
              <Text
                color={getMuscleColor(exercise.muscle)}
                fontSize="$xs"
                fontWeight="$medium"
              >
                •{" "}
                {exercise.completed
                  ? t("history.workout.completed")
                  : t("history.workout.incomplete")}
              </Text>
            </HStack>
          </VStack>

          <HStack alignItems="center" space="xs">
            <Ionicons
              name={exercise.completed ? "checkmark-circle" : "time-outline"}
              size={12}
              color={
                exercise.completed
                  ? FIXED_COLORS.success[500]
                  : FIXED_COLORS.warning[500]
              }
            />
            <Text
              color={
                exercise.completed
                  ? FIXED_COLORS.success[500]
                  : FIXED_COLORS.warning[500]
              }
              fontSize="$xs"
              fontWeight="$medium"
            >
              {exercise.duration}min
            </Text>
          </HStack>
        </HStack>

        <HStack justifyContent="space-between" mt="$1">
          <VStack alignItems="center" space="xs">
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.workout.weight")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xs"
              fontWeight="$medium"
            >
              {exercise.weight}kg
            </Text>
          </VStack>

          <VStack alignItems="center" space="xs">
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.workout.sets")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xs"
              fontWeight="$medium"
            >
              {exercise.sets}x{exercise.reps}
            </Text>
          </VStack>

          <VStack alignItems="center" space="xs">
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.workout.rest")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xs"
              fontWeight="$medium"
            >
              {formatRestTime(exercise.restTime)}
            </Text>
          </VStack>

          <VStack alignItems="center" space="xs">
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.workout.duration")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xs"
              fontWeight="$medium"
            >
              {exercise.duration}min
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};
