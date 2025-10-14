import React, { useState } from "react";
import { ScrollView } from "react-native";
import { VStack, Text, HStack, Pressable, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { MealCard } from "./MealCard";
import { MealDetailsDrawer } from "./MealDetailsDrawer";
import { getMockDietPlan } from "./mockData";
import { Meal } from "./types";

interface AllMealsScreenProps {
  onBack: () => void;
}

export const AllMealsScreen: React.FC<AllMealsScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [dietPlan, setDietPlan] = useState(getMockDietPlan());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleToggleActive = (mealId: string) => {
    setDietPlan((prev) => ({
      ...prev,
      meals: prev.meals.map((meal) =>
        meal.id === mealId ? { ...meal, active: !meal.active } : meal
      ),
    }));
  };

  const handleDeleteMeal = (mealId: string) => {
    setDietPlan((prev) => ({
      ...prev,
      meals: prev.meals.filter((meal) => meal.id !== mealId),
    }));
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  const activeMeals = dietPlan.meals.filter((meal) => meal.active);
  const inactiveMeals = dietPlan.meals.filter((meal) => !meal.active);

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
                      onToggleConsumed={() => handleToggleConsumed(meal.id)}
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
                      onToggleConsumed={() => handleToggleConsumed(meal.id)}
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
