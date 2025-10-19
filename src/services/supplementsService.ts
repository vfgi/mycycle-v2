import { apiService } from "./api";

export interface Supplement {
  id: string;
  name: string;
  time: string;
  amount: string;
  frequency: string;
  protein?: string;
  carbohydrates?: string;
  calories?: string;
  description?: string;
  is_active: boolean;
  client_id: string;
}

export interface CreateSupplementRequest {
  name: string;
  time: string;
  amount: string;
  frequency: string;
  protein?: string;
  carbohydrates?: string;
  calories?: string;
  description?: string;
  is_active?: boolean;
}

export class SupplementsService {
  async getSupplements(): Promise<Supplement[]> {
    const response = await apiService.get<Supplement[]>("/supplements");

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async getSupplement(id: string): Promise<Supplement> {
    const response = await apiService.get<Supplement>(`/supplements/${id}`);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async createSupplement(
    supplement: CreateSupplementRequest
  ): Promise<Supplement> {
    const response = await apiService.post<Supplement>(
      "/supplements",
      supplement
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateSupplement(
    id: string,
    supplement: Partial<CreateSupplementRequest>
  ): Promise<Supplement> {
    const response = await apiService.put<Supplement>(
      `/supplements/${id}`,
      supplement
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateSupplementStatus(
    id: string,
    supplement: Supplement,
    isActive: boolean
  ): Promise<Supplement> {
    const updateData: CreateSupplementRequest = {
      name: supplement.name,
      time: supplement.time,
      amount: supplement.amount,
      frequency: supplement.frequency,
      protein: supplement.protein,
      carbohydrates: supplement.carbohydrates,
      calories: supplement.calories,
      description: supplement.description,
      is_active: isActive,
    };

    const response = await apiService.put<Supplement>(
      `/supplements/${id}`,
      updateData
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async deleteSupplement(id: string): Promise<void> {
    const response = await apiService.delete<void>(`/supplements/${id}`);

    if (response.error) {
      throw new Error(response.error);
    }
  }
}

export const supplementsService = new SupplementsService();
