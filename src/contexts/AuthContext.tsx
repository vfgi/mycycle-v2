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
      const [user, accessToken, refreshToken] = await Promise.all([
        tokenStorage.getUser(),
        tokenStorage.getAccessToken(),
        tokenStorage.getRefreshToken(),
      ]);

      if (accessToken && refreshToken) {
        setAuthState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
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
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        await logout();
        return;
      }

      const response = await authService.refreshToken(refreshToken);

      // Salvar tokens
      await tokenStorage.setTokens(
        response.access_token,
        response.refresh_token
      );

      // Se houver dados do usuário, salvar também
      if (response.user) {
        await tokenStorage.setUser(response.user);
      }

      setAuthState({
        user: response.user || null,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error refreshing auth:", error);
      // Se o refresh token falhar, fazer logout
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
