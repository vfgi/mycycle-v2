import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { MeasurementRecord } from "./types";

interface MeasurementsComparisonCardProps {
  oldestRecord?: MeasurementRecord;
  latestRecord?: MeasurementRecord;
  periodLabel: string;
  colors?: string[];
  difference?: Record<string, number>;
  comparisonDate?: string;
  hasComparisonData?: boolean;
}

export const MeasurementsComparisonCard: React.FC<
  MeasurementsComparisonCardProps
> = ({
  oldestRecord,
  latestRecord,
  periodLabel,
  colors = [FIXED_COLORS.success[500], FIXED_COLORS.success[600]],
  difference,
  comparisonDate,
  hasComparisonData = false,
}) => {
  const { t } = useTranslation();

  if (!oldestRecord || !latestRecord) {
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
            name="resize-outline"
            size={32}
            color={FIXED_COLORS.text[400]}
          />
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$sm"
            textAlign="center"
          >
            {t("history.overview.noMeasurementData")}
          </Text>
        </VStack>
      </Box>
    );
  }

  const measurementKeys = [
    { key: "chest", label: t("history.overview.measurements.chest") },
    { key: "waist", label: t("history.overview.measurements.waist") },
    { key: "bicep", label: t("history.overview.measurements.bicep") },
    { key: "thigh", label: t("history.overview.measurements.thigh") },
    { key: "neck", label: t("history.overview.measurements.neck") },
    { key: "forearm", label: t("history.overview.measurements.forearm") },
    { key: "calf", label: t("history.overview.measurements.calf") },
  ] as const;

  const formatDifference = (diff: number) => {
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}cm`;
  };

  const getDifferenceColor = (diff: number, measurementType: string) => {
    if (Math.abs(diff) < 0.1) return FIXED_COLORS.text[400]; // Estável

    // Para cintura, diminuir é bom
    if (measurementType === "waist") {
      return diff < 0 ? FIXED_COLORS.success[500] : FIXED_COLORS.warning[500];
    }

    // Para outras medidas, aumentar geralmente é bom (ganho muscular)
    return diff > 0 ? FIXED_COLORS.success[500] : FIXED_COLORS.error[500];
  };

  const formatComparisonDate = (dateString?: string) => {
    if (!dateString) return periodLabel;

    // Extrair apenas a data da string ISO (YYYY-MM-DD)
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");

    const formatted = `${day}/${month}/${year}`;

    return `${t("history.overview.comparingWith")} ${formatted}`;
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
              name="resize-outline"
              size={20}
              color={FIXED_COLORS.success[500]}
            />
          </Box>
          <VStack flex={1}>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$md"
              fontWeight="$bold"
            >
              {t("history.overview.measurementsProgress")}
            </Text>
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$xs"
              opacity={0.8}
            >
              {formatComparisonDate(comparisonDate)}
            </Text>
          </VStack>
        </HStack>

        {/* Comparações de Medidas */}
        <VStack space="sm">
          {measurementKeys
            .map(({ key, label }) => {
              const oldValue = oldestRecord.measurements[key];
              const newValue = latestRecord.measurements[key];

              // Skip if measurement doesn't exist in both records
              if (!oldValue || !newValue) return null;

              const diff = newValue - oldValue;

              return (
                <HStack
                  key={key}
                  justifyContent="space-between"
                  alignItems="center"
                  py="$1"
                >
                  <Text
                    color={FIXED_COLORS.background[0]}
                    fontSize="$xs"
                    opacity={0.8}
                    flex={1}
                    minWidth="$16"
                  >
                    {label}
                  </Text>

                  <HStack alignItems="center" space="xs" flex={2}>
                    <Text
                      color={FIXED_COLORS.background[0]}
                      fontSize="$xs"
                      fontWeight="$medium"
                      textAlign="center"
                      flex={1}
                    >
                      {oldValue.toFixed(1)} → {newValue.toFixed(1)}cm
                    </Text>

                    <HStack alignItems="center" space="xs" minWidth="$20">
                      <Box
                        bg={FIXED_COLORS.background[0]}
                        borderRadius="$full"
                        p="$1"
                        opacity={0.9}
                      >
                        <Ionicons
                          name={
                            Math.abs(diff) < 0.1
                              ? "remove"
                              : diff > 0
                              ? "trending-up"
                              : "trending-down"
                          }
                          size={10}
                          color={getDifferenceColor(diff, key)}
                        />
                      </Box>

                      <Text
                        color={FIXED_COLORS.background[0]}
                        fontSize="$xs"
                        fontWeight="$semibold"
                        textAlign="right"
                        minWidth="$12"
                      >
                        {formatDifference(diff)}
                      </Text>
                    </HStack>
                  </HStack>
                </HStack>
              );
            })
            .filter(Boolean)}
        </VStack>

        {/* Resumo de Medidas */}
        <HStack justifyContent="center" mt="$2">
          <Text
            color={FIXED_COLORS.background[0]}
            fontSize="$xs"
            textAlign="center"
            opacity={0.8}
          >
            {measurementKeys.length} {t("history.overview.measurementsTracked")}
          </Text>
        </HStack>
      </VStack>
    </LinearGradient>
  );
};
