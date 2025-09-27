import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthState, User, LoginRequest, SignupRequest } from "../types/auth";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { tokenStorage } from "../services/tokenStorage";
import { oneSignalService } from "../services/oneSignalService";

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const initializeAuth = async () => {
    try {
      console.log("🔍 [AuthContext] Initializing auth...");
      const [user, accessToken, refreshToken] = await Promise.all([
        tokenStorage.getUser(),
        tokenStorage.getAccessToken(),
        tokenStorage.getRefreshToken(),
      ]);

      console.log("🔍 [AuthContext] Storage data:", {
        hasUser: !!user,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        refreshTokenLength: refreshToken?.length || 0,
      });

      if (accessToken && refreshToken) {
        console.log("✅ [AuthContext] User authenticated from storage");
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log("❌ [AuthContext] No valid tokens found in storage");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("❌ [AuthContext] Error initializing auth:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authService.login(credentials);

      // Salvar tokens
      await tokenStorage.setTokens(
        response.access_token,
        response.refresh_token
      );

      // Buscar perfil completo do usuário
      let userProfile = response.user;
      try {
        userProfile = await userService.getProfile();
      } catch (error) {
        console.error("Error fetching user profile after login:", error);
        // Se falhar, usa os dados básicos da resposta de login
      }

      // Salvar dados do usuário
      if (userProfile) {
        await tokenStorage.setUser(userProfile);

        // Configurar OneSignal com dados do usuário
        try {
          await oneSignalService.setUserId(userProfile.id.toString());
          await oneSignalService.setUserEmail(userProfile.email);
        } catch (error) {
          console.error("Error configuring OneSignal user on login:", error);
        }
      }

      setAuthState({
        user: userProfile || null,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (userData: SignupRequest) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authService.signup(userData);

      // Salvar tokens
      await tokenStorage.setTokens(
        response.access_token,
        response.refresh_token
      );

      // Buscar perfil completo do usuário
      let userProfile = response.user;
      try {
        userProfile = await userService.getProfile();
      } catch (error) {
        console.error("Error fetching user profile after signup:", error);
        // Se falhar, usa os dados básicos da resposta de signup
      }

      // Salvar dados do usuário
      if (userProfile) {
        await tokenStorage.setUser(userProfile);

        // Configurar OneSignal com dados do usuário
        try {
          await oneSignalService.setUserId(userProfile.id.toString());
          await oneSignalService.setUserEmail(userProfile.email);
        } catch (error) {
          console.error("Error configuring OneSignal user on signup:", error);
        }
      }

      setAuthState({
        user: userProfile || null,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await tokenStorage.clearAll();
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const refreshAuth = async () => {
    try {
      console.log("🔄 [AuthContext] Starting refresh auth...");
      const refreshToken = await tokenStorage.getRefreshToken();

      console.log("🔍 [AuthContext] Refresh token from storage:", {
        hasRefreshToken: !!refreshToken,
        refreshTokenLength: refreshToken?.length || 0,
        refreshTokenPreview: refreshToken
          ? `${refreshToken.substring(0, 20)}...`
          : null,
      });

      if (!refreshToken) {
        console.log("❌ [AuthContext] No refresh token found, logging out");
        await logout();
        return;
      }

      console.log("🌐 [AuthContext] Calling refresh token API...");
      const response = await authService.refreshToken(refreshToken);
      console.log("✅ [AuthContext] Refresh token API success");

      // Salvar tokens
      await tokenStorage.setTokens(
        response.access_token,
        response.refresh_token
      );
      console.log("💾 [AuthContext] New tokens saved to storage");

      // Se houver dados do usuário, salvar também
      if (response.user) {
        await tokenStorage.setUser(response.user);
        console.log("👤 [AuthContext] User data updated");
      }

      setAuthState({
        user: response.user || null,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log("✅ [AuthContext] Auth state updated successfully");
    } catch (error) {
      console.error("❌ [AuthContext] Error refreshing auth:", error);
      // Se o refresh token falhar, fazer logout
      console.log("🚪 [AuthContext] Refresh failed, logging out user");
      await logout();
    }
  };

  const setLoading = (loading: boolean) => {
    setAuthState((prev) => ({ ...prev, isLoading: loading }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    refreshAuth,
    setLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
