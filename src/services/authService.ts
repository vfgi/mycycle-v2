import { apiService } from "./api";
import { AuthResponse, LoginRequest, SignupRequest } from "../types/auth";

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/signin/client",
      credentials
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/clients/signup",
      userData
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/refresh-token",
      {
        refreshToken: refreshToken,
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(
      "/clients/request-password-reset",
      {
        email,
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Resposta inválida do servidor");
    }

    return response.data;
  }

  async changePassword(data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> {
    await apiService.post("/clients/me/change-password", data);
  }
}

export const authService = new AuthService();
