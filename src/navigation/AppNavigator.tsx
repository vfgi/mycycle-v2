import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { SignupScreen } from "../screens/auth/SignupScreen";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { ChangePasswordScreen } from "../screens/settings/ChangePasswordScreen";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { useTranslation } from "../hooks/useTranslation";
import { getErrorMessage } from "../utils/errorHandler";
import { LoginFormData } from "../schemas/authSchema";
import { SignupFormData } from "../schemas/signupSchema";
import { FIXED_COLORS } from "../theme/colors";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Settings: undefined;
  ChangePassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, login, signup, setLoading } = useAuth();
  const { showError } = useToast();
  const { t } = useTranslation();

  const handleLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data);
      // Se chegou até aqui, o login foi bem-sucedido
      // A navegação será feita automaticamente pelo isAuthenticated
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      const errorMessage = getErrorMessage(
        (err as Error).message || "generic-error",
        t
      );
      showError(errorMessage);
      // Não fazer throw para não quebrar o fluxo
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    try {
      setLoading(true);
      // Remover confirmPassword antes de enviar para a API
      const { confirmPassword, ...signupData } = data;
      await signup(signupData);
      // Se chegou até aqui, o signup foi bem-sucedido
      // A navegação será feita automaticamente pelo isAuthenticated
    } catch (err) {
      console.error("Signup error:", err);
      setLoading(false);
      const errorMessage = getErrorMessage(
        (err as Error).message || "generic-error",
        t
      );
      showError(errorMessage);
      // Não fazer throw para não quebrar o fluxo
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={({ route }) => ({
                headerShown: true,
                title: t("settings.title"),
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              })}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  onLogin={handleLogin}
                  onNavigateToSignup={() => navigation.navigate("Signup")}
                  isLoading={isLoading}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {({ navigation }) => (
                <SignupScreen
                  onSignup={handleSignup}
                  onNavigateToLogin={() => navigation.navigate("Login")}
                  isLoading={isLoading}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
