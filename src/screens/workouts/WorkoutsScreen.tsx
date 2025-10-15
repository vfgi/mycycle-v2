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
import { ExerciseList } from "./components/ExerciseList";
import { PlanExercisesList } from "./components/PlanExercisesList";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const WorkoutsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPremium = user?.is_premium || false;
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [todayExercises, setTodayExercises] = useState<TrainingExercise[]>([]);
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
      const plans = await trainingService.getTrainingPlans();
      setTrainingPlans(plans);

      // Extrair exercícios de hoje
      const today = getCurrentDayKey();
      const todayWorkouts = plans
        .flatMap((plan) => plan.workouts)
        .filter((workout) => workout.weekDays.includes(today));

      const exercises = todayWorkouts.flatMap((workout) => workout.exercises);
      setTodayExercises(exercises);
    } catch (error) {
      setTrainingPlans([]);
      setTodayExercises([]);
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

  // Mock data para estatísticas (você pode substituir pelos dados reais)
  const mockStats = {
    dailyGoal: 6, // Meta de exercícios diários do usuário
    dailyCompleted: 2, // Exercícios completados hoje (mock)
    weeklyGoal: 5, // Meta de treinos semanais
    weeklyCompleted: 3, // Treinos completados esta semana (mock)
  };

  // Obter todos os workouts do plano ativo
  const getActivePlanWorkouts = () => {
    const activePlan = trainingPlans.find((plan) => plan.is_active);
    if (!activePlan) return [];

    return activePlan.workouts;
  };

  const handleViewAllWorkouts = () => {
    navigation.navigate("AllWorkouts");
  };

  const handleViewAllPlans = () => {
    navigation.navigate("AllTrainingPlans");
  };

  const handleExercisePlay = (exercise: TrainingExercise) => {
    console.log("🎯 [EXERCISE] Playing exercise:", exercise.name);
    // TODO: Implementar navegação para tela de execução do exercício
  };

  // Dados das tabs usando o padrão AnimatedTabs
  const tabData = [
    {
      id: "today",
      title: t("workouts.todayExercises"),
      icon: (
        <Ionicons
          name="today-outline"
          size={18}
          color={FIXED_COLORS.text[400]}
        />
      ),
      content: (
        <ExerciseList
          exercises={todayExercises}
          onExercisePlay={handleExercisePlay}
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
        dailyGoal={mockStats.dailyGoal}
        dailyCompleted={mockStats.dailyCompleted}
        weeklyGoal={mockStats.weeklyGoal}
        weeklyCompleted={mockStats.weeklyCompleted}
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
