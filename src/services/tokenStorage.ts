import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export class TokenStorage {
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      console.log("💾 [TokenStorage] Saving tokens:", {
        accessTokenLength: accessToken?.length || 0,
        refreshTokenLength: refreshToken?.length || 0,
        refreshTokenPreview: refreshToken
          ? `${refreshToken.substring(0, 20)}...`
          : null,
      });
      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
      ]);
      console.log("✅ [TokenStorage] Tokens saved successfully");
    } catch (error) {
      console.error("❌ [TokenStorage] Error saving tokens:", error);
      throw new Error("Falha ao salvar tokens");
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      console.log("🔍 [TokenStorage] Getting refresh token:", {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      });
      return token;
    } catch (error) {
      console.error("❌ [TokenStorage] Error getting refresh token:", error);
      return null;
    }
  }

  async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Falha ao salvar dados do usuário");
    }
  }

  async getUser(): Promise<any | null> {
    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  async clearAll(): Promise<void> {
    try {
      console.log("🗑️ [TokenStorage] Clearing all tokens and user data");
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      console.log("✅ [TokenStorage] All data cleared successfully");
    } catch (error) {
      console.error("❌ [TokenStorage] Error clearing storage:", error);
      throw new Error("Falha ao limpar dados");
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      return refreshToken !== null;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }
}

export const tokenStorage = new TokenStorage();
