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
import { Supplement } from "./types";

interface SimpleSupplementCardProps {
  supplement: Supplement;
  onPress: () => void;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SimpleSupplementCard: React.FC<SimpleSupplementCardProps> = ({
  supplement,
  onPress,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const getCategoryIcon = () => {
    switch (supplement.category) {
      case "protein":
        return "barbell-outline";
      case "vitamin":
        return "nutrition-outline";
      case "mineral":
        return "flask-outline";
      case "preworkout":
        return "flash-outline";
      default:
        return "cube-outline";
    }
  };

  return (
    <Pressable onPress={onPress} width="$full">
      <Box
        bg={FIXED_COLORS.background[800]}
        borderRadius="$lg"
        p="$4"
        mb="$3"
        borderWidth={1}
        borderColor={
          supplement.is_active
            ? FIXED_COLORS.success[600]
            : FIXED_COLORS.warning[600]
        }
        width="$full"
      >
        <VStack space="md">
          {/* Header */}
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack flex={1} space="xs">
              <HStack alignItems="center" space="xs">
                <Ionicons
                  name={getCategoryIcon()}
                  size={16}
                  color={FIXED_COLORS.text[400]}
                />
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t(`nutrition.supplements.categories.${supplement.category}`)}
                  {supplement.brand && ` • ${supplement.brand}`}
                </Text>
                {!supplement.is_active && (
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
                      {t("nutrition.supplements.management.inactive")}
                    </Text>
                  </Box>
                )}
              </HStack>

              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$bold"
              >
                {supplement.name}
              </Text>

              {supplement.description && (
                <Text
                  color={FIXED_COLORS.text[300]}
                  fontSize="$sm"
                  numberOfLines={2}
                >
                  {supplement.description}
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
                  {supplement.is_active
                    ? t("nutrition.supplements.management.active")
                    : t("nutrition.supplements.management.inactive")}
                </Text>
                <Switch
                  value={supplement.is_active}
                  onValueChange={onToggleActive}
                  size="sm"
                  trackColor={{
                    false: FIXED_COLORS.background[600],
                    true: FIXED_COLORS.success[500],
                  }}
                  thumbColor={FIXED_COLORS.text[50]}
                />
              </HStack>

              <Pressable
                onPress={onEdit}
                bg={FIXED_COLORS.background[700]}
                borderRadius="$md"
                p="$2"
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={FIXED_COLORS.primary[400]}
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

          {/* Informações do suplemento */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {supplement.dosage}
              </Text>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                {t("nutrition.supplements.dosage")}
              </Text>
            </VStack>

            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {supplement.frequency}
              </Text>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                {t("nutrition.supplements.frequency")}
              </Text>
            </VStack>

            {supplement.nutrients?.protein !== undefined && (
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {supplement.nutrients.protein}g
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.protein")}
                </Text>
              </VStack>
            )}

            {supplement.nutrients?.carbs !== undefined && (
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {supplement.nutrients.carbs}g
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.carbs")}
                </Text>
              </VStack>
            )}

            {supplement.nutrients?.fat !== undefined && (
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {supplement.nutrients.fat}g
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.fat")}
                </Text>
              </VStack>
            )}

            {supplement.nutrients?.calories !== undefined && (
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$bold"
                >
                  {supplement.nutrients.calories}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  kcal
                </Text>
              </VStack>
            )}
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
};
