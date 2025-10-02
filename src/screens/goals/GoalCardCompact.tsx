import React from "react";
import { ImageBackground } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { CustomInput } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";

interface GoalCardCompactProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon: any;
}

export const GoalCardCompact: React.FC<GoalCardCompactProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
}) => (
  <VStack
    borderWidth={1}
    borderColor={FIXED_COLORS.background[0]}
    borderRadius="$xl"
    bg="rgba(0, 0, 0, 0.4)"
    overflow="hidden"
    justifyContent="flex-end"
  >
    <ImageBackground
      source={icon}
      style={{
        justifyContent: "flex-end",
        padding: 20,
      }}
      imageStyle={{
        opacity: 0.6,
        resizeMode: "cover",
      }}
    >
      <CustomInput
        label={label}
        placeholder={placeholder || label}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
      />
    </ImageBackground>
  </VStack>
);
