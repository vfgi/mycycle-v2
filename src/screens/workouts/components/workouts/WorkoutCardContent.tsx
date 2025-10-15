import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ExerciseCard } from "../ExerciseCard";
import { WorkoutExercise } from "../../../../services/workoutsService";

interface WorkoutCardContentProps {
  exercises: WorkoutExercise[];
  onPlayExercise: (exercise: WorkoutExercise) => void;
}

export const WorkoutCardContent: React.FC<WorkoutCardContentProps> = ({
  exercises,
  onPlayExercise,
}) => {
  const { t } = useTranslation();

  if (exercises.length === 0) {
    return (
      <VStack alignItems="center" justifyContent="center" py="$8" space="md">
        <Ionicons
          name="barbell-outline"
          size={48}
          color={FIXED_COLORS.text[400]}
        />
        <Text color={FIXED_COLORS.text[400]} fontSize="$md" textAlign="center">
          {t("workouts.noExercisesInWorkout")}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack space="md">
      {exercises.map((exercise, exerciseIndex) => (
        <ExerciseCard
          key={exercise.id || exerciseIndex}
          exercise={{
            name: exercise.name,
            muscle_group: exercise.muscle_group,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            imageURL: exercise.imageURL,
            videoURL: exercise.videoURL,
            category: exercise.category || "",
            difficulty: exercise.difficulty || "",
            equipment: exercise.equipment || "",
            order: exercise.order || exerciseIndex,
          }}
          onPlayPress={() => onPlayExercise(exercise)}
        />
      ))}
    </VStack>
  );
};
