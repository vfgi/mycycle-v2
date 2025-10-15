import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { SafeContainer } from "../../components";
import { StepIndicator, SetupHeader, NavigationButtons } from "./components";
import {
  Step0PlanInfo,
  Step1DaysSelection,
  Step2ExerciseSelection,
  Step3WorkoutSummary,
} from "./steps";
import { Exercise } from "../../types/exercises";
import { trainingService } from "../../services/trainingService";
import {
  CreateTrainingPlanRequest,
  TrainingExercise,
} from "../../types/training";
import { useTranslation } from "../../hooks/useTranslation";
import { useToast } from "../../hooks/useToast";
import { MUSCLE_GROUP_MAPPING } from "./data/muscleGroups";

interface WorkoutSetupData {
  daysPerWeek: number;
  selectedDays: string[];
}

export const WorkoutSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();

  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const totalSteps = 4; // Steps: 0=Plano, 1=Dias, 2=Exercícios, 3=Resumo

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

  // Função para gerar nome do treino baseado nos grupos musculares dos exercícios selecionados
  const generateWorkoutName = (day: string): string => {
    const dayExercises = selectedWorkoutExercises[day] || [];
    if (dayExercises.length === 0) return `Treino ${day}`;

    // Extrair grupos musculares únicos dos exercícios selecionados
    const uniqueMuscleGroups = Array.from(
      new Set(dayExercises.map((exercise) => exercise.muscle_group))
    );

    // Mapear para nomes em português
    const muscleGroupNames = uniqueMuscleGroups.map((group) => {
      // Mapear os nomes que vêm da API para o formato do MUSCLE_GROUP_MAPPING
      const mappingKey = group
        .toLowerCase()
        .replace("peitoral", "chest")
        .replace("costas", "back")
        .replace("ombros", "shoulders")
        .replace("bíceps", "biceps")
        .replace("triceps", "triceps")
        .replace("pernas", "legs")
        .replace("glúteos", "glutes")
        .replace("gluteos", "glutes")
        .replace("panturrilhas", "calves")
        .replace("antebraços", "forearms")
        .replace("antebracos", "forearms")
        .replace("trapézio", "traps")
        .replace("trapezio", "traps");

      return MUSCLE_GROUP_MAPPING[mappingKey] || group;
    });

    return muscleGroupNames.join(" - ");
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

  const handleContinue = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await createTrainingPlan();
    }
  };

  // Mapear categorias para os valores aceitos pela API
  const mapCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      Forca: "Força",
      Força: "Força",
      Hipertrofia: "Hipertrofia",
      Resistencia: "Resistência",
      Resistência: "Resistência",
      Cardio: "Cardio",
      Flexibilidade: "Flexibilidade",
      Core: "Core",
      Funcional: "Funcional",
    };
    return categoryMap[category] || "Força"; // Default para Força
  };

  // Mapear dificuldades para os valores aceitos pela API
  const mapDifficulty = (difficulty: string): string => {
    const difficultyMap: Record<string, string> = {
      Iniciante: "Iniciante",
      Intermediario: "Intermediário",
      Intermediário: "Intermediário",
      Avancado: "Avançado",
      Avançado: "Avançado",
    };
    return difficultyMap[difficulty] || "Intermediário"; // Default para Intermediário
  };

  const createTrainingPlan = async () => {
    try {
      setIsCreating(true);

      const workouts = selectedDays.map((dayKey) => {
        const exercises: TrainingExercise[] =
          selectedWorkoutExercises[dayKey]?.map((exercise, index) => {
            const mappedCategory = mapCategory(exercise.category);
            const mappedDifficulty = mapDifficulty(exercise.difficulty);

            return {
              name: exercise.name,
              category: mappedCategory,
              muscle_group: exercise.muscle_group,
              difficulty: mappedDifficulty,
              equipment: exercise.equipment,
              sets: parseInt(exerciseConfigs[exercise.id]?.sets || "3"),
              reps: parseInt(exerciseConfigs[exercise.id]?.reps || "12"),
              weight: parseFloat(exerciseConfigs[exercise.id]?.weight || "0"),
              order: index + 1,
              instructions: exercise.instructions,
              videoURL: exercise.imageURL,
              imageURL: exercise.previewImage,
            };
          }) || [];

        const workoutName = generateWorkoutName(dayKey);

        return {
          name: workoutName,
          description: "",
          weekDays: [dayKey],
          exercises,
        };
      });

      const trainingPlanData: CreateTrainingPlanRequest = {
        name: planName,
        description: planDescription,
        is_active: true,
        workouts,
      };

      await trainingService.createTrainingPlan(trainingPlanData);

      showSuccess(t("workoutSetup.planCreated"));

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao criar plano de treino:", error);
      showError(t("workoutSetup.planCreationError"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return planName.trim().length > 0;
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
      case 0:
        return (
          <Step0PlanInfo
            planName={planName}
            planDescription={planDescription}
            onPlanNameChange={setPlanName}
            onPlanDescriptionChange={setPlanDescription}
          />
        );
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
            generateWorkoutName={generateWorkoutName}
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
            isContinueDisabled={!isStepValid() || isCreating}
            isLoading={isCreating}
          />
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
