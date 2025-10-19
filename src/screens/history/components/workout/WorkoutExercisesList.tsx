import React from "react";
import { VStack, HStack, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { formatDuration } from "../../../../utils";
import { WorkoutExercise } from "./types";
import { WorkoutExerciseCard } from "./WorkoutExerciseCard";

interface WorkoutExercisesListProps {
  exercises: WorkoutExercise[];
}

export const WorkoutExercisesList: React.FC<WorkoutExercisesListProps> = ({
  exercises,
}) => {
  const { t } = useTranslation();

  if (exercises.length === 0) {
    return null;
  }

  const completedExercises = exercises.filter(
    (exercise) => exercise.completed
  ).length;
  const totalDurationSeconds = exercises.reduce(
    (sum, exercise) => sum + (exercise.duration * 60),
    0
  );

  return (
    <VStack space="sm" mt="$4">
      <HStack alignItems="center" space="sm">
        <Ionicons
          name="barbell-outline"
          size={18}
          color={FIXED_COLORS.primary[600]}
        />
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$md"
          fontWeight="$semibold"
        >
          {t("history.workout.exercisesExecutedTitle")}
        </Text>
      </HStack>

      <HStack alignItems="center" space="md">
        <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
          {exercises.length}{" "}
          {exercises.length === 1
            ? t("history.workout.exerciseRegistered")
            : t("history.workout.exercisesRegistered")}
        </Text>

        <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
          • {completedExercises}/{exercises.length}{" "}
          {t("history.workout.completed").toLowerCase()}
        </Text>

        <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
          • {formatDuration(totalDurationSeconds)} {t("history.workout.totalDuration")}
        </Text>
      </HStack>

      <VStack space="xs">
        {exercises.map((exercise) => (
          <WorkoutExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </VStack>
    </VStack>
  );
};
