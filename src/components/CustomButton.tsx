import React from "react";
import { Animated } from "react-native";
import { Button, ButtonText, HStack } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";

const blackIcon = require("../../assets/black-icon.png");

interface CustomButtonProps {
  onPress: () => void;
  text: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  bg?: string;
  size?: "sm" | "md" | "lg" | "xl";
  borderRadius?: any;
  mt?: any;
  height?: number;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  isLoading = false,
  isDisabled = false,
  bg = FIXED_COLORS.primary[600],
  size = "lg",
  borderRadius = "$xl",
  mt = "$4",
  height,
}) => {
  const { t } = useTranslation();
  const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    if (isLoading) {
      const fadeInOut = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      fadeInOut.start();
    } else {
      fadeAnim.setValue(0.3);
    }
  }, [isLoading, fadeAnim]);

  return (
    <Button
      onPress={onPress}
      bg={bg}
      isDisabled={isDisabled || isLoading}
      size={size}
      borderRadius={borderRadius}
      mt={mt}
      height={height}
    >
      {isLoading ? (
        <HStack space="sm" alignItems="center">
          <Animated.Image
            source={blackIcon}
            style={{
              width: 40,
              height: 40,
              opacity: fadeAnim,
            }}
            resizeMode="contain"
          />
          <ButtonText color={FIXED_COLORS.text[900]}>
            {t("common.loading")}
          </ButtonText>
        </HStack>
      ) : (
        <ButtonText color={FIXED_COLORS.text[900]}>{text}</ButtonText>
      )}
    </Button>
  );
};
