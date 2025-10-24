import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Divider } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { useUnits } from "../../contexts/UnitsContext";
import { goalsService } from "../../services/goalsService";
import { dailyDataStorage } from "../../services/dailyDataStorage";
import { Goals } from "../../types/goals";

interface StatValue {
  label: string;
  value: string;
  color?: string;
}

const StatRow: React.FC<{
  title: string;
  stats: StatValue[];
}> = ({ title, stats }) => (
  <VStack space="md">
    <Text color={FIXED_COLORS.text[50]} fontSize="$md" fontWeight="$bold">
      {title}
    </Text>

    <HStack space="lg" justifyContent="space-around">
      {stats.map((stat, index) => (
        <VStack key={index} alignItems="center" flex={1}>
          <Text color={FIXED_COLORS.text[400]} fontSize="$xs" mb="$1">
            {stat.label}
          </Text>
          <Text
            color={stat.color || FIXED_COLORS.primary[500]}
            fontSize="$lg"
            fontWeight="$bold"
          >
            {stat.value}
          </Text>
        </VStack>
      ))}
    </HStack>
  </VStack>
);

export const StatsTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { convertWeight } = useUnits();
  const [goals, setGoals] = useState<Goals | null>(null);
  const [dailyData, setDailyData] = useState<any>(null);

  useEffect(() => {
    loadGoals();
    loadDailyData();
  }, []);

  const loadGoals = async () => {
    try {
      const goalsData = await goalsService.getGoals();
      setGoals(goalsData);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const loadDailyData = async () => {
    try {
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const data = await dailyDataStorage.getDailyData(todayLocal);
      setDailyData(data);
      console.log("📊 Daily data loaded:", data);
      console.log("📊 Exercise data:", {
        exercisesCompleted: data?.exercise?.exercisesCompleted,
        totalExercises: data?.exercise?.totalExercises,
      });
    } catch (error) {
      console.error("Error loading daily data:", error);
    }
  };

  // Weight Stats
  const currentWeight =
    dailyData?.weight?.weight || user?.measurements?.weight || 0;
  const goalWeight = goals?.targetWeight || 0;
  const difference = currentWeight - goalWeight;

  const currentWeightConverted = convertWeight(currentWeight);
  const goalWeightConverted = convertWeight(goalWeight);
  const differenceConverted = convertWeight(Math.abs(difference));

  // Consumption Stats
  const caloriesConsumed = dailyData?.consumption?.calories || 0;
  const targetCalories = goals?.targetCalories || 0;
  const exercisesCompleted = dailyData?.exercise?.exercisesCompleted || 0;
  const weeklyWorkouts = goals?.weeklyWorkouts || 0;

  const weightStats = [
    currentWeight > 0 && {
      label: t("profile.current"),
      value: `${currentWeightConverted.value} ${currentWeightConverted.unit}`,
    },
    goalWeight > 0 && {
      label: t("profile.goal"),
      value: `${goalWeightConverted.value} ${goalWeightConverted.unit}`,
    },
    currentWeight > 0 &&
      goalWeight > 0 && {
        label: t("profile.difference"),
        value: `${difference > 0 ? "+" : "-"}${differenceConverted.value} ${
          differenceConverted.unit
        }`,
        color:
          difference > 0
            ? FIXED_COLORS.warning[500]
            : FIXED_COLORS.success[500],
      },
  ].filter(Boolean);

  const calorieStats = [
    caloriesConsumed > 0 && {
      label: t("profile.today"),
      value: `${Math.round(caloriesConsumed)}`,
    },
    targetCalories > 0 && {
      label: t("profile.goal"),
      value: `${targetCalories}`,
    },
  ].filter(Boolean);

  const exerciseStats = [
    exercisesCompleted > 0 && {
      label: t("profile.today"),
      value: `${exercisesCompleted}`,
    },
    weeklyWorkouts > 0 && {
      label: t("profile.thisWeek"),
      value: `${weeklyWorkouts}`,
    },
  ].filter(Boolean);

  return (
    <VStack space="xl">
      {weightStats.length > 0 && (
        <>
          <StatRow
            title={t("profile.weight")}
            stats={weightStats as StatValue[]}
          />
          <Divider bg={FIXED_COLORS.background[700]} />
        </>
      )}

      {calorieStats.length > 0 && (
        <>
          <StatRow
            title={t("profile.calories")}
            stats={calorieStats as StatValue[]}
          />
          <Divider bg={FIXED_COLORS.background[700]} />
        </>
      )}

      {exerciseStats.length > 0 && (
        <>
          <StatRow
            title={t("profile.workouts")}
            stats={exerciseStats as StatValue[]}
          />
        </>
      )}
    </VStack>
  );
};
