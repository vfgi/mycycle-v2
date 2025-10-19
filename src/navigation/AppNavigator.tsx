import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { SignupScreen } from "../screens/auth/SignupScreen";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { ChangePasswordScreen } from "../screens/settings/ChangePasswordScreen";
import { NotificationsScreen } from "../screens/notifications/NotificationsScreen";
import { MeasurementsScreen } from "../screens/measurements/MeasurementsScreen";
import { GoalsScreen } from "../screens/goals/GoalsScreen";
import { HistoryScreen } from "../screens/history/HistoryScreen";
import { CalendarScreen } from "../screens/calendar/CalendarScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { WorkoutSetupScreen } from "../screens/workoutSetup";
import { WorkoutCreationScreen } from "../screens/workouts/WorkoutCreationScreen";
import { AllWorkoutsScreen } from "../screens/workouts/AllWorkoutsScreen";
import { AllTrainingPlansScreen } from "../screens/workouts/AllTrainingPlansScreen";
import { EmptyWorkoutScreen } from "../screens/workouts/EmptyWorkoutScreen";
import { ActiveWorkoutScreen } from "../screens/workouts/ActiveWorkoutScreen";
import { MealsManagementScreen } from "../screens/nutrition/MealsManagementScreen";
import { CreateMealScreen } from "../screens/nutrition/CreateMealScreen";
import { SupplementsManagementScreen } from "../screens/nutrition/SupplementsManagementScreen";
import {
  MedicationsScreen,
  MedicationsManagementScreen,
  CreateMedicationScreen,
} from "../screens/medications";
import { CreateSupplementScreen } from "../screens/nutrition/components/supplements/CreateSupplementScreen";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { useTranslation } from "../hooks/useTranslation";
import { getErrorMessage } from "../utils/errorHandler";
import { LoginFormData } from "../schemas/authSchema";
import { SignupFormData } from "../schemas/signupSchema";
import { FIXED_COLORS } from "../theme/colors";
import { HeaderLogo } from "../components/HeaderLogo";

import { TrainingPlanResponse } from "../types/training";
import { WorkoutSession } from "../services/workoutsService";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
  Measurements: undefined;
  Goals: undefined;
  History: undefined;
  Calendar: undefined;
  Profile: undefined;
  WorkoutSetup: { editPlan?: TrainingPlanResponse } | undefined;
  WorkoutCreation: { editWorkout?: WorkoutSession } | undefined;
  AllWorkouts: undefined;
  AllTrainingPlans: undefined;
  EmptyWorkout: undefined;
  ActiveWorkout: undefined;
  MealsManagement: undefined;
  CreateMeal: undefined;
  SupplementsManagement: undefined;
  CreateSupplement: undefined;
  Medications: undefined;
  MedicationsManagement: undefined;
  CreateMedication: undefined;
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
        initialRouteName={isAuthenticated ? "Main" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={({ route }) => ({
                headerShown: true,
                title: t("settings.title"),
                headerBackTitleVisible: false,
                headerBackTitle: "",
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
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Measurements"
              component={MeasurementsScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="Goals"
              component={GoalsScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="WorkoutSetup"
              component={WorkoutSetupScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="WorkoutCreation"
              component={WorkoutCreationScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="AllWorkouts"
              component={AllWorkoutsScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="AllTrainingPlans"
              component={AllTrainingPlansScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="EmptyWorkout"
              component={EmptyWorkoutScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="ActiveWorkout"
              component={ActiveWorkoutScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="MealsManagement"
              component={MealsManagementScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="CreateMeal"
              component={CreateMealScreen}
              options={({ route }) => ({
                headerShown: true,
                title: t("nutrition.meals.createMeal"),
                headerBackTitleVisible: false,
                headerBackTitle: "",
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
              name="SupplementsManagement"
              component={SupplementsManagementScreen}
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => <HeaderLogo />,
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
              })}
            />
            <Stack.Screen
              name="CreateSupplement"
              component={CreateSupplementScreen}
              options={({ route }) => ({
                headerShown: true,
                title: t("nutrition.supplements.create.title"),
                headerBackTitleVisible: false,
                headerBackTitle: "",
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
              name="Medications"
              component={MedicationsScreen}
              options={({ route }) => ({
                headerShown: true,
                title: t("medications.header.title"),
                headerBackTitleVisible: false,
                headerBackTitle: "",
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
              name="MedicationsManagement"
              component={MedicationsManagementScreen}
              options={({ route }) => ({
                headerShown: true,
                title: t("medications.management.title"),
                headerBackTitleVisible: false,
                headerBackTitle: "",
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
              name="CreateMedication"
              component={CreateMedicationScreen}
              options={({ route }) => ({
                headerShown: true,
                title: t("medications.create.title"),
                headerBackTitleVisible: false,
                headerBackTitle: "",
                headerStyle: {
                  backgroundColor: FIXED_COLORS.background[800],
                },
                headerTintColor: FIXED_COLORS.text[50],
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              })}
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
