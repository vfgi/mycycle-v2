import React from "react";
import {
  VStack,
  Text,
  HStack,
  Box,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";

const getMeasurementGradient = (measurementKey: string): [string, string] => {
  const gradients: Record<string, [string, string]> = {
    height: [FIXED_COLORS.primary[600], FIXED_COLORS.primary[800]],
    neck: [FIXED_COLORS.secondary[500], FIXED_COLORS.secondary[700]],
    back: ["#8B5CF6", "#7C3AED"], // Purple
    biceps: [FIXED_COLORS.success[500], FIXED_COLORS.success[700]],
    forearm: ["#F59E0B", "#D97706"], // Amber
    wrist: ["#EF4444", "#DC2626"], // Red
    chest: [FIXED_COLORS.primary[500], FIXED_COLORS.primary[700]],
    abdomen: ["#10B981", "#059669"], // Emerald
    waist: ["#3B82F6", "#2563EB"], // Blue
    hip: ["#EC4899", "#DB2777"], // Pink
    thigh: ["#8B5CF6", "#7C3AED"], // Purple
    calf: ["#F59E0B", "#D97706"], // Amber
    foot: ["#6B7280", "#4B5563"], // Gray
  };

  return (
    gradients[measurementKey] || [
      FIXED_COLORS.background[700],
      FIXED_COLORS.background[800],
    ]
  );
};

interface MeasurementCardProps {
  label: string;
  description: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isOptional?: boolean;
  unit?: string;
  error?: string;
  currentValue?: string;
  measurementKey: string;
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({
  label,
  description,
  value,
  onChangeText,
  placeholder,
  isOptional = false,
  unit = "cm",
  error,
  currentValue,
  measurementKey,
}) => {
  const { t } = useTranslation();
  const [startColor, endColor] = getMeasurementGradient(measurementKey);

  return (
    <Box borderRadius="$lg" overflow="hidden">
      <LinearGradient
        colors={[startColor, endColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 12 }}
      >
        <VStack p="$4" space="sm">
          <HStack alignItems="center" justifyContent="space-between">
            <VStack flex={1} space="xs">
              <HStack alignItems="center" justifyContent="space-between">
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
                      color="rgba(255, 255, 255, 0.7)"
                      fontSize="$sm"
                      fontStyle="italic"
                    >
                      ({t("measurements.optional")})
                    </Text>
                  )}
                </HStack>
                {currentValue && (
                  <VStack alignItems="flex-end">
                    <Text
                      color="rgba(255, 255, 255, 0.8)"
                      fontSize="$xs"
                      fontWeight="$medium"
                    >
                      {t("measurements.current")}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$lg"
                      fontWeight="$bold"
                    >
                      {currentValue} {unit}
                    </Text>
                  </VStack>
                )}
              </HStack>
              <Text
                color="rgba(255, 255, 255, 0.8)"
                fontSize="$sm"
                lineHeight="$sm"
              >
                {description}
              </Text>
            </VStack>
          </HStack>

          <HStack alignItems="center" space="sm">
            <VStack flex={1}>
              <Input
                bg="rgba(255, 255, 255, 0.15)"
                borderColor="rgba(255, 255, 255, 0.3)"
                borderRadius="$md"
                borderWidth={1}
                h="$12"
              >
                <InputField
                  value={value}
                  onChangeText={onChangeText}
                  placeholder={
                    placeholder ||
                    t("measurements.placeholder").replace("{unit}", unit)
                  }
                  keyboardType="numeric"
                  color={FIXED_COLORS.text[50]}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  fontSize="$md"
                />
              </Input>
              {error && (
                <Text color={FIXED_COLORS.error[300]} fontSize="$sm" mt="$1">
                  {t(error)}
                </Text>
              )}
            </VStack>
            <Text
              color="rgba(255, 255, 255, 0.9)"
              fontSize="$md"
              fontWeight="$semibold"
              minWidth="$8"
            >
              {unit}
            </Text>
          </HStack>
        </VStack>
      </LinearGradient>
    </Box>
  );
};
