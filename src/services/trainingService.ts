import { apiService } from "./api";
import {
  TrainingPlan,
  TrainingPlanResponse,
  CreateTrainingPlanRequest,
} from "../types/training";

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

  async getTrainingPlans(isActive?: boolean): Promise<TrainingPlanResponse[]> {
    const queryParam = isActive !== undefined ? `?is_active=${isActive}` : "";
    const response = await apiService.get<TrainingPlanResponse[]>(
      `/training-plans${queryParam}`
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

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
}

export const trainingService = new TrainingService();
