import React from "react";
import { ScrollView } from "react-native";
import { VStack, Text, HStack } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

export const SupplementsTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <VStack space="lg" p="$4">
        {/* Header Card */}
        <LinearGradient
          colors={[FIXED_COLORS.primary[600], FIXED_COLORS.primary[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 16, padding: 20 }}
        >
          <VStack space="sm" alignItems="center">
            <Ionicons name="medical" size={32} color={FIXED_COLORS.text[50]} />
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
              textAlign="center"
            >
              {t("nutrition.supplements.title")}
            </Text>
            <Text
              color="rgba(255, 255, 255, 0.8)"
              fontSize="$sm"
              textAlign="center"
              lineHeight="$sm"
            >
              {t("nutrition.supplements.description")}
            </Text>
          </VStack>
        </LinearGradient>

        {/* Coming Soon Card */}
        <VStack
          bg={FIXED_COLORS.background[800]}
          borderRadius="$lg"
          p="$6"
          space="md"
          alignItems="center"
        >
          <Ionicons
            name="construct-outline"
            size={48}
            color={FIXED_COLORS.text[400]}
          />
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$semibold"
            textAlign="center"
          >
            {t("common.comingSoon")}
          </Text>
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$sm"
            textAlign="center"
            lineHeight="$sm"
          >
            {t("nutrition.supplements.comingSoonDescription")}
          </Text>
        </VStack>

        {/* Features Preview */}
        <VStack space="md">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$semibold"
          >
            {t("nutrition.supplements.featuresTitle")}
          </Text>

          {[
            {
              icon: "fitness-outline",
              title: t("nutrition.supplements.features.protein"),
              description: t(
                "nutrition.supplements.features.proteinDescription"
              ),
            },
            {
              icon: "flash-outline",
              title: t("nutrition.supplements.features.preworkout"),
              description: t(
                "nutrition.supplements.features.preworkoutDescription"
              ),
            },
            {
              icon: "shield-outline",
              title: t("nutrition.supplements.features.vitamins"),
              description: t(
                "nutrition.supplements.features.vitaminsDescription"
              ),
            },
            {
              icon: "timer-outline",
              title: t("nutrition.supplements.features.schedule"),
              description: t(
                "nutrition.supplements.features.scheduleDescription"
              ),
            },
          ].map((feature, index) => (
            <HStack
              key={index}
              bg={FIXED_COLORS.background[800]}
              borderRadius="$md"
              p="$4"
              space="md"
              alignItems="center"
            >
              <Ionicons
                name={feature.icon as any}
                size={24}
                color={FIXED_COLORS.primary[600]}
              />
              <VStack flex={1} space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$medium"
                >
                  {feature.title}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  lineHeight="$sm"
                >
                  {feature.description}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
};
