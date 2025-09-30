import { apiService } from "./api";
import { Professional } from "../types/professionals";

export class ProfessionalsService {
  async getMyProfessionals(): Promise<Professional[]> {
    const response = await apiService.get<Professional[]>(
      "/clients/me/professionals"
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

export const professionalsService = new ProfessionalsService();
