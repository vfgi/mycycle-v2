import React from "react";
import {
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../../theme/colors";
import {
  TrainingPlanResponse,
  TrainingExercise,
} from "../../../../types/training";
import { TrainingPlanCardHeader } from "./TrainingPlanCardHeader";
import { TrainingPlanCardContent } from "./TrainingPlanCardContent";

interface TrainingPlanCardProps {
  plan: TrainingPlanResponse;
  onToggleActive: (plan: TrainingPlanResponse) => void;
  onEdit: (plan: TrainingPlanResponse) => void;
  onDelete: (plan: TrainingPlanResponse) => void;
  onExercisePlay: (exercise: TrainingExercise) => void;
}

export const TrainingPlanCard: React.FC<TrainingPlanCardProps> = ({
  plan,
  onToggleActive,
  onEdit,
  onDelete,
  onExercisePlay,
}) => {
  const getTotalExercises = () => {
    return plan.workouts.reduce(
      (total, workout) => total + workout.exercises.length,
      0
    );
  };

  return (
    <AccordionItem
      value={`plan-${plan.id}`}
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      borderWidth={1}
      borderColor={FIXED_COLORS.background[700]}
      mb="$3"
    >
      <AccordionHeader>
        <AccordionTrigger>
          {({ isExpanded }: { isExpanded: boolean }) => (
            <TrainingPlanCardHeader
              plan={plan}
              totalExercises={getTotalExercises()}
              onToggleActive={onToggleActive}
              onEdit={onEdit}
              onDelete={onDelete}
              isExpanded={isExpanded}
            />
          )}
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent>
        <TrainingPlanCardContent
          workouts={plan.workouts}
          onExercisePlay={onExercisePlay}
        />
      </AccordionContent>
    </AccordionItem>
  );
};
