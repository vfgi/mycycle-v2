import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout, TrainingExercise } from "../types/training";

const ACTIVE_WORKOUT_KEY = "@mycycle:activeWorkout";

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  completed: boolean;
  completedSets: number;
  totalSets: number;
  totalExecutionTime: number;
  restTimes: number[];
  averageRestTime: number;
  completedAt?: string;
}

export interface ActiveWorkout {
  workoutId?: string;
  workoutName: string;
  startTime: string;
  startedAt?: string;
  finishedAt?: string;
  exercises: TrainingExercise[];
  progress: ExerciseProgress[];
  totalExercises: number;
  completedExercises: number;
}

class ActiveWorkoutStorage {
  async getActiveWorkout(): Promise<ActiveWorkout | null> {
    try {
      const data = await AsyncStorage.getItem(ACTIVE_WORKOUT_KEY);
      if (!data) return null;

      const workout: ActiveWorkout = JSON.parse(data);

      // Migração: adicionar campos novos se não existirem
      let needsUpdate = false;
      workout.progress = workout.progress.map((progress) => {
        if (
          progress.totalExecutionTime === undefined ||
          progress.restTimes === undefined ||
          progress.averageRestTime === undefined
        ) {
          needsUpdate = true;
          return {
            ...progress,
            totalExecutionTime: progress.totalExecutionTime ?? 0,
            restTimes: progress.restTimes ?? [],
            averageRestTime: progress.averageRestTime ?? 0,
          };
        }
        return progress;
      });

      // Recalcular completedExercises baseado no estado real do progress
      const actualCompletedCount = workout.progress.filter(
        (p) => p.completed
      ).length;
      if (workout.completedExercises !== actualCompletedCount) {
        workout.completedExercises = actualCompletedCount;
        needsUpdate = true;
      }

      // Salvar de volta se houve mudanças
      if (needsUpdate) {
        await AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(workout));
      }

      return workout;
    } catch (error) {
      console.error("Error getting active workout:", error);
      return null;
    }
  }

  async createActiveWorkout(workout: Workout): Promise<ActiveWorkout> {
    try {
      const activeWorkout: ActiveWorkout = {
        workoutId: (workout as any).id,
        workoutName: workout.name,
        startTime: new Date().toISOString(),
        exercises: workout.exercises,
        progress: workout.exercises.map((exercise, index) => ({
          exerciseId: `${exercise.name}-${index}`,
          exerciseName: exercise.name,
          completed: false,
          completedSets: 0,
          totalSets: exercise.sets,
          totalExecutionTime: 0,
          restTimes: [],
          averageRestTime: 0,
        })),
        totalExercises: workout.exercises.length,
        completedExercises: 0,
      };

      await AsyncStorage.setItem(
        ACTIVE_WORKOUT_KEY,
        JSON.stringify(activeWorkout)
      );
      return activeWorkout;
    } catch (error) {
      console.error("Error creating active workout:", error);
      throw error;
    }
  }

  async updateExerciseProgress(
    exerciseId: string,
    updates: Partial<ExerciseProgress>
  ): Promise<ActiveWorkout | null> {
    try {
      const activeWorkout = await this.getActiveWorkout();
      if (!activeWorkout) return null;

      const exerciseIndex = activeWorkout.progress.findIndex(
        (p) => p.exerciseId === exerciseId
      );

      if (exerciseIndex === -1) return null;

      // Verificar se já estava completo ANTES da atualização
      const wasCompleted = activeWorkout.progress[exerciseIndex].completed;

      activeWorkout.progress[exerciseIndex] = {
        ...activeWorkout.progress[exerciseIndex],
        ...updates,
      };

      // Se o exercício foi marcado como completo agora (não estava antes), incrementar contador
      if (updates.completed && !wasCompleted) {
        activeWorkout.completedExercises += 1;
        activeWorkout.progress[exerciseIndex].completedAt =
          new Date().toISOString();
      }

      await AsyncStorage.setItem(
        ACTIVE_WORKOUT_KEY,
        JSON.stringify(activeWorkout)
      );
      return activeWorkout;
    } catch (error) {
      console.error("Error updating exercise progress:", error);
      return null;
    }
  }

  async completeExercise(exerciseId: string): Promise<ActiveWorkout | null> {
    const result = await this.updateExerciseProgress(exerciseId, {
      completed: true,
    });
    return result;
  }

  async updateCompletedSets(
    exerciseId: string,
    completedSets: number
  ): Promise<ActiveWorkout | null> {
    return this.updateExerciseProgress(exerciseId, { completedSets });
  }

  async updateExerciseStats(
    exerciseId: string,
    totalExecutionTime: number,
    restTimes: number[]
  ): Promise<ActiveWorkout | null> {
    try {
      const activeWorkout = await this.getActiveWorkout();
      if (!activeWorkout) return null;

      const exerciseIndex = activeWorkout.progress.findIndex(
        (p) => p.exerciseId === exerciseId
      );

      if (exerciseIndex === -1) {
        return null;
      }

      const averageRestTime =
        restTimes.length > 0
          ? restTimes.reduce((sum, time) => sum + time, 0) / restTimes.length
          : 0;

      activeWorkout.progress[exerciseIndex] = {
        ...activeWorkout.progress[exerciseIndex],
        totalExecutionTime,
        restTimes,
        averageRestTime,
      };

      await AsyncStorage.setItem(
        ACTIVE_WORKOUT_KEY,
        JSON.stringify(activeWorkout)
      );
      return activeWorkout;
    } catch (error) {
      console.error("Error updating exercise stats:", error);
      return null;
    }
  }

  async startActiveWorkout(): Promise<ActiveWorkout | null> {
    try {
      const activeWorkout = await this.getActiveWorkout();
      if (!activeWorkout) return null;

      activeWorkout.startedAt = new Date().toISOString();

      await AsyncStorage.setItem(
        ACTIVE_WORKOUT_KEY,
        JSON.stringify(activeWorkout)
      );

      return activeWorkout;
    } catch (error) {
      console.error("Error starting active workout:", error);
      return null;
    }
  }

  async finishActiveWorkout(): Promise<ActiveWorkout | null> {
    try {
      const activeWorkout = await this.getActiveWorkout();
      if (!activeWorkout) return null;

      activeWorkout.finishedAt = new Date().toISOString();

      await AsyncStorage.setItem(
        ACTIVE_WORKOUT_KEY,
        JSON.stringify(activeWorkout)
      );

      return activeWorkout;
    } catch (error) {
      console.error("Error finishing active workout:", error);
      return null;
    }
  }

  async deleteActiveWorkout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ACTIVE_WORKOUT_KEY);
    } catch (error) {
      console.error("Error deleting active workout:", error);
      throw error;
    }
  }

  async hasActiveWorkout(): Promise<boolean> {
    try {
      const activeWorkout = await this.getActiveWorkout();
      return activeWorkout !== null;
    } catch (error) {
      console.error("Error checking active workout:", error);
      return false;
    }
  }

  async getElapsedTime(): Promise<number> {
    try {
      const activeWorkout = await this.getActiveWorkout();
      if (!activeWorkout) return 0;

      const startTime = new Date(activeWorkout.startTime).getTime();
      const currentTime = new Date().getTime();
      const elapsedMilliseconds = currentTime - startTime;

      return Math.floor(elapsedMilliseconds / 1000);
    } catch (error) {
      console.error("Error calculating elapsed time:", error);
      return 0;
    }
  }
}

export const activeWorkoutStorage = new ActiveWorkoutStorage();
