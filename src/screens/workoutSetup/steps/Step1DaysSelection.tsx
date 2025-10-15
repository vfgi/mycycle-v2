import React from "react";
import { VStack, Text, HStack, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { WEEK_DAYS } from "../../../utils/weekDays";

interface Step1DaysSelectionProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
}

export const Step1DaysSelection: React.FC<Step1DaysSelectionProps> = ({
  selectedDays,
  onDaysChange,
}) => {
  const { t } = useTranslation();

  const handleDayToggle = (dayKey: string) => {
    if (selectedDays.includes(dayKey)) {
      onDaysChange(selectedDays.filter((day) => day !== dayKey));
    } else {
      onDaysChange([...selectedDays, dayKey]);
    }
  };

  const isDaySelected = (dayKey: string) => selectedDays.includes(dayKey);

  return (
    <VStack space="lg" flex={1}>
      <VStack space="md">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$semibold"
        >
          {t("workoutSetup.selectDays")}
        </Text>

        <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
          {t("workoutSetup.selectDaysDescription")}
        </Text>
      </VStack>

      <VStack bg={FIXED_COLORS.background[800]} borderRadius="$lg" space="xs">
        {WEEK_DAYS.map((day) => (
          <Pressable
            key={day.key}
            onPress={() => handleDayToggle(day.key)}
            bg={
              isDaySelected(day.key)
                ? FIXED_COLORS.background[900]
                : FIXED_COLORS.background[800]
            }
            borderWidth={1}
            borderColor={
              isDaySelected(day.key)
                ? FIXED_COLORS.primary[600]
                : FIXED_COLORS.background[700]
            }
            borderRadius="$lg"
            p="$4"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <Text
                color={
                  isDaySelected(day.key)
                    ? FIXED_COLORS.text[50]
                    : FIXED_COLORS.text[300]
                }
                fontSize="$md"
                fontWeight="$medium"
              >
                {t(day.labelKey)}
              </Text>

              {isDaySelected(day.key) && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={FIXED_COLORS.primary[500]}
                />
              )}
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </VStack>
  );
};
