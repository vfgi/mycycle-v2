import React, { useState, useEffect } from "react";
import { VStack, Text, HStack, Pressable, Spinner } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { WEEK_DAYS, getWeekDayLabel } from "../../../utils/weekDays";
import { EXERCISE_CATEGORIES } from "../data/exerciseCategories";
import { MUSCLE_GROUP_MAPPING } from "../data/muscleGroups";
import { exerciseService } from "../../../services/exerciseService";
import { Exercise } from "../../../types/exercises";
import {
  ExerciseCard,
  ExercisePreviewModal,
  SelectedExerciseItem,
} from "../components";

interface Step2ExerciseSelectionProps {
  selectedDays: string[];
  selectedExercises: Record<string, string[]>; // day -> exercise categories
  selectedWorkoutExercises: Record<string, Exercise[]>; // day -> selected exercises
  exerciseConfigs: Record<
    string,
    { sets: string; reps: string; weight: string }
  >;
  onExercisesChange: (day: string, categories: string[]) => void;
  onWorkoutExercisesChange: (day: string, exercises: Exercise[]) => void;
  onUpdateSets: (exerciseId: string, sets: string) => void;
  onUpdateReps: (exerciseId: string, reps: string) => void;
  onUpdateWeight: (exerciseId: string, weight: string) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

export const Step2ExerciseSelection: React.FC<Step2ExerciseSelectionProps> = ({
  selectedDays,
  selectedExercises,
  selectedWorkoutExercises,
  exerciseConfigs,
  onExercisesChange,
  onWorkoutExercisesChange,
  onUpdateSets,
  onUpdateReps,
  onUpdateWeight,
  onRemoveExercise,
}) => {
  const { t } = useTranslation();
  const [currentDay, setCurrentDay] = useState(selectedDays[0] || "");
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [selectedExercisePreview, setSelectedExercisePreview] =
    useState<Exercise | null>(null);
  const [swappingExercise, setSwappingExercise] = useState<Exercise | null>(
    null
  );

  // Limpar estados quando o dia muda
  useEffect(() => {
    setFilteredCategory(null);
    setSwappingExercise(null);
    setSelectedExercisePreview(null);
  }, [currentDay]);

  const handleCategoryToggle = (category: string) => {
    const currentCategories = selectedExercises[currentDay] || [];

    // Se a categoria já está selecionada, deseleciona
    if (currentCategories.includes(category)) {
      const newCategories = currentCategories.filter((cat) => cat !== category);
      onExercisesChange(currentDay, newCategories);
    } else {
      // Se não está selecionada, seleciona apenas esta (remove outras)
      onExercisesChange(currentDay, [category]);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setFilteredCategory(category);
    // Automaticamente seleciona apenas este músculo (remove outros)
    onExercisesChange(currentDay, [category]);

    // Buscar exercícios da API
    await fetchExercisesForMuscleGroup(category);
  };

  const fetchExercisesForMuscleGroup = async (category: string) => {
    try {
      setIsLoadingExercises(true);
      const muscleGroup = MUSCLE_GROUP_MAPPING[category];
      if (muscleGroup) {
        const response = await exerciseService.getExercisesByMuscleGroup(
          muscleGroup,
          50
        );
        setAvailableExercises(response.exercises);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setAvailableExercises([]);
    } finally {
      setIsLoadingExercises(false);
    }
  };

  const handleClearFilter = () => {
    setFilteredCategory(null);
    setAvailableExercises([]);
  };

  const handleExerciseToggle = (exercise: Exercise) => {
    // Se estamos em modo de troca, substituir o exercício
    if (swappingExercise) {
      handleReplaceExercise(exercise);
      return;
    }

    const currentExercises = selectedWorkoutExercises[currentDay] || [];
    const isSelected = currentExercises.some((ex) => ex.id === exercise.id);

    let newExercises: Exercise[];
    if (isSelected) {
      newExercises = currentExercises.filter((ex) => ex.id !== exercise.id);
    } else {
      newExercises = [...currentExercises, exercise];
    }

    onWorkoutExercisesChange(currentDay, newExercises);
  };

  const isExerciseSelected = (exercise: Exercise) => {
    const currentExercises = selectedWorkoutExercises[currentDay] || [];
    return currentExercises.some((ex) => ex.id === exercise.id);
  };

  const handleExercisePreview = (exercise: Exercise) => {
    setSelectedExercisePreview(exercise);
  };

  const handleUpdateSetsLocal = (exerciseId: string, sets: string) => {
    onUpdateSets(exerciseId, sets);
  };

  const handleUpdateRepsLocal = (exerciseId: string, reps: string) => {
    onUpdateReps(exerciseId, reps);
  };

  const handleUpdateWeightLocal = (exerciseId: string, weight: string) => {
    onUpdateWeight(exerciseId, weight);
  };

  const handleRemoveExercise = (exercise: Exercise) => {
    const currentExercises = selectedWorkoutExercises[currentDay] || [];
    const updatedExercises = currentExercises.filter(
      (ex) => ex.id !== exercise.id
    );
    onWorkoutExercisesChange(currentDay, updatedExercises);

    // Remove config using parent function
    onRemoveExercise(exercise.id);
  };

  const handleSwapExercise = (exercise: Exercise) => {
    setSwappingExercise(exercise);
    // Filtrar pelo mesmo grupo muscular
    const muscleGroup =
      MUSCLE_GROUP_MAPPING[exercise.muscle_group] || exercise.muscle_group;
    handleCategoryFilter(muscleGroup);
  };

  const handleReplaceExercise = (newExercise: Exercise) => {
    if (!swappingExercise) return;

    const currentExercises = selectedWorkoutExercises[currentDay] || [];
    const exerciseIndex = currentExercises.findIndex(
      (ex) => ex.id === swappingExercise.id
    );

    if (exerciseIndex !== -1) {
      const updatedExercises = [...currentExercises];
      updatedExercises[exerciseIndex] = newExercise;
      onWorkoutExercisesChange(currentDay, updatedExercises);

      // Preserve configurations if they exist
      const oldConfig = exerciseConfigs[swappingExercise.id];
      if (oldConfig) {
        onUpdateSets(newExercise.id, oldConfig.sets);
        onUpdateReps(newExercise.id, oldConfig.reps);
        onUpdateWeight(newExercise.id, oldConfig.weight);
        onRemoveExercise(swappingExercise.id);
      }
    }

    setSwappingExercise(null);
    setFilteredCategory(null);
  };

  const getFilteredCategories = () => {
    if (filteredCategory) {
      return EXERCISE_CATEGORIES.filter((cat) => cat.key === filteredCategory);
    }
    return EXERCISE_CATEGORIES;
  };

  const isCategorySelected = (category: string) => {
    return selectedExercises[currentDay]?.includes(category) || false;
  };

  const getCurrentDayLabel = () => {
    return getWeekDayLabel(currentDay, t);
  };

  const isAllDaysCompleted = () => {
    return selectedDays.every(
      (day) => selectedExercises[day] && selectedExercises[day].length > 0
    );
  };

  return (
    <VStack space="lg">
      <VStack space="md">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$semibold"
        >
          {t("workoutSetup.selectExercises")}
        </Text>
        <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
          {t("workoutSetup.selectExercisesDescription")}
        </Text>
      </VStack>

      {/* Day Selector */}
      <VStack space="sm">
        <Text
          color={FIXED_COLORS.text[400]}
          fontSize="$sm"
          fontWeight="$semibold"
        >
          {t("workoutSetup.selectDay")}
        </Text>
        <HStack space="xs" flexWrap="wrap">
          {selectedDays.map((day) => {
            const dayInfo = WEEK_DAYS.find((d) => d.key === day);
            const isSelected = currentDay === day;
            const isCompleted =
              selectedExercises[day] && selectedExercises[day].length > 0;

            return (
              <Pressable
                key={day}
                onPress={() => setCurrentDay(day)}
                bg={
                  isSelected
                    ? FIXED_COLORS.primary[600]
                    : isCompleted
                    ? FIXED_COLORS.success[600]
                    : FIXED_COLORS.background[700]
                }
                borderRadius="$lg"
                px="$3"
                py="$2"
              >
                <HStack alignItems="center" space="xs">
                  <Text
                    color={
                      isSelected || isCompleted
                        ? FIXED_COLORS.text[950]
                        : FIXED_COLORS.text[300]
                    }
                    fontSize="$sm"
                    fontWeight="$medium"
                  >
                    {dayInfo ? t(dayInfo.labelKey) : day}
                  </Text>
                  {isCompleted && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={FIXED_COLORS.text[950]}
                    />
                  )}
                </HStack>
              </Pressable>
            );
          })}
        </HStack>
      </VStack>

      {/* Current Day Title */}
      {currentDay && (
        <VStack space="sm">
          <HStack justifyContent="space-between" alignItems="center">
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                {getCurrentDayLabel()}
              </Text>
              <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                {filteredCategory
                  ? t("workoutSetup.selectedMuscleGroup")
                  : t("workoutSetup.selectMuscleGroups")}
              </Text>
            </VStack>
            {filteredCategory && (
              <Pressable
                onPress={handleClearFilter}
                bg={FIXED_COLORS.primary[600]}
                borderRadius="$full"
                p="$2"
              >
                <Ionicons
                  name="swap-horizontal"
                  size={20}
                  color={FIXED_COLORS.text[950]}
                />
              </Pressable>
            )}
          </HStack>
        </VStack>
      )}

      {/* Exercise Categories Grid */}
      {currentDay && (
        <VStack space="md">
          <HStack space="md" flexWrap="wrap" justifyContent="space-between">
            {getFilteredCategories().map((category) => (
              <ExerciseCard
                key={category.key}
                id={category.key}
                title={t(category.labelKey)}
                isSelected={
                  isCategorySelected(category.key) ||
                  filteredCategory === category.key
                }
                onPress={() => {
                  if (filteredCategory) {
                    handleCategoryToggle(category.key);
                  } else {
                    handleCategoryFilter(category.key);
                  }
                }}
                imageSource={category.image}
                imageType="local"
                showCheckmark={true}
                cardHeight={140}
                imageHeight={120}
              />
            ))}
          </HStack>
        </VStack>
      )}

      {/* API Exercises Section - Only show when filtered */}
      {filteredCategory && (
        <VStack space="md">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$md"
            fontWeight="$semibold"
          >
            {t("workoutSetup.exercisesForMuscle", {
              muscle: t(`workoutSetup.muscleGroups.${filteredCategory}`),
            })}
          </Text>

          {isLoadingExercises ? (
            <VStack alignItems="center" py="$8">
              <Spinner size="large" color={FIXED_COLORS.primary[600]} />
              <Text color={FIXED_COLORS.text[300]} mt="$2">
                {t("workoutSetup.loadingExercises")}
              </Text>
            </VStack>
          ) : (
            <HStack space="md" flexWrap="wrap" justifyContent="space-between">
              {availableExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  id={exercise.id}
                  title={t(`exercises.${exercise.name}`)}
                  isSelected={isExerciseSelected(exercise)}
                  onPress={() => handleExerciseToggle(exercise)}
                  imageSource={{ uri: exercise.previewImage }}
                  imageType="uri"
                  onPreview={() => handleExercisePreview(exercise)}
                  showPreview={true}
                  showCheckmark={true}
                  cardHeight={180}
                  imageHeight={120}
                />
              ))}
            </HStack>
          )}
        </VStack>
      )}

      {/* Selected Exercises List */}
      {currentDay &&
        selectedWorkoutExercises[currentDay] &&
        selectedWorkoutExercises[currentDay].length > 0 && (
          <VStack space="md">
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("workoutSetup.selectedExercises")}
              </Text>
              <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                {t("workoutSetup.selectedExercisesDescription")}
              </Text>
            </VStack>

            <VStack space="sm">
              {selectedWorkoutExercises[currentDay].map((exercise) => (
                <SelectedExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  onRemove={handleRemoveExercise}
                  onSwap={handleSwapExercise}
                  onUpdateSets={handleUpdateSetsLocal}
                  onUpdateReps={handleUpdateRepsLocal}
                  onUpdateWeight={handleUpdateWeightLocal}
                  sets={exerciseConfigs[exercise.id]?.sets || "3"}
                  reps={exerciseConfigs[exercise.id]?.reps || "12"}
                  weight={exerciseConfigs[exercise.id]?.weight || "0"}
                />
              ))}
            </VStack>
          </VStack>
        )}

      {/* Exercise Preview Modal */}
      <ExercisePreviewModal
        exercise={selectedExercisePreview}
        isOpen={selectedExercisePreview !== null}
        onClose={() => setSelectedExercisePreview(null)}
      />
    </VStack>
  );
};
