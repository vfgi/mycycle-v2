import React from "react";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Meal } from "./types";

interface SimpleMealCardProps {
  meal: Meal;
  onPress: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

export const SimpleMealCard: React.FC<SimpleMealCardProps> = ({
  meal,
  onPress,
  onToggleActive,
  onDelete,
}) => {
  const { t } = useTranslation();

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
            <HStack space="xs" ml="$3">
              <Pressable
                onPress={onToggleActive}
                bg={
                  meal.active
                    ? FIXED_COLORS.warning[600]
                    : FIXED_COLORS.success[600]
                }
                borderRadius="$full"
                p="$2"
                borderWidth={meal.active ? 0 : 2}
                borderColor={
                  meal.active ? "transparent" : FIXED_COLORS.success[400]
                }
                shadowColor={
                  meal.active ? "transparent" : FIXED_COLORS.success[600]
                }
                shadowOffset={
                  meal.active
                    ? { width: 0, height: 0 }
                    : { width: 0, height: 2 }
                }
                shadowOpacity={meal.active ? 0 : 0.3}
                shadowRadius={meal.active ? 0 : 4}
                elevation={meal.active ? 0 : 4}
              >
                <Ionicons
                  name={meal.active ? "pause" : "play"}
                  size={16}
                  color={FIXED_COLORS.text[50]}
                />
              </Pressable>

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
                {meal.protein}g
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
                {meal.carbs}g
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
                {meal.fat}g
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
