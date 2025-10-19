import React from "react";
import { Pressable } from "react-native";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Supplement } from "./types";

interface SupplementCardProps {
  supplement: Supplement;
  onPress: () => void;
  onToggleTaken?: () => void;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement,
  onPress,
  onToggleTaken,
}) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress}>
      <Box
        borderRadius="$lg"
        bg={FIXED_COLORS.background[800]}
        borderWidth={2}
        borderColor={FIXED_COLORS.warning[500]}
        p="$4"
      >
        <VStack space="md">
          {/* Header com nome, botão tomado e seta */}
          <HStack justifyContent="space-between" alignItems="center">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$semibold"
              flex={1}
            >
              {supplement.name}
            </Text>

            {onToggleTaken && (
              <Pressable
                onPress={onToggleTaken}
                style={{
                  backgroundColor: supplement.is_taken
                    ? FIXED_COLORS.success[600]
                    : FIXED_COLORS.success[500],
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name={
                      supplement.is_taken
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={12}
                    color={FIXED_COLORS.text[50]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$xs"
                    fontWeight="$semibold"
                  >
                    {supplement.is_taken
                      ? t("nutrition.supplements.taken")
                      : t("nutrition.supplements.markAsTaken")}
                  </Text>
                </HStack>
              </Pressable>
            )}

            <Ionicons
              name="chevron-forward"
              size={20}
              color={FIXED_COLORS.text[400]}
            />
          </HStack>

          {/* Informações básicas */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack space="xs" flex={1}>
              <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                {t("nutrition.supplements.dosage")}
              </Text>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {supplement.dosage}
              </Text>
            </VStack>

            <VStack space="xs" alignItems="flex-end" flex={1}>
              <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                {t("nutrition.supplements.frequency")}
              </Text>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {supplement.frequency}
              </Text>
            </VStack>
          </HStack>

          {/* Informações nutricionais */}
          {supplement.nutrients && (
            <VStack space="sm">
              <Text
                color={FIXED_COLORS.text[300]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                Informações Nutricionais
              </Text>
              <HStack justifyContent="space-around">
                {supplement.nutrients.protein && (
                  <VStack alignItems="center" space="xs">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                      Proteína
                    </Text>
                    <Text
                      color={FIXED_COLORS.primary[500]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.protein}g
                    </Text>
                  </VStack>
                )}
                {supplement.nutrients.carbs && (
                  <VStack alignItems="center" space="xs">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                      Carboidratos
                    </Text>
                    <Text
                      color={FIXED_COLORS.warning[500]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.carbs}g
                    </Text>
                  </VStack>
                )}
                {supplement.nutrients.fat && (
                  <VStack alignItems="center" space="xs">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                      Gordura
                    </Text>
                    <Text
                      color={FIXED_COLORS.error[500]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.fat}g
                    </Text>
                  </VStack>
                )}
                {supplement.nutrients.calories && (
                  <VStack alignItems="center" space="xs">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                      Calorias
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.calories}
                    </Text>
                  </VStack>
                )}
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>
    </Pressable>
  );
};
