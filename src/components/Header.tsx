import React from "react";
import { HStack, Image, Pressable, VStack, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../theme/colors";
import { Platform } from "react-native";

const logoStandard = require("../../assets/logo-standard.png");

interface HeaderProps {
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationPress,
  notificationCount = 0,
}) => {
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

      <VStack
        position="absolute"
        right="$4"
        mt={Platform.OS === "ios" ? "$10" : "$4"}
      >
        <Pressable
          onPress={onNotificationPress}
          p="$2"
          borderRadius="$full"
          bg={FIXED_COLORS.background[950]}
          $pressed={{
            bg: FIXED_COLORS.background[700],
          }}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={FIXED_COLORS.text[50]}
          />
        </Pressable>

        {notificationCount > 0 && (
          <VStack
            position="absolute"
            top="$0"
            right="$0"
            bg={FIXED_COLORS.primary[600]}
            borderRadius="$full"
            minWidth="$5"
            minHeight="$5"
            alignItems="center"
            justifyContent="center"
            borderWidth={2}
            borderColor={FIXED_COLORS.background[950]}
          >
            <Text
              color={FIXED_COLORS.text[900]}
              fontSize="$xs"
              fontWeight="$bold"
              lineHeight="$xs"
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </Text>
          </VStack>
        )}
      </VStack>
    </HStack>
  );
};
