import React from "react";
import { VStack, Text, HStack, Pressable } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepPress?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepPress,
}) => {
  const { t } = useTranslation();

  return (
    <VStack space="sm" alignItems="center">
      <Text
        color={FIXED_COLORS.text[400]}
        fontSize="$sm"
        fontWeight="$semibold"
      >
        {t("workoutSetup.step")} {currentStep} {t("workoutSetup.of")}{" "}
        {totalSteps}
      </Text>
      <HStack space="xs">
        {Array.from({ length: totalSteps }, (_, index) => (
          <Pressable
            key={index}
            onPress={() => onStepPress?.(index + 1)}
            disabled={!onStepPress}
          >
            <VStack
              w="$3"
              h="$1"
              bg={
                index < currentStep
                  ? FIXED_COLORS.primary[600]
                  : FIXED_COLORS.background[600]
              }
              borderRadius="$full"
            />
          </Pressable>
        ))}
      </HStack>
    </VStack>
  );
};
