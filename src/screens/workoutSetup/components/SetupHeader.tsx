import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

export const SetupHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <VStack space="md" alignItems="center">
      <Text
        color={FIXED_COLORS.text[50]}
        fontSize="$2xl"
        fontWeight="$bold"
        textAlign="center"
      >
        {t("workoutSetup.title")}
      </Text>
      <Text
        color={FIXED_COLORS.text[300]}
        fontSize="$md"
        textAlign="center"
        lineHeight="$md"
      >
        {t("workoutSetup.subtitle")}
      </Text>
    </VStack>
  );
};
