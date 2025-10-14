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
      const data = await response.json();

      if (!response.ok) {
        // Se for erro 401 (Unauthorized), tentar refresh token primeiro
        if (response.status === 401 && !this.isRefreshing) {
          console.log(
            "🔄 [ApiService] 401 detected, attempting token refresh..."
          );

          try {
            this.isRefreshing = true;
            const refreshToken = await tokenStorage.getRefreshToken();

            if (refreshToken) {
              console.log("🌐 [ApiService] Refreshing token...");
              const refreshResponse = await authService.refreshToken(
                refreshToken
              );

              // Salvar novos tokens
              await tokenStorage.setTokens(
                refreshResponse.access_token,
                refreshResponse.refresh_token
              );

              console.log(
                "✅ [ApiService] Token refreshed, retrying original request..."
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
                console.log("✅ [ApiService] Retry successful");
                return { data: retryData };
              } else {
                console.log("❌ [ApiService] Retry failed, clearing tokens");
                await tokenStorage.clearAll();
              }
            } else {
              console.log(
                "❌ [ApiService] No refresh token available, clearing tokens"
              );
              await tokenStorage.clearAll();
            }
          } catch (refreshError) {
            console.error(
              "❌ [ApiService] Token refresh failed:",
              refreshError
            );
            await tokenStorage.clearAll();
          } finally {
            this.isRefreshing = false;
          }
        } else if (response.status === 401) {
          // Se já está refreshing ou falhou, limpar tokens
          await tokenStorage.clearAll();
        }

        return {
          error: data.message || data.error || "Erro na requisição",
          message: data.message,
        };
      }

      return { data };
    } catch (error) {
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
    // Implementar timeout específico para PUT
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
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers,
    });
  }
}

export const apiService = new ApiService();
