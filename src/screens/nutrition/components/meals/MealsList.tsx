import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { MealCard } from "./MealCard";
import { MealDetailsDrawer } from "./MealDetailsDrawer";
import { mealsService } from "../../../../services/mealsService";
import { mealsHistoryService } from "../../../../services/mealsHistoryService";
import { useToast } from "../../../../hooks/useToast";
import { useAuth } from "../../../../contexts/AuthContext";
import { Meal } from "./types";

// Função para obter a imagem baseada no tipo de refeição
const getMealImage = (mealType: string) => {
  switch (mealType) {
    case "breakfast":
      return require("../../../../../assets/images/food/breakfast.jpg");
    case "lunch":
      return require("../../../../../assets/images/food/lunch.jpg");
    case "dinner":
      return require("../../../../../assets/images/food/dinner.jpg");
    case "snack":
      return require("../../../../../assets/images/food/snacks.jpg");
    default:
      return require("../../../../../assets/images/food/lunch.jpg");
  }
};

interface MealsListProps {
  onViewAll?: () => void;
  onMealConsumptionChange?: () => void;
}

export const MealsList: React.FC<MealsListProps> = ({
  onViewAll,
  onMealConsumptionChange,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
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

      // Usar data local do dispositivo em vez de UTC
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const response = await mealsService.getMealsWithNutrition(todayLocal);
      const data = response?.meals || [];

      if (!data || !Array.isArray(data)) {
        setMeals([]);
        return;
      }

      const mealsWithDefaults = data.map((meal) => {
        const totals = mealsService.calculateMealTotals(meal);

        // Verificar se foi consumida hoje baseada no last_consumed_at
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
          fiber: totals.fiber,
          meal_type: "lunch" as const,
          time: "12:00",
          image: getMealImage("lunch"),
          ingredients: meal.ingredients.map((ingredient) => ({
            ...ingredient,
            unit: "g", // Default unit
          })),
        };
      });
      setMeals(mealsWithDefaults);
    } catch (error) {
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

  const handleToggleConsumed = async (mealId: string) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      const now = new Date();
      // Usar data local do dispositivo
      const todayLocal = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (!meal.is_consumed) {
        // Adicionar ao histórico
        const nutritionData = {
          total_calories: meal.calories || 0,
          total_protein: meal.protein || 0,
          total_carbs: meal.carbs || 0,
          total_fat: meal.fat || 0,
          total_fiber: 0, // Não temos este dado no tipo Meal
          total_sodium: 0, // Não temos este dado
          total_sugar: 0, // Não temos este dado
          ingredients:
            meal.ingredients?.map((ingredient) => ({
              name: ingredient.name,
              quantity: ingredient.quantity || 0,
              unit: ingredient.unit || "g",
              calories:
                (ingredient.calories_per_unit || 0) *
                (ingredient.quantity || 0),
              protein:
                (ingredient.protein_per_unit || 0) * (ingredient.quantity || 0),
              carbs:
                (ingredient.carbs_per_unit || 0) * (ingredient.quantity || 0),
              fat: (ingredient.fat_per_unit || 0) * (ingredient.quantity || 0),
            })) || [],
        };

        // Criar ISO string com a data/hora local (não UTC)
        const localISOString = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        ).toISOString();

        const mealPayload = {
          meal_id: mealId,
          recorded_at: localISOString,
          timezone,
          nutrition_data: nutritionData,
          notes: `${meal.meal_type} - ${meal.name}`,
        };

        await mealsHistoryService.addMealToHistory(mealPayload);

        showSuccess(t("nutrition.meals.addedToHistory"));
      } else {
        // Remover do histórico
        await mealsHistoryService.removeMealFromHistory({
          meal_id: mealId,
          date: todayLocal,
          client_id: user?.id,
        });

        showSuccess(t("nutrition.meals.removedFromHistory"));
      }

      // Recarregar dados para obter informações atualizadas
      await loadMeals();

      // Notificar o componente pai para atualizar o gráfico
      if (onMealConsumptionChange) {
        onMealConsumptionChange();
      }
    } catch (error) {
      showError(t("nutrition.meals.toggleError"));
    }
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
