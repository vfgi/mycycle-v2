import React from "react";
import { Button, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface ContinueButtonProps {
  onPress: () => void;
  isDisabled: boolean;
  text?: string;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onPress,
  isDisabled,
  text,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      onPress={onPress}
      bg={FIXED_COLORS.primary[600]}
      borderRadius="$lg"
      h="$12"
      isDisabled={isDisabled}
      opacity={isDisabled ? 0.5 : 1}
    >
      <Text
        color={FIXED_COLORS.text[950]}
        fontSize="$md"
        fontWeight="$semibold"
      >
        {text || t("workoutSetup.continue")}
      </Text>
    </Button>
  );
};
