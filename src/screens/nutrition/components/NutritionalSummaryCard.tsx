import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";

interface NutritionalSummaryCardProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const NutritionalSummaryCard: React.FC<NutritionalSummaryCardProps> = ({
  calories,
  protein,
  carbs,
  fat,
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();

  const proteinConverted = convertMacronutrient(protein);
  const carbsConverted = convertMacronutrient(carbs);
  const fatConverted = convertMacronutrient(fat);
  const unit = getMacroUnit();

  return (
    <Box
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      p="$4"
      borderWidth={1}
      borderColor={FIXED_COLORS.primary[600]}
    >
      <VStack space="md">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$semibold"
        >
          {t("nutrition.meals.nutritionalSummary")}
        </Text>

        <HStack justifyContent="space-between" flexWrap="wrap">
          <VStack alignItems="center" width="23%">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
            >
              {Math.round(calories)}
            </Text>
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$xs"
              textAlign="center"
            >
              kcal
            </Text>
          </VStack>

          <VStack alignItems="center" width="23%">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$bold"
            >
              {proteinConverted.value.toFixed(1)}
              {unit}
            </Text>
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$xs"
              textAlign="center"
            >
              {t("nutrition.food.nutrients.protein")}
            </Text>
          </VStack>

          <VStack alignItems="center" width="23%">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$bold"
            >
              {carbsConverted.value.toFixed(1)}
              {unit}
            </Text>
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$xs"
              textAlign="center"
            >
              {t("nutrition.food.nutrients.carbs")}
            </Text>
          </VStack>

          <VStack alignItems="center" width="23%">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$bold"
            >
              {fatConverted.value.toFixed(1)}
              {unit}
            </Text>
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$xs"
              textAlign="center"
            >
              {t("nutrition.food.nutrients.fat")}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};
