import React, { useState, useMemo } from "react";
import { ScrollView } from "react-native";
import { VStack, Text, HStack, Pressable, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { MealCard } from "./MealCard";
import { MealDetailsDrawer } from "./MealDetailsDrawer";
import { mealsService } from "../../../../services/mealsService";
import { Meal } from "./types";
import {
  getMealImageForType,
  normalizeMealType,
  sortMealsByLocalTimeOfDay,
} from "../../utils/mealPresentation";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface AllMealsScreenProps {
  onBack: () => void;
}

export const AllMealsScreen: React.FC<AllMealsScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const mealPlan = await mealsService.getMealsPlans();
      console.log("[meals-plans]", mealPlan);

      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const response = await mealsService.getMealsWithNutrition(todayLocal);
      const data = response?.meals || [];
      const mapped: Meal[] = data.map((meal) => {
        const totals = mealsService.calculateMealTotals(meal);
        const mealType = normalizeMealType(meal.meal_type);
        const scheduled =
          meal.scheduled_time ??
          (meal as { time?: string }).time ??
          "";
        const isConsumedToday = meal.last_consumed_at
          ? meal.last_consumed_at.split("T")[0] === todayLocal
          : false;
        return {
          ...meal,
          active: meal.is_active,
          is_consumed: isConsumedToday,
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat,
          meal_type: mealType,
          time: scheduled,
          scheduled_time: meal.scheduled_time,
          image: getMealImageForType(mealType),
          ingredients: meal.ingredients.map((ing) => ({
            ...ing,
            unit: "g" as const,
          })),
        };
      });
      setMeals(mapped);
    } catch (error) {
      console.error("Error loading meals:", error);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDrawerOpen(true);
  };

  const handleToggleConsumed = () => {
    // Noop - API não suporta toggle de consumo local
  };

  const handleToggleActive = (mealId: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId ? { ...meal, active: !meal.active } : meal
      )
    );
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  const sortedMeals = useMemo(
    () => sortMealsByLocalTimeOfDay(meals),
    [meals]
  );
  const activeMeals = sortedMeals.filter((meal) => meal.active);
  const inactiveMeals = sortedMeals.filter((meal) => !meal.active);

  return (
    <ScreenContainer>
      <VStack flex={1} space="lg">
        {/* Header */}
        <HStack alignItems="center" space="md" p="$4" pb="$0">
          <Pressable onPress={onBack}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={FIXED_COLORS.text[50]}
            />
          </Pressable>
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$xl"
            fontWeight="$bold"
            flex={1}
          >
            {t("nutrition.meals.allMeals")}
          </Text>
        </HStack>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <VStack space="lg" p="$4" pt="$0">
            {/* Refeições Ativas */}
            {activeMeals.length > 0 && (
              <VStack space="md">
                <HStack alignItems="center" space="xs">
                  <Box
                    width="$3"
                    height="$3"
                    borderRadius="$full"
                    bg={FIXED_COLORS.success[500]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$lg"
                    fontWeight="$semibold"
                  >
                    {t("nutrition.meals.activeMeals")} ({activeMeals.length})
                  </Text>
                </HStack>

                <VStack space="sm">
                  {activeMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onPress={() => handleMealPress(meal)}
                      onToggleConsumed={handleToggleConsumed}
                    />
                  ))}
                </VStack>
              </VStack>
            )}

            {/* Refeições Inativas */}
            {inactiveMeals.length > 0 && (
              <VStack space="md">
                <HStack alignItems="center" space="xs">
                  <Box
                    width="$3"
                    height="$3"
                    borderRadius="$full"
                    bg={FIXED_COLORS.text[400]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$lg"
                    fontWeight="$semibold"
                  >
                    {t("nutrition.meals.inactiveMeals")} ({inactiveMeals.length}
                    )
                  </Text>
                </HStack>

                <VStack space="sm">
                  {inactiveMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onPress={() => handleMealPress(meal)}
                      onToggleConsumed={handleToggleConsumed}
                    />
                  ))}
                </VStack>
              </VStack>
            )}
          </VStack>
        </ScrollView>

        <MealDetailsDrawer
          meal={selectedMeal}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          showActions={true}
          onToggleActive={
            selectedMeal ? () => handleToggleActive(selectedMeal.id) : undefined
          }
          onDelete={
            selectedMeal ? () => handleDeleteMeal(selectedMeal.id) : undefined
          }
        />
      </VStack>
    </ScreenContainer>
  );
};
