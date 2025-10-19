import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { SafeContainer } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";

export const CreateMedicationScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SafeContainer paddingTop={12} paddingBottom={24} paddingHorizontal={12}>
      <VStack flex={1} space="lg">
        <Text color={FIXED_COLORS.text[50]} fontSize="$2xl" fontWeight="$bold">
          {t("medications.create.title")}
        </Text>
        <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
          {t("medications.create.description")}
        </Text>
      </VStack>
    </SafeContainer>
  );
};

