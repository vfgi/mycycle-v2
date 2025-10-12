import React, { useState } from "react";
import { VStack, Text, HStack, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { ExpandableCalendarComponent } from "../../../components";

export const WeightTab: React.FC = () => {
  const { t } = useTranslation();

  const allMockWeightData = {
    "2025-10-12": {
      weight: 75.2,
      change: +0.3,
      bodyFat: 15.8,
      muscleMass: 63.4,
    },
    "2025-10-11": {
      weight: 74.9,
      change: -0.1,
      bodyFat: 16.0,
      muscleMass: 63.1,
    },
    "2025-10-10": {
      weight: 75.0,
      change: +0.2,
      bodyFat: 16.1,
      muscleMass: 62.9,
    },
    "2025-10-09": {
      weight: 74.8,
      change: -0.4,
      bodyFat: 16.3,
      muscleMass: 62.7,
    },
    "2025-10-08": {
      weight: 75.5,
      change: +0.7,
      bodyFat: 15.9,
      muscleMass: 63.6,
    },
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  console.log("⚖️ WeightTab - selectedDate atual:", selectedDate);

  const handleDayPress = (day: any) => {
    console.log("⚖️ WeightTab - Dia clicado:", day.dateString);
    setSelectedDate(day.dateString);
  };

  const selectedWeightData =
    allMockWeightData[selectedDate as keyof typeof allMockWeightData];

  const getMarkedDates = () => {
    const marked: any = {};
    Object.keys(allMockWeightData).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: FIXED_COLORS.primary[500],
      };
    });
    return marked;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Hoje";
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const renderWeightCard = (data: any) => (
    <Box bg={FIXED_COLORS.background[800]} borderRadius="$lg" p="$4" mb="$3">
      <VStack space="sm">
        <HStack alignItems="center" justifyContent="space-between">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$md"
            fontWeight="$semibold"
          >
            {formatDate(selectedDate)}
          </Text>
          <HStack alignItems="center" space="xs">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
            >
              {data.weight} kg
            </Text>
            <HStack alignItems="center" space="xs">
              <Ionicons
                name={data.change >= 0 ? "arrow-up" : "arrow-down"}
                size={14}
                color={
                  data.change >= 0
                    ? FIXED_COLORS.success[500]
                    : FIXED_COLORS.error[500]
                }
              />
              <Text
                color={
                  data.change >= 0
                    ? FIXED_COLORS.success[500]
                    : FIXED_COLORS.error[500]
                }
                fontSize="$sm"
                fontWeight="$medium"
              >
                {data.change >= 0 ? "+" : ""}
                {data.change} kg
              </Text>
            </HStack>
          </HStack>
        </HStack>

        <HStack justifyContent="space-around" mt="$2">
          <VStack alignItems="center" space="xs">
            <Ionicons
              name="body-outline"
              size={16}
              color={FIXED_COLORS.text[400]}
            />
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.weight.bodyFat")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$medium"
            >
              {data.bodyFat}%
            </Text>
          </VStack>

          <VStack alignItems="center" space="xs">
            <Ionicons
              name="fitness-outline"
              size={16}
              color={FIXED_COLORS.text[400]}
            />
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.weight.muscleMass")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$medium"
            >
              {data.muscleMass} kg
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );

  const allWeights = Object.values(allMockWeightData).map(
    (data) => data.weight
  );
  const weeklyAverage =
    allWeights.reduce((sum, weight) => sum + weight, 0) / allWeights.length;
  const totalChange = allWeights[0] - allWeights[allWeights.length - 1];

  return (
    <VStack flex={1} space="md">
      <ExpandableCalendarComponent
        selectedDate={selectedDate}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
      >
        <Box
          bg={FIXED_COLORS.background[800]}
          borderRadius="$lg"
          p="$4"
          mb="$3"
          borderWidth={1}
          borderColor={FIXED_COLORS.primary[600]}
        >
          <VStack space="sm">
            <Text
              color={FIXED_COLORS.primary[600]}
              fontSize="$md"
              fontWeight="$semibold"
            >
              {t("history.weight.weeklySummary")}
            </Text>

            <HStack justifyContent="space-between">
              <VStack alignItems="center" space="xs">
                <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                  {t("history.weight.weeklyAverage")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$bold"
                >
                  {weeklyAverage.toFixed(1)} kg
                </Text>
              </VStack>

              <VStack alignItems="center" space="xs">
                <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                  {t("history.weight.totalVariation")}
                </Text>
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name={totalChange >= 0 ? "arrow-up" : "arrow-down"}
                    size={14}
                    color={
                      totalChange >= 0
                        ? FIXED_COLORS.success[500]
                        : FIXED_COLORS.error[500]
                    }
                  />
                  <Text
                    color={
                      totalChange >= 0
                        ? FIXED_COLORS.success[500]
                        : FIXED_COLORS.error[500]
                    }
                    fontSize="$md"
                    fontWeight="$bold"
                  >
                    {totalChange >= 0 ? "+" : ""}
                    {totalChange.toFixed(1)} kg
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {selectedWeightData ? (
          renderWeightCard(selectedWeightData)
        ) : (
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
                name="calendar-outline"
                size={32}
                color={FIXED_COLORS.text[400]}
              />
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                textAlign="center"
              >
                Nenhum registro de peso para esta data
              </Text>
            </VStack>
          </Box>
        )}

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
              name="add-circle-outline"
              size={32}
              color={FIXED_COLORS.text[400]}
            />
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$sm"
              textAlign="center"
            >
              {t("history.weight.registerWeight")}
            </Text>
          </VStack>
        </Box>
      </ExpandableCalendarComponent>
    </VStack>
  );
};
