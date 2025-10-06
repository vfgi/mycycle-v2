import React from "react";
import { HStack, Pressable, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  isContinueDisabled: boolean;
  isBackDisabled?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  isContinueDisabled,
  isBackDisabled = false,
}) => {
  const { t } = useTranslation();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <HStack space="md" justifyContent="space-between">
      {/* Botão Voltar */}
      <Pressable
        onPress={onBack}
        disabled={isBackDisabled || isFirstStep}
        flex={1}
        bg={
          isBackDisabled || isFirstStep
            ? FIXED_COLORS.background[700]
            : FIXED_COLORS.background[800]
        }
        p="$4"
        borderRadius="$lg"
        borderWidth={1}
        borderColor={
          isBackDisabled || isFirstStep
            ? FIXED_COLORS.background[600]
            : FIXED_COLORS.primary[500]
        }
        alignItems="center"
        opacity={isBackDisabled || isFirstStep ? 0.5 : 1}
      >
        <Text
          color={
            isBackDisabled || isFirstStep
              ? FIXED_COLORS.text[600]
              : FIXED_COLORS.text[50]
          }
          fontSize="$md"
          fontWeight="$semibold"
        >
          {t("workoutSetup.back")}
        </Text>
      </Pressable>

      {/* Botão Continuar */}
      <Pressable
        onPress={onContinue}
        disabled={isContinueDisabled}
        flex={1}
        bg={
          isContinueDisabled
            ? FIXED_COLORS.background[700]
            : FIXED_COLORS.primary[500]
        }
        p="$4"
        borderRadius="$lg"
        alignItems="center"
        opacity={isContinueDisabled ? 0.5 : 1}
      >
        <Text
          color={
            isContinueDisabled ? FIXED_COLORS.text[600] : FIXED_COLORS.text[50]
          }
          fontSize="$md"
          fontWeight="$semibold"
        >
          {isLastStep ? t("workoutSetup.finish") : t("workoutSetup.continue")}
        </Text>
      </Pressable>
    </HStack>
  );
};
