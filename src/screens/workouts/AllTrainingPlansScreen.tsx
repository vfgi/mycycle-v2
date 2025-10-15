import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  HStack,
  ScrollView,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  Spinner,
} from "@gluestack-ui/themed";
import { Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import { trainingService } from "../../services/trainingService";
import {
  TrainingPlanResponse,
  Workout,
  TrainingExercise,
} from "../../types/training";
import { useToast } from "../../hooks/useToast";
import { ExerciseCard } from "./components/ExerciseCard";
import { DeletePlanModal } from "./components/DeletePlanModal";

export const AllTrainingPlansScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showError, showSuccess } = useToast();
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<TrainingPlanResponse | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTrainingPlans();
  }, []);

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

  const handleExercisePlay = (exercise: any) => {
    console.log("🎯 [EXERCISE] Playing exercise:", exercise.name);
    // TODO: Implementar navegação para tela de execução do exercício
  };

  const isPlanActive = (plan: TrainingPlanResponse) => {
    return plan.is_active;
  };

  const getTotalExercises = (plan: TrainingPlanResponse) => {
    return plan.workouts.reduce(
      (total: number, workout: Workout) => total + workout.exercises.length,
      0
    );
  };

  const formatWeekDays = (weekDays: string[]) => {
    return weekDays
      .map((day) => t(`workouts.weekDays.${day}`) || day)
      .join(", ");
  };

  const handleDeletePlan = (plan: TrainingPlanResponse) => {
    // Verificar se é o único plano
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

      // Remover o plano da lista local
      setTrainingPlans((prev) =>
        prev.filter((plan) => plan.id !== planToDelete.id)
      );

      showSuccess(t("workouts.planDeletedSuccess"));
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir plano:", error);
      showError(t("workouts.deletePlanError"));
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (isDeleting) return; // Não permitir fechar durante exclusão
    setDeleteModalOpen(false);
    setPlanToDelete(null);
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
        <Image
          source={require("../../../assets/images/exercises/back.jpg")}
          style={{
            width: "100%",
            height: 200,
            opacity: 0.7,
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

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <VStack px="$2" pt="$4" pb="$8" space="md">
            <Accordion
              size="md"
              variant="unfilled"
              type="multiple"
              isCollapsible={true}
              isDisabled={false}
            >
              {(trainingPlans || []).map((plan, planIndex) => (
                <AccordionItem
                  key={plan.id}
                  value={`plan-${plan.id}`}
                  bg={FIXED_COLORS.background[800]}
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor={FIXED_COLORS.background[700]}
                  mb="$3"
                >
                  <AccordionHeader>
                    <HStack flex={1} alignItems="center">
                      <AccordionTrigger flex={1}>
                        {({ isExpanded }: { isExpanded: boolean }) => (
                          <HStack flex={1} alignItems="center" space="sm">
                            <Ionicons
                              name={
                                isPlanActive(plan)
                                  ? "checkmark-circle"
                                  : "pause-circle-outline"
                              }
                              size={20}
                              color={
                                isPlanActive(plan)
                                  ? FIXED_COLORS.success[400]
                                  : FIXED_COLORS.warning[400]
                              }
                            />
                            <VStack flex={1} space="xs">
                              <AccordionTitleText
                                color={FIXED_COLORS.text[100]}
                                fontSize="$lg"
                                fontWeight="$bold"
                              >
                                {plan.name}
                              </AccordionTitleText>
                              <HStack alignItems="center" space="md">
                                <Text
                                  color={FIXED_COLORS.text[300]}
                                  fontSize="$sm"
                                  fontWeight="$medium"
                                >
                                  {plan.workouts.length}{" "}
                                  {t("workouts.workouts")}
                                </Text>
                                <Text
                                  color={FIXED_COLORS.text[400]}
                                  fontSize="$sm"
                                >
                                  •
                                </Text>
                                <Text
                                  color={FIXED_COLORS.text[300]}
                                  fontSize="$sm"
                                  fontWeight="$medium"
                                >
                                  {getTotalExercises(plan)}{" "}
                                  {t("workouts.exercises")}
                                </Text>
                                {plan.description && (
                                  <>
                                    <Text
                                      color={FIXED_COLORS.text[400]}
                                      fontSize="$sm"
                                    >
                                      •
                                    </Text>
                                    <Text
                                      color={FIXED_COLORS.text[400]}
                                      fontSize="$sm"
                                      numberOfLines={1}
                                    >
                                      {plan.description}
                                    </Text>
                                  </>
                                )}
                              </HStack>
                            </VStack>
                            <Ionicons
                              name={isExpanded ? "chevron-up" : "chevron-down"}
                              size={20}
                              color={FIXED_COLORS.text[400]}
                            />
                          </HStack>
                        )}
                      </AccordionTrigger>

                      {/* Botão de exclusão fora do trigger */}
                      <Pressable
                        onPress={() => handleDeletePlan(plan)}
                        style={{
                          padding: 8,
                          paddingRight: 18,
                          borderRadius: 6,
                        }}
                        hitSlop={{
                          top: 10,
                          bottom: 10,
                          left: 10,
                          right: 10,
                        }}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={FIXED_COLORS.error[400]}
                        />
                      </Pressable>
                    </HStack>
                  </AccordionHeader>

                  <AccordionContent>
                    <VStack space="lg" px="$1">
                      {plan.workouts.map(
                        (workout: Workout, workoutIndex: number) => (
                          <VStack key={workoutIndex} space="sm">
                            {/* Cabeçalho do treino */}
                            <VStack space="xs" px="$1">
                              <HStack alignItems="center" space="sm">
                                <Ionicons
                                  name="calendar-outline"
                                  size={14}
                                  color={FIXED_COLORS.text[400]}
                                />
                                <Text
                                  color={FIXED_COLORS.text[400]}
                                  fontSize="$sm"
                                >
                                  {formatWeekDays(workout.weekDays)}
                                </Text>
                              </HStack>
                              <HStack alignItems="center" space="sm">
                                <Ionicons
                                  name="fitness"
                                  size={16}
                                  color={FIXED_COLORS.primary[400]}
                                />
                                <Text
                                  color={FIXED_COLORS.text[200]}
                                  fontSize="$md"
                                  fontWeight="$bold"
                                >
                                  {workout.name}
                                </Text>
                                <Text
                                  color={FIXED_COLORS.text[400]}
                                  fontSize="$sm"
                                >
                                  • {workout.exercises.length}{" "}
                                  {t("workouts.exercises")}
                                </Text>
                              </HStack>
                            </VStack>

                            {/* Lista de exercícios do treino */}
                            <VStack space="md">
                              {workout.exercises.map(
                                (
                                  exercise: TrainingExercise,
                                  exerciseIndex: number
                                ) => (
                                  <ExerciseCard
                                    key={exerciseIndex}
                                    exercise={{
                                      name: exercise.name,
                                      muscle_group: exercise.muscle_group,
                                      sets: exercise.sets,
                                      reps: exercise.reps,
                                      weight: exercise.weight,
                                      imageURL: exercise.imageURL,
                                      videoURL: exercise.videoURL,
                                      category: exercise.category || "",
                                      difficulty: exercise.difficulty || "",
                                      equipment: exercise.equipment || "",
                                      order: exercise.order || exerciseIndex,
                                    }}
                                    onPlayPress={() =>
                                      handleExercisePlay(exercise)
                                    }
                                  />
                                )
                              )}
                            </VStack>
                          </VStack>
                        )
                      )}
                    </VStack>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </VStack>
        </ScrollView>
      </VStack>

      {/* Modal de confirmação de exclusão */}
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
