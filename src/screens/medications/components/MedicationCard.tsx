import React from "react";
import { Pressable } from "react-native";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { Medication } from "../types";

interface MedicationCardProps {
  medication: Medication;
  onPress: () => void;
  onToggleTaken?: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onPress,
  onToggleTaken,
}) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} width="$full">
      <Box
        borderRadius="$lg"
        bg={FIXED_COLORS.background[800]}
        borderWidth={2}
        borderColor={FIXED_COLORS.error[500]}
        p="$4"
        width="$full"
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
              {medication.name}
            </Text>

            {onToggleTaken && (
              <Pressable
                onPress={onToggleTaken}
                style={{
                  backgroundColor: medication.is_taken
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
                      medication.is_taken
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
                    {medication.is_taken
                      ? t("medications.taken")
                      : t("medications.markAsTaken")}
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
                {t("medications.dosage")}
              </Text>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {medication.dosage}
              </Text>
            </VStack>

            <VStack space="xs" alignItems="flex-end" flex={1}>
              <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                {t("medications.frequency")}
              </Text>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {medication.frequency}
              </Text>
            </VStack>
          </HStack>

          {/* Horários */}
          {medication.time_of_day && medication.time_of_day.length > 0 && (
            <VStack space="xs">
              <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
                {t("medications.timeOfDay")}
              </Text>
              <HStack space="xs" flexWrap="wrap">
                {medication.time_of_day.map((time, index) => (
                  <Box
                    key={index}
                    bg={FIXED_COLORS.background[700]}
                    px="$2"
                    py="$1"
                    borderRadius="$md"
                  >
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$xs"
                      fontWeight="$medium"
                    >
                      {time}
                    </Text>
                  </Box>
                ))}
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>
    </Pressable>
  );
};
