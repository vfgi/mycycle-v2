import React from "react";
import { VStack, Text, HStack, Box, Pressable } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import AnimatedProgressBar from "../../../components/ui/AnimatedProgressBar";

interface ActiveWorkoutProgressCardProps {
  workoutName: string;
  completedExercises: number;
  totalExercises: number;
  elapsedTime: number;
  progressPercentage: number;
  startedAt?: string;
  finishedAt?: string;
  onStartWorkout: () => void;
  onCompleteWorkout: () => void;
}

export const ActiveWorkoutProgressCard: React.FC<
  ActiveWorkoutProgressCardProps
> = ({
  workoutName,
  completedExercises,
  totalExercises,
  elapsedTime,
  progressPercentage,
  startedAt,
  finishedAt,
  onStartWorkout,
  onCompleteWorkout,
}) => {
  const { t } = useTranslation();
  const isStarted = !!startedAt;
  const isFinished = !!finishedAt;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <Box borderRadius="$xl" overflow="hidden">
      <LinearGradient
        colors={["#1e3a8a", "#312e81"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20 }}
      >
        <VStack space="lg">
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack space="xs" flex={1}>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$xl"
                fontWeight="$bold"
              >
                {workoutName}
              </Text>
              <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                {t("workouts.activeWorkout")}
              </Text>
            </VStack>

            {/* Botão Iniciar/Finalizar Treino */}
            {!isStarted ? (
              <Pressable
                onPress={onStartWorkout}
                bg={FIXED_COLORS.success[600]}
                px="$4"
                py="$2"
                borderRadius="$lg"
                flexDirection="row"
                alignItems="center"
                gap="$2"
              >
                <Ionicons
                  name="play-circle"
                  size={18}
                  color={FIXED_COLORS.text[950]}
                />
                <Text
                  color={FIXED_COLORS.text[950]}
                  fontSize="$sm"
                  fontWeight="$bold"
                >
                  {t("workouts.start")}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={onCompleteWorkout}
                bg={
                  isFinished
                    ? FIXED_COLORS.success[600]
                    : FIXED_COLORS.warning[500]
                }
                px="$4"
                py="$2"
                borderRadius="$lg"
                flexDirection="row"
                alignItems="center"
                gap="$2"
                disabled={isFinished}
                opacity={isFinished ? 0.6 : 1}
              >
                <Ionicons
                  name={isFinished ? "checkmark-circle" : "flag"}
                  size={18}
                  color={FIXED_COLORS.text[950]}
                />
                <Text
                  color={FIXED_COLORS.text[950]}
                  fontSize="$sm"
                  fontWeight="$bold"
                >
                  {isFinished ? t("common.completed") : t("workouts.finish")}
                </Text>
              </Pressable>
            )}
          </HStack>

          {/* Progress Bars */}
          <VStack space="lg">
            {/* Exercises Progress */}
            <VStack space="sm">
              <HStack justifyContent="space-between" alignItems="center">
                <Text
                  color={FIXED_COLORS.text[200]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {t("workouts.progress")}
                </Text>
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {completedExercises} / {totalExercises}{" "}
                  {t("workouts.exercises")}
                </Text>
              </HStack>

              <AnimatedProgressBar
                progress={progressPercentage / 100}
                height={24}
                width={Dimensions.get("window").width - 104}
                text={`${Math.round(progressPercentage)}%`}
                icon={
                  <Ionicons
                    name="checkbox"
                    size={14}
                    color={FIXED_COLORS.text[950]}
                  />
                }
                iconContainerColor="#10b981"
                trackColor={FIXED_COLORS.background[800]}
                textStyle={{
                  color: FIXED_COLORS.text[50],
                  fontSize: 11,
                  fontWeight: "600",
                }}
                colorAtZeroProgress="#6366f1"
                colorAtMidProgress="#8b5cf6"
                colorAtFullProgress="#10b981"
                animationDuration={1000}
                reduceMotion="never"
              />
            </VStack>

            {/* Timer */}
            <VStack space="sm">
              <HStack justifyContent="space-between" alignItems="center">
                <Text
                  color={FIXED_COLORS.text[200]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {t("workouts.duration")}
                </Text>
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {formatTime(elapsedTime)}
                </Text>
              </HStack>

              <AnimatedProgressBar
                progress={1}
                height={24}
                width={Dimensions.get("window").width - 104}
                text={formatTime(elapsedTime)}
                icon={
                  <Ionicons
                    name="time"
                    size={14}
                    color={FIXED_COLORS.text[950]}
                  />
                }
                iconContainerColor="#f59e0b"
                trackColor={FIXED_COLORS.background[800]}
                textStyle={{
                  color: FIXED_COLORS.text[950],
                  fontSize: 11,
                  fontWeight: "600",
                }}
                colorAtZeroProgress="#f59e0b"
                colorAtMidProgress="#f59e0b"
                colorAtFullProgress="#f59e0b"
                animationDuration={500}
                reduceMotion="never"
              />
            </VStack>
          </VStack>
        </VStack>
      </LinearGradient>
    </Box>
  );
};
