import React from "react";
import { VStack, Text, HStack, ScrollView } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { getWeekDayLabel } from "../../../utils/weekDays";
import { Exercise } from "../../../types/exercises";
import { SelectedExerciseItem } from "../components";

interface Step3WorkoutSummaryProps {
  selectedDays: string[];
  selectedWorkoutExercises: Record<string, Exercise[]>;
  selectedExercises: Record<string, string[]>; // day -> muscle groups
  exerciseConfigs: Record<
    string,
    { sets: string; reps: string; weight: string }
  >;
  onUpdateSets: (exerciseId: string, sets: string) => void;
  onUpdateReps: (exerciseId: string, reps: string) => void;
  onUpdateWeight: (exerciseId: string, weight: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
  generateWorkoutName: (day: string) => string;
}

export const Step3WorkoutSummary: React.FC<Step3WorkoutSummaryProps> = ({
  selectedDays,
  selectedWorkoutExercises,
  selectedExercises,
  exerciseConfigs,
  onUpdateSets,
  onUpdateReps,
  onUpdateWeight,
  onRemoveExercise,
  generateWorkoutName,
}) => {
  const { t } = useTranslation();

  return (
    <VStack space="lg" flex={1}>
      <VStack space="md">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$xl"
          fontWeight="$bold"
          textAlign="center"
        >
          {t("workoutSetup.summary")}
        </Text>
        <Text color={FIXED_COLORS.text[400]} fontSize="$sm" textAlign="center">
          {t("workoutSetup.summaryDescription")}
        </Text>
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="lg">
          {selectedDays.map((day) => {
            const dayExercises = selectedWorkoutExercises[day] || [];
            const workoutName = generateWorkoutName(day);

            return (
              <VStack key={day} space="md">
                {/* Header do Dia */}
                <VStack
                  bg={FIXED_COLORS.background[800]}
                  p="$4"
                  borderRadius="$lg"
                  borderLeftWidth={4}
                  borderLeftColor={FIXED_COLORS.primary[500]}
                >
                  <HStack alignItems="center" space="md">
                    <VStack
                      bg={FIXED_COLORS.primary[500]}
                      width={12}
                      height={12}
                      borderRadius="$full"
                    />
                    <VStack flex={1}>
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$lg"
                        fontWeight="$bold"
                      >
                        {getWeekDayLabel(day, t)}
                      </Text>
                      <Text
                        color={FIXED_COLORS.text[300]}
                        fontSize="$md"
                        fontWeight="$medium"
                      >
                        {workoutName}
                      </Text>
                      <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                        {dayExercises.length}{" "}
                        {dayExercises.length === 1
                          ? t("workoutSetup.exercise")
                          : t("workoutSetup.exercises")}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>

                {/* Lista de Exercícios do Dia */}
                {dayExercises.length > 0 ? (
                  <VStack space="sm">
                    {dayExercises.map((exercise) => (
                      <SelectedExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        sets={exerciseConfigs[exercise.id]?.sets || "3"}
                        reps={exerciseConfigs[exercise.id]?.reps || "12"}
                        weight={exerciseConfigs[exercise.id]?.weight || "0"}
                        onUpdateSets={(exerciseId, sets) =>
                          onUpdateSets(exerciseId, sets)
                        }
                        onUpdateReps={(exerciseId, reps) =>
                          onUpdateReps(exerciseId, reps)
                        }
                        onUpdateWeight={(exerciseId, weight) =>
                          onUpdateWeight(exerciseId, weight)
                        }
                        onRemove={() => onRemoveExercise(exercise.id)}
                        onSwap={() => {
                          // TODO: Implementar troca de exercício
                        }}
                      />
                    ))}
                  </VStack>
                ) : (
                  <VStack
                    bg={FIXED_COLORS.background[800]}
                    p="$4"
                    borderRadius="$lg"
                    alignItems="center"
                  >
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      textAlign="center"
                    >
                      {t("workoutSetup.noExercisesForDay")}
                    </Text>
                  </VStack>
                )}
              </VStack>
            );
          })}
        </VStack>
      </ScrollView>
    </VStack>
  );
};
