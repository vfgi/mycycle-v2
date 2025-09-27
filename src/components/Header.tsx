import React from "react";
import { HStack, Image, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../theme/colors";
import { Platform } from "react-native";

const logoStandard = require("../../assets/logo-standard.png");

interface HeaderProps {
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNotificationPress }) => {
  return (
    <HStack
      justifyContent="center"
      alignItems="center"
      bg={FIXED_COLORS.background[950]}
      pt={Platform.OS === "ios" ? "$10" : "$4"}
      h="$24"
      pb="$0"
      borderBottomWidth={0}
      position="relative"
    >
      <Image
        source={logoStandard}
        alt="Logo"
        width={160}
        height={40}
        resizeMode="contain"
      />

      <Pressable
        onPress={onNotificationPress}
        p="$2"
        borderRadius="$full"
        mt={Platform.OS === "ios" ? "$10" : "$4"}
        bg={FIXED_COLORS.background[950]}
        $pressed={{
          bg: FIXED_COLORS.background[700],
        }}
        position="absolute"
        right="$4"
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={FIXED_COLORS.text[50]}
        />
      </Pressable>
    </HStack>
  );
};
