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
    console.log("✏️ [API] PUT /workouts/" + id, workout);

    const response = await apiService.put<WorkoutSession>(
      `/workouts/${id}`,
      workout
    );

    console.log("📥 [API] Update Response:", response);

    if (response.error) {
      console.error("❌ [API] Update Error:", response.error);
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Invalid server response");
    }

    console.log("✅ [API] Treino atualizado com sucesso");
    return response.data;
  }

  async deleteWorkout(id: string): Promise<void> {
    console.log("🗑️ [API] DELETE /workouts/" + id);

    const response = await apiService.delete<void>(`/workouts/${id}`);

    console.log("📥 [API] Delete Response:", response);

    if (response.error) {
      console.error("❌ [API] Delete Error:", response.error);
      throw new Error(response.error);
    }

    console.log("✅ [API] Treino excluído com sucesso");
  }
}

export const workoutsService = new WorkoutsService();
