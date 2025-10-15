import React from "react";
import {
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../../theme/colors";
import { WorkoutSession } from "../../../../services/workoutsService";
import { WorkoutCardHeader } from "./WorkoutCardHeader";
import { WorkoutCardContent } from "./WorkoutCardContent";

interface WorkoutCardProps {
  workout: WorkoutSession;
  lastExecutionDate: string;
  isCompleted: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPlayExercise: (exercise: any) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  lastExecutionDate,
  isCompleted,
  onEdit,
  onDelete,
  onPlayExercise,
}) => {
  return (
    <AccordionItem
      value={`workout-${workout.id}`}
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      borderWidth={1}
      borderColor={FIXED_COLORS.background[700]}
      mb="$3"
    >
      <AccordionHeader p="$0">
        <AccordionTrigger>
          {({ isExpanded }: { isExpanded: boolean }) => (
            <WorkoutCardHeader
              workoutName={workout.name}
              lastExecutionDate={lastExecutionDate}
              exercisesCount={workout.exercises.length}
              isCompleted={isCompleted}
              isExpanded={isExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent>
        <WorkoutCardContent
          exercises={workout.exercises}
          onPlayExercise={onPlayExercise}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
