import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import AnimatedProgressBar from "../../../components/ui/AnimatedProgressBar";

interface WorkoutStatsCardProps {
  dailyGoal: number;
  dailyCompleted: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

export const WorkoutStatsCard: React.FC<WorkoutStatsCardProps> = ({
  dailyGoal,
  dailyCompleted,
  weeklyGoal,
  weeklyCompleted,
}) => {
  const { t } = useTranslation();

  const dailyProgress = dailyGoal > 0 ? (dailyCompleted / dailyGoal) * 100 : 0;
  const weeklyProgress =
    weeklyGoal > 0 ? (weeklyCompleted / weeklyGoal) * 100 : 0;

  return (
    <Box borderRadius="$xl" overflow="hidden" mx="$4" mb="$4">
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 20,
        }}
      >
        <VStack space="lg">
          {/* Título */}
          <Text color={FIXED_COLORS.text[50]} fontSize="$xl" fontWeight="$bold">
            {t("workouts.todayProgress")}
          </Text>

          {/* Estatísticas */}
          <VStack space="lg">
            {/* Meta Diária */}
            <VStack space="sm">
              <HStack justifyContent="space-between" alignItems="center">
                <Text
                  color={FIXED_COLORS.text[200]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {t("workouts.dailyExercises")}
                </Text>
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {dailyCompleted} / {dailyGoal}
                </Text>
              </HStack>

              <AnimatedProgressBar
                progress={dailyProgress / 100}
                height={24}
                width={Dimensions.get("window").width - 80}
                text={`${Math.round(dailyProgress)}%`}
                icon={
                  <Ionicons
                    name="fitness"
                    size={14}
                    color={FIXED_COLORS.text[50]}
                  />
                }
                iconContainerColor="#FF6B35"
                trackColor={FIXED_COLORS.background[800]}
                textStyle={{
                  color: FIXED_COLORS.text[50],
                  fontSize: 11,
                  fontWeight: "600",
                }}
                colorAtZeroProgress="#FF6B35"
                colorAtMidProgress="#F7931E"
                colorAtFullProgress="#FFB347"
                animationDuration={1000}
                reduceMotion="never"
              />
            </VStack>

            {/* Meta Semanal */}
            <VStack space="sm">
              <HStack justifyContent="space-between" alignItems="center">
                <Text
                  color={FIXED_COLORS.text[200]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {t("workouts.weeklyWorkouts")}
                </Text>
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {weeklyCompleted} / {weeklyGoal}
                </Text>
              </HStack>

              <AnimatedProgressBar
                progress={weeklyProgress / 100}
                height={24}
                width={Dimensions.get("window").width - 80}
                text={`${Math.round(weeklyProgress)}%`}
                icon={
                  <Ionicons
                    name="calendar"
                    size={14}
                    color={FIXED_COLORS.text[50]}
                  />
                }
                iconContainerColor="#4ECDC4"
                trackColor={FIXED_COLORS.background[800]}
                textStyle={{
                  color: FIXED_COLORS.text[50],
                  fontSize: 11,
                  fontWeight: "600",
                }}
                colorAtZeroProgress="#4ECDC4"
                colorAtMidProgress="#44A08D"
                colorAtFullProgress="#5DD39E"
                animationDuration={1200}
                reduceMotion="never"
              />
            </VStack>
          </VStack>
        </VStack>
      </LinearGradient>
    </Box>
  );
};
