import React from "react";
import { VStack, ScrollView, Accordion } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../../theme/colors";
import { WorkoutSession } from "../../../../services/workoutsService";
import { WorkoutCard } from "./WorkoutCard";

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
  return (
    <ScrollView flex={1} showsVerticalScrollIndicator={false}>
      <VStack px="$2" pt="$4" pb="$8" space="md">
        <Accordion
          size="md"
          variant="unfilled"
          type="multiple"
          isCollapsible={true}
          isDisabled={false}
        >
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              lastExecutionDate={getLastWorkoutDate(workout)}
              isCompleted={isWorkoutCompleted(workout)}
              onEdit={() => onEditWorkout(workout)}
              onDelete={() => onDeleteWorkout(workout)}
              onPlayExercise={onPlayExercise}
            />
          ))}
        </Accordion>
      </VStack>
    </ScrollView>
  );
};
