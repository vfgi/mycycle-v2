import React, { useState, useEffect, useCallback } from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer, AnimatedTabs, AdBanner } from "../../components";
import { EmptyWorkoutScreen } from "./EmptyWorkoutScreen";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { trainingService } from "../../services/trainingService";
import { TrainingPlanResponse, TrainingExercise } from "../../types/training";
import { WorkoutStatsCard } from "./components/WorkoutStatsCard";
import { MuscleCards } from "./components/MuscleCards";
import { TodayWorkoutsList } from "./components/TodayWorkoutsList";
import { PlanExercisesList } from "./components/PlanExercisesList";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { Workout } from "../../types/training";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const WorkoutsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPremium = user?.is_premium || false;
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [counters, setCounters] = useState({
    workoutsExecutedThisWeek: 0,
    exercisesExecutedToday: 0,
  });
  const navigation = useNavigation<NavigationProp>();

  // Carregar planos quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadTrainingPlans();
    }, [])
  );

  const loadTrainingPlans = async () => {
    try {
      setIsLoading(true);
      const response = await trainingService.getTrainingPlans(true);
      setTrainingPlans(response.trainingPlans);
      setCounters(response.counters);

      // Extrair treinos de hoje
      const today = getCurrentDayKey();
      const workoutsToday = response.trainingPlans
        .flatMap((plan) =>
          plan.workouts.map((workout) => ({
            ...workout,
            id: workout.id,
            planId: plan.id,
          }))
        )
        .filter((workout) => workout.weekDays.includes(today));

      setTodayWorkouts(workoutsToday);
    } catch (error) {
      setTrainingPlans([]);
      setTodayWorkouts([]);
      setCounters({
        workoutsExecutedThisWeek: 0,
        exercisesExecutedToday: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter o dia atual da semana
  const getCurrentDayKey = (): string => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = new Date().getDay();
    return days[today];
  };

  // Calcular metas baseadas nos treinos de hoje e da semana
  const dailyGoal = todayWorkouts.reduce(
    (sum, workout) => sum + workout.exercises.length,
    0
  );
  const weeklyGoal = trainingPlans.reduce(
    (sum, plan) => sum + plan.workouts.length,
    0
  );

  const stats = {
    dailyGoal: dailyGoal,
    dailyCompleted: counters.exercisesExecutedToday,
    weeklyGoal: weeklyGoal,
    weeklyCompleted: counters.workoutsExecutedThisWeek,
  };

  // Obter todos os workouts de todos os planos ativos
  const getActivePlanWorkouts = () => {
    // Retornar workouts de todos os planos ativos, não apenas o primeiro
    const activeWorkouts = trainingPlans
      .filter((plan) => plan.is_active)
      .flatMap((plan) => plan.workouts);

    return activeWorkouts;
  };

  const handleViewAllWorkouts = () => {
    navigation.navigate("AllWorkouts");
  };

  const handleViewAllPlans = () => {
    navigation.navigate("AllTrainingPlans");
  };

  const handleStartWorkout = (workout: Workout) => {};

  const handleExercisePlay = (exercise: TrainingExercise) => {};

  // Dados das tabs usando o padrão AnimatedTabs
  const tabData = [
    {
      id: "today",
      title: t("workouts.todayWorkouts"),
      icon: (
        <Ionicons
          name="today-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: (
        <TodayWorkoutsList
          workouts={todayWorkouts}
          onStartWorkout={handleStartWorkout}
        />
      ),
    },
    {
      id: "plan",
      title: t("workouts.planExercises"),
      icon: (
        <Ionicons
          name="list-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: (
        <PlanExercisesList
          workouts={getActivePlanWorkouts()}
          onExercisePlay={handleExercisePlay}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <SafeContainer>
        <VStack flex={1} justifyContent="center" alignItems="center" p="$6">
          <Text color={FIXED_COLORS.text[400]} fontSize="$md">
            {t("common.loading")}
          </Text>
        </VStack>
      </SafeContainer>
    );
  }

  if (trainingPlans.length === 0) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <EmptyWorkoutScreen />
      </SafeContainer>
    );
  }
  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      {/* Banner de Propaganda - Apenas para não premium */}
      {!isPremium && (
        <VStack pb="$2" px="$4">
          <AdBanner />
        </VStack>
      )}

      {/* Card de Estatísticas */}
      <WorkoutStatsCard
        dailyGoal={stats.dailyGoal}
        dailyCompleted={stats.dailyCompleted}
        weeklyGoal={stats.weeklyGoal}
        weeklyCompleted={stats.weeklyCompleted}
      />

      {/* Cards de Músculos */}
      <MuscleCards
        onWorkoutsPress={handleViewAllWorkouts}
        onPlansPress={handleViewAllPlans}
      />

      {/* Tabs de Exercícios */}
      <AnimatedTabs
        tabs={tabData}
        reduceMotion="never"
        containerStyle={{ flex: 1 }}
      />
    </SafeContainer>
  );
};
