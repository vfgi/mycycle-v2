import React from "react";
import {
  VStack,
  Text,
  HStack,
  ScrollView,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionIcon,
  AccordionContent,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { TrainingExercise, Workout } from "../../../types/training";
import { ExerciseCard } from "./ExerciseCard";

interface PlanExercisesListProps {
  workouts: Workout[];
  onExercisePlay: (exercise: TrainingExercise) => void;
}

export const PlanExercisesList: React.FC<PlanExercisesListProps> = ({
  workouts,
  onExercisePlay,
}) => {
  const { t } = useTranslation();

  if (workouts.length === 0) {
    return (
      <VStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        px="$4"
        pt="$8"
        space="md"
      >
        <Ionicons
          name="calendar-outline"
          size={64}
          color={FIXED_COLORS.text[400]}
        />
        <Text
          color={FIXED_COLORS.text[400]}
          fontSize="$lg"
          fontWeight="$semibold"
          textAlign="center"
        >
          {t("workouts.noExercisesToday")}
        </Text>
        <Text
          color={FIXED_COLORS.text[500]}
          fontSize="$sm"
          textAlign="center"
          px="$4"
        >
          {t("workouts.noExercisesTodayDescription")}
        </Text>
      </VStack>
    );
  }

  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <VStack px="$4" pt="$4" pb="$8" space="md">
        <Accordion
          size="md"
          variant="unfilled"
          type="multiple"
          isCollapsible={true}
          isDisabled={false}
        >
          {workouts.map((workout, workoutIndex) => (
            <AccordionItem
              key={workoutIndex}
              value={`workout-${workoutIndex}`}
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              borderWidth={1}
              borderColor={FIXED_COLORS.background[700]}
              mb="$3"
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <HStack flex={1} alignItems="center" space="sm">
                      <Ionicons
                        name="calendar"
                        size={20}
                        color={FIXED_COLORS.primary[400]}
                      />
                      <VStack flex={1} space="xs">
                        <AccordionTitleText
                          color={FIXED_COLORS.text[100]}
                          fontSize="$lg"
                          fontWeight="$bold"
                        >
                          {workout.weekDays
                            .map((day) => t(`workouts.weekDays.${day}`) || day)
                            .join(", ")}
                        </AccordionTitleText>
                        <Text
                          color={FIXED_COLORS.text[300]}
                          fontSize="$sm"
                          fontWeight="$medium"
                        >
                          {workout.name} • {workout.exercises.length}{" "}
                          {t("workouts.exercises")}
                        </Text>
                      </VStack>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={FIXED_COLORS.text[400]}
                      />
                    </HStack>
                  )}
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                <VStack space="md">
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <ExerciseCard
                      key={exerciseIndex}
                      exercise={exercise}
                      onPlayPress={() => onExercisePlay(exercise)}
                    />
                  ))}
                </VStack>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </VStack>
    </ScrollView>
  );
};
