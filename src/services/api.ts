import { ENV } from "../config";
import { tokenStorage } from "./tokenStorage";
import { authService } from "./authService";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private timeout: number;
  private isRefreshing: boolean = false;

  constructor() {
    this.baseURL = ENV.API_BASE_URL;
    this.timeout = ENV.API_TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, this.timeout);

      const config: RequestInit = {
        ...options,
        headers,
        signal: controller.signal,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Tentar fazer parse do JSON, mas se falhar (ex: 204 No Content), retornar null
      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (e) {
          // Se falhar o parse, deixa data como null
        }
      }

      if (!response.ok) {
        // Se for erro 401 (Unauthorized), tentar refresh token primeiro
        if (response.status === 401 && !this.isRefreshing) {
          try {
            this.isRefreshing = true;
            const refreshToken = await tokenStorage.getRefreshToken();

            if (refreshToken) {
              const refreshResponse = await authService.refreshToken(
                refreshToken
              );

              // Salvar novos tokens
              await tokenStorage.setTokens(
                refreshResponse.access_token,
                refreshResponse.refresh_token
              );

              // Tentar novamente a requisição original com o novo token
              const newAccessToken = refreshResponse.access_token;
              const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${newAccessToken}`,
              };

              const retryResponse = await fetch(url, {
                ...config,
                headers: retryHeaders,
              });

              const retryData = await retryResponse.json();

              if (retryResponse.ok) {
                return { data: retryData };
              } else {
                await tokenStorage.clearAll();
              }
            } else {
              await tokenStorage.clearAll();
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            await tokenStorage.clearAll();
          } finally {
            this.isRefreshing = false;
          }
        } else if (response.status === 401) {
          await tokenStorage.clearAll();
        }

        return {
          error: data.message || data.error || "Erro na requisição",
          message: data.message,
        };
      }

      return { data };
    } catch (error) {
      console.error("Error making API request:", error);
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
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("PUT request timeout"));
      }, this.timeout);
    });

    const requestPromise = this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });

    return Promise.race([requestPromise, timeoutPromise]);
  }

  async delete<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  async patch<T>(
    endpoint: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers,
    });
  }
}

export const apiService = new ApiService();
