import { apiService } from "./api";
import { userStorage } from "./userStorage";
import { User } from "../types/auth";

export interface MeasurementComparison {
  current: {
    date: string;
    measurements: Record<string, number>;
  };
  result: {
    date: string;
    measurements: Record<string, number>;
    notes?: string;
    difference: Record<string, number>;
  };
}

export interface WeightHistoryData {
  label: string;
  weight?: number;
  date?: string;
}

export interface WeightHistoryResponse {
  period: string;
  start_date: string;
  end_date: string;
  data: WeightHistoryData[];
}

export class UserService {
  async getProfile(): Promise<User> {
    const response = await apiService.get<User>("/clients/me/profile");

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    // Sempre salva os dados na AsyncStorage quando busca da API
    try {
      await userStorage.setUserProfile(response.data);
    } catch (error) {
      console.error("Error saving user profile to storage:", error);
      // Não interrompe o fluxo se falhar ao salvar no storage
    }

    return response.data;
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await apiService.put<User>(
      "/clients/me/profile",
      profileData
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    // Sempre salva os dados atualizados na AsyncStorage
    try {
      await userStorage.setUserProfile(response.data);
    } catch (error) {
      console.error("Error saving updated user profile to storage:", error);
      // Não interrompe o fluxo se falhar ao salvar no storage
    }

    return response.data;
  }

  async getMeasurementsComparison(
    period: "week" | "month" | "3months" | "6months" | "year" | "first" | "all"
  ): Promise<MeasurementComparison> {
    const userProfile = await userStorage.getUserProfile();
    const clientId = userProfile?.id;

    if (!clientId) {
      throw new Error("Client ID não encontrado");
    }

    const endpoint = `/clients/${clientId}/measurements-comparison?period=${period}`;

    const response = await apiService.get<MeasurementComparison>(endpoint);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async updateUserMeasurement(clientId: string, weight: number): Promise<void> {
    const endpoint = `/clients/${clientId}/measurements`;

    const payload = {
      measurements: {
        weight,
      },
    };

    const response = await apiService.patch<void>(endpoint, payload);

    if (response.error) {
      throw new Error(response.error);
    }
  }

  async getWeightHistory(
    clientId: string,
    period: "weekly" | "monthly" | "yearly" = "yearly"
  ): Promise<WeightHistoryResponse> {
    const endpoint = `/clients/${clientId}/weight-history?period=${period}`;

    console.log("📊 Fetching weight history:", { clientId, period, endpoint });

    const response = await apiService.get<WeightHistoryResponse>(endpoint);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    console.log("📊 Weight history received:", response.data);

    return response.data;
  }
}

export const userService = new UserService();
