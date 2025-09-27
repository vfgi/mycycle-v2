import React from "react";
import { Box, ImageBackground } from "@gluestack-ui/themed";
import { SafeContainer } from "./SafeContainer";
import { FIXED_COLORS } from "../theme/colors";

interface AuthContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  backgroundImage?: any;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  children,
  backgroundColor = FIXED_COLORS.background[50],
  backgroundImage,
}) => {
  return (
    <Box flex={1} backgroundColor={backgroundColor} position="relative">
      {backgroundImage && (
        <Box
          position="absolute"
          top={-10}
          left={0}
          right={0}
          height="35%"
          zIndex={0}
        >
          <ImageBackground
            source={backgroundImage}
            style={{
              width: "100%",
              height: "100%",
              opacity: 0.6,
            }}
            resizeMode="cover"
          />
        </Box>
      )}
      <SafeContainer backgroundColor="transparent" paddingHorizontal={0}>
        <Box flex={1} justifyContent="center" zIndex={1} position="relative">
          {children}
        </Box>
      </SafeContainer>
    </Box>
  );
};
