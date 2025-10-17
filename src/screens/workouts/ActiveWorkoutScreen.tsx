import React, { useState, useEffect } from "react";
import { VStack, Box, Text, Pressable } from "@gluestack-ui/themed";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer, AdBanner } from "../../components";
import { FinishWorkoutModal } from "../../components/FinishWorkoutModal";
import {
  ExerciseVideoModal,
  ActiveWorkoutProgressCard,
  ActiveExercisesList,
  ActiveExerciseDrawer,
} from "./components";
import { useAuth } from "../../contexts/AuthContext";
import {
  activeWorkoutStorage,
  ActiveWorkout,
} from "../../services/activeWorkoutStorage";
import { TrainingExercise } from "../../types/training";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { workoutHistoryService } from "../../services/workoutHistoryService";
import { useToast } from "../../hooks/useToast";

export const ActiveWorkoutScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();
  const isPremium = user?.is_premium || false;

  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<
    number | null
  >(null);
  const [exerciseWeights, setExerciseWeights] = useState<{
    [key: number]: string;
  }>({});
  const [selectedExercise, setSelectedExercise] =
    useState<TrainingExercise | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(
    null
  );
  const [showExerciseDrawer, setShowExerciseDrawer] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadActiveWorkout();
    }, [])
  );

  useEffect(() => {
    if (!activeWorkout) return;

    // Se o treino já está finalizado ou não foi iniciado, não atualiza o timer
    if (activeWorkout.finishedAt || !activeWorkout.startedAt) {
      return;
    }

    const timer = setInterval(() => {
      updateElapsedTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [activeWorkout]);

  const loadActiveWorkout = async () => {
    try {
      setIsLoading(true);
      const workout = await activeWorkoutStorage.getActiveWorkout();
      if (!workout) {
        navigation.goBack();
        return;
      }

      setActiveWorkout(workout);

      // Inicializar pesos dos exercícios
      const weights: { [key: number]: string } = {};
      workout.exercises.forEach((exercise, index) => {
        weights[index] = exercise.weight?.toString() || "0";
      });
      setExerciseWeights(weights);

      await updateElapsedTime();
    } catch (error) {
      console.error("Error loading active workout:", error);
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditWeight = (index: number) => {
    setEditingExerciseIndex(index);
  };

  const handleSaveWeight = async (index: number) => {
    const newWeight = parseFloat(exerciseWeights[index] || "0");
    if (activeWorkout) {
      const updatedExercises = [...activeWorkout.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        weight: newWeight,
      };

      const updatedWorkout = {
        ...activeWorkout,
        exercises: updatedExercises,
      };

      setActiveWorkout(updatedWorkout);
      // TODO: Salvar no AsyncStorage se necessário
    }
    setEditingExerciseIndex(null);
  };

  const handleWeightChange = (index: number, value: string): void => {
    setExerciseWeights((prev) => ({ ...prev, [index]: value }));
  };

  const handleOpenVideoModal = (exercise: TrainingExercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedExercise(null);
  };

  const handleStartExercise = (index: number) => {
    setActiveExerciseIndex(index);
    setCurrentSet(1);
    setShowExerciseDrawer(true);
  };

  const handleCloseExerciseDrawer = async () => {
    setShowExerciseDrawer(false);
    setActiveExerciseIndex(null);
    setCurrentSet(1);

    await loadActiveWorkout();
  };

  const handleSetComplete = () => {
    if (activeExerciseIndex === null || !activeWorkout) return;

    const exercise = activeWorkout.exercises[activeExerciseIndex];

    setCurrentSet((prev) => prev + 1);
  };

  const updateElapsedTime = async () => {
    const elapsed = await activeWorkoutStorage.getElapsedTime();
    setElapsedTime(elapsed);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (): number => {
    if (!activeWorkout || activeWorkout.totalExercises === 0) return 0;
    return (
      (activeWorkout.completedExercises / activeWorkout.totalExercises) * 100
    );
  };

  const handleStartWorkout = async () => {
    try {
      const startedWorkout = await activeWorkoutStorage.startActiveWorkout();

      if (!startedWorkout) {
        return;
      }

      // Atualizar o estado local
      setActiveWorkout(startedWorkout);
    } catch (error) {
      console.error("❌ Erro ao iniciar treino:", error);
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      // Marcar o treino como finalizado
      const finishedWorkout = await activeWorkoutStorage.finishActiveWorkout();

      if (!finishedWorkout) {
        return;
      }

      // Atualizar o estado local
      setActiveWorkout(finishedWorkout);
    } catch (error) {
      console.error("Error finishing workout:", error);
    }
  };

  const handleFinishWorkout = () => {
    setShowFinishModal(true);
  };

  const handleConfirmFinishWorkout = async () => {
    if (!activeWorkout?.workoutId) {
      showError(t("workout.finish.error"));
      return;
    }

    try {
      setIsSavingWorkout(true);

      // Transformar dados do treino ativo para o formato da API
      const historyData =
        workoutHistoryService.transformActiveWorkoutToHistoryData(
          activeWorkout
        );

      // Console.log dos dados que serão enviados para a API
      console.log("=== DADOS ENVIADOS PARA A API ===");
      console.log("workoutId:", activeWorkout.workoutId);
      console.log("historyData:", JSON.stringify(historyData, null, 2));
      console.log("=================================");

      // Salvar no histórico
      const success = await workoutHistoryService.saveWorkoutHistory(
        activeWorkout.workoutId,
        historyData
      );

      if (success) {
        // Limpar dados temporários da storage
        await activeWorkoutStorage.deleteActiveWorkout();

        showSuccess(t("workout.finish.success"));
        setShowFinishModal(false);
        navigation.goBack();
      } else {
        showError(t("workout.finish.saveError"));
      }
    } catch (error) {
      console.error("Error saving workout history:", error);
      showError(t("workout.finish.saveError"));
    } finally {
      setIsSavingWorkout(false);
    }
  };

  const handleCancelFinishWorkout = () => {
    setShowFinishModal(false);
  };

  const handleClearWorkoutData = async () => {
    Alert.alert(t("workout.dev.clearData"), t("workout.dev.clearDataMessage"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("workout.dev.clear"),
        style: "destructive",
        onPress: async () => {
          try {
            await activeWorkoutStorage.deleteActiveWorkout();
            showSuccess(t("workout.dev.clearSuccess"));
            navigation.goBack();
          } catch (error) {
            console.error("Error clearing workout data:", error);
            showError(t("workout.dev.clearError"));
          }
        },
      },
    ]);
  };

  if (isLoading || !activeWorkout) {
    return (
      <SafeContainer>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Text color={FIXED_COLORS.text[400]}>{t("common.loading")}</Text>
        </VStack>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer paddingTop={12} paddingHorizontal={0}>
      <VStack flex={1}>
        {/* Ad Banner */}
        {!isPremium && (
          <Box px="$4" mb="$4">
            <AdBanner size="BANNER" maxHeight={60} isPremium={false} />
          </Box>
        )}

        {/* Progress Card */}
        <Box px="$4" mb="$4">
          <ActiveWorkoutProgressCard
            workoutName={activeWorkout.workoutName}
            completedExercises={activeWorkout.completedExercises}
            totalExercises={activeWorkout.totalExercises}
            elapsedTime={elapsedTime}
            progressPercentage={getProgressPercentage()}
            startedAt={activeWorkout.startedAt}
            finishedAt={activeWorkout.finishedAt}
            onStartWorkout={handleStartWorkout}
            onCompleteWorkout={handleFinishWorkout}
          />
        </Box>

        {/* DEV: Clear Workout Data Button */}
        <Box px="$4" mb="$4">
          <Pressable
            onPress={handleClearWorkoutData}
            bg={FIXED_COLORS.error[500]}
            px="$4"
            py="$3"
            borderRadius="$lg"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="$2"
          >
            <Ionicons name="trash" size={18} color={FIXED_COLORS.text[50]} />
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$bold"
            >
              {t("workout.dev.clearButton")}
            </Text>
          </Pressable>
        </Box>

        {/* Exercises List */}
        <ActiveExercisesList
          exercises={activeWorkout.exercises}
          progress={activeWorkout.progress}
          editingExerciseIndex={editingExerciseIndex}
          exerciseWeights={exerciseWeights}
          onOpenVideo={handleOpenVideoModal}
          onStartExercise={handleStartExercise}
          onEditWeight={handleEditWeight}
          onSaveWeight={handleSaveWeight}
          onWeightChange={handleWeightChange}
        />
      </VStack>

      {/* Video Modal */}
      <ExerciseVideoModal
        exercise={selectedExercise}
        isOpen={showVideoModal}
        onClose={handleCloseVideoModal}
      />

      {/* Active Exercise Drawer */}
      <ActiveExerciseDrawer
        isOpen={showExerciseDrawer}
        onClose={handleCloseExerciseDrawer}
        exercise={
          activeExerciseIndex !== null
            ? activeWorkout.exercises[activeExerciseIndex]
            : null
        }
        exerciseIndex={activeExerciseIndex ?? 0}
        currentSet={currentSet}
        onSetComplete={handleSetComplete}
      />

      {/* Finish Workout Modal */}
      <FinishWorkoutModal
        isOpen={showFinishModal}
        onClose={handleCancelFinishWorkout}
        onConfirm={handleConfirmFinishWorkout}
        isLoading={isSavingWorkout}
        workoutName={activeWorkout.workoutName}
        completedExercises={activeWorkout.completedExercises}
        totalExercises={activeWorkout.totalExercises}
      />
    </SafeContainer>
  );
};
