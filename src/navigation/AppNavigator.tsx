import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { SignupScreen } from "../screens/auth/SignupScreen";
import { LoginFormData } from "../schemas/authSchema";
import { SignupFormData } from "../schemas/signupSchema";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      console.log("Login attempt:", data);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Login successful");
    } catch (err) {
      setError("Erro ao fazer login");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      console.log("Signup attempt:", data);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Signup successful");
    } catch (err) {
      setError("Erro ao criar conta");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen
              onLogin={handleLogin}
              onNavigateToSignup={() => navigation.navigate("Signup")}
              isLoading={isLoading}
              error={error}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {({ navigation }) => (
            <SignupScreen
              onSignup={handleSignup}
              onNavigateToLogin={() => navigation.navigate("Login")}
              isLoading={isLoading}
              error={error}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
