import React from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Pressable,
  Switch,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useUnits } from "../../../../contexts/UnitsContext";
import { Meal } from "./types";

interface SimpleMealCardProps {
  meal: Meal;
  onPress: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export const SimpleMealCard: React.FC<SimpleMealCardProps> = ({
  meal,
  onPress,
  onToggleActive,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();

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

  return (
    <Pressable onPress={onPress}>
      <Box
        bg={FIXED_COLORS.background[800]}
        borderRadius="$lg"
        p="$4"
        mb="$3"
        borderWidth={1}
        borderColor={
          meal.active ? FIXED_COLORS.success[600] : FIXED_COLORS.warning[600]
        }
      >
        <VStack space="md">
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack flex={1} space="xs">
              <HStack alignItems="center" space="xs">
                <Ionicons
                  name={getMealTypeIcon()}
                  size={16}
                  color={FIXED_COLORS.text[400]}
                />
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {getMealTypeLabel()} • {meal.time}
                </Text>
                {!meal.active && (
                  <Box
                    bg={FIXED_COLORS.warning[600]}
                    borderRadius="$full"
                    px="$2"
                    py="$1"
                  >
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$xs"
                      fontWeight="$medium"
                    >
                      {t("nutrition.meals.inactive")}
                    </Text>
                  </Box>
                )}
              </HStack>

              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$bold"
              >
                {meal.name}
              </Text>

              {meal.description && (
                <Text
                  color={FIXED_COLORS.text[300]}
                  fontSize="$sm"
                  numberOfLines={2}
                >
                  {meal.description}
                </Text>
              )}
            </VStack>

            {/* Botões de ação */}
            <HStack space="md" ml="$3" alignItems="center">
              <HStack space="xs" alignItems="center">
                <Text
                  color={FIXED_COLORS.text[300]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {meal.active
                    ? t("nutrition.meals.active")
                    : t("nutrition.meals.inactive")}
                </Text>
                <Switch
                  value={meal.active}
                  onValueChange={onToggleActive}
                  size="sm"
                  trackColor={{
                    false: FIXED_COLORS.background[600],
                    true: FIXED_COLORS.success[500],
                  }}
                  thumbColor={FIXED_COLORS.text[50]}
                />
              </HStack>

              {onEdit && (
                <Pressable
                  onPress={onEdit}
                  bg={FIXED_COLORS.primary[600]}
                  borderRadius="$full"
                  p="$2"
                >
                  <Ionicons
                    name="create"
                    size={16}
                    color={FIXED_COLORS.text[50]}
                  />
                </Pressable>
              )}

              <Pressable
                onPress={onDelete}
                bg={FIXED_COLORS.error[600]}
                borderRadius="$full"
                p="$2"
              >
                <Ionicons
                  name="trash"
                  size={16}
                  color={FIXED_COLORS.text[50]}
                />
              </Pressable>
            </HStack>
          </HStack>

          {/* Informações nutricionais */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
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

            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {meal.ingredients.length}
              </Text>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                {t("nutrition.meals.ingredients")}
              </Text>
            </VStack>

            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
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

            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
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

            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
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
      </Box>
    </Pressable>
  );
};
