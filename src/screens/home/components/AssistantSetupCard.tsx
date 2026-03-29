import React from "react";
import { Pressable } from "react-native";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface AssistantSetupCardProps {
  onPress: () => void;
}

export const AssistantSetupCard: React.FC<AssistantSetupCardProps> = ({
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <Pressable onPress={onPress} style={{ width: "100%" }}>
      {({ pressed }) => (
        <Box
          borderRadius="$2xl"
          overflow="hidden"
          borderWidth={1}
          borderColor={FIXED_COLORS.primary[600]}
          opacity={pressed ? 0.92 : 1}
        >
          <LinearGradient
            colors={[
              "rgba(173, 209, 0, 0.35)",
              "rgba(36, 38, 43, 0.98)",
              FIXED_COLORS.background[800],
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: "100%" }}
          >
            <VStack p="$4" space="md">
              <HStack alignItems="center" justifyContent="space-between">
                <HStack alignItems="center" space="sm" flex={1}>
                  <Box
                    width={44}
                    height={44}
                    borderRadius="$lg"
                    bg="rgba(0,0,0,0.35)"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Ionicons
                      name="sparkles"
                      size={24}
                      color={FIXED_COLORS.secondary[300]}
                    />
                  </Box>
                  <VStack flex={1}>
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$lg"
                      fontWeight="$bold"
                      numberOfLines={2}
                    >
                      {t("home.assistantSetupCardTitle")}
                    </Text>
                  </VStack>
                </HStack>
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={FIXED_COLORS.text[400]}
                />
              </HStack>
              <Text
                color={FIXED_COLORS.text[300]}
                fontSize="$sm"
                lineHeight="$sm"
              >
                {t("home.assistantSetupCardSubtitle")}
              </Text>
              <HStack space="md" flexWrap="wrap" pt="$1">
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name="barbell-outline"
                    size={16}
                    color={FIXED_COLORS.primary[600]}
                  />
                  <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                    {t("navigation.workouts")}
                  </Text>
                </HStack>
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name="nutrition-outline"
                    size={16}
                    color={FIXED_COLORS.secondary[300]}
                  />
                  <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                    {t("navigation.nutrition")}
                  </Text>
                </HStack>
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name="flag-outline"
                    size={16}
                    color={FIXED_COLORS.warning[400]}
                  />
                  <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                    {t("navigation.goals")}
                  </Text>
                </HStack>
              </HStack>
              <Box
                mt="$1"
                alignSelf="flex-start"
                bg={FIXED_COLORS.warning[500]}
                px="$4"
                py="$2"
                borderRadius="$full"
              >
                <Text
                  color={FIXED_COLORS.text[950]}
                  fontSize="$sm"
                  fontWeight="$bold"
                >
                  {t("home.assistantSetupCardCta")}
                </Text>
              </Box>
            </VStack>
          </LinearGradient>
        </Box>
      )}
    </Pressable>
  );
};
