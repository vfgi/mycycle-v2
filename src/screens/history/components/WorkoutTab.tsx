import React, { useState, useEffect } from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useAuth } from "../../../contexts/AuthContext";
import {
  ExpandableCalendarComponent,
  WorkoutGoalCard,
} from "../../../components";
import { WorkoutExercisesList } from "./workout";
import {
  workoutsService,
  WorkoutHistoryEntry,
} from "../../../services/workoutsService";
import { formatDuration } from "../../../utils";

export const WorkoutTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Usar data local ao invés de UTC
  const today = new Date();
  const todayLocal = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [datesWithWorkouts, setDatesWithWorkouts] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (user?.id) {
      loadWorkoutHistory();
    }
  }, [selectedDate, user?.id]);

  const loadWorkoutHistory = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const history = await workoutsService.getWorkoutHistoryByDay(
        user.id,
        selectedDate
      );
      setWorkoutHistory(history);

      // Adicionar data ao conjunto de datas com treinos
      if (history.length > 0) {
        setDatesWithWorkouts((prev) => new Set(prev).add(selectedDate));
      }
    } catch (error) {
      console.error("Error loading workout history:", error);
      setWorkoutHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const getMarkedDates = () => {
    const marked: any = {};
    datesWithWorkouts.forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: FIXED_COLORS.primary[500],
      };
    });
    return marked;
  };

  // Calcular estatísticas do dia - usar dados do workout_data
  const completedExercises = workoutHistory.reduce(
    (sum, entry) => sum + entry.workout_data.completed_exercises,
    0
  );
  const totalExercisesGoal = workoutHistory.reduce(
    (sum, entry) => sum + entry.workout_data.total_exercises,
    0
  );
  const totalDuration = workoutHistory.reduce(
    (sum, entry) => sum + (entry.workout_data.total_duration_seconds || 0),
    0
  );
  const progressPercentage =
    workoutHistory.length > 0
      ? Math.round(
          workoutHistory.reduce(
            (sum, entry) => sum + entry.workout_data.progress_percentage,
            0
          ) / workoutHistory.length
        )
      : 0;

  // Converter histórico para formato compatível com WorkoutExercisesList
  const selectedExercises = workoutHistory.flatMap((entry) =>
    entry.workout_data.exercises_completed.map((exercise, index) => ({
      id: `${entry.id}-${index}`,
      name: exercise.name,
      muscle: exercise.muscle_group,
      sets: exercise.sets_completed,
      reps: exercise.reps_completed[0] || 0,
      weight: exercise.weight_used[0] || 0,
      duration: exercise.execution_time_seconds,
      restTime: exercise.average_rest_time_seconds,
      completed: exercise.status === "completed",
      time: new Date(exercise.completed_at).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }))
  );

  return (
    <VStack flex={1}>
      <ExpandableCalendarComponent
        selectedDate={selectedDate}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 16, paddingHorizontal: 16 }}
        >
          {isLoading ? (
            <Box
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              p="$4"
              borderWidth={1}
              borderColor={FIXED_COLORS.background[700]}
            >
              <VStack alignItems="center" space="sm">
                <Ionicons
                  name="refresh-outline"
                  size={32}
                  color={FIXED_COLORS.primary[500]}
                />
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  textAlign="center"
                >
                  {t("common.loading")}
                </Text>
              </VStack>
            </Box>
          ) : selectedExercises.length > 0 ? (
            <VStack space="md">
              {/* Card de meta de exercícios */}
              <WorkoutGoalCard
                title={t("history.workout.title")}
                currentExercises={completedExercises}
                goalExercises={totalExercisesGoal}
                currentDuration={formatDuration(totalDuration)}
                goalDuration={45}
                colors={[
                  FIXED_COLORS.primary[700],
                  FIXED_COLORS.secondary[400],
                ]}
                icon={
                  <Ionicons
                    name="barbell-outline"
                    size={20}
                    color={FIXED_COLORS.primary[500]}
                  />
                }
              />

              {/* Lista de exercícios executados */}
              <WorkoutExercisesList exercises={selectedExercises} />
            </VStack>
          ) : (
            <Box
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              p="$4"
              borderWidth={1}
              borderColor={FIXED_COLORS.background[700]}
              borderStyle="dashed"
            >
              <VStack alignItems="center" space="sm">
                <Ionicons
                  name="calendar-outline"
                  size={32}
                  color={FIXED_COLORS.text[400]}
                />
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  textAlign="center"
                >
                  {t("history.workout.noDataForDate")}
                </Text>
              </VStack>
            </Box>
          )}
        </ScrollView>
      </ExpandableCalendarComponent>
    </VStack>
  );
};
