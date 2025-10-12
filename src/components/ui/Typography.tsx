import React from "react";
import { Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";

interface TypographyProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  color?: string;
  style?: any;
  numberOfLines?: number;
}

const sizeMap = {
  xs: "$xs",
  sm: "$sm",
  md: "$md",
  lg: "$lg",
  xl: "$xl",
  "2xl": "$2xl",
};

const weightMap = {
  light: "$light",
  regular: "$normal",
  medium: "$medium",
  semibold: "$semibold",
  bold: "$bold",
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  size = "md",
  weight = "regular",
  color = FIXED_COLORS.text[50],
  style,
  numberOfLines,
}) => {
  return (
    <Text
      fontSize={sizeMap[size] as any}
      fontWeight={weightMap[weight] as any}
      color={color}
      style={style}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default Typography;
