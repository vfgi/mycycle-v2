import React from "react";
import { ImageBackground, ScrollView } from "react-native";
import {
  VStack,
  HStack,
  Text,
  Box,
  Pressable,
  Switch,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CustomDrawer } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useUnits } from "../../../../contexts/UnitsContext";
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

interface MealDetailsDrawerProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  showActions?: boolean;
  onToggleActive?: () => void;
  onDelete?: () => void;
}

export const MealDetailsDrawer: React.FC<MealDetailsDrawerProps> = ({
  meal,
  isOpen,
  onClose,
  showActions = false,
  onToggleActive,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();

  if (!meal) return null;

  const proteinConverted = convertMacronutrient(meal.protein || 0);
  const carbsConverted = convertMacronutrient(meal.carbs || 0);
  const fatConverted = convertMacronutrient(meal.fat || 0);
  const unit = getMacroUnit();

  const getMealTypeIcon = () => {
    switch (meal.meal_type) {
      case "breakfast":
        return "sunny-outline";
      case "lunch":
        return "restaurant-outline";
      case "dinner":
        return "moon-outline";
      case "snack":
        return "cafe-outline";
      default:
        return "restaurant-outline";
    }
  };

  const getMealTypeLabel = () => {
    return t(`nutrition.meals.types.${meal.meal_type}`);
  };

  const getDifficultyColor = () => {
    switch (meal.difficulty) {
      case "easy":
        return FIXED_COLORS.success[500];
      case "medium":
        return FIXED_COLORS.warning[500];
      case "hard":
        return FIXED_COLORS.error[500];
      default:
        return FIXED_COLORS.text[400];
    }
  };

  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose} minHeight={650}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        <VStack space="lg">
          {/* Header com imagem */}
          <Box borderRadius="$lg" overflow="hidden">
            <ImageBackground
              source={getMealImage(meal.meal_type)}
              style={{
                width: "100%",
                height: 200,
                justifyContent: "flex-end",
              }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />

              <VStack p="$4" space="xs">
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name={getMealTypeIcon()}
                    size={18}
                    color={FIXED_COLORS.text[50]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$sm"
                    fontWeight="$medium"
                    opacity={0.9}
                  >
                    {getMealTypeLabel()} • {meal.time}
                  </Text>
                </HStack>

                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {meal.name}
                </Text>

                {meal.description && (
                  <Text
                    color="rgba(255, 255, 255, 0.8)"
                    fontSize="$sm"
                    lineHeight="$sm"
                  >
                    {meal.description}
                  </Text>
                )}
              </VStack>
            </ImageBackground>
          </Box>

          {/* Informações nutricionais */}
          <VStack space="md">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$semibold"
            >
              {t("nutrition.meals.nutritionalInfo")}
            </Text>

            <HStack justifyContent="space-between">
              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                mr="$2"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {meal.calories}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  kcal
                </Text>
              </VStack>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                mx="$1"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$bold"
                >
                  {proteinConverted.value.toFixed(1)}
                  {unit}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.protein")}
                </Text>
              </VStack>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                mx="$1"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$bold"
                >
                  {carbsConverted.value.toFixed(1)}
                  {unit}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.carbs")}
                </Text>
              </VStack>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                ml="$2"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$bold"
                >
                  {fatConverted.value.toFixed(1)}
                  {unit}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.fat")}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Lista de ingredientes */}
          <VStack space="md">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$semibold"
            >
              {t("nutrition.meals.ingredients")} ({meal.ingredients.length})
            </Text>

            <VStack space="sm">
              {meal.ingredients.map((ingredient, index) => {
                const quantityConverted = convertMacronutrient(
                  ingredient.quantity || 0
                );
                const caloriesForQuantity = ingredient.calories_per_unit
                  ? Math.round(
                      (ingredient.calories_per_unit * ingredient.quantity) / 100
                    )
                  : 0;

                return (
                  <HStack
                    key={index}
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$md"
                    p="$3"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <VStack flex={1}>
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$md"
                        fontWeight="$medium"
                      >
                        {ingredient.name}
                      </Text>
                      {ingredient.category && (
                        <Text
                          color={FIXED_COLORS.text[400]}
                          fontSize="$xs"
                          fontWeight="$medium"
                          numberOfLines={1}
                        >
                          {ingredient.category}
                        </Text>
                      )}
                    </VStack>

                    <VStack alignItems="flex-end">
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$sm"
                        fontWeight="$semibold"
                      >
                        {quantityConverted.value.toFixed(1)}
                        {unit}
                      </Text>
                      {caloriesForQuantity > 0 && (
                        <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                          {caloriesForQuantity} kcal
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                );
              })}
            </VStack>
          </VStack>

          {/* Informações de preparo */}
          {(meal.preparation_time || meal.cooking_time || meal.difficulty) && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("nutrition.meals.preparationInfo")}
              </Text>

              <HStack space="md" flexWrap="wrap">
                {meal.preparation_time && (
                  <HStack
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$full"
                    px="$3"
                    py="$2"
                    alignItems="center"
                    space="xs"
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={FIXED_COLORS.text[400]}
                    />
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {meal.preparation_time}min {t("nutrition.meals.prep")}
                    </Text>
                  </HStack>
                )}

                {meal.cooking_time && (
                  <HStack
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$full"
                    px="$3"
                    py="$2"
                    alignItems="center"
                    space="xs"
                  >
                    <Ionicons
                      name="flame-outline"
                      size={16}
                      color={FIXED_COLORS.text[400]}
                    />
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {meal.cooking_time}min {t("nutrition.meals.cooking")}
                    </Text>
                  </HStack>
                )}

                {meal.difficulty && (
                  <HStack
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$full"
                    px="$3"
                    py="$2"
                    alignItems="center"
                    space="xs"
                  >
                    <Box
                      width="$3"
                      height="$3"
                      borderRadius="$full"
                      bg={getDifficultyColor()}
                    />
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t(`nutrition.meals.difficulty.${meal.difficulty}`)}
                    </Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
          )}

          {/* Instruções */}
          {meal.instructions && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("nutrition.meals.instructions")}
              </Text>

              <Box bg={FIXED_COLORS.background[800]} borderRadius="$md" p="$4">
                <Text
                  color={FIXED_COLORS.text[300]}
                  fontSize="$sm"
                  lineHeight="$md"
                >
                  {meal.instructions}
                </Text>
              </Box>
            </VStack>
          )}

          {/* Botões de Ação */}
          {showActions && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("nutrition.meals.actions")}
              </Text>

              <VStack space="sm">
                {/* Switch Ativar/Desativar */}
                <Box
                  bg={FIXED_COLORS.background[800]}
                  borderRadius="$md"
                  p="$4"
                >
                  <HStack alignItems="center" justifyContent="space-between">
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$md"
                      fontWeight="$semibold"
                    >
                      {meal.active
                        ? t("nutrition.meals.deactivate")
                        : t("nutrition.meals.activate")}
                    </Text>
                    <Switch
                      value={meal.active}
                      onValueChange={onToggleActive}
                      size="md"
                      trackColor={{
                        false: FIXED_COLORS.background[600],
                        true: FIXED_COLORS.success[500],
                      }}
                      thumbColor={FIXED_COLORS.text[50]}
                    />
                  </HStack>
                </Box>

                {/* Botão Excluir */}
                <Pressable
                  onPress={onDelete}
                  bg={FIXED_COLORS.error[600]}
                  borderRadius="$md"
                  p="$4"
                >
                  <HStack
                    alignItems="center"
                    space="md"
                    justifyContent="center"
                  >
                    <Ionicons
                      name="trash"
                      size={20}
                      color={FIXED_COLORS.text[50]}
                    />
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$md"
                      fontWeight="$semibold"
                    >
                      {t("nutrition.meals.delete")}
                    </Text>
                  </HStack>
                </Pressable>
              </VStack>
            </VStack>
          )}

          {/* Espaçamento extra no final */}
          <Box height="$4" />
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};
