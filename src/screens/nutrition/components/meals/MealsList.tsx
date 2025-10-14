import React, { useState } from "react";
import { VStack, Text, HStack, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { MealCard } from "./MealCard";
import { MealDetailsDrawer } from "./MealDetailsDrawer";
import { getMockDietPlan } from "./mockData";
import { Meal } from "./types";

interface MealsListProps {
  onViewAll?: () => void;
}

export const MealsList: React.FC<MealsListProps> = ({ onViewAll }) => {
  const { t } = useTranslation();
  const [dietPlan, setDietPlan] = useState(getMockDietPlan());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mostrar apenas refeições ativas
  const mealsToShow = dietPlan.meals.filter((meal) => meal.active);

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDrawerOpen(true);
  };

  const handleToggleConsumed = (mealId: string) => {
    setDietPlan((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) =>
        meal.id === mealId ? { ...meal, is_consumed: !meal.is_consumed } : meal
      ),
    }));
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

      <MealDetailsDrawer
        meal={selectedMeal}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </VStack>
  );
};
