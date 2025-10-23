import { apiService } from "./api";
import { ActiveWorkout, ExerciseProgress } from "./activeWorkoutStorage";

export interface ExerciseCompleted {
  exercise_id: string;
  name: string;
  muscle_group: string;
  sets_completed: number;
  total_sets: number;
  reps_completed: number[];
  weight_used: number[];
  rest_time_seconds: number[];
  execution_time_seconds: number;
  average_rest_time_seconds: number;
  notes?: string;
  status: "completed";
  completed_at: string;
}

export interface WorkoutHistoryData {
  exercises_completed: ExerciseCompleted[];
  total_duration_seconds: number;
  total_exercises: number;
  completed_exercises: number;
  progress_percentage: number;
  total_calories_burned?: number;
  difficulty_rating?: number;
  energy_level_before?: number;
  energy_level_after?: number;
  mood_before?: number;
  mood_after?: number;
  workout_name: string;
  started_at: string;
  completed_at: string;
}

export interface SaveWorkoutHistoryRequest {
  workoutId: string;
  recorded_at: string;
  timezone: string;
  historyData: WorkoutHistoryData;
}

class WorkoutHistoryService {
  async saveWorkoutHistory(
    workoutId: string,
    historyData: WorkoutHistoryData
  ): Promise<boolean> {
    try {
      const now = new Date();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Garantir que a data está no formato ISO 8601 correto
      const recordedAt = now.toISOString();

      // Validar se a data está no formato correto
      if (!recordedAt || recordedAt === "Invalid Date") {
        throw new Error("Invalid date format for recorded_at");
      }

      const payload: SaveWorkoutHistoryRequest = {
        workoutId,
        recorded_at: recordedAt,
        timezone,
        historyData,
      };

      const response = await apiService.post<{ success: boolean }>(
        "/workouts/history/save",
        payload
      );

      if (response.error) {
        console.error("Error saving workout history:", response.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in saveWorkoutHistory:", error);
      return false;
    }
  }

  transformActiveWorkoutToHistoryData(
    activeWorkout: ActiveWorkout
  ): WorkoutHistoryData {
    const completedAt = new Date().toISOString();

    // Filtrar apenas exercícios que foram realmente completados
    const completedProgress = activeWorkout.progress.filter(
      (progress) => progress.completed === true
    );

    const exercises_completed: ExerciseCompleted[] = completedProgress.map(
      (progress) => {
        // Encontrar o exercício correspondente pelo índice
        const exerciseIndex = activeWorkout.exercises.findIndex(
          (ex) =>
            `${ex.name}-${activeWorkout.exercises.indexOf(ex)}` ===
            progress.exerciseId
        );
        const exercise = activeWorkout.exercises[exerciseIndex];

        return {
          exercise_id: exercise?.id || progress.exerciseId, // Usar o ID real do exercício da API
          name: progress.exerciseName,
          muscle_group: exercise?.muscle_group || "Não especificado",
          sets_completed: progress.completedSets,
          total_sets: progress.totalSets,
          reps_completed: Array(progress.completedSets).fill(
            exercise?.reps || 0
          ),
          weight_used: Array(progress.completedSets).fill(
            exercise?.weight || 0
          ),
          rest_time_seconds: progress.restTimes,
          execution_time_seconds: progress.totalExecutionTime,
          average_rest_time_seconds: progress.averageRestTime,
          notes: "",
          status: "completed" as const,
          completed_at: progress.completedAt || completedAt,
        };
      }
    );

    const startTime = new Date(activeWorkout.startTime);

    // Calcular o tempo total do treino baseado no último exercício completado
    let endTime: Date;
    if (exercises_completed.length > 0) {
      // Usar o completedAt do último exercício completado
      const lastCompletedExercise =
        exercises_completed[exercises_completed.length - 1];
      endTime = new Date(lastCompletedExercise.completed_at);
    } else {
      // Se nenhum exercício foi completado, usar o momento atual
      endTime = new Date(completedAt);
    }

    const totalDurationSeconds = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    );

    const progressPercentage =
      activeWorkout.totalExercises > 0
        ? Math.round(
            (activeWorkout.completedExercises / activeWorkout.totalExercises) *
              100
          )
        : 0;

    return {
      exercises_completed,
      total_duration_seconds: totalDurationSeconds,
      total_exercises: activeWorkout.totalExercises,
      completed_exercises: activeWorkout.completedExercises,
      progress_percentage: progressPercentage,
      total_calories_burned: Math.round(totalDurationSeconds * 0.1), // Estimativa simples
      difficulty_rating: 7, // Valor padrão
      energy_level_before: 8, // Valor padrão
      energy_level_after: 6, // Valor padrão
      mood_before: 8, // Valor padrão
      mood_after: 9, // Valor padrão
      workout_name: activeWorkout.workoutName,
      started_at: activeWorkout.startTime,
      completed_at: completedAt,
    };
  }
}

export const workoutHistoryService = new WorkoutHistoryService();
