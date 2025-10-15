import React from "react";
import { Accordion } from "@gluestack-ui/themed";
import {
  TrainingPlanResponse,
  TrainingExercise,
} from "../../../../types/training";
import { TrainingPlanCard } from "./TrainingPlanCard";

interface TrainingPlansListProps {
  plans: TrainingPlanResponse[];
  onToggleActive: (plan: TrainingPlanResponse) => void;
  onEdit: (plan: TrainingPlanResponse) => void;
  onDelete: (plan: TrainingPlanResponse) => void;
  onExercisePlay: (exercise: TrainingExercise) => void;
}

export const TrainingPlansList: React.FC<TrainingPlansListProps> = ({
  plans,
  onToggleActive,
  onEdit,
  onDelete,
  onExercisePlay,
}) => {
  return (
    <Accordion
      size="md"
      variant="unfilled"
      type="multiple"
      isCollapsible={true}
      isDisabled={false}
    >
      {plans.map((plan) => (
        <TrainingPlanCard
          key={plan.id}
          plan={plan}
          onToggleActive={onToggleActive}
          onEdit={onEdit}
          onDelete={onDelete}
          onExercisePlay={onExercisePlay}
        />
      ))}
    </Accordion>
  );
};
