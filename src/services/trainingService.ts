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

  async getTrainingPlans(): Promise<TrainingPlanResponse[]> {
    const response = await apiService.get<TrainingPlanResponse[]>(
      "/training-plans"
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
    console.log("🔄 [API] PUT /training-plans/" + id);
    console.log("🔄 [API] Body:", JSON.stringify(trainingPlan, null, 2));

    const response = await apiService.put<TrainingPlanResponse>(
      `/training-plans/${id}`,
      trainingPlan
    );

    console.log("📥 [API] Response:", JSON.stringify(response, null, 2));

    if (response.error) {
      console.error("❌ [API] Error:", response.error);
      throw new Error(response.error);
    }

    if (!response.data) {
      console.error("❌ [API] No data in response");
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async deleteTrainingPlan(id: string): Promise<void> {
    console.log("🗑️ [API] DELETE /training-plans/" + id);

    const response = await apiService.delete<void>(`/training-plans/${id}`);

    console.log("📥 [API] Delete Response:", response);

    if (response.error) {
      console.error("❌ [API] Delete Error:", response.error);
      throw new Error(response.error);
    }

    console.log("✅ [API] Plano excluído com sucesso");
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
}

export const trainingService = new TrainingService();
