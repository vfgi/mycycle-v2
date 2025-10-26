import React from "react";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import { FloatingTextInput } from "../../../components";
import { SelectedIngredient } from "../../../schemas/mealSchema";

interface SelectedIngredientCardProps {
  ingredient: SelectedIngredient;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const SelectedIngredientCard: React.FC<SelectedIngredientCardProps> = ({
  ingredient,
  onUpdateQuantity,
  onRemove,
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit, unitSystem } = useUnits();

  const convertedQuantity = convertMacronutrient(ingredient.quantity || 0);
  const [localValue, setLocalValue] = React.useState(
    convertedQuantity.value.toString()
  );

  React.useEffect(() => {
    const converted = convertMacronutrient(ingredient.quantity || 0);
    setLocalValue(converted.value.toString());
  }, [ingredient.quantity, unitSystem, convertMacronutrient]);

  const convertToMetric = (value: number): number => {
    if (unitSystem === "imperial") {
      return Math.round((value / 0.035274) * 100) / 100;
    }
    return value;
  };

  const handleQuantityChange = (value: string) => {
    setLocalValue(value);

    if (value === "" || value === "0") {
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      const metricValue = convertToMetric(numValue);
      onUpdateQuantity(metricValue);
    }
  };

  const handleBlur = () => {
    if (localValue === "" || localValue === "0") {
      const defaultMetricValue = 100;
      const defaultDisplayValue = convertMacronutrient(defaultMetricValue);
      setLocalValue(defaultDisplayValue.value.toString());
      onUpdateQuantity(defaultMetricValue);
    }
  };

  // Mostrar valores por 100g do template (sem multiplicar pela quantidade)
  const baseCalories =
    ingredient.template?.calories || ingredient.calories || 0;
  const baseProtein = ingredient.template?.protein || ingredient.protein || 0;
  const baseCarbs = ingredient.template?.carbs || ingredient.carbs || 0;
  const baseFat = ingredient.template?.fat || ingredient.fat || 0;

  // Converter para unidade atual (gramas por padrão)
  const proteinConverted = convertMacronutrient(baseProtein);
  const carbsConverted = convertMacronutrient(baseCarbs);
  const fatConverted = convertMacronutrient(baseFat);
  const unit = getMacroUnit();

  return (
    <Box
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      p="$4"
      borderWidth={1}
      borderColor={FIXED_COLORS.background[600]}
    >
      <VStack space="md">
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack flex={1} space="xs">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$semibold"
            >
              {ingredient.name}
            </Text>

            {/* Nutritional Info - valores por 100g */}
            <HStack space="md" flexWrap="wrap">
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                {Math.round(baseCalories)} kcal
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                P: {proteinConverted.value.toFixed(1)}
                {unit}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                C: {carbsConverted.value.toFixed(1)}
                {unit}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                G: {fatConverted.value.toFixed(1)}
                {unit}
              </Text>
            </HStack>
          </VStack>

          {/* Remove Button */}
          <Pressable
            onPress={onRemove}
            bg={FIXED_COLORS.error[600]}
            borderRadius="$full"
            p="$2"
            ml="$3"
          >
            <Ionicons name="trash" size={16} color={FIXED_COLORS.text[50]} />
          </Pressable>
        </HStack>

        {/* Quantity Input */}
        <Box width="40%">
          <FloatingTextInput
            label={`${t("nutrition.meals.quantity")} (${getMacroUnit()})`}
            value={localValue}
            onChangeText={handleQuantityChange}
            onBlur={handleBlur}
            keyboardType="numeric"
            backgroundColor={FIXED_COLORS.background[700]}
            valueColor={FIXED_COLORS.text[50]}
            isFocusLabelColor={FIXED_COLORS.primary[400]}
            isBlurLabelColor={FIXED_COLORS.text[400]}
            isFocusBorderColor={FIXED_COLORS.primary[500]}
            isBlurBorderColor={FIXED_COLORS.background[600]}
            isBlurValueBorderColor={FIXED_COLORS.background[600]}
          />
        </Box>
      </VStack>
    </Box>
  );
};
