import React from "react";
import {
  VStack,
  Text,
  HStack,
  Box,
  Image,
  Pressable,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import FloatingTextInput from "../../../components/ui/FloatingTextInput";
import { TrainingExercise } from "../../../types/training";
import { ExerciseProgress } from "../../../services/activeWorkoutStorage";

interface ActiveExerciseCardProps {
  exercise: TrainingExercise;
  index: number;
  progress?: ExerciseProgress;
  isEditing: boolean;
  weightValue: string;
  onOpenVideo: () => void;
  onStartExercise: () => void;
  onEditWeight: () => void;
  onSaveWeight: () => void;
  onWeightChange: (value: string) => void;
}

export const ActiveExerciseCard: React.FC<ActiveExerciseCardProps> = ({
  exercise,
  index,
  progress,
  isEditing,
  weightValue,
  onOpenVideo,
  onStartExercise,
  onEditWeight,
  onSaveWeight,
  onWeightChange,
}) => {
  const { t } = useTranslation();
  const { unitSystem } = useUnits();
  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <VStack
      key={`${exercise.name}-${index}`}
      bg={FIXED_COLORS.background[800]}
      borderRadius="$xl"
      overflow="hidden"
      borderWidth={1}
      borderColor={
        progress?.completed
          ? FIXED_COLORS.success[600]
          : FIXED_COLORS.background[600]
      }
    >
      <HStack space="md">
        {/* Image Preview */}
        {exercise.imageURL && (
          <Pressable onPress={onOpenVideo}>
            <Box width={100} height={120} position="relative">
              <Image
                source={{ uri: exercise.imageURL }}
                alt={exercise.name}
                style={{ width: 100, height: 140 }}
                resizeMode="cover"
              />
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                height={140}
                justifyContent="center"
                alignItems="center"
                bg="rgba(0,0,0,0.3)"
              >
                <Ionicons
                  name="play-circle"
                  size={40}
                  color={FIXED_COLORS.text[50]}
                />
              </Box>
            </Box>
          </Pressable>
        )}

        {/* Exercise Info */}
        <VStack flex={1} py="$3" space="sm" pr="$2">
          {/* Header with status */}
          <HStack alignItems="center" space="sm" justifyContent="space-between">
            <HStack alignItems="center" space="sm" flex={1}>
              {progress?.completed && (
                <Box
                  bg={FIXED_COLORS.success[500]}
                  width={24}
                  height={24}
                  borderRadius="$full"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={FIXED_COLORS.text[50]}
                  />
                </Box>
              )}
              <VStack flex={1}>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$bold"
                  numberOfLines={1}
                >
                  {t(`exercises.${exercise.name}`)}
                </Text>
                <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                  {exercise.muscle_group}
                </Text>
              </VStack>
            </HStack>

            {/* Start Button */}
            <Pressable
              onPress={onStartExercise}
              bg={
                progress?.completed
                  ? FIXED_COLORS.success[500]
                  : FIXED_COLORS.primary[500]
              }
              borderRadius="$md"
              px="$3"
              py="$1.5"
            >
              <HStack alignItems="center" space="xs">
                <Ionicons
                  name={progress?.completed ? "checkmark" : "play"}
                  size={12}
                  color={FIXED_COLORS.text[950]}
                />
                <Text
                  color={FIXED_COLORS.text[950]}
                  fontSize="$xs"
                  fontWeight="$semibold"
                >
                  {progress?.completed
                    ? t("common.completed")
                    : t("workouts.start")}
                </Text>
              </HStack>
            </Pressable>
          </HStack>

          {/* Exercise Stats */}
          <HStack space="sm" justifyContent="space-between">
            <VStack alignItems="center" space="xs" flex={1}>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$2xs"
                fontWeight="$medium"
              >
                {t("workouts.sets")}
              </Text>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$bold"
              >
                {progress?.completedSets || 0}/{exercise.sets}
              </Text>
            </VStack>

            <VStack alignItems="center" space="xs" flex={1}>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$2xs"
                fontWeight="$medium"
              >
                {t("workouts.reps")}
              </Text>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$bold"
              >
                {exercise.reps}
              </Text>
            </VStack>

            <VStack alignItems="center" space="xs" flex={1}>
              {isEditing ? (
                <Box width={80}>
                  <FloatingTextInput
                    label={weightUnit}
                    value={weightValue}
                    onChangeText={onWeightChange}
                    keyboardType="numeric"
                    onBlur={onSaveWeight}
                    autoFocus
                    backgroundColor={FIXED_COLORS.background[700]}
                    valueColor={FIXED_COLORS.text[50]}
                    isFocusLabelColor={FIXED_COLORS.primary[400]}
                    isBlurLabelColor={FIXED_COLORS.text[400]}
                    isFocusBorderColor={FIXED_COLORS.primary[500]}
                    isBlurBorderColor={FIXED_COLORS.background[600]}
                    isBlurValueBorderColor={FIXED_COLORS.background[600]}
                  />
                </Box>
              ) : (
                <Pressable onPress={onEditWeight}>
                  <Text
                    color={FIXED_COLORS.text[400]}
                    fontSize="$2xs"
                    fontWeight="$medium"
                  >
                    {t("workouts.weight")}
                  </Text>
                  <HStack alignItems="center" space="xs">
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$md"
                      fontWeight="$bold"
                    >
                      {exercise.weight ?? 0}
                      {weightUnit}
                    </Text>
                    <Ionicons
                      name="create-outline"
                      size={14}
                      color={FIXED_COLORS.primary[400]}
                    />
                  </HStack>
                </Pressable>
              )}
            </VStack>
          </HStack>

          {/* Time Stats (only if progress exists) */}
          {progress &&
            (progress.totalExecutionTime > 0 ||
              progress.averageRestTime > 0) && (
              <HStack space="md" mt="$2" justifyContent="flex-start">
                {progress.totalExecutionTime > 0 && (
                  <HStack space="xs" alignItems="center">
                    <Ionicons
                      name="timer-outline"
                      size={14}
                      color={FIXED_COLORS.primary[400]}
                    />
                    <Text color={FIXED_COLORS.text[400]} fontSize="$2xs">
                      {formatTime(progress.totalExecutionTime)}
                    </Text>
                  </HStack>
                )}
                {progress.averageRestTime > 0 && (
                  <HStack space="xs" alignItems="center">
                    <Ionicons
                      name="pause-circle-outline"
                      size={14}
                      color={FIXED_COLORS.success[400]}
                    />
                    <Text color={FIXED_COLORS.text[400]} fontSize="$2xs">
                      ~{formatTime(Math.round(progress.averageRestTime))}
                    </Text>
                  </HStack>
                )}
              </HStack>
            )}
        </VStack>
      </HStack>
    </VStack>
  );
};
