import React from "react";
import {
  VStack,
  Text,
  ScrollView,
  Box,
  HStack,
  Pressable,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { Workout } from "../../../types/training";
import { ExerciseCard } from "./ExerciseCard";
import { activeWorkoutStorage } from "../../../services/activeWorkoutStorage";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface TodayWorkoutsListProps {
  workouts: Workout[];
  onStartWorkout?: (workout: Workout) => void;
}

export const TodayWorkoutsList: React.FC<TodayWorkoutsListProps> = ({
  workouts,
  onStartWorkout,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const isWorkoutExecutedToday = (workout: Workout) => {
    if (workout.lastTimeExecuted) {
      const lastExecuted = new Date(workout.lastTimeExecuted);
      const today = new Date();
      return lastExecuted.toDateString() === today.toDateString();
    }
    return false;
  };

  const handleStartWorkout = async (workout: Workout) => {
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

      await activeWorkoutStorage.createActiveWorkout(workout);
      navigation.navigate("ActiveWorkout");
      onStartWorkout?.(workout);
    } catch (error) {
      console.error("Error starting workout:", error);
      Alert.alert(t("common.error"), t("workouts.errorStartingWorkout"));
    }
  };

  if (workouts.length === 0) {
    return (
      <VStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        p="$8"
        space="lg"
      >
        <Box
          bg={FIXED_COLORS.background[800]}
          borderRadius="$full"
          p="$6"
          mb="$4"
        >
          <Ionicons
            name="fitness-outline"
            size={64}
            color={FIXED_COLORS.text[400]}
          />
        </Box>

        <VStack space="md" alignItems="center">
          <Text
            color={FIXED_COLORS.text[200]}
            fontSize="$xl"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("workouts.noWorkoutsToday")}
          </Text>
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$md"
            textAlign="center"
            maxWidth={280}
            lineHeight="$md"
          >
            {t("workouts.noWorkoutsTodayDescription")}
          </Text>
        </VStack>
      </VStack>
    );
  }

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
        {workouts.map((workout, workoutIndex) => (
          <VStack
            key={workoutIndex}
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
                  <Box bg={FIXED_COLORS.primary[500]} p="$2" borderRadius="$md">
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
                        {workout.exercises.length}{" "}
                        {workout.exercises.length === 1
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
            </VStack>

            {/* Lista de Exercícios */}
            <VStack space="sm">
              <Text
                color={FIXED_COLORS.text[300]}
                fontSize="$sm"
                fontWeight="$semibold"
                textTransform="uppercase"
              >
                {t("workouts.exercises")}
              </Text>
              <VStack space="md">
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <ExerciseCard
                    key={`${exercise.name}-${exerciseIndex}`}
                    exercise={exercise}
                    showPlayButton={false}
                  />
                ))}
              </VStack>
            </VStack>
          </VStack>
        ))}
      </VStack>
    </ScrollView>
  );
};
