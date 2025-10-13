import React from "react";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";

interface PremiumAnalysisCardProps {
  isPremium: boolean;
  onUpgradePress?: () => void;
  analysis?: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
}

export const PremiumAnalysisCard: React.FC<PremiumAnalysisCardProps> = ({
  isPremium,
  onUpgradePress,
  analysis,
}) => {
  const { t } = useTranslation();

  if (!isPremium) {
    return (
      <Pressable onPress={onUpgradePress}>
        <LinearGradient
          colors={[FIXED_COLORS.warning[500], FIXED_COLORS.warning[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 16,
            shadowColor: FIXED_COLORS.background[950],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <VStack space="md" alignItems="center">
            {/* Header Premium */}
            <HStack alignItems="center" space="sm">
              <Box
                bg={FIXED_COLORS.background[0]}
                borderRadius="$full"
                p="$2"
                opacity={0.9}
              >
                <Ionicons
                  name="star"
                  size={24}
                  color={FIXED_COLORS.warning[500]}
                />
              </Box>
              <VStack flex={1} alignItems="center">
                <Text
                  color={FIXED_COLORS.background[0]}
                  fontSize="$lg"
                  fontWeight="$bold"
                  textAlign="center"
                >
                  {t("history.overview.premiumAnalysis")}
                </Text>
                <Text
                  color={FIXED_COLORS.background[0]}
                  fontSize="$xs"
                  opacity={0.9}
                  textAlign="center"
                >
                  {t("history.overview.unlockInsights")}
                </Text>
              </VStack>
            </HStack>

            {/* Features Preview */}
            <VStack space="sm" width="100%">
              {[
                t("history.overview.features.progressAnalysis"),
                t("history.overview.features.personalizedRecommendations"),
                t("history.overview.features.trendPrediction"),
                t("history.overview.features.detailedReports"),
              ].map((feature, index) => (
                <HStack key={index} alignItems="center" space="sm">
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={FIXED_COLORS.background[0]}
                  />
                  <Text
                    color={FIXED_COLORS.background[0]}
                    fontSize="$xs"
                    opacity={0.9}
                    flex={1}
                  >
                    {feature}
                  </Text>
                </HStack>
              ))}
            </VStack>

            {/* CTA Button */}
            <Box
              bg={FIXED_COLORS.background[0]}
              borderRadius="$lg"
              px="$4"
              py="$3"
              mt="$2"
            >
              <HStack alignItems="center" space="sm">
                <Text
                  color={FIXED_COLORS.warning[500]}
                  fontSize="$sm"
                  fontWeight="$bold"
                >
                  {t("history.overview.upgradeToPremium")}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={FIXED_COLORS.warning[500]}
                />
              </HStack>
            </Box>
          </VStack>
        </LinearGradient>
      </Pressable>
    );
  }

  // Premium Analysis Content
  const mockAnalysis = analysis || {
    overallScore: 85,
    strengths: [
      t("history.overview.analysis.consistentProgress"),
      t("history.overview.analysis.muscleGain"),
      t("history.overview.analysis.fatLoss"),
    ],
    improvements: [
      t("history.overview.analysis.increaseProtein"),
      t("history.overview.analysis.moreCardio"),
    ],
    recommendations: [
      t("history.overview.analysis.adjustCalories"),
      t("history.overview.analysis.focusCompound"),
      t("history.overview.analysis.trackSleep"),
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return FIXED_COLORS.success[500];
    if (score >= 60) return FIXED_COLORS.warning[500];
    return FIXED_COLORS.error[500];
  };

  return (
    <LinearGradient
      colors={[FIXED_COLORS.primary[600], FIXED_COLORS.primary[700]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 16,
        shadowColor: FIXED_COLORS.background[950],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <VStack space="md">
        {/* Header */}
        <HStack alignItems="center" space="sm">
          <Box
            bg={FIXED_COLORS.background[0]}
            borderRadius="$full"
            p="$1.5"
            opacity={0.9}
          >
            <Ionicons
              name="analytics"
              size={20}
              color={FIXED_COLORS.primary[500]}
            />
          </Box>
          <VStack flex={1}>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$md"
              fontWeight="$bold"
            >
              {t("history.overview.progressAnalysis")}
            </Text>
            <HStack alignItems="center" space="xs">
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xs"
                opacity={0.8}
              >
                {t("history.overview.overallScore")}:
              </Text>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$sm"
                fontWeight="$bold"
              >
                {mockAnalysis.overallScore}/100
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Strengths */}
        <VStack space="xs">
          <Text
            color={FIXED_COLORS.background[0]}
            fontSize="$sm"
            fontWeight="$semibold"
          >
            ✅ {t("history.overview.strengths")}
          </Text>
          {mockAnalysis.strengths.slice(0, 2).map((strength, index) => (
            <Text
              key={index}
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.9}
            >
              • {strength}
            </Text>
          ))}
        </VStack>

        {/* Recommendations */}
        <VStack space="xs">
          <Text
            color={FIXED_COLORS.background[0]}
            fontSize="$sm"
            fontWeight="$semibold"
          >
            💡 {t("history.overview.recommendations")}
          </Text>
          {mockAnalysis.recommendations.slice(0, 2).map((rec, index) => (
            <Text
              key={index}
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.9}
            >
              • {rec}
            </Text>
          ))}
        </VStack>

        {/* View Full Report */}
        <Box
          bg={FIXED_COLORS.background[0]}
          borderRadius="$md"
          p="$2"
          opacity={0.1}
          mt="$2"
        >
          <Text
            color={FIXED_COLORS.background[0]}
            fontSize="$xs"
            textAlign="center"
            opacity={0.8}
          >
            {t("history.overview.viewFullReport")}
          </Text>
        </Box>
      </VStack>
    </LinearGradient>
  );
};
