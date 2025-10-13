import React from "react";
import { HStack, Text, Pressable } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../../theme/colors";
import { PeriodOption, PeriodType } from "./types";

interface PeriodSelectorProps {
  options: PeriodOption[];
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  options,
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <HStack space="xs" flexWrap="wrap" justifyContent="center" p="$2">
      {options.map((option) => (
        <Pressable
          key={option.key}
          onPress={() => onPeriodChange(option.key)}
          bg={
            selectedPeriod === option.key
              ? FIXED_COLORS.primary[500]
              : FIXED_COLORS.background[800]
          }
          borderRadius="$full"
          px="$3"
          py="$2"
          borderWidth={1}
          borderColor={
            selectedPeriod === option.key
              ? FIXED_COLORS.primary[500]
              : FIXED_COLORS.background[700]
          }
          mb="$2"
        >
          <Text
            color={
              selectedPeriod === option.key
                ? FIXED_COLORS.background[0]
                : FIXED_COLORS.text[50]
            }
            fontSize="$xs"
            fontWeight={selectedPeriod === option.key ? "$bold" : "$medium"}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
};
