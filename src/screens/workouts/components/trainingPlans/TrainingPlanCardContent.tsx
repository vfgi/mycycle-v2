import React from "react";
import { VStack, HStack, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Workout, TrainingExercise } from "../../../../types/training";
import { ExerciseCard } from "../ExerciseCard";

interface TrainingPlanCardContentProps {
  workouts: Workout[];
  onExercisePlay: (exercise: TrainingExercise) => void;
}

const WEEK_DAYS_MAPPING: { [key: string]: string } = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const TrainingPlanCardContent: React.FC<
  TrainingPlanCardContentProps
> = ({ workouts, onExercisePlay }) => {
  const { t } = useTranslation();

  const formatWeekDays = (weekDays: string[]) => {
    return weekDays
      .map((day) => t(`workouts.weekDays.${day}`) || day)
      .join(", ");
  };

  return (
    <VStack space="xs">
      {workouts.map((workout: Workout, workoutIndex: number) => (
        <VStack key={workoutIndex} space="sm">
          {/* Cabeçalho do treino */}
          <VStack space="xs" px="$1">
            <HStack alignItems="center" space="sm">
              <Ionicons
                name="calendar-outline"
                size={14}
                color={FIXED_COLORS.text[400]}
              />
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                {formatWeekDays(workout.weekDays)}
              </Text>
            </HStack>
            <HStack alignItems="center" space="sm">
              <Ionicons
                name="fitness"
                size={16}
                color={FIXED_COLORS.primary[400]}
              />
              <Text
                color={FIXED_COLORS.text[200]}
                fontSize="$md"
                fontWeight="$bold"
              >
                {workout.name}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                • {workout.exercises.length} {t("workouts.exercises")}
              </Text>
            </HStack>
          </VStack>

          {/* Lista de exercícios do treino */}
          <VStack space="md">
            {workout.exercises.map(
              (exercise: TrainingExercise, exerciseIndex: number) => (
                <ExerciseCard
                  key={exerciseIndex}
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
                />
              )
            )}
          </VStack>
        </VStack>
      ))}
    </VStack>
  );
};
