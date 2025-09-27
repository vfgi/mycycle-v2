import React from "react";
import { VStack, Text, HStack } from "@gluestack-ui/themed";
import { CustomInput } from "./CustomInput";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";

interface MeasurementCardProps {
  label: string;
  description: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isOptional?: boolean;
  unit?: string;
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({
  label,
  description,
  value,
  onChangeText,
  placeholder,
  isOptional = false,
  unit = "cm",
}) => {
  const { t } = useTranslation();
  return (
    <VStack
      bg={FIXED_COLORS.background[900]}
      borderRadius="$lg"
      p="$4"
      space="sm"
      opacity={0.9}
      r
    >
      <HStack alignItems="center" justifyContent="space-between">
        <VStack flex={1} space="xs">
          <HStack alignItems="center" space="xs">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$semibold"
            >
              {label}
            </Text>
            {isOptional && (
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                fontStyle="italic"
              >
                ({t("measurements.optional")})
              </Text>
            )}
          </HStack>
          <Text color={FIXED_COLORS.text[300]} fontSize="$sm" lineHeight="$sm">
            {description}
          </Text>
        </VStack>
      </HStack>

      <HStack alignItems="center" space="sm">
        <VStack flex={1}>
          <CustomInput
            value={value}
            onChangeText={onChangeText}
            placeholder={
              placeholder ||
              t("measurements.placeholder").replace("{unit}", unit)
            }
            keyboardType="numeric"
          />
        </VStack>
        <Text
          color={FIXED_COLORS.text[400]}
          fontSize="$md"
          fontWeight="$medium"
          minWidth="$8"
        >
          {unit}
        </Text>
      </HStack>
    </VStack>
  );
};
