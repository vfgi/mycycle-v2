import React from "react";
import { VStack, HStack, Text, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

const MEAL_TYPES = [
  { key: "breakfast", icon: "sunny-outline", label: "Café da manhã" },
  { key: "lunch", icon: "restaurant-outline", label: "Almoço" },
  { key: "dinner", icon: "moon-outline", label: "Jantar" },
  { key: "snack", icon: "cafe-outline", label: "Lanche" },
];

interface MealTypeSelectorProps {
  selectedType?: string;
  onSelectType: (type: string) => void;
  error?: string;
}

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedType,
  onSelectType,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <VStack space="sm">
      <Text color={FIXED_COLORS.text[300]} fontSize="$sm" fontWeight="$medium">
        {t("nutrition.meals.mealType")}
      </Text>
      <HStack space="sm" flexWrap="wrap">
        {MEAL_TYPES.map((type) => (
          <Pressable
            key={type.key}
            onPress={() => onSelectType(type.key)}
            flex={1}
            minWidth="48%"
            bg={
              selectedType === type.key
                ? FIXED_COLORS.primary[600]
                : FIXED_COLORS.background[800]
            }
            borderRadius="$md"
            p="$3"
            borderWidth={1}
            borderColor={
              selectedType === type.key
                ? FIXED_COLORS.primary[500]
                : FIXED_COLORS.background[600]
            }
            mb="$2"
          >
            <HStack alignItems="center" space="sm">
              <Ionicons
                name={type.icon as any}
                size={20}
                color={
                  selectedType === type.key
                    ? FIXED_COLORS.text[950]
                    : FIXED_COLORS.text[400]
                }
              />
              <Text
                color={
                  selectedType === type.key
                    ? FIXED_COLORS.text[950]
                    : FIXED_COLORS.text[300]
                }
                fontSize="$sm"
                fontWeight="$medium"
              >
                {type.label}
              </Text>
            </HStack>
          </Pressable>
        ))}
      </HStack>
      {error && (
        <Text color={FIXED_COLORS.error[500]} fontSize="$xs">
          {error}
        </Text>
      )}
    </VStack>
  );
};
