import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Meal } from "./types";

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
  onToggleConsumed: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onPress,
  onToggleConsumed,
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Box
        borderRadius="$lg"
        overflow="hidden"
        mb="$3"
        opacity={meal.is_consumed ? 0.7 : 1}
      >
        <ImageBackground
          source={meal.image}
          style={{
            width: "100%",
            height: 180,
            justifyContent: "flex-end",
          }}
          resizeMode="cover"
        >
          {/* Overlay escuro */}
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

          {/* Botão de consumido */}
          <Pressable
            position="absolute"
            top="$3"
            right="$3"
            onPress={onToggleConsumed}
            bg={
              meal.is_consumed
                ? FIXED_COLORS.success[500]
                : "rgba(0, 0, 0, 0.4)"
            }
            borderRadius="$full"
            p="$3"
            borderWidth={2}
            borderColor={
              meal.is_consumed
                ? FIXED_COLORS.success[400]
                : "rgba(255, 255, 255, 0.6)"
            }
            shadowColor={FIXED_COLORS.background[950]}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.3}
            shadowRadius={4}
            elevation={5}
          >
            <Ionicons
              name={meal.is_consumed ? "checkmark" : "add"}
              size={22}
              color={FIXED_COLORS.text[50]}
            />
          </Pressable>

          {/* Informações da refeição */}
          <VStack p="$4" space="xs">
            <HStack alignItems="center" space="xs" mb="$1">
              <Ionicons
                name={getMealTypeIcon()}
                size={16}
                color={FIXED_COLORS.text[50]}
              />
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$xs"
                fontWeight="$medium"
                opacity={0.8}
              >
                {getMealTypeLabel()} • {meal.time}
              </Text>
            </HStack>

            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
              mb="$2"
            >
              {meal.name}
            </Text>

            {/* Macros */}
            <HStack justifyContent="space-between" alignItems="center">
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$bold"
                >
                  {meal.calories}
                </Text>
                <Text
                  color="rgba(255, 255, 255, 0.8)"
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  kcal
                </Text>
              </VStack>

              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {meal.ingredients.length}
                </Text>
                <Text
                  color="rgba(255, 255, 255, 0.8)"
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.meals.ingredients")}
                </Text>
              </VStack>

              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {meal.protein}g
                </Text>
                <Text
                  color="rgba(255, 255, 255, 0.8)"
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.protein")}
                </Text>
              </VStack>

              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {meal.carbs}g
                </Text>
                <Text
                  color="rgba(255, 255, 255, 0.8)"
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.carbs")}
                </Text>
              </VStack>

              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {meal.fat}g
                </Text>
                <Text
                  color="rgba(255, 255, 255, 0.8)"
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.fat")}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </ImageBackground>
      </Box>
    </TouchableOpacity>
  );
};
