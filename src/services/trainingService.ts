import { apiService } from "./api";
import {
  TrainingPlan,
  TrainingPlanResponse,
  CreateTrainingPlanRequest,
  TrainingPlansWithCounters,
} from "../types/training";
import { dailyDataStorage, DailyExerciseData } from "./dailyDataStorage";

export class TrainingService {
  async createTrainingPlan(
    trainingPlan: CreateTrainingPlanRequest
  ): Promise<TrainingPlanResponse> {
    const response = await apiService.post<TrainingPlanResponse>(
      "/training-plans",
      trainingPlan
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }
    return response.data;
  }

  async getTrainingPlans(
    isActive?: boolean
  ): Promise<TrainingPlansWithCounters> {
    const queryParam = isActive !== undefined ? `?is_active=${isActive}` : "";
    const response = await apiService.get<TrainingPlansWithCounters>(
      `/training-plans${queryParam}`
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    // Salvar dados de exercícios no storage para a tela home
    await this.updateDailyExerciseData(response.data);

    return response.data;
  }

  async getTrainingPlan(id: string): Promise<TrainingPlanResponse> {
    const response = await apiService.get<TrainingPlanResponse>(
      `/training-plans/${id}`
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateTrainingPlan(
    id: string,
    trainingPlan: Partial<CreateTrainingPlanRequest>
  ): Promise<TrainingPlanResponse> {
    const response = await apiService.put<TrainingPlanResponse>(
      `/training-plans/${id}`,
      trainingPlan
    );

    if (response.error) {
      console.error("Error updating training plan:", response.error);
      throw new Error(response.error);
    }

    if (!response.data) {
      console.error("No data in response");
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async deleteTrainingPlan(id: string): Promise<void> {
    const response = await apiService.delete<void>(`/training-plans/${id}`);

    if (response.error) {
      console.error("Error deleting training plan:", response.error);
      throw new Error(response.error);
    }
  }

  async activateTrainingPlan(id: string): Promise<TrainingPlanResponse> {
    const response = await apiService.put<TrainingPlanResponse>(
      `/training-plans/${id}`,
      { is_active: true }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateTrainingPlanStatus(
    id: string,
    isActive: boolean
  ): Promise<TrainingPlanResponse> {
    const response = await apiService.patch<TrainingPlanResponse>(
      `/training-plans/${id}`,
      { is_active: isActive }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateDailyExerciseData(
    data: TrainingPlansWithCounters
  ): Promise<void> {
    try {
      // Usar data local ao invés de UTC
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Obter o dia atual da semana
      const getCurrentDayKey = (): string => {
        const days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const todayIndex = new Date().getDay();
        return days[todayIndex];
      };

      const currentDay = getCurrentDayKey();

      // Calcular exercícios de hoje (treinos que devem ser executados hoje)
      const todayWorkouts = data.trainingPlans
        .flatMap((plan) =>
          plan.workouts.map((workout) => ({
            ...workout,
            planId: plan.id,
          }))
        )
        .filter((workout) => workout.weekDays.includes(currentDay));

      const totalExercisesToday = todayWorkouts.reduce(
        (acc, workout) => acc + workout.exercises.length,
        0
      );

      // Usar os counters da API para exercícios executados
      const exercisesExecutedToday = data.counters.exercisesExecutedToday;

      console.log("📊 Daily Exercise Data:", {
        todayLocal,
        exercisesExecutedToday,
        totalExercisesToday,
        counters: data.counters,
      });

      // Só salvar se houver dados reais (exercícios completados > 0)
      if (exercisesExecutedToday === 0 && totalExercisesToday > 0) {
        console.log("⚠️ No exercises completed today, skipping save");
        return;
      }

      // Calcular duração total (aproximada) - 3 minutos por exercício
      const totalDuration = exercisesExecutedToday * 3 * 60; // 3 minutos por exercício

      // Calcular calorias queimadas (aproximada) - 15 calorias por exercício
      const caloriesBurned = exercisesExecutedToday * 15; // 15 calorias por exercício

      const exerciseData: DailyExerciseData = {
        date: todayLocal,
        exercisesCompleted: exercisesExecutedToday,
        totalExercises: totalExercisesToday,
        totalDuration: totalDuration,
        caloriesBurned: caloriesBurned,
        workoutsExecutedThisWeek: data.counters.workoutsExecutedThisWeek,
        lastUpdated: new Date().toISOString(),
      };

      console.log("💾 Saving exercise data:", exerciseData);
      await dailyDataStorage.setDailyExerciseData(exerciseData);
    } catch (error) {
      console.error("Error updating daily exercise data:", error);
    }
  }
}

export const trainingService = new TrainingService();
