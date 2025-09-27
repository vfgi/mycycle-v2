import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";

export const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <VStack
      flex={1}
      bg={FIXED_COLORS.background[900]}
      justifyContent="center"
      alignItems="center"
      p="$6"
    >
      <Text
        color={FIXED_COLORS.text[50]}
        fontSize="$2xl"
        fontWeight="$bold"
        textAlign="center"
      >
        {t("navigation.calendar")}
      </Text>
      <Text
        color={FIXED_COLORS.text[400]}
        fontSize="$md"
        textAlign="center"
        mt="$4"
      >
        Tela de Calendário
      </Text>
    </VStack>
  );
};
