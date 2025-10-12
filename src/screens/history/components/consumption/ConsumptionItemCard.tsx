import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ConsumptionItem } from "./types";

interface ConsumptionItemCardProps {
  item: ConsumptionItem;
}

export const ConsumptionItemCard: React.FC<ConsumptionItemCardProps> = ({
  item,
}) => {
  const { t } = useTranslation();

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

  return (
    <Box
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      p="$3"
      mb="$2"
      borderLeftWidth={4}
      borderLeftColor={getMealTypeColor(item.mealType)}
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
            P: {item.protein}g
          </Text>
          <Text color={FIXED_COLORS.text[400]} fontSize="$2xs">
            C: {item.carbs}g
          </Text>
          <Text color={FIXED_COLORS.text[400]} fontSize="$2xs">
            G: {item.fat}g
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ConsumptionItemCard;
