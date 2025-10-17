import React from "react";
import { VStack, Text, ScrollView } from "@gluestack-ui/themed";
import { KeyboardAvoidingView, Platform } from "react-native";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { TrainingExercise } from "../../../types/training";
import { ExerciseProgress } from "../../../services/activeWorkoutStorage";
import { ActiveExerciseCard } from "./ActiveExerciseCard";

interface ActiveExercisesListProps {
  exercises: TrainingExercise[];
  progress: ExerciseProgress[];
  editingExerciseIndex: number | null;
  exerciseWeights: { [key: number]: string };
  onOpenVideo: (exercise: TrainingExercise) => void;
  onStartExercise: (index: number) => void;
  onEditWeight: (index: number) => void;
  onSaveWeight: (index: number) => void;
  onWeightChange: (index: number, value: string) => void;
}

export const ActiveExercisesList: React.FC<ActiveExercisesListProps> = ({
  exercises,
  progress,
  editingExerciseIndex,
  exerciseWeights,
  onOpenVideo,
  onStartExercise,
  onEditWeight,
  onSaveWeight,
  onWeightChange,
}) => {
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <VStack flex={1} px="$4">
        <Text
          color={FIXED_COLORS.text[300]}
          fontSize="$sm"
          fontWeight="$semibold"
          textTransform="uppercase"
          mb="$3"
        >
          {t("workouts.exercises")} ({exercises.length})
        </Text>

        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack space="md">
            {exercises.map((exercise, index) => {
              const exerciseProgress = progress[index];
              const isEditing = editingExerciseIndex === index;

              return (
                <ActiveExerciseCard
                  key={`${exercise.name}-${index}`}
                  exercise={exercise}
                  index={index}
                  progress={exerciseProgress}
                  isEditing={isEditing}
                  weightValue={exerciseWeights[index]}
                  onOpenVideo={() => onOpenVideo(exercise)}
                  onStartExercise={() => onStartExercise(index)}
                  onEditWeight={() => onEditWeight(index)}
                  onSaveWeight={() => onSaveWeight(index)}
                  onWeightChange={(value) => onWeightChange(index, value)}
                />
              );
            })}
          </VStack>
        </ScrollView>
      </VStack>
    </KeyboardAvoidingView>
  );
};
