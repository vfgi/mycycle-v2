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
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import {
  workoutsService,
  WorkoutSession,
} from "../../services/workoutsService";
import { useToast } from "../../hooks/useToast";
import { ExerciseCard } from "./components/ExerciseCard";

export const AllWorkoutsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showError } = useToast();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const workoutsData = await workoutsService.getWorkouts();
      setWorkouts(workoutsData || []);
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
      showError(t("workouts.loadWorkoutsError"));
      setWorkouts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExercisePlay = (exercise: any) => {
    console.log("🎯 [EXERCISE] Playing exercise:", exercise.name);
    // TODO: Implementar navegação para tela de execução do exercício
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const { language } = useTranslation();

    // Mapear idiomas para locales
    const localeMap: { [key: string]: string } = {
      ptBR: "pt-BR",
      ptPT: "pt-PT",
      en: "en-US",
      es: "es-ES",
    };

    const locale = localeMap[language] || "pt-BR";

    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isWorkoutCompleted = (workout: WorkoutSession) => {
    return workout.history && workout.history.length > 0;
  };

  const getLastWorkoutDate = (workout: WorkoutSession) => {
    if (!workout.history || workout.history.length === 0) {
      return t("workouts.neverExecuted");
    }
    const lastDate = workout.history[workout.history.length - 1];
    return formatDate(lastDate);
  };

  if (isLoading) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <VStack flex={1}>
          <Image
            source={require("../../../assets/images/exercises/gym-cardio.jpg")}
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
              {t("workouts.workoutsList")}
            </Text>
            <Text
              color={FIXED_COLORS.background[100]}
              fontSize="$sm"
              textAlign="center"
              lineHeight="$sm"
              px="$4"
              mt="$2"
            >
              {t("workouts.workoutsDescription")}
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

  if (!workouts || workouts.length === 0) {
    return (
      <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
        <VStack flex={1}>
          <Image
            source={require("../../../assets/images/exercises/gym-cardio.jpg")}
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
              {t("workouts.workoutsList")}
            </Text>
            <Text
              color={FIXED_COLORS.background[100]}
              fontSize="$sm"
              textAlign="center"
              lineHeight="$sm"
              px="$4"
              mt="$2"
            >
              {t("workouts.workoutsDescription")}
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
              name="barbell-outline"
              size={64}
              color={FIXED_COLORS.text[400]}
            />
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$lg"
              fontWeight="$semibold"
              textAlign="center"
            >
              {t("workouts.noWorkouts")}
            </Text>
            <Text
              color={FIXED_COLORS.text[500]}
              fontSize="$sm"
              textAlign="center"
              px="$4"
            >
              {t("workouts.noWorkoutsDescription")}
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
          source={require("../../../assets/images/exercises/gym-cardio.jpg")}
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
            {t("workouts.workoutsList")}
          </Text>
          <Text
            color={FIXED_COLORS.background[100]}
            fontSize="$sm"
            textAlign="center"
            lineHeight="$sm"
            px="$4"
            mt="$2"
          >
            {t("workouts.workoutsDescription")}
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
              {(workouts || []).map((workout, workoutIndex) => (
                <AccordionItem
                  key={workout.id}
                  value={`workout-${workout.id}`}
                  bg={FIXED_COLORS.background[800]}
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor={FIXED_COLORS.background[700]}
                  mb="$3"
                >
                  <AccordionHeader>
                    <AccordionTrigger>
                      {({ isExpanded }: { isExpanded: boolean }) => (
                        <HStack flex={1} alignItems="center" space="sm">
                          <Ionicons
                            name={
                              isWorkoutCompleted(workout)
                                ? "checkmark-circle"
                                : "time-outline"
                            }
                            size={20}
                            color={
                              isWorkoutCompleted(workout)
                                ? FIXED_COLORS.success[400]
                                : FIXED_COLORS.primary[400]
                            }
                          />
                          <VStack flex={1} space="xs">
                            <AccordionTitleText
                              color={FIXED_COLORS.text[100]}
                              fontSize="$lg"
                              fontWeight="$bold"
                            >
                              {workout.name}
                            </AccordionTitleText>
                            <HStack alignItems="center" space="md">
                              <Text
                                color={FIXED_COLORS.text[300]}
                                fontSize="$sm"
                                fontWeight="$medium"
                              >
                                {getLastWorkoutDate(workout)}
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
                                {workout.exercises.length}{" "}
                                {t("workouts.exercises")}
                              </Text>
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
                  </AccordionHeader>

                  <AccordionContent>
                    <VStack space="md">
                      {workout.exercises.length > 0 ? (
                        workout.exercises.map((exercise, exerciseIndex) => (
                          <ExerciseCard
                            key={exercise.id || exerciseIndex}
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
                            onPlayPress={() => handleExercisePlay(exercise)}
                          />
                        ))
                      ) : (
                        <VStack
                          alignItems="center"
                          justifyContent="center"
                          py="$8"
                          space="md"
                        >
                          <Ionicons
                            name="barbell-outline"
                            size={48}
                            color={FIXED_COLORS.text[400]}
                          />
                          <Text
                            color={FIXED_COLORS.text[400]}
                            fontSize="$md"
                            textAlign="center"
                          >
                            {t("workouts.noExercisesInWorkout")}
                          </Text>
                        </VStack>
                      )}
                    </VStack>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </VStack>
        </ScrollView>
      </VStack>
    </SafeContainer>
  );
};
