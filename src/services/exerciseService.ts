import { apiService } from "./api";
import { ExerciseResponse } from "../types/exercises";

export const exerciseService = {
  async getExercisesByMuscleGroup(
    muscleGroup: string,
    limit?: number
  ): Promise<ExerciseResponse> {
    try {
      const params = new URLSearchParams({ muscle_group: muscleGroup });
      if (limit != null) {
        params.set("page", "1");
        params.set("limit", String(limit));
      }
      const response = await apiService.get(
        `/workout-exercises-template?${params.toString()}`
      );
      return response.data as ExerciseResponse;
    } catch (error) {
      console.error("Error fetching exercises:", error);
      throw error;
    }
  },
};
