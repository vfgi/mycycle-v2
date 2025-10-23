import React, { useState, useCallback } from "react";
import { VStack, Text, Spinner } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import {
  workoutsService,
  WorkoutSession,
} from "../../services/workoutsService";
import { useToast } from "../../hooks/useToast";
import { RootStackParamList } from "../../navigation/AppNavigator";
import {
  WorkoutHeader,
  WorkoutsList,
  DeleteWorkoutModal,
} from "./components/workouts";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const AllWorkoutsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showError, showSuccess } = useToast();
  const navigation = useNavigation<NavigationProp>();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<WorkoutSession | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const workoutsData = await workoutsService.getWorkouts();
      setWorkouts(workoutsData || []);
    } catch (error) {
      console.error("Error loading workouts:", error);
      showError(t("workouts.loadWorkoutsError"));
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExercisePlay = (exercise: any) => {};

  const handleCreateWorkout = () => {
    navigation.navigate("WorkoutCreation");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const { language } = useTranslation();

    const localeMap: { [key: string]: string } = {
      ptBR: "pt-BR",
      ptPT: "pt-PT",
      en: "en-US",
      es: "es-ES",
    };

    const locale = localeMap[language] || "pt-BR";

    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isWorkoutCompleted = (workout: WorkoutSession) => {
    // Verificar se foi executado hoje usando lastTimeExecuted
    if (workout.lastTimeExecuted) {
      const lastExecuted = new Date(workout.lastTimeExecuted);
      const today = new Date();
      const isToday = lastExecuted.toDateString() === today.toDateString();
      return isToday;
    }

    // Fallback para o histórico antigo
    return workout.history && workout.history.length > 0;
  };

  const getLastWorkoutDate = (workout: WorkoutSession) => {
    // Priorizar lastTimeExecuted se disponível
    if (workout.lastTimeExecuted) {
      return formatDate(workout.lastTimeExecuted);
    }

    // Fallback para o histórico antigo
    if (!workout.history || workout.history.length === 0) {
      return t("workouts.neverExecuted");
    }
    const lastDate = workout.history[workout.history.length - 1];
    return formatDate(lastDate);
  };

  const handleEditWorkout = (workout: WorkoutSession) => {
    navigation.navigate("WorkoutCreation", { editWorkout: workout });
  };

  const handleDeleteWorkout = (workout: WorkoutSession) => {
    setWorkoutToDelete(workout);
    setDeleteModalOpen(true);
  };

  const confirmDeleteWorkout = async () => {
    if (!workoutToDelete) return;

    try {
      setIsDeleting(true);

      await workoutsService.deleteWorkout(workoutToDelete.id);

      await loadWorkouts();

      showSuccess(t("workouts.workoutDeletedSuccess"));
      setDeleteModalOpen(false);
      setWorkoutToDelete(null);
    } catch (error) {
      console.error("Error deleting workout:", error);
      showError(t("workouts.deleteWorkoutError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setWorkoutToDelete(null);
  };

  if (isLoading) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <VStack flex={1}>
          <WorkoutHeader
            title={t("workouts.workoutsList")}
            description={t("workouts.workoutsDescription")}
            onCreateWorkout={handleCreateWorkout}
          />

          <VStack flex={1} justifyContent="center" alignItems="center" p="$6">
            <Spinner size="large" color={FIXED_COLORS.primary[400]} />
            <Text color={FIXED_COLORS.text[400]} fontSize="$md" mt="$4">
              {t("common.loading")}
            </Text>
          </VStack>
        </VStack>
      </SafeContainer>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <VStack flex={1}>
          <WorkoutHeader
            title={t("workouts.workoutsList")}
            description={t("workouts.workoutsDescription")}
            onCreateWorkout={handleCreateWorkout}
          />

          <VStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            px="$4"
            pt="$8"
            space="md"
          >
            <Ionicons
              name="barbell-outline"
              size={64}
              color={FIXED_COLORS.text[400]}
            />
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$lg"
              fontWeight="$semibold"
              textAlign="center"
            >
              {t("workouts.noWorkouts")}
            </Text>
            <Text
              color={FIXED_COLORS.text[500]}
              fontSize="$sm"
              textAlign="center"
              px="$4"
            >
              {t("workouts.noWorkoutsDescription")}
            </Text>
          </VStack>
        </VStack>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <VStack flex={1}>
        <WorkoutHeader
          title={t("workouts.workoutsList")}
          description={t("workouts.workoutsDescription")}
          onCreateWorkout={handleCreateWorkout}
        />

        <WorkoutsList
          workouts={workouts}
          getLastWorkoutDate={getLastWorkoutDate}
          isWorkoutCompleted={isWorkoutCompleted}
          onEditWorkout={handleEditWorkout}
          onDeleteWorkout={handleDeleteWorkout}
          onPlayExercise={handleExercisePlay}
        />

        <DeleteWorkoutModal
          isOpen={deleteModalOpen}
          workoutName={workoutToDelete?.name || ""}
          isDeleting={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteWorkout}
        />
      </VStack>
    </SafeContainer>
  );
};
