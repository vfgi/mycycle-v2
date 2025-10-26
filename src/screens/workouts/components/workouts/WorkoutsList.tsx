import React, { useState } from "react";
import {
  VStack,
  ScrollView,
  Box,
  HStack,
  Pressable,
  Text,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { WorkoutSession } from "../../../../services/workoutsService";
import { ExerciseCard } from "../ExerciseCard";
import { activeWorkoutStorage } from "../../../../services/activeWorkoutStorage";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface WorkoutsListProps {
  workouts: WorkoutSession[];
  getLastWorkoutDate: (workout: WorkoutSession) => string;
  isWorkoutCompleted: (workout: WorkoutSession) => boolean;
  onEditWorkout: (workout: WorkoutSession) => void;
  onDeleteWorkout: (workout: WorkoutSession) => void;
  onPlayExercise: (exercise: any) => void;
}

export const WorkoutsList: React.FC<WorkoutsListProps> = ({
  workouts,
  getLastWorkoutDate,
  isWorkoutCompleted,
  onEditWorkout,
  onDeleteWorkout,
  onPlayExercise,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(
    new Set()
  );

  const toggleWorkoutExpanded = (workoutId: string) => {
    setExpandedWorkouts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  const isWorkoutExecutedToday = (workout: WorkoutSession) => {
    if (workout.lastTimeExecuted) {
      const lastExecuted = new Date(workout.lastTimeExecuted);
      const today = new Date();
      return lastExecuted.toDateString() === today.toDateString();
    }
    return false;
  };

  const handleStartWorkout = async (workout: WorkoutSession) => {
    try {
      const hasActive = await activeWorkoutStorage.hasActiveWorkout();

      if (hasActive) {
        Alert.alert(
          t("workouts.activeWorkoutExists"),
          t("workouts.activeWorkoutExistsMessage"),
          [
            { text: t("common.cancel"), style: "cancel" },
            {
              text: t("workouts.viewActiveWorkout"),
              onPress: () => navigation.navigate("ActiveWorkout"),
            },
          ]
        );
        return;
      }

      // Converter WorkoutSession para Workout
      const workoutForStorage = {
        id: workout.id,
        name: workout.name,
        exercises: (workout.exercises || []).map((exercise, index) => ({
          ...exercise,
          order: exercise.order ?? index,
        })),
        weekDays: [],
        lastTimeExecuted: workout.lastTimeExecuted,
      };

      await activeWorkoutStorage.createActiveWorkout(workoutForStorage);
      navigation.navigate("ActiveWorkout");
    } catch (error) {
      console.error("Error starting workout:", error);
      Alert.alert(t("common.error"), t("workouts.errorStartingWorkout"));
    }
  };

  const handleEditWorkout = (workout: WorkoutSession) => {
    onEditWorkout(workout);
  };

  const handleDeleteWorkout = (workout: WorkoutSession) => {
    Alert.alert(
      t("workouts.deleteWorkout"),
      t("workouts.deleteWorkoutMessage", { name: workout.name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => onDeleteWorkout(workout),
        },
      ]
    );
  };

  return (
    <ScrollView
      flex={1}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
      }}
    >
      <VStack space="lg">
        {workouts.map((workout) => {
          const isExpanded = expandedWorkouts.has(workout.id);

          return (
            <VStack
              key={workout.id}
              bg={FIXED_COLORS.background[800]}
              borderRadius="$xl"
              p="$4"
              space="md"
              borderWidth={1}
              borderColor={FIXED_COLORS.primary[700]}
            >
              {/* Header do Treino */}
              <VStack space="sm">
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space="sm" flex={1}>
                    <Box
                      bg={FIXED_COLORS.primary[500]}
                      p="$2"
                      borderRadius="$md"
                    >
                      <Ionicons
                        name="fitness"
                        size={20}
                        color={FIXED_COLORS.text[50]}
                      />
                    </Box>
                    <VStack flex={1}>
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$lg"
                        fontWeight="$bold"
                        numberOfLines={1}
                      >
                        {workout.name}
                      </Text>
                      <VStack>
                        <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                          {workout.exercises?.length || 0}{" "}
                          {(workout.exercises?.length || 0) === 1
                            ? t("workouts.exercise")
                            : t("workouts.exercises")}
                        </Text>
                        {isWorkoutExecutedToday(workout) && (
                          <HStack alignItems="center" space="xs" mt="$1">
                            <Ionicons
                              name="checkmark-circle"
                              size={14}
                              color={FIXED_COLORS.success[500]}
                            />
                            <Text
                              color={FIXED_COLORS.success[500]}
                              fontSize="$xs"
                              fontWeight="$medium"
                            >
                              {t("workouts.completedToday")}
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </VStack>
                  </HStack>

                  {/* Botões de Ação */}
                  <HStack space="sm" alignItems="center">
                    {/* Botão Editar */}
                    <Pressable
                      onPress={() => handleEditWorkout(workout)}
                      bg={FIXED_COLORS.background[700]}
                      p="$2"
                      borderRadius="$md"
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color={FIXED_COLORS.text[300]}
                      />
                    </Pressable>

                    {/* Botão Excluir */}
                    <Pressable
                      onPress={() => handleDeleteWorkout(workout)}
                      bg={FIXED_COLORS.error[600]}
                      p="$2"
                      borderRadius="$md"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={FIXED_COLORS.text[50]}
                      />
                    </Pressable>

                    {/* Botão Iniciar Treino */}
                    <Pressable
                      onPress={() => handleStartWorkout(workout)}
                      bg={FIXED_COLORS.primary[600]}
                      px="$4"
                      py="$2"
                      borderRadius="$lg"
                      flexDirection="row"
                      alignItems="center"
                      gap="$1"
                    >
                      <Ionicons
                        name="play"
                        size={18}
                        color={FIXED_COLORS.text[950]}
                      />
                      <Text
                        color={FIXED_COLORS.text[950]}
                        fontSize="$sm"
                        fontWeight="$bold"
                      >
                        {t("workouts.startWorkout")}
                      </Text>
                    </Pressable>
                  </HStack>
                </HStack>
              </VStack>

              {/* Lista de Exercícios */}
              <VStack space="sm">
                <Pressable onPress={() => toggleWorkoutExpanded(workout.id)}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text
                      color={FIXED_COLORS.text[300]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                      textTransform="uppercase"
                    >
                      {t("workouts.exercises")}
                    </Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={FIXED_COLORS.text[400]}
                    />
                  </HStack>
                </Pressable>

                {isExpanded && (
                  <VStack space="md">
                    {workout.exercises?.map((exercise, exerciseIndex) => (
                      <ExerciseCard
                        key={`${exercise.name}-${exerciseIndex}`}
                        exercise={{
                          ...exercise,
                          order: exercise.order ?? exerciseIndex,
                        }}
                        showPlayButton={false}
                      />
                    ))}
                  </VStack>
                )}
              </VStack>
            </VStack>
          );
        })}
      </VStack>
    </ScrollView>
  );
};
