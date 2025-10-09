import React, { useState } from "react";
import { ScrollView } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { SafeContainer } from "../../components";
import { StepIndicator, SetupHeader, NavigationButtons } from "./components";
import {
  Step1DaysSelection,
  Step2ExerciseSelection,
  Step3WorkoutSummary,
} from "./steps";
import { Exercise } from "../../types/exercises";

interface WorkoutSetupData {
  daysPerWeek: number;
  selectedDays: string[];
}

export const WorkoutSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, string[]>
  >({});
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState<
    Record<string, Exercise[]>
  >({});
  const [exerciseConfigs, setExerciseConfigs] = useState<
    Record<string, { sets: string; reps: string; weight: string }>
  >({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleDaysChange = (days: string[]) => {
    setSelectedDays(days);

    // Limpar exercícios dos dias removidos
    const removedDays = selectedDays.filter((day) => !days.includes(day));
    if (removedDays.length > 0) {
      setSelectedExercises((prev) => {
        const newExercises = { ...prev };
        removedDays.forEach((day) => {
          delete newExercises[day];
        });
        return newExercises;
      });

      setSelectedWorkoutExercises((prev) => {
        const newWorkoutExercises = { ...prev };
        removedDays.forEach((day) => {
          delete newWorkoutExercises[day];
        });
        return newWorkoutExercises;
      });
    }
  };

  const handleExercisesChange = (day: string, categories: string[]) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [day]: categories,
    }));
  };

  const handleWorkoutExercisesChange = (day: string, exercises: Exercise[]) => {
    setSelectedWorkoutExercises((prev) => ({
      ...prev,
      [day]: exercises,
    }));
  };

  const handleUpdateSets = (exerciseId: string, sets: string) => {
    setExerciseConfigs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], sets },
    }));
  };

  const handleUpdateReps = (exerciseId: string, reps: string) => {
    setExerciseConfigs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], reps },
    }));
  };

  const handleUpdateWeight = (exerciseId: string, weight: string) => {
    setExerciseConfigs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], weight },
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    // Remover exercício de todos os dias
    setSelectedWorkoutExercises((prev) => {
      const newExercises = { ...prev };
      Object.keys(newExercises).forEach((day) => {
        newExercises[day] = newExercises[day].filter(
          (exercise) => exercise.id !== exerciseId
        );
      });
      return newExercises;
    });

    // Remover configurações do exercício
    setExerciseConfigs((prev) => {
      const newConfigs = { ...prev };
      delete newConfigs[exerciseId];
      return newConfigs;
    });
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dados para API - Incluir configurações diretamente nos exercícios
      const apiData = {
        days: selectedDays,
        exercises: Object.keys(selectedWorkoutExercises).reduce((acc, day) => {
          acc[day] = selectedWorkoutExercises[day].map((exercise) => ({
            ...exercise,
            sets: exerciseConfigs[exercise.id]?.sets || "3",
            reps: exerciseConfigs[exercise.id]?.reps || "12",
            weight: exerciseConfigs[exercise.id]?.weight || "0",
          }));
          return acc;
        }, {} as Record<string, any[]>),
        muscleGroups: selectedExercises,
      };

      // TODO: Implementar lógica para criar o plano de treino
      navigation.goBack();
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedDays.length > 0;
      case 2:
        return selectedDays.every(
          (day) => selectedExercises[day] && selectedExercises[day].length > 0
        );
      case 3:
        return (
          Object.keys(selectedWorkoutExercises).length > 0 &&
          Object.values(selectedWorkoutExercises).some(
            (exercises) => exercises.length > 0
          )
        );
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1DaysSelection
            selectedDays={selectedDays}
            onDaysChange={handleDaysChange}
          />
        );
      case 2:
        return (
          <Step2ExerciseSelection
            selectedDays={selectedDays}
            selectedExercises={selectedExercises}
            selectedWorkoutExercises={selectedWorkoutExercises}
            exerciseConfigs={exerciseConfigs}
            onExercisesChange={handleExercisesChange}
            onWorkoutExercisesChange={handleWorkoutExercisesChange}
            onUpdateSets={handleUpdateSets}
            onUpdateReps={handleUpdateReps}
            onUpdateWeight={handleUpdateWeight}
            onRemoveExercise={handleRemoveExercise}
          />
        );
      case 3:
        return (
          <Step3WorkoutSummary
            selectedDays={selectedDays}
            selectedWorkoutExercises={selectedWorkoutExercises}
            selectedExercises={selectedExercises}
            exerciseConfigs={exerciseConfigs}
            onUpdateSets={handleUpdateSets}
            onUpdateReps={handleUpdateReps}
            onUpdateWeight={handleUpdateWeight}
            onRemoveExercise={handleRemoveExercise}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <ScrollView style={{ flex: 1 }}>
        <VStack flex={1} p="$6" space="lg">
          <SetupHeader />
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepPress={handleStepChange}
          />
          {renderCurrentStep()}
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
            onContinue={handleContinue}
            isContinueDisabled={!isStepValid()}
          />
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
