import React from "react";
import { Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";

interface SectionTitleProps {
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <Text
    color={FIXED_COLORS.background[0]}
    fontSize="$2xl"
    fontWeight="$bold"
    mb="$3"
    mt="$4"
  >
    {title}
  </Text>
);
