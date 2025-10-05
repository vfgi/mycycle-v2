import React, { useState } from "react";
import { ScrollView } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { SafeContainer } from "../../components";
import { StepIndicator, SetupHeader, ContinueButton } from "./components";
import { Step1DaysSelection, Step2ExerciseSelection } from "./steps";
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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleDaysChange = (days: string[]) => {
    setSelectedDays(days);
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

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const data: WorkoutSetupData = {
        daysPerWeek: selectedDays.length,
        selectedDays: selectedDays,
      };
      console.log("Workout setup completed:", data);
      console.log("Selected exercises:", selectedExercises);
      console.log("Selected workout exercises:", selectedWorkoutExercises);
      // TODO: Implementar lógica para criar o plano de treino
      navigation.goBack();
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
            onExercisesChange={handleExercisesChange}
            onWorkoutExercisesChange={handleWorkoutExercisesChange}
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
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          {renderCurrentStep()}
          <ContinueButton
            onPress={handleContinue}
            isDisabled={!isStepValid()}
          />
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
