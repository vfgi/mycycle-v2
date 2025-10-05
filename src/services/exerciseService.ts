import { apiService } from "./api";
import { ExerciseResponse } from "../types/exercises";

export const exerciseService = {
  async getExercisesByMuscleGroup(
    muscleGroup: string,
    limit: number = 50
  ): Promise<ExerciseResponse> {
    try {
      const response = await apiService.get(
        `/workout-exercises-template?page=1&limit=${limit}&muscle_group=${muscleGroup}`
      );
      return response.data as ExerciseResponse;
    } catch (error) {
      console.error("Error fetching exercises:", error);
      throw error;
    }
  },
};
