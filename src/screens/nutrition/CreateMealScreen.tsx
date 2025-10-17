import React, { useState } from "react";
import {
  VStack,
  Text,
  ScrollView,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeContainer } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useUnits } from "../../contexts/UnitsContext";
import {
  mealSchema,
  MealFormData,
  SelectedIngredient,
} from "../../schemas/mealSchema";
import {
  MealBasicInfoForm,
  NutritionalSummaryCard,
  IngredientsSection,
} from "./components";
import { IngredientTemplate } from "../../services/ingredientsService";
import { mealsService, Ingredient } from "../../services/mealsService";
import { useToast } from "../../hooks/useToast";

export const CreateMealScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const { unitSystem } = useUnits();
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      meal_type: undefined,
      description: "",
    },
  });

  const selectedMealType = watch("meal_type");

  const handleAddIngredient = (ingredient: IngredientTemplate) => {
    const exists = selectedIngredients.find((i) => i.id === ingredient.id);
    if (exists) {
      Alert.alert(t("common.error"), "Este ingrediente já foi adicionado");
      return;
    }

    const newIngredient: SelectedIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      calories: ingredient.calories || 0,
      protein: ingredient.protein || 0,
      carbs: ingredient.carbs || 0,
      fat: ingredient.fat || 0,
      fiber: ingredient.fiber || 0,
      sodium: ingredient.sodium || 0,
      quantity: 100,
    };

    setSelectedIngredients([...selectedIngredients, newIngredient]);
  };

  const handleUpdateIngredientQuantity = (id: string, quantity: number) => {
    setSelectedIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, quantity } : ing))
    );
  };

  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const calculateTotals = () => {
    return selectedIngredients.reduce(
      (acc, ing) => {
        const multiplier = (ing.quantity || 0) / 100;
        return {
          calories: acc.calories + (ing.calories || 0) * multiplier,
          protein: acc.protein + (ing.protein || 0) * multiplier,
          carbs: acc.carbs + (ing.carbs || 0) * multiplier,
          fat: acc.fat + (ing.fat || 0) * multiplier,
          fiber: acc.fiber + (ing.fiber || 0) * multiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const onSubmit = async (data: MealFormData) => {
    if (selectedIngredients.length === 0) {
      Alert.alert(t("common.error"), "Adicione pelo menos um ingrediente");
      return;
    }

    setIsSubmitting(true);

    try {
      const ingredients: Ingredient[] = selectedIngredients.map(
        (ing, index) => {
          const multiplier = (ing.quantity || 0) / 100;
          return {
            name: ing.name || "",
            description: "",
            calories: Math.round((ing.calories || 0) * multiplier),
            protein: parseFloat(((ing.protein || 0) * multiplier).toFixed(1)),
            carbs: parseFloat(((ing.carbs || 0) * multiplier).toFixed(1)),
            fat: parseFloat(((ing.fat || 0) * multiplier).toFixed(1)),
            fiber: parseFloat(((ing.fiber || 0) * multiplier).toFixed(1)),
            sodium: ing.sodium
              ? Math.round((ing.sodium || 0) * multiplier)
              : undefined,
            quantity: ing.quantity || 0,
            order: index + 1,
          };
        }
      );

      const payload = {
        name: data.name,
        description: data.description || "",
        ingredients,
      };

      const result = await mealsService.createMeal(payload);

      if (result) {
        showSuccess(t("nutrition.meals.createSuccess"));
        navigation.goBack();
      } else {
        showError(t("nutrition.meals.createError"));
      }
    } catch (error) {
      console.error("❌ Erro ao criar refeição:", error);
      showError(t("nutrition.meals.createError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <SafeContainer paddingTop={12} paddingBottom={0} paddingHorizontal={0}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack space="lg" px="$4">
            {/* Header */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$2xl"
                fontWeight="$bold"
              >
                {t("nutrition.meals.createMeal")}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                {t("nutrition.meals.createMealDescription")}
              </Text>
            </VStack>

            {/* Basic Info Form */}
            <MealBasicInfoForm
              control={control}
              errors={errors}
              selectedMealType={selectedMealType}
              onSelectMealType={(type) => setValue("meal_type", type as any)}
            />

            {/* Nutritional Summary */}
            {selectedIngredients.length > 0 && (
              <NutritionalSummaryCard
                calories={totals.calories}
                protein={totals.protein}
                carbs={totals.carbs}
                fat={totals.fat}
              />
            )}

            {/* Ingredients Section */}
            <IngredientsSection
              selectedIngredients={selectedIngredients}
              onAddIngredient={handleAddIngredient}
              onUpdateQuantity={handleUpdateIngredientQuantity}
              onRemoveIngredient={handleRemoveIngredient}
            />

            {/* Submit Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              bg={FIXED_COLORS.primary[600]}
              borderRadius="$lg"
              size="lg"
              isDisabled={isSubmitting || selectedIngredients.length === 0}
              opacity={
                isSubmitting || selectedIngredients.length === 0 ? 0.5 : 1
              }
            >
              <ButtonText
                color={FIXED_COLORS.text[950]}
                fontWeight="$bold"
                fontSize="$md"
              >
                {isSubmitting
                  ? t("common.loading")
                  : t("nutrition.meals.createMeal")}
              </ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};
