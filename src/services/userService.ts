import { apiService } from "./api";
import { userStorage } from "./userStorage";
import { User } from "../types/auth";

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
}

export const userService = new UserService();
