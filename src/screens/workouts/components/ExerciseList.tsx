import React from "react";
import { VStack, Text, ScrollView, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { TrainingExercise } from "../../../types/training";
import { ExerciseCard } from "./ExerciseCard";

interface ExerciseListProps {
  exercises: TrainingExercise[];
  title?: string;
  onExercisePlay?: (exercise: TrainingExercise) => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  title,
  onExercisePlay,
}) => {
  const { t } = useTranslation();

  if (exercises.length === 0) {
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
            {t("workouts.noExercisesToday")}
          </Text>
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$md"
            textAlign="center"
            maxWidth={280}
            lineHeight="$md"
          >
            {t("workouts.noExercisesTodayDescription")}
          </Text>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack flex={1} px="$4" pt="$4">
      {title && (
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$xl"
          fontWeight="$bold"
          mb="$6"
          textAlign="center"
        >
          {title}
        </Text>
      )}

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32,
        }}
      >
        <VStack space="md">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={`${exercise.name}-${index}`}
              exercise={exercise}
              onPlayPress={onExercisePlay}
            />
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  );
};
