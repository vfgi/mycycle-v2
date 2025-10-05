import React, { useState, useEffect } from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import { EmptyWorkoutScreen } from "./EmptyWorkoutScreen";
import { getWorkouts, Workout } from "./workoutData";

export const WorkoutsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const workoutData = await getWorkouts();
      setWorkouts(workoutData);
    } catch (error) {
      console.error("Error loading workouts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustom = () => {
    // TODO: Navegar para tela de criação de treino personalizado
    console.log("Create custom workout");
  };

  const handleCreateWithAI = () => {
    // TODO: Navegar para tela de criação com IA ou upgrade para premium
    console.log("Create workout with AI");
  };

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

  // Se não há treinos, mostrar tela vazia
  if (workouts.length === 0) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <EmptyWorkoutScreen
          onCreateCustom={handleCreateCustom}
          onCreateWithAI={handleCreateWithAI}
        />
      </SafeContainer>
    );
  }

  // TODO: Implementar lista de treinos quando houver dados
  return (
    <SafeContainer>
      <VStack
        flex={1}
        bg={FIXED_COLORS.background[950]}
        justifyContent="center"
        alignItems="center"
        p="$6"
      >
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$2xl"
          fontWeight="$bold"
          textAlign="center"
        >
          {t("navigation.workouts")}
        </Text>
        <Text
          color={FIXED_COLORS.text[400]}
          fontSize="$md"
          textAlign="center"
          mt="$4"
        >
          {t("workouts.workoutsList")} ({workouts.length})
        </Text>
      </VStack>
    </SafeContainer>
  );
};
