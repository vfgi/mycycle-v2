import { apiService } from "./api";

export interface WorkoutExercise {
  id: string;
  name: string;
  muscle_group: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time?: number;
  notes?: string;
  imageURL?: string;
  videoURL?: string;
  category?: string;
  difficulty?: string;
  equipment?: string;
  order?: number;
  instructions?: string;
  history?: string[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  description?: string;
  professional_id: string;
  client_id: string;
  exercises: WorkoutExercise[];
  history: string[];
}

export class WorkoutsService {
  async getWorkouts(): Promise<WorkoutSession[]> {
    const response = await apiService.get<WorkoutSession[]>("/workouts");

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Invalid server response");
    }

    return response.data;
  }

  async getWorkout(id: string): Promise<WorkoutSession> {
    const response = await apiService.get<WorkoutSession>(`/workouts/${id}`);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Invalid server response");
    }

    return response.data;
  }

  async createWorkout(
    workout: Omit<WorkoutSession, "id">
  ): Promise<WorkoutSession> {
    const response = await apiService.post<WorkoutSession>(
      "/workouts",
      workout
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Invalid server response");
    }

    return response.data;
  }

  async updateWorkout(
    id: string,
    workout: Partial<WorkoutSession>
  ): Promise<WorkoutSession> {
    const response = await apiService.put<WorkoutSession>(
      `/workouts/${id}`,
      workout
    );

    if (response.error) {
      console.error("Error updating workout:", response.error);
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Invalid server response");
    }

    return response.data;
  }

  async deleteWorkout(id: string): Promise<void> {
    const response = await apiService.delete<void>(`/workouts/${id}`);

    if (response.error) {
      console.error("Error deleting workout:", response.error);
      throw new Error(response.error);
    }
  }

  async getWorkoutHistoryByDay(
    clientId: string,
    date: string
  ): Promise<WorkoutHistoryEntry[]> {
    const response = await apiService.get<WorkoutHistoryEntry[]>(
      `/workouts/history/client/${clientId}/day/${date}`
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Invalid server response");
    }

    return response.data;
  }
}

export interface WorkoutHistoryExercise {
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
  notes: string;
  status: "completed" | "skipped" | "partial";
  completed_at: string;
}

export interface WorkoutHistoryData {
  exercises_completed: WorkoutHistoryExercise[];
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

export interface WorkoutHistoryEntry {
  id: string;
  workout_id: string;
  client_id: string;
  recorded_by_user_id: string;
  recorded_by_user_type: "client" | "professional";
  recorded_at: string;
  workout_data: WorkoutHistoryData;
}

export const workoutsService = new WorkoutsService();
