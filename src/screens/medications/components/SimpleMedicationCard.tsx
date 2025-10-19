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
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { Medication } from "../types";

interface SimpleMedicationCardProps {
  medication: Medication;
  onPress: () => void;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SimpleMedicationCard: React.FC<SimpleMedicationCardProps> = ({
  medication,
  onPress,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const getCategoryIcon = () => {
    switch (medication.category) {
      case "analgesic":
        return "bandage-outline";
      case "antibiotic":
        return "shield-checkmark-outline";
      case "vitamin":
        return "nutrition-outline";
      case "antiinflammatory":
        return "fitness-outline";
      default:
        return "medkit-outline";
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
          medication.is_active
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
                  {t(`medications.categories.${medication.category}`)}
                  {medication.brand && ` • ${medication.brand}`}
                </Text>
                {!medication.is_active && (
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
                      {t("medications.management.inactive")}
                    </Text>
                  </Box>
                )}
              </HStack>

              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$bold"
              >
                {medication.name}
              </Text>

              {medication.description && (
                <Text
                  color={FIXED_COLORS.text[300]}
                  fontSize="$sm"
                  numberOfLines={2}
                >
                  {medication.description}
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
                  {medication.is_active
                    ? t("medications.management.active")
                    : t("medications.management.inactive")}
                </Text>
                <Switch
                  value={medication.is_active}
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

          {/* Informações do medicamento */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {medication.dosage}
              </Text>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                {t("medications.dosage")}
              </Text>
            </VStack>

            <VStack alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {medication.frequency}
              </Text>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$xs"
                fontWeight="$medium"
              >
                {t("medications.frequency")}
              </Text>
            </VStack>

            {medication.time_of_day && medication.time_of_day.length > 0 && (
              <VStack alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {medication.time_of_day.length}x
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("medications.timesPerDay")}
                </Text>
              </VStack>
            )}
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
};
