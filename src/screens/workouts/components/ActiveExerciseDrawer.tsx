import React, { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Pressable,
  Image,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import { CustomDrawer } from "../../../components";
import { ExerciseVideoModal } from "./ExerciseVideoModal";
import { TrainingExercise } from "../../../types/training";
import ProgressCircle from "../../../components/ui/ProgressCircle";
import SwipeSlider from "../../../components/ui/SwipeSlider";
import { activeWorkoutStorage } from "../../../services/activeWorkoutStorage";

interface ActiveExerciseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: TrainingExercise | null;
  exerciseIndex: number;
  currentSet: number;
  onSetComplete: () => void;
}

type ExerciseMode = "execution" | "rest";

export const ActiveExerciseDrawer: React.FC<ActiveExerciseDrawerProps> = ({
  isOpen,
  onClose,
  exercise,
  exerciseIndex,
  currentSet,
  onSetComplete,
}) => {
  const { t } = useTranslation();
  const { unitSystem } = useUnits();
  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";

  const [mode, setMode] = useState<ExerciseMode>("execution");
  const [executionTime, setExecutionTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [restTimesArray, setRestTimesArray] = useState<number[]>([]);

  const EXECUTION_TIME = 60;
  const REST_TIME = 90;

  useEffect(() => {
    if (!isOpen) {
      setExecutionTime(0);
      setRestTime(0);
      setMode("execution");
      return;
    }

    const timer = setInterval(() => {
      if (mode === "execution") {
        setExecutionTime((prev) => prev + 1);
      } else {
        setRestTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSwipeComplete = async () => {
    if (mode === "execution") {
      if (currentSet >= (exercise?.sets ?? 0)) {
        await saveAndClose();
      } else {
        setMode("rest");
        setRestTime(0);
      }
    } else {
      setRestTimesArray((prev) => [...prev, restTime]);
      setMode("execution");
      setRestTime(0);
      onSetComplete();
    }
  };

  const saveAndClose = async () => {
    if (!exercise) {
      return;
    }

    const exerciseId = `${exercise.name}-${exerciseIndex}`;

    await activeWorkoutStorage.updateExerciseStats(
      exerciseId,
      executionTime,
      restTimesArray
    );

    await activeWorkoutStorage.updateCompletedSets(exerciseId, currentSet);

    if (currentSet >= exercise.sets) {
      await activeWorkoutStorage.completeExercise(exerciseId);
    }

    onClose();
  };

  const handleManualClose = async () => {
    await saveAndClose();
  };

  if (!exercise) return null;

  const modeColor =
    mode === "execution"
      ? FIXED_COLORS.primary[500]
      : FIXED_COLORS.success[500];
  const modeText =
    mode === "execution" ? t("workouts.execution") : t("workouts.rest");

  return (
    <CustomDrawer isOpen={isOpen} onClose={handleManualClose} minHeight={600}>
      <VStack flex={1}>
        {/* Header */}
        <VStack p="$6" pb="$4" space="md">
          <HStack justifyContent="space-between" alignItems="flex-start">
            <HStack space="md" flex={1} alignItems="center">
              {/* Exercise Preview Image */}
              <Pressable onPress={() => setShowVideoModal(true)}>
                <Box
                  width={60}
                  height={60}
                  borderRadius="$lg"
                  overflow="hidden"
                  borderWidth={2}
                  borderColor={FIXED_COLORS.primary[600]}
                >
                  <Image
                    source={{ uri: exercise.imageURL }}
                    alt={exercise.name}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    right={0}
                    bg={FIXED_COLORS.primary[600]}
                    p="$1"
                    borderTopLeftRadius="$sm"
                  >
                    <Ionicons
                      name="play"
                      size={12}
                      color={FIXED_COLORS.text[950]}
                    />
                  </Box>
                </Box>
              </Pressable>

              {/* Exercise Name */}
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$xl"
                fontWeight="$bold"
                flex={1}
              >
                {t(`exercises.${exercise.name}`)}
              </Text>
            </HStack>

            <Pressable onPress={handleManualClose}>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$lg"
                fontWeight="$bold"
              >
                ✕
              </Text>
            </Pressable>
          </HStack>
        </VStack>

        {/* Content */}
        <VStack flex={1} space="xl" alignItems="center" px="$6" pb="$6">
          {/* Exercise Info */}
          <VStack space="md" alignItems="center" width="100%">
            <HStack space="xl" justifyContent="center">
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("workouts.sets")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {currentSet}/{exercise.sets}
                </Text>
              </VStack>

              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("workouts.reps")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {exercise.reps}
                </Text>
              </VStack>

              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("workouts.weight")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {exercise.weight ?? 0}
                  {weightUnit}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Progress Circles */}
          <VStack space="md" alignItems="center" my="$6">
            <HStack space="xl" justifyContent="center">
              {/* Execution Circle */}
              <VStack alignItems="center" space="sm">
                <Text
                  color={FIXED_COLORS.primary[500]}
                  fontSize="$xs"
                  fontWeight="$semibold"
                  textTransform="uppercase"
                >
                  {t("workouts.execution")}
                </Text>
                <ProgressCircle
                  progress={(executionTime % EXECUTION_TIME) / EXECUTION_TIME}
                  progressColor={FIXED_COLORS.primary[500]}
                  trackColor={FIXED_COLORS.background[700]}
                  size={120}
                  strokeWidth={8}
                  animationDuration={500}
                  reduceMotion="never"
                >
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$2xl"
                    fontWeight="$bold"
                  >
                    {formatTime(executionTime)}
                  </Text>
                </ProgressCircle>
              </VStack>

              {/* Rest Circle */}
              <VStack alignItems="center" space="sm">
                <Text
                  color={FIXED_COLORS.success[500]}
                  fontSize="$xs"
                  fontWeight="$semibold"
                  textTransform="uppercase"
                >
                  {t("workouts.rest")}
                </Text>
                <ProgressCircle
                  progress={Math.min(restTime / REST_TIME, 1)}
                  progressColor={FIXED_COLORS.success[500]}
                  trackColor={FIXED_COLORS.background[700]}
                  size={120}
                  strokeWidth={8}
                  animationDuration={500}
                  reduceMotion="never"
                >
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$2xl"
                    fontWeight="$bold"
                  >
                    {formatTime(restTime)}
                  </Text>
                </ProgressCircle>
              </VStack>
            </HStack>
          </VStack>

          {/* Swipe Slider */}
          <Box width="100%" mt="$4">
            <SwipeSlider
              onSwipeComplete={handleSwipeComplete}
              enableHaptics
              sliderTrackWidth={350}
              initialTrackColor={FIXED_COLORS.background[700]}
              completeTrackColor={modeColor}
              sliderBackgroundColor={modeColor}
              textColor={FIXED_COLORS.text[50]}
              initialText={
                mode === "execution"
                  ? t("workouts.swipeToRest")
                  : t("workouts.swipeToNextSet")
              }
              completeText={
                mode === "execution"
                  ? t("workouts.startRest")
                  : t("workouts.nextSet")
              }
              startIcon={
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={FIXED_COLORS.text[950]}
                />
              }
              endIcon={
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={FIXED_COLORS.text[950]}
                />
              }
              reduceMotion="never"
            />
          </Box>
        </VStack>
      </VStack>

      {/* Exercise Video Modal */}
      {showVideoModal && (
        <ExerciseVideoModal
          exercise={exercise}
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </CustomDrawer>
  );
};
