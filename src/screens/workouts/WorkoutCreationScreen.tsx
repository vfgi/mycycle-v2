import React, { useState, useEffect } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { VStack, Text } from "@gluestack-ui/themed";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeContainer } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useToast } from "../../hooks/useToast";
import { workoutsService } from "../../services/workoutsService";
import { Exercise } from "../../types/exercises";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { StepIndicator, NavigationButtons } from "../workoutSetup/components";
import {
  Step2ExerciseSelection,
  Step3WorkoutSummary,
} from "../workoutSetup/steps";
import { MUSCLE_GROUP_MAPPING } from "../workoutSetup/data/muscleGroups";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type WorkoutCreationRouteProp = RouteProp<
  RootStackParamList,
  "WorkoutCreation"
>;

export const WorkoutCreationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<WorkoutCreationRouteProp>();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();

  const editWorkout = route.params?.editWorkout;
  const isEditing = !!editWorkout;

  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, string[]>
  >({ workout: [] });
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState<
    Record<string, Exercise[]>
  >({ workout: [] });
  const [exerciseConfigs, setExerciseConfigs] = useState<
    Record<string, { sets: string; reps: string; weight: string }>
  >({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const totalSteps = 2;

  // Inicializar dados quando estiver editando
  useEffect(() => {
    if (editWorkout) {
      // Mapear exercícios para o formato Exercise
      const exercises: Exercise[] = editWorkout.exercises.map((ex, index) => ({
        id: `${ex.name}-${index}`,
        name: ex.name,
        category: ex.category || "Força",
        muscle_group: ex.muscle_group,
        difficulty: ex.difficulty || "Intermediário",
        equipment: ex.equipment || "",
        instructions: ex.instructions || "",
        imageURL: ex.videoURL || "",
        previewImage: ex.imageURL || "",
      }));

      setSelectedWorkoutExercises({ workout: exercises });

      // Configurar sets, reps, weight para cada exercício
      const configs: Record<
        string,
        { sets: string; reps: string; weight: string }
      > = {};

      editWorkout.exercises.forEach((ex, index) => {
        const exerciseId = `${ex.name}-${index}`;
        configs[exerciseId] = {
          sets: String(ex.sets),
          reps: String(ex.reps),
          weight: String(ex.weight),
        };
      });

      setExerciseConfigs(configs);

      // Extrair categorias únicas
      const categories = Array.from(
        new Set(exercises.map((ex) => ex.muscle_group))
      );
      setSelectedExercises({ workout: categories });
    }
  }, [editWorkout]);

  const handleNext = () => {
    if (currentStep === 0) {
      const exercises = selectedWorkoutExercises["workout"] || [];
      if (exercises.length === 0) {
        showError(t("workouts.selectAtLeastOneExercise"));
        return;
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateWorkout();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleExercisesChange = (day: string, categories: string[]) => {
    setSelectedExercises({ ...selectedExercises, [day]: categories });
  };

  const handleWorkoutExercisesChange = (day: string, exercises: Exercise[]) => {
    setSelectedWorkoutExercises({
      ...selectedWorkoutExercises,
      [day]: exercises,
    });
  };

  const handleUpdateSets = (exerciseId: string, sets: string) => {
    setExerciseConfigs({
      ...exerciseConfigs,
      [exerciseId]: { ...exerciseConfigs[exerciseId], sets },
    });
  };

  const handleUpdateReps = (exerciseId: string, reps: string) => {
    setExerciseConfigs({
      ...exerciseConfigs,
      [exerciseId]: { ...exerciseConfigs[exerciseId], reps },
    });
  };

  const handleUpdateWeight = (exerciseId: string, weight: string) => {
    setExerciseConfigs({
      ...exerciseConfigs,
      [exerciseId]: { ...exerciseConfigs[exerciseId], weight },
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    const updatedExercises = (selectedWorkoutExercises["workout"] || []).filter(
      (ex) => ex.id !== exerciseId
    );
    setSelectedWorkoutExercises({
      ...selectedWorkoutExercises,
      workout: updatedExercises,
    });
  };

  const generateWorkoutName = (day: string): string => {
    const dayExercises = selectedWorkoutExercises[day] || [];
    if (dayExercises.length === 0) return t("workouts.newWorkout");

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

  const handleCreateWorkout = async () => {
    try {
      setIsCreating(true);

      const exercises = (selectedWorkoutExercises["workout"] || []).map(
        (exercise, index) => {
          const config = exerciseConfigs[exercise.id] || {
            sets: "3",
            reps: "12",
            weight: "0",
          };

          return {
            name: exercise.name,
            category: exercise.category,
            muscle_group: exercise.muscle_group,
            difficulty: exercise.difficulty,
            equipment: exercise.equipment || "",
            sets: parseInt(config.sets) || 3,
            reps: parseInt(config.reps) || 12,
            weight: parseFloat(config.weight) || 0,
            order: index + 1,
            instructions: exercise.instructions || "",
            videoURL: exercise.imageURL || "",
            imageURL: exercise.previewImage || "",
          };
        }
      );

      const workoutName = generateWorkoutName("workout");

      const workoutData = {
        name: workoutName,
        description: `Treino com ${exercises.length} exercícios`,
        exercises,
      };

      if (isEditing && editWorkout) {
        await workoutsService.updateWorkout(editWorkout.id, workoutData as any);
        showSuccess(t("workouts.workoutUpdated"));
      } else {
        await workoutsService.createWorkout(workoutData as any);
        showSuccess(t("workouts.workoutCreated"));
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error creating workout:", error);
      showError(
        isEditing
          ? t("workouts.workoutUpdateError")
          : t("workouts.workoutCreationError")
      );
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            keyboardShouldPersistTaps="handled"
          >
            <Step2ExerciseSelection
              selectedDays={["workout"]}
              hideDaySelector
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
          </ScrollView>
        );

      case 1:
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            keyboardShouldPersistTaps="handled"
          >
            <Step3WorkoutSummary
              selectedDays={["workout"]}
              selectedExercises={selectedExercises}
              selectedWorkoutExercises={selectedWorkoutExercises}
              exerciseConfigs={exerciseConfigs}
              onUpdateSets={handleUpdateSets}
              onUpdateReps={handleUpdateReps}
              onUpdateWeight={handleUpdateWeight}
              onRemoveExercise={handleRemoveExercise}
              generateWorkoutName={generateWorkoutName}
            />
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeContainer paddingTop={0} paddingBottom={24} paddingHorizontal={16}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <VStack flex={1}>
          <VStack p="$6" space="md" alignItems="center">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$2xl"
              fontWeight="$bold"
              textAlign="center"
            >
              {isEditing
                ? t("workouts.editWorkout")
                : t("workouts.createWorkout")}
            </Text>
            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$md"
              textAlign="center"
              lineHeight="$md"
            >
              {t("workouts.createWorkoutSubtitle")}
            </Text>
          </VStack>

          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          <VStack flex={1}>{renderStep()}</VStack>

          <NavigationButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={handleBack}
            onContinue={handleNext}
            isContinueDisabled={false}
            isLoading={isCreating}
            isEditing={isEditing}
          />
        </VStack>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};
