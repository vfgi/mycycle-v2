import { ENV } from "../config";
import { tokenStorage } from "./tokenStorage";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = ENV.API_BASE_URL;
    this.timeout = ENV.API_TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    let timeoutId: NodeJS.Timeout | undefined;

    try {
      const url = `${this.baseURL}${endpoint}`;

      // Adicionar token de autorização se disponível
      const accessToken = await tokenStorage.getAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      // Criar AbortController para timeout
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const config: RequestInit = {
        ...options,
        headers,
        signal: controller.signal,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        // Se for erro 401 (Unauthorized), limpar tokens
        if (response.status === 401) {
          await tokenStorage.clearAll();
        }

        return {
          error: data.message || data.error || "Erro na requisição",
          message: data.message,
        };
      }

      return { data };
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      console.error("API Request Error:", error);
      return {
        error: error instanceof Error ? error.message : "Erro de conexão",
      };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async get<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }
}

export const apiService = new ApiService();
