import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { useAuth } from "../../contexts/AuthContext";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <SafeContainer>
      <VStack flex={1} justifyContent="center" alignItems="center" p="$6">
        <VStack space="lg" alignItems="center" w="$full">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$2xl"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("home.welcome")}
          </Text>

          {user && (
            <VStack space="sm" alignItems="center">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                textAlign="center"
              >
                {t("home.hello")} {user.name}
              </Text>
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                textAlign="center"
              >
                {user.email}
              </Text>
            </VStack>
          )}
        </VStack>
      </VStack>
    </SafeContainer>
  );
};
