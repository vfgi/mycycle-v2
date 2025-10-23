import React, { useState, useMemo } from "react";
import {
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  VStack,
  HStack,
  Text,
  Pressable,
  Input,
  InputField,
  Box,
} from "@gluestack-ui/themed";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeContainer, FloatingTextInput, AdBanner } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/useToast";
import { SimpleMealCard } from "./components/meals/SimpleMealCard";
import { MealDetailsDrawer } from "./components/meals/MealDetailsDrawer";
import { mealsService } from "../../services/mealsService";
import { Meal } from "./components/meals/types";

export const MealsManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const isPremium = user?.is_premium || false;
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [maxCalories, setMaxCalories] = useState("");
  const [searchIngredients, setSearchIngredients] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive">(
    "active"
  );

  useFocusEffect(
    React.useCallback(() => {
      loadMeals();
    }, [])
  );

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      // Usar data local ao invés de UTC
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const response = await mealsService.getMealsWithNutrition(todayLocal);
      const data = response?.meals || [];
      const mealsWithDefaults = data.map((meal) => {
        const totals = mealsService.calculateMealTotals(meal);
        const ingredientsWithUnit = meal.ingredients.map((ing) => ({
          ...ing,
          unit: "g" as const,
        }));

        return {
          ...meal,
          ingredients: ingredientsWithUnit,
          active: meal.is_active,
          is_consumed: false,
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat,
          fiber: totals.fiber,
          meal_type: "lunch" as const,
          time: "12:00",
          image: require("../../../assets/images/calculatorcalories.avif"),
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

  // Filtrar refeições baseado no filtro, calorias máximas e ingredientes
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      const matchesFilter =
        (filterStatus === "active" && meal.active) ||
        (filterStatus === "inactive" && !meal.active);

      const matchesCalories = maxCalories
        ? meal.calories <= parseInt(maxCalories)
        : true;

      const matchesIngredients = searchIngredients
        ? meal.ingredients.some((ingredient) =>
            ingredient.name
              .toLowerCase()
              .includes(searchIngredients.toLowerCase())
          )
        : true;

      return matchesFilter && matchesCalories && matchesIngredients;
    });
  }, [meals, filterStatus, maxCalories, searchIngredients]);

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDrawerOpen(true);
  };

  const handleToggleActive = async (mealId: string) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      const updatedMeal = await mealsService.updateMealStatus(
        mealId,
        !meal.active
      );

      if (updatedMeal) {
        setMeals((prev) =>
          prev.map((m) =>
            m.id === mealId
              ? {
                  ...m,
                  active: updatedMeal.is_active,
                  is_active: updatedMeal.is_active,
                }
              : m
          )
        );
        showSuccess(
          updatedMeal.is_active
            ? t("nutrition.meals.activatedSuccess")
            : t("nutrition.meals.deactivatedSuccess")
        );
      } else {
        showError(t("nutrition.meals.updateError"));
      }
    } catch (error) {
      console.error("Error updating meal status:", error);
      showError(t("nutrition.meals.updateError"));
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    Alert.alert(
      t("nutrition.meals.deleteTitle"),
      t("nutrition.meals.deleteMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const success = await mealsService.deleteMeal(mealId);

              if (success) {
                setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
                showSuccess(t("nutrition.meals.deleteSuccess"));

                if (selectedMeal?.id === mealId) {
                  handleCloseDrawer();
                }
              } else {
                showError(t("nutrition.meals.deleteError"));
              }
            } catch (error) {
              console.error("Error deleting meal:", error);
              showError(t("nutrition.meals.deleteError"));
            }
          },
        },
      ]
    );
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  const handleEditMeal = (meal: Meal) => {
    navigation.navigate("CreateMeal" as never, { meal } as never);
  };

  const activeMealsCount = useMemo(
    () => meals.filter((meal) => meal.active).length,
    [meals]
  );

  const inactiveMealsCount = useMemo(
    () => meals.filter((meal) => !meal.active).length,
    [meals]
  );

  const filterOptions = [
    {
      key: "active",
      label: t("nutrition.meals.active"),
      count: activeMealsCount,
    },
    {
      key: "inactive",
      label: t("nutrition.meals.inactive"),
      count: inactiveMealsCount,
    },
  ];

  return (
    <>
      <SafeContainer paddingTop={12} paddingBottom={24} paddingHorizontal={12}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <VStack space="lg">
                {/* Ad Banner */}
                {!isPremium && (
                  <Box mb="$2">
                    <AdBanner
                      size="BANNER"
                      maxHeight={60}
                      isPremium={isPremium}
                    />
                  </Box>
                )}

                {/* Estatísticas */}
                <HStack justifyContent="space-around">
                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {meals.length}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("nutrition.meals.total")}
                    </Text>
                  </VStack>

                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.success[500]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {activeMealsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("nutrition.meals.active")}
                    </Text>
                  </VStack>

                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.warning[500]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {inactiveMealsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("nutrition.meals.inactive")}
                    </Text>
                  </VStack>
                </HStack>

                {/* Input de Calorias Máximas */}
                <Box zIndex={10}>
                  <FloatingTextInput
                    label={t("nutrition.meals.maxCalories")}
                    value={maxCalories}
                    onChangeText={setMaxCalories}
                    keyboardType="numeric"
                    backgroundColor={FIXED_COLORS.background[950]}
                    valueColor={FIXED_COLORS.text[50]}
                    isFocusLabelColor={FIXED_COLORS.primary[500]}
                    isBlurLabelColor={FIXED_COLORS.text[400]}
                    isFocusBorderColor={FIXED_COLORS.primary[500]}
                    isBlurBorderColor={FIXED_COLORS.background[700]}
                    isBlurValueBorderColor={FIXED_COLORS.background[600]}
                  />
                </Box>

                {/* Input de Busca por Ingredientes */}
                <Box zIndex={9}>
                  <FloatingTextInput
                    label={t("nutrition.meals.searchIngredients")}
                    value={searchIngredients}
                    onChangeText={setSearchIngredients}
                    backgroundColor={FIXED_COLORS.background[950]}
                    valueColor={FIXED_COLORS.text[50]}
                    isFocusLabelColor={FIXED_COLORS.primary[500]}
                    isBlurLabelColor={FIXED_COLORS.text[400]}
                    isFocusBorderColor={FIXED_COLORS.primary[500]}
                    isBlurBorderColor={FIXED_COLORS.background[700]}
                    isBlurValueBorderColor={FIXED_COLORS.background[600]}
                  />
                </Box>

                {/* Filtros de Status */}
                <HStack space="sm">
                  {filterOptions.map((option) => (
                    <Pressable
                      key={option.key}
                      onPress={() => setFilterStatus(option.key as any)}
                      bg={
                        filterStatus === option.key
                          ? FIXED_COLORS.primary[600]
                          : FIXED_COLORS.background[800]
                      }
                      borderRadius="$full"
                      px="$4"
                      py="$2"
                      flex={1}
                    >
                      <HStack
                        alignItems="center"
                        justifyContent="center"
                        space="xs"
                      >
                        <Text
                          color={
                            filterStatus === option.key
                              ? FIXED_COLORS.text[50]
                              : FIXED_COLORS.text[400]
                          }
                          fontSize="$sm"
                          fontWeight="$medium"
                          textAlign="center"
                        >
                          {option.label}
                        </Text>
                        <Box
                          bg={
                            filterStatus === option.key
                              ? "rgba(255, 255, 255, 0.2)"
                              : FIXED_COLORS.background[700]
                          }
                          borderRadius="$full"
                          px="$2"
                          py="$1"
                        >
                          <Text
                            color={
                              filterStatus === option.key
                                ? FIXED_COLORS.text[50]
                                : FIXED_COLORS.text[400]
                            }
                            fontSize="$xs"
                            fontWeight="$bold"
                          >
                            {option.count}
                          </Text>
                        </Box>
                      </HStack>
                    </Pressable>
                  ))}
                </HStack>

                {/* Lista de refeições */}
                <VStack space="sm">
                  {filteredMeals.length > 0 ? (
                    filteredMeals.map((meal) => (
                      <SimpleMealCard
                        key={meal.id}
                        meal={meal}
                        onPress={() => handleMealPress(meal)}
                        onToggleActive={() => handleToggleActive(meal.id)}
                        onDelete={() => handleDeleteMeal(meal.id)}
                        onEdit={() => handleEditMeal(meal)}
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
                        name="restaurant-outline"
                        size={48}
                        color={FIXED_COLORS.text[400]}
                      />
                      <Text
                        color={FIXED_COLORS.text[400]}
                        fontSize="$lg"
                        fontWeight="$medium"
                        textAlign="center"
                      >
                        {maxCalories || searchIngredients
                          ? t("nutrition.meals.noResultsFound")
                          : t("nutrition.meals.noMealsFound")}
                      </Text>
                    </VStack>
                  )}
                </VStack>
              </VStack>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeContainer>

      <MealDetailsDrawer
        meal={selectedMeal}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        showActions={true}
        onToggleActive={() =>
          selectedMeal && handleToggleActive(selectedMeal.id)
        }
        onDelete={() => selectedMeal && handleDeleteMeal(selectedMeal.id)}
      />
    </>
  );
};
