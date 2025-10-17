import React, { useState, useEffect } from "react";
import { VStack, Text, HStack, Pressable, Button, ButtonText } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { MealCard } from "./MealCard";
import { MealDetailsDrawer } from "./MealDetailsDrawer";
import { mealsService } from "../../../../services/mealsService";
import { Meal } from "./types";

interface MealsListProps {
  onViewAll?: () => void;
}

export const MealsList: React.FC<MealsListProps> = ({ onViewAll }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadMeals();
    }, [])
  );

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const data = await mealsService.getMeals();
      const mealsWithDefaults = data.map((meal) => {
        const totals = mealsService.calculateMealTotals(meal);
        return {
          ...meal,
          active: true,
          is_consumed: false,
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat,
          fiber: totals.fiber,
          meal_type: "lunch",
          time: "12:00",
          image: require("../../../../../assets/images/calculatorcalories.avif"),
        };
      });
      setMeals(mealsWithDefaults);
    } catch (error) {
      console.error("Error loading meals:", error);
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const mealsToShow = meals.filter((meal) => meal.active);

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDrawerOpen(true);
  };

  const handleToggleConsumed = (mealId: string) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.id === mealId ? { ...meal, is_consumed: !meal.is_consumed } : meal
      )
    );
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  return (
    <VStack space="md">
      <HStack justifyContent="space-between" alignItems="center">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$semibold"
        >
          {t("nutrition.meals.meals")}
        </Text>

        <HStack space="md" alignItems="center">
          {/* Create Meal Button */}
          <Button
            onPress={() => navigation.navigate("CreateMeal" as never)}
            size="sm"
            bg={FIXED_COLORS.warning[500]}
            borderRadius="$md"
          >
            <HStack alignItems="center" space="xs">
              <Ionicons
                name="add-circle"
                size={16}
                color={FIXED_COLORS.text[950]}
              />
              <ButtonText
                color={FIXED_COLORS.text[950]}
                fontSize="$xs"
                fontWeight="$semibold"
              >
                {t("nutrition.meals.create")}
              </ButtonText>
            </HStack>
          </Button>

          {onViewAll && (
            <Pressable onPress={onViewAll}>
              <HStack alignItems="center" space="xs">
                <Text
                  color={FIXED_COLORS.primary[500]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("nutrition.meals.viewAll")}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={FIXED_COLORS.primary[500]}
                />
              </HStack>
            </Pressable>
          )}
        </HStack>
      </HStack>

      {isLoading ? (
        <VStack space="sm">
          <Text color={FIXED_COLORS.text[400]} textAlign="center">
            {t("common.loading")}
          </Text>
        </VStack>
      ) : mealsToShow.length === 0 ? (
        <VStack space="sm" alignItems="center" py="$8">
          <Ionicons
            name="restaurant-outline"
            size={48}
            color={FIXED_COLORS.text[400]}
          />
          <Text color={FIXED_COLORS.text[400]} textAlign="center">
            {t("nutrition.meals.noMeals")}
          </Text>
        </VStack>
      ) : (
        <VStack space="sm">
          {mealsToShow.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => handleMealPress(meal)}
              onToggleConsumed={() => handleToggleConsumed(meal.id)}
            />
          ))}
        </VStack>
      )}

      <MealDetailsDrawer
        meal={selectedMeal}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </VStack>
  );
};
