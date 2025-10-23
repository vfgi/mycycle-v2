import React from "react";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useUnits } from "../../../../contexts/UnitsContext";
import { ConsumptionItem } from "./types";

interface ConsumptionItemCardProps {
  item: ConsumptionItem;
  onPress?: () => void;
}

export const ConsumptionItemCard: React.FC<ConsumptionItemCardProps> = ({
  item,
  onPress,
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();

  const getMealTypeLabel = (mealType: ConsumptionItem["mealType"]) => {
    const mealTypeMap = {
      breakfast: t("history.consumption.mealTypes.breakfast"),
      lunch: t("history.consumption.mealTypes.lunch"),
      dinner: t("history.consumption.mealTypes.dinner"),
      snack: t("history.consumption.mealTypes.snack"),
    };
    return mealTypeMap[mealType];
  };

  const getMealTypeColor = (mealType: ConsumptionItem["mealType"]) => {
    const colorMap = {
      breakfast: "#f59e0b",
      lunch: "#10b981",
      dinner: "#6366f1",
      snack: "#ef4444",
    };
    return colorMap[mealType];
  };

  const getBorderColor = (type: ConsumptionItem["type"]) => {
    return type === "supplement" ? "#a855f7" : getMealTypeColor(item.mealType);
  };

  return (
    <Pressable onPress={onPress}>
      <Box
        bg={FIXED_COLORS.background[800]}
        borderRadius="$lg"
        p="$4"
        borderLeftWidth={4}
        borderLeftColor={getBorderColor(item.type)}
      >
        <VStack space="xs">
          <HStack alignItems="center" justifyContent="space-between">
            <VStack flex={1}>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <HStack alignItems="center" space="xs">
                <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                  {item.quantity} {item.unit}
                </Text>
                <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                  • {item.time}
                </Text>
                <Text
                  color={getMealTypeColor(item.mealType)}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  • {getMealTypeLabel(item.mealType)}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  •{" "}
                  {item.type === "meal"
                    ? t("history.consumption.meal")
                    : t("history.consumption.supplement")}
                </Text>
              </HStack>
            </VStack>

            <HStack alignItems="center" space="xs">
              <Ionicons
                name="flame-outline"
                size={12}
                color={FIXED_COLORS.primary[600]}
              />
              <Text
                color={FIXED_COLORS.primary[600]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                {item.calories} kcal
              </Text>
            </HStack>
          </HStack>

          <HStack justifyContent="space-between" mt="$1">
            <Text color={FIXED_COLORS.text[400]} fontSize="$2xs">
              P: {convertMacronutrient(item.protein).value.toFixed(1)}
              {getMacroUnit()}
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$2xs">
              C: {convertMacronutrient(item.carbs).value.toFixed(1)}
              {getMacroUnit()}
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$2xs">
              G: {convertMacronutrient(item.fat).value.toFixed(1)}
              {getMacroUnit()}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default ConsumptionItemCard;
