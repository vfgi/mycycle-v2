import { apiService } from "./api";

export interface Medication {
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

export interface CreateMedicationRequest {
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

export class MedicationsService {
  async getMedications(): Promise<Medication[]> {
    const response = await apiService.get<Medication[]>("/medications");

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async getMedication(id: string): Promise<Medication> {
    const response = await apiService.get<Medication>(`/medications/${id}`);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async createMedication(
    medication: CreateMedicationRequest
  ): Promise<Medication> {
    const response = await apiService.post<Medication>(
      "/medications",
      medication
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateMedication(
    id: string,
    medication: Partial<CreateMedicationRequest>
  ): Promise<Medication> {
    const response = await apiService.put<Medication>(
      `/medications/${id}`,
      medication
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateMedicationStatus(
    id: string,
    medication: Medication,
    isActive: boolean
  ): Promise<Medication> {
    const updateData: CreateMedicationRequest = {
      name: medication.name,
      time: medication.time,
      amount: medication.amount,
      frequency: medication.frequency,
      protein: medication.protein,
      carbohydrates: medication.carbohydrates,
      calories: medication.calories,
      description: medication.description,
      is_active: isActive,
    };

    const response = await apiService.put<Medication>(
      `/medications/${id}`,
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

  async deleteMedication(id: string): Promise<void> {
    const response = await apiService.delete<void>(`/medications/${id}`);

    if (response.error) {
      throw new Error(response.error);
    }
  }
}

export const medicationsService = new MedicationsService();
