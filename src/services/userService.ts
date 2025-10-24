import { apiService } from "./api";
import { userStorage } from "./userStorage";
import { User } from "../types/auth";
import { bodyDataService } from "./bodyDataService";
import { dailyDataStorage, DailyWeightData } from "./dailyDataStorage";

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

    // Salvar peso no histórico local após atualizar na API
    try {
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      await bodyDataService.addWeightEntry({
        date: todayLocal,
        weight: weight,
      });

      // Atualizar storage diário para o StatsCard
      const dailyWeightData: DailyWeightData = {
        date: todayLocal,
        weight: weight,
        lastUpdated: new Date().toISOString(),
      };
      await dailyDataStorage.setDailyWeightData(dailyWeightData);

      console.log("✅ Weight entry added to local history:", {
        date: todayLocal,
        weight,
      });
    } catch (error) {
      console.error("Error adding weight to local history:", error);
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

  async uploadProfileImage(imageUri: string): Promise<User> {
    const formData = new FormData();

    const filename = imageUri.split("/").pop() || "profile.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiService.uploadImage<User>(
      "/clients/me/image",
      formData
    );

    if (response.error) {
      throw new Error(response.error);
    }

    // Após upload, fazer GET do perfil completo para manter todos os dados
    const fullProfile = await this.getProfile();

    return fullProfile;
  }
}

export const userService = new UserService();
