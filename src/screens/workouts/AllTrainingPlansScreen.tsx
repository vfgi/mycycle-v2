import React, { useState, useEffect, useCallback } from "react";
import { VStack, Text, ScrollView, Spinner } from "@gluestack-ui/themed";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import { trainingService } from "../../services/trainingService";
import { TrainingPlanResponse, TrainingExercise } from "../../types/training";
import { useToast } from "../../hooks/useToast";
import { DeletePlanModal } from "./components/DeletePlanModal";
import {
  TrainingPlanHeader,
  TrainingPlansList,
} from "./components/trainingPlans";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const AllTrainingPlansScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showError, showSuccess } = useToast();
  const navigation = useNavigation<NavigationProp>();
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<TrainingPlanResponse | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Carregar planos quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadTrainingPlans();
    }, [])
  );

  const loadTrainingPlans = async () => {
    try {
      setIsLoading(true);
      const plansData = await trainingService.getTrainingPlans();
      setTrainingPlans(plansData || []);
    } catch (error) {
      console.error("Erro ao carregar planos de treino:", error);
      showError(t("workouts.loadPlansError"));
      setTrainingPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExercisePlay = (exercise: TrainingExercise) => {};

  const handleDeletePlan = (plan: TrainingPlanResponse) => {
    if (trainingPlans.length === 1) {
      showError(
        t("workouts.cannotDeleteLastPlan") +
          ". " +
          t("workouts.needAtLeastOnePlan")
      );
      return;
    }

    setPlanToDelete(plan);
    setDeleteModalOpen(true);
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      setIsDeleting(true);

      await trainingService.deleteTrainingPlan(planToDelete.id);

      // Recarregar a lista completa da API
      await loadTrainingPlans();

      showSuccess(t("workouts.planDeletedSuccess"));
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error("Error deleting plan:", error);
      showError(t("workouts.deletePlanError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleCreateNewPlan = () => {
    navigation.navigate("EmptyWorkout");
  };

  const handleToggleActivePlan = async (plan: TrainingPlanResponse) => {
    try {
      // Inverter o status atual do plano
      await trainingService.updateTrainingPlanStatus(plan.id, !plan.is_active);
      await loadTrainingPlans();
      showSuccess(
        plan.is_active
          ? t("workouts.planDeactivated")
          : t("workouts.planActivated")
      );
    } catch (error) {
      showError(t("workouts.togglePlanError"));
    }
  };

  const handleEditPlan = (plan: TrainingPlanResponse) => {
    navigation.navigate("WorkoutSetup", { editPlan: plan });
  };

  if (isLoading) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <VStack flex={1}>
          <Image
            source={require("../../../assets/images/exercises/back.jpg")}
            style={{
              width: "100%",
              height: 200,
              opacity: 0.4,
            }}
            resizeMode="cover"
          />

          <VStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            height={200}
            alignItems="center"
            justifyContent="center"
            bg="rgba(0, 0, 0, 0.3)"
          >
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$3xl"
              fontWeight="$bold"
              textAlign="center"
            >
              {t("workouts.trainingPlans")}
            </Text>
            <Text
              color={FIXED_COLORS.background[100]}
              fontSize="$sm"
              textAlign="center"
              lineHeight="$sm"
              px="$4"
              mt="$2"
            >
              {t("workouts.plansDescription")}
            </Text>
          </VStack>

          <VStack flex={1} justifyContent="center" alignItems="center" p="$6">
            <Spinner size="large" color={FIXED_COLORS.primary[400]} />
            <Text color={FIXED_COLORS.text[400]} fontSize="$md" mt="$4">
              {t("common.loading")}
            </Text>
          </VStack>
        </VStack>
      </SafeContainer>
    );
  }

  if (!trainingPlans || trainingPlans.length === 0) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <VStack flex={1}>
          <Image
            source={require("../../../assets/images/exercises/back.jpg")}
            style={{
              width: "100%",
              height: 200,
              opacity: 0.4,
            }}
            resizeMode="cover"
          />

          <VStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            height={200}
            alignItems="center"
            justifyContent="center"
            bg="rgba(0, 0, 0, 0.3)"
          >
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$3xl"
              fontWeight="$bold"
              textAlign="center"
            >
              {t("workouts.trainingPlans")}
            </Text>
            <Text
              color={FIXED_COLORS.background[100]}
              fontSize="$sm"
              textAlign="center"
              lineHeight="$sm"
              px="$4"
              mt="$2"
            >
              {t("workouts.plansDescription")}
            </Text>
          </VStack>

          <VStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            px="$4"
            pt="$8"
            space="md"
          >
            <Ionicons
              name="document-text-outline"
              size={64}
              color={FIXED_COLORS.text[400]}
            />
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$lg"
              fontWeight="$semibold"
              textAlign="center"
            >
              {t("workouts.noTrainingPlans")}
            </Text>
            <Text
              color={FIXED_COLORS.text[500]}
              fontSize="$sm"
              textAlign="center"
              px="$4"
            >
              {t("workouts.noTrainingPlansDescription")}
            </Text>
          </VStack>
        </VStack>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <VStack flex={1}>
        <TrainingPlanHeader onCreateNewPlan={handleCreateNewPlan} />

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <VStack px="$2" pt="$4" pb="$8" space="md">
            <TrainingPlansList
              plans={trainingPlans}
              onToggleActive={handleToggleActivePlan}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
              onExercisePlay={handleExercisePlay}
            />
          </VStack>
        </ScrollView>
      </VStack>

      <DeletePlanModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeletePlan}
        planName={planToDelete?.name || ""}
        isDeleting={isDeleting}
      />
    </SafeContainer>
  );
};
