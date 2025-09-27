import React from "react";
import { Box } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FIXED_COLORS } from "../theme/colors";

interface SafeContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
}

export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  backgroundColor = FIXED_COLORS.background[50],
  paddingTop,
  paddingBottom,
  paddingHorizontal = 24,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Box
      flex={1}
      bg={backgroundColor}
      pt={paddingTop !== undefined ? paddingTop : insets.top}
      pb={paddingBottom !== undefined ? paddingBottom : insets.bottom}
      px={paddingHorizontal}
      width="100%"
      height="100%"
    >
      {children}
    </Box>
  );
};
