import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { WeightRecord } from "./types";
import { ProcessedBodyData } from "../../../../services/bodyDataService";

interface WeightComparisonCardProps {
  oldestRecord?: WeightRecord;
  latestRecord?: WeightRecord;
  periodLabel: string;
  colors?: string[];
  processedData?: ProcessedBodyData;
}

export const WeightComparisonCard: React.FC<WeightComparisonCardProps> = ({
  oldestRecord,
  latestRecord,
  periodLabel,
  colors = [FIXED_COLORS.primary[500], FIXED_COLORS.secondary[300]],
  processedData,
}) => {
  const { t } = useTranslation();

  // Use processed data if available, otherwise fall back to records
  const currentWeight = processedData?.currentWeight || latestRecord?.weight;
  const targetWeight = processedData?.targetWeight;
  const initialWeight = oldestRecord?.weight;

  if (!currentWeight) {
    return (
      <Box
        bg={FIXED_COLORS.background[800]}
        borderRadius="$lg"
        p="$4"
        borderWidth={1}
        borderColor={FIXED_COLORS.background[700]}
        borderStyle="dashed"
      >
        <VStack alignItems="center" space="sm">
          <Ionicons
            name="scale-outline"
            size={32}
            color={FIXED_COLORS.text[400]}
          />
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$sm"
            textAlign="center"
          >
            {t("history.overview.noWeightData")}
          </Text>
        </VStack>
      </Box>
    );
  }

  const weightDiff = initialWeight ? currentWeight - initialWeight : 0;
  const targetDiff = targetWeight ? targetWeight - currentWeight : null;

  const formatDifference = (
    diff: number,
    unit: string,
    isPercentage = false
  ) => {
    const sign = diff >= 0 ? "+" : "";
    const value = isPercentage ? diff.toFixed(1) : diff.toFixed(1);
    return `${sign}${value}${unit}`;
  };

  const getDifferenceColor = (diff: number, isBodyFat = false) => {
    if (Math.abs(diff) < 0.1) return FIXED_COLORS.text[400]; // Estável
    if (isBodyFat) {
      return diff < 0 ? FIXED_COLORS.success[500] : FIXED_COLORS.warning[500];
    }
    return diff > 0 ? FIXED_COLORS.success[500] : FIXED_COLORS.error[500];
  };

  return (
    <LinearGradient
      colors={colors as [string, string]}
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
              name="scale-outline"
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
              {t("history.overview.weightProgress")}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.8}
            >
              {periodLabel}
            </Text>
          </VStack>
        </HStack>

        {/* Comparação de Peso */}
        <VStack space="sm">
          <HStack justifyContent="space-between" alignItems="center">
            {initialWeight && (
              <VStack alignItems="center" flex={1}>
                <Text
                  color={FIXED_COLORS.background[0]}
                  fontSize="$xs"
                  opacity={0.8}
                >
                  {t("history.overview.initial")}
                </Text>
                <Text
                  color={FIXED_COLORS.background[0]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {initialWeight.toFixed(1)}kg
                </Text>
              </VStack>
            )}

            <VStack alignItems="center" flex={1}>
              <Box
                bg={FIXED_COLORS.background[0]}
                borderRadius="$full"
                p="$2"
                opacity={0.9}
                mb="$1"
              >
                <Ionicons
                  name={weightDiff >= 0 ? "trending-up" : "trending-down"}
                  size={16}
                  color={getDifferenceColor(weightDiff)}
                />
              </Box>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {formatDifference(weightDiff, "kg")}
              </Text>
            </VStack>

            <VStack alignItems="center" flex={1}>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xs"
                opacity={0.8}
              >
                {t("history.overview.current")}
              </Text>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xl"
                fontWeight="$bold"
              >
                {currentWeight.toFixed(1)}kg
              </Text>
            </VStack>
          </HStack>

          {/* Meta de Peso */}
          {targetWeight && (
            <HStack justifyContent="center" alignItems="center" space="xs">
              <Ionicons
                name="flag-outline"
                size={14}
                color={FIXED_COLORS.background[0]}
              />
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xs"
                opacity={0.8}
              >
                {t("history.overview.weightGoal")}: {targetWeight.toFixed(1)}kg
              </Text>
              {targetDiff && (
                <Text
                  color={FIXED_COLORS.background[0]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  ({targetDiff > 0 ? "+" : ""}
                  {targetDiff.toFixed(1)}kg)
                </Text>
              )}
            </HStack>
          )}
        </VStack>

        {/* Métricas Adicionais */}
        <HStack justifyContent="space-around" mt="$2">
          {/* IMC */}
          {processedData?.bmi && (
            <VStack alignItems="center" space="xs">
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xs"
                opacity={0.8}
              >
                {t("history.overview.bmi")}
              </Text>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {processedData.bmi}
              </Text>
              {processedData.bmiClassification && (
                <Box
                  bg={processedData.bmiClassification.color}
                  borderRadius="$full"
                  px="$2"
                  py="$1"
                >
                  <Text
                    color={FIXED_COLORS.background[0]}
                    fontSize="$2xs"
                    fontWeight="$medium"
                  >
                    {t(
                      `history.overview.bmiCategories.${processedData.bmiClassification.category}`
                    )}
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Percentual de Gordura */}
          {processedData?.bodyFatPercentage && (
            <VStack alignItems="center" space="xs">
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xs"
                opacity={0.8}
              >
                {t("history.overview.bodyFat")}
              </Text>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {processedData.bodyFatPercentage.toFixed(1)}%
              </Text>
              {processedData.bodyFatClassification && (
                <Box
                  bg={processedData.bodyFatClassification.color}
                  borderRadius="$full"
                  px="$2"
                  py="$1"
                >
                  <Text
                    color={FIXED_COLORS.background[0]}
                    fontSize="$2xs"
                    fontWeight="$medium"
                  >
                    {t(
                      `history.overview.bodyFatCategories.${processedData.bodyFatClassification.category}`
                    )}
                  </Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Massa Muscular */}
          {processedData?.muscleMass && (
            <VStack alignItems="center" space="xs">
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$xs"
                opacity={0.8}
              >
                {t("history.overview.muscleMass")}
              </Text>
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {processedData.muscleMass.toFixed(1)}kg
              </Text>
            </VStack>
          )}
        </HStack>
      </VStack>
    </LinearGradient>
  );
};
