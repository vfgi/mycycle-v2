import React, { useState, useEffect } from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { PremiumUpgradeDrawer } from "../../../components";
import {
  periodOptions,
  getDataForPeriod,
  PeriodSelector,
  WeightComparisonCard,
  MeasurementsComparisonCard,
  PremiumAnalysisCard,
  PeriodType,
} from "./overview";
import {
  bodyDataService,
  ProcessedBodyData,
} from "../../../services/bodyDataService";

export const OverviewTab: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("1month");
  const [processedData, setProcessedData] = useState<ProcessedBodyData>({});
  const [realWeightData, setRealWeightData] = useState<any>({});
  const [realMeasurementData, setRealMeasurementData] = useState<any>({});
  const [isPremiumDrawerOpen, setIsPremiumDrawerOpen] = useState(false);

  // Mock para verificar se é premium (pode vir de context/store)
  const isPremium = false;

  useEffect(() => {
    loadRealData();
  }, [selectedPeriod]);

  const loadRealData = async () => {
    try {
      // Load processed body data
      const bodyData = await bodyDataService.getProcessedBodyData();
      setProcessedData(bodyData);

      // Load weight data for selected period
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
      console.error("Error loading real data:", error);
    }
  };

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  const handleUpgradePress = () => {
    setIsPremiumDrawerOpen(true);
  };

  const handlePremiumUpgrade = (planId: string) => {
    // Aqui seria processado o upgrade do plano
    setIsPremiumDrawerOpen(false);
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
            oldestRecord={periodData.oldestWeight}
            latestRecord={periodData.latestWeight}
            periodLabel={selectedPeriodOption?.label || ""}
            colors={[FIXED_COLORS.primary[500], FIXED_COLORS.primary[600]]}
            processedData={processedData}
          />

          {/* Card de Progresso de Medidas */}
          <MeasurementsComparisonCard
            oldestRecord={periodData.oldestMeasurement}
            latestRecord={periodData.latestMeasurement}
            periodLabel={selectedPeriodOption?.label || ""}
            colors={[FIXED_COLORS.success[500], FIXED_COLORS.success[600]]}
          />

          {/* Card de Análise Premium */}
          <PremiumAnalysisCard
            isPremium={isPremium}
            onUpgradePress={handleUpgradePress}
          />

          {/* Espaçamento extra no final */}
          <VStack height="$4" />
        </VStack>
      </ScrollView>

      {/* Premium Upgrade Drawer */}
      <PremiumUpgradeDrawer
        isOpen={isPremiumDrawerOpen}
        onClose={() => setIsPremiumDrawerOpen(false)}
        onUpgrade={handlePremiumUpgrade}
      />
    </VStack>
  );
};
