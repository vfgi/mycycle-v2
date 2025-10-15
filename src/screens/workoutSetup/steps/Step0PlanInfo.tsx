import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import FloatingTextInput from "../../../components/ui/FloatingTextInput";

interface Step0PlanInfoProps {
  planName: string;
  planDescription: string;
  onPlanNameChange: (name: string) => void;
  onPlanDescriptionChange: (description: string) => void;
}

export const Step0PlanInfo: React.FC<Step0PlanInfoProps> = ({
  planName,
  planDescription,
  onPlanNameChange,
  onPlanDescriptionChange,
}) => {
  const { t } = useTranslation();

  return (
    <VStack space="lg" flex={1}>
      <VStack space="lg">
        <FloatingTextInput
          label={t("workoutSetup.planName")}
          value={planName}
          onChangeText={onPlanNameChange}
          backgroundColor={FIXED_COLORS.background[950]}
          valueColor={FIXED_COLORS.text[50]}
          isFocusLabelColor={FIXED_COLORS.primary[600]}
          isBlurLabelColor={FIXED_COLORS.text[500]}
          isFocusBorderColor={FIXED_COLORS.primary[600]}
          isBlurBorderColor={FIXED_COLORS.text[300]}
          isBlurValueBorderColor={FIXED_COLORS.text[400]}
        />

        <FloatingTextInput
          label={t("workoutSetup.planDescription")}
          value={planDescription}
          onChangeText={onPlanDescriptionChange}
          backgroundColor={FIXED_COLORS.background[950]}
          valueColor={FIXED_COLORS.text[50]}
          isFocusLabelColor={FIXED_COLORS.primary[600]}
          isBlurLabelColor={FIXED_COLORS.text[500]}
          isFocusBorderColor={FIXED_COLORS.primary[600]}
          isBlurBorderColor={FIXED_COLORS.text[300]}
          isBlurValueBorderColor={FIXED_COLORS.text[400]}
          multiline
          numberOfLines={3}
          height={80}
        />
      </VStack>
    </VStack>
  );
};
