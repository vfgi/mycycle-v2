import React from "react";
import { VStack, HStack, Text, Divider } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { useUnits } from "../../contexts/UnitsContext";

interface StatValue {
  label: string;
  value: string;
  color?: string;
}

const StatRow: React.FC<{
  title: string;
  stats: StatValue[];
}> = ({ title, stats }) => (
  <VStack space="sm">
    <Text color={FIXED_COLORS.background[0]} fontSize="$2xl" fontWeight="$bold">
      {title}
    </Text>
    <HStack
      space="xl"
      mt="$2"
      alignItems="center"
      justifyContent="space-between"
    >
      {stats.map((stat, index) => (
        <VStack key={index} alignItems="center" space="xs">
          <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
            {stat.label}
          </Text>
          <Text
            color={stat.color || FIXED_COLORS.text[50]}
            fontSize="$xl"
            fontWeight="$semibold"
          >
            {stat.value}
          </Text>
        </VStack>
      ))}
    </HStack>
  </VStack>
);

export const StatsTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { convertWeight } = useUnits();

  const currentWeight = user?.measurements?.weight || 0;
  const goalWeight = 70;
  const difference = currentWeight - goalWeight;

  const currentWeightConverted = convertWeight(currentWeight);
  const goalWeightConverted = convertWeight(goalWeight);
  const differenceConverted = convertWeight(Math.abs(difference));

  return (
    <VStack space="xl">
      <StatRow
        title={t("profile.weight")}
        stats={[
          {
            label: t("profile.current"),
            value: `${currentWeightConverted.value} ${currentWeightConverted.unit}`,
          },
          {
            label: t("profile.goal"),
            value: `${goalWeightConverted.value} ${goalWeightConverted.unit}`,
          },
          {
            label: t("profile.difference"),
            value: `${difference > 0 ? "+" : "-"}${differenceConverted.value} ${
              differenceConverted.unit
            }`,
            color:
              difference > 0
                ? FIXED_COLORS.warning[500]
                : FIXED_COLORS.success[500],
          },
        ]}
      />

      <Divider bg={FIXED_COLORS.background[700]} />

      <StatRow
        title={t("profile.workouts")}
        stats={[
          { label: t("profile.total"), value: "24" },
          { label: t("profile.thisWeek"), value: "4" },
          { label: t("profile.thisMonth"), value: "18" },
        ]}
      />

      <Divider bg={FIXED_COLORS.background[700]} />

      <StatRow
        title={t("profile.calories")}
        stats={[
          { label: t("profile.today"), value: "1850" },
          { label: t("profile.average"), value: "2100" },
          { label: t("profile.goal"), value: "2200" },
        ]}
      />

      <Divider bg={FIXED_COLORS.background[700]} />

      <StatRow
        title={t("profile.totalTime")}
        stats={[
          { label: t("profile.total"), value: "12h" },
          { label: t("profile.thisWeek"), value: "3h" },
          { label: t("profile.average"), value: "45min" },
        ]}
      />
    </VStack>
  );
};
