import React, { useState, useMemo } from "react";
import { ScrollView } from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { SafeContainer, FloatingTextInput } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SimpleMealCard } from "./components/meals/SimpleMealCard";
import { MealDetailsDrawer } from "./components/meals/MealDetailsDrawer";
import { getMockDietPlan } from "./components/meals/mockData";
import { Meal } from "./components/meals/types";

export const MealsManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [dietPlan, setDietPlan] = useState(getMockDietPlan());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [maxCalories, setMaxCalories] = useState("");
  const [searchIngredients, setSearchIngredients] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive">(
    "active"
  );

  // Filtrar refeições baseado no filtro, calorias máximas e ingredientes
  const filteredMeals = useMemo(() => {
    return dietPlan.meals.filter((meal) => {
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
  }, [dietPlan.meals, filterStatus, maxCalories, searchIngredients]);

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDrawerOpen(true);
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
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  const activeMealsCount = useMemo(
    () => dietPlan.meals.filter((meal) => meal.active).length,
    [dietPlan.meals]
  );

  const inactiveMealsCount = useMemo(
    () => dietPlan.meals.filter((meal) => !meal.active).length,
    [dietPlan.meals]
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeContainer
          paddingTop={12}
          paddingBottom={24}
          paddingHorizontal={12}
        >
          <VStack flex={1} space="lg">
            {/* Estatísticas */}
            <HStack justifyContent="space-around">
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {dietPlan.meals.length}
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
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <VStack space="sm">
                {filteredMeals.length > 0 ? (
                  filteredMeals.map((meal) => (
                    <SimpleMealCard
                      key={meal.id}
                      meal={meal}
                      onPress={() => handleMealPress(meal)}
                      onToggleActive={() => handleToggleActive(meal.id)}
                      onDelete={() => handleDeleteMeal(meal.id)}
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
            </ScrollView>
          </VStack>
        </SafeContainer>
      </TouchableWithoutFeedback>

      <MealDetailsDrawer
        meal={selectedMeal}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
};
