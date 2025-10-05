import React from "react";
import { VStack, Text, HStack } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
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
          <VStack
            key={index}
            w="$3"
            h="$1"
            bg={
              index < currentStep
                ? FIXED_COLORS.primary[600]
                : FIXED_COLORS.background[600]
            }
            borderRadius="$full"
          />
        ))}
      </HStack>
    </VStack>
  );
};
