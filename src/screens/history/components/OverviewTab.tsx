import React, { useState, useEffect } from "react";
import { VStack, Text, HStack, Box } from "@gluestack-ui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  periodOptions,
  getDataForPeriod,
  PeriodSelector,
  WeightComparisonCard,
  MeasurementsComparisonCard,
  PeriodType,
} from "./overview";
import {
  bodyDataService,
  ProcessedBodyData,
} from "../../../services/bodyDataService";
import {
  userService,
  MeasurementComparison,
} from "../../../services/userService";
import { Ionicons } from "@expo/vector-icons";

const periodApiMap: Record<PeriodType, string> = {
  "1week": "week",
  "1month": "month",
  "3months": "3months",
  "6months": "6months",
  "1year": "year",
  all: "all",
};

export const OverviewTab: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("1week");
  const [processedData, setProcessedData] = useState<ProcessedBodyData>({});
  const [realWeightData, setRealWeightData] = useState<any>({});
  const [realMeasurementData, setRealMeasurementData] = useState<any>({});
  const [comparisonData, setComparisonData] =
    useState<MeasurementComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRealData();
  }, [selectedPeriod]);

  const loadRealData = async () => {
    try {
      setIsLoading(true);
      const bodyData = await bodyDataService.getProcessedBodyData();
      setProcessedData(bodyData);

      const apiPeriod = periodApiMap[selectedPeriod];
      const comparison = await userService.getMeasurementsComparison(
        apiPeriod as any
      );
      setComparisonData(comparison);

      const selectedPeriodOption = periodOptions.find(
        (option) => option.key === selectedPeriod
      );

      if (selectedPeriodOption) {
        const weightData = await bodyDataService.getWeightDataForPeriod(
          selectedPeriodOption.days
        );
        setRealWeightData(weightData);

        const measurementData =
          await bodyDataService.getMeasurementsDataForPeriod(
            selectedPeriodOption.days
          );
        setRealMeasurementData(measurementData);
      }
    } catch (error) {
      console.error("❌ Error loading real data:", error);
      console.error("Error Details:", {
        message: (error as any)?.message,
        response: (error as any)?.response,
        stack: (error as any)?.stack,
      });
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  // Obter dados para o período selecionado
  const selectedPeriodOption = periodOptions.find(
    (option) => option.key === selectedPeriod
  );

  // Use real data if available, otherwise fall back to mock data
  const periodData =
    realWeightData.history?.length > 0
      ? {
          oldestWeight: realWeightData.oldest,
          latestWeight: realWeightData.latest,
          oldestMeasurement: realMeasurementData.oldest,
          latestMeasurement: realMeasurementData.latest,
        }
      : getDataForPeriod(selectedPeriodOption!);

  return (
    <VStack flex={1} bg={FIXED_COLORS.background[950]}>
      {/* Seletor de Período */}
      <VStack space="sm" p="$4" pb="$2">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$md"
          fontWeight="$semibold"
          textAlign="center"
        >
          {t("history.overview.title")}
        </Text>
        <Text
          color={FIXED_COLORS.text[400]}
          fontSize="$xs"
          textAlign="center"
          mb="$2"
        >
          {t("history.overview.description")}
        </Text>

        <PeriodSelector
          options={periodOptions}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </VStack>

      {/* Conteúdo Principal */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        <VStack space="md" pb="$10">
          {/* Card de Progresso de Peso */}
          <WeightComparisonCard
            oldestRecord={
              comparisonData?.result?.measurements?.weight
                ? {
                    id: "comparison",
                    date: comparisonData.result.date,
                    weight: comparisonData.result.measurements.weight,
                  }
                : periodData.oldestWeight
            }
            latestRecord={
              comparisonData?.current?.measurements?.weight
                ? {
                    id: "current",
                    date: comparisonData.current.date,
                    weight: comparisonData.current.measurements.weight,
                  }
                : periodData.latestWeight
            }
            periodLabel={selectedPeriodOption?.label || ""}
            colors={[FIXED_COLORS.primary[500], FIXED_COLORS.primary[600]]}
            processedData={processedData}
            comparisonDate={comparisonData?.result?.date}
            hasComparisonData={!!comparisonData?.result?.measurements?.weight}
          />

          {/* Card de Progresso de Medidas */}
          {comparisonData?.result?.measurements &&
          comparisonData?.current?.measurements ? (
            <MeasurementsComparisonCard
              oldestRecord={{
                id: "comparison",
                date: comparisonData.result.date,
                measurements: comparisonData.result.measurements as any,
              }}
              latestRecord={{
                id: "current",
                date: comparisonData.current.date,
                measurements: comparisonData.current.measurements as any,
              }}
              periodLabel={selectedPeriodOption?.label || ""}
              colors={[FIXED_COLORS.success[500], FIXED_COLORS.success[600]]}
              difference={comparisonData.result.difference as any}
              comparisonDate={comparisonData.result.date}
              hasComparisonData={true}
            />
          ) : (
            <VStack
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              p="$4"
              borderWidth={1}
              borderColor={FIXED_COLORS.warning[600]}
            >
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                {t("history.overview.noDataTitle")}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm" mt="$2">
                {t("history.overview.noDataDescription")}
              </Text>
            </VStack>
          )}

          {/* Card de Análise em Breve */}
          <VStack
            bg={FIXED_COLORS.background[800]}
            borderRadius="$lg"
            p="$4"
            borderWidth={2}
            borderColor={FIXED_COLORS.primary[500]}
            space="md"
          >
            <HStack alignItems="center" space="sm">
              <Box bg={FIXED_COLORS.primary[500]} borderRadius="$full" p="$2">
                <Ionicons
                  name="sparkles"
                  size={20}
                  color={FIXED_COLORS.background[0]}
                />
              </Box>
              <VStack flex={1}>
                <Text
                  color={FIXED_COLORS.primary[500]}
                  fontSize="$md"
                  fontWeight="$bold"
                >
                  {t("history.overview.comingSoon")}
                </Text>
                <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                  {t("history.overview.analysisFeatureDescription")}
                </Text>
              </VStack>
            </HStack>

            <VStack space="xs">
              <HStack alignItems="flex-start" space="sm">
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={FIXED_COLORS.primary[500]}
                  style={{ marginTop: 2 }}
                />
                <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                  {t("history.overview.analysisFeatures.detailedAnalysis")}
                </Text>
              </HStack>

              <HStack alignItems="flex-start" space="sm">
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={FIXED_COLORS.primary[500]}
                  style={{ marginTop: 2 }}
                />
                <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                  {t(
                    "history.overview.analysisFeatures.personalizedRecommendations"
                  )}
                </Text>
              </HStack>

              <HStack alignItems="flex-start" space="sm">
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={FIXED_COLORS.primary[500]}
                  style={{ marginTop: 2 }}
                />
                <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                  {t("history.overview.analysisFeatures.trendPrediction")}
                </Text>
              </HStack>

              <HStack alignItems="flex-start" space="sm">
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={FIXED_COLORS.primary[500]}
                  style={{ marginTop: 2 }}
                />
                <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                  {t(
                    "history.overview.analysisFeatures.mealAndWorkoutAdjustments"
                  )}
                </Text>
              </HStack>
            </VStack>

            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$xs"
              textAlign="center"
              mt="$2"
            >
              {t("history.overview.analysisFeatures.andMore")}
            </Text>
          </VStack>

          {/* Espaçamento extra no final */}
          <VStack height="$4" />
        </VStack>
      </ScrollView>
    </VStack>
  );
};
