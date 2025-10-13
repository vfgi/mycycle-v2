import React, { useState, useEffect } from "react";
import { Animated, Dimensions, Platform, TouchableOpacity } from "react-native";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Modal,
  ModalBackdrop,
  Image,
} from "@gluestack-ui/themed";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../contexts/AuthContext";
import { userStorage } from "../services/userStorage";
import { User } from "../types/auth";
import { HelpDrawer } from "./HelpDrawer";
import { AboutDrawer } from "./AboutDrawer";

const logoStandard = require("../../assets/logo-standard.png");

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemPress: (item: string) => void;
}

export const Menu: React.FC<MenuProps> = ({
  isOpen,
  onClose,
  onMenuItemPress,
}) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(false);
  const [isAboutDrawerOpen, setIsAboutDrawerOpen] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const slideAnim = React.useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userData = await userStorage.getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
    };

    if (isOpen) {
      loadUserFromStorage();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim, screenWidth]);

  const mainMenuItems = [
    { key: "home", icon: "home", label: t("navigation.home") },
    {
      key: "measurements",
      icon: "body-outline",
      label: t("navigation.measurements"),
    },
    { key: "goals", icon: "trophy-outline", label: t("navigation.goals") },
    {
      key: "calendar",
      icon: "calendar-number",
      label: t("navigation.calendar"),
    },
    {
      key: "settings",
      icon: "settings-outline",
      label: t("navigation.settings"),
    },
  ];

  const bottomMenuItems = [
    { key: "help", icon: "help-circle-outline", label: t("navigation.help") },
    {
      key: "about",
      icon: "information-circle-outline",
      label: t("navigation.about"),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: screenWidth * 0.8,
          height: "100%",
          transform: [{ translateX: slideAnim }],
        }}
      >
        <VStack
          bg={FIXED_COLORS.background[800]}
          h="$full"
          p="$6"
          space="lg"
          borderTopRightRadius="$xl"
          borderBottomRightRadius="$xl"
          justifyContent="space-between"
        >
          <VStack space="lg">
            {/* Logo */}
            <VStack
              alignItems="flex-start"
              mb="$0"
              mt={Platform.OS === "ios" ? "$8" : "$2"}
            >
              <Image
                source={logoStandard}
                alt="Logo"
                width={120}
                height={30}
                resizeMode="contain"
              />
            </VStack>

            {/* Profile Card */}
            <Pressable
              onPress={() => {
                onMenuItemPress("profile");
                onClose();
              }}
              $pressed={{
                opacity: 0.8,
              }}
            >
              <VStack
                bg={FIXED_COLORS.background[700]}
                borderRadius="$lg"
                p="$4"
                mb="$4"
              >
                <HStack alignItems="center" justifyContent="space-between">
                  <HStack alignItems="center" space="md" flex={1}>
                    {user?.image ? (
                      <Image
                        source={{ uri: user.image }}
                        alt="Profile"
                        width={60}
                        height={60}
                        borderRadius={48}
                        resizeMode="cover"
                      />
                    ) : (
                      <FontAwesome
                        name="user-circle"
                        size={48}
                        color={FIXED_COLORS.primary[600]}
                      />
                    )}
                    <VStack flex={1}>
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$lg"
                        fontWeight="$bold"
                      >
                        {user?.name || "Usuário"}
                      </Text>
                      <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                        {user?.email || "email@exemplo.com"}
                      </Text>
                    </VStack>
                  </HStack>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={FIXED_COLORS.text[400]}
                  />
                </HStack>
              </VStack>
            </Pressable>

            {/* Main Menu Items */}
            {mainMenuItems.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => {
                  if (item.key === "home") {
                    onClose();
                    setTimeout(() => {
                      onMenuItemPress(item.key);
                    }, 300);
                  } else {
                    onMenuItemPress(item.key);
                    onClose();
                  }
                }}
                p="$3"
                borderRadius="$md"
                $pressed={{
                  bg: FIXED_COLORS.background[700],
                }}
              >
                <HStack space="md" alignItems="center">
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={FIXED_COLORS.text[50]}
                  />
                  <Text color={FIXED_COLORS.text[50]} fontSize="$md">
                    {item.label}
                  </Text>
                </HStack>
              </Pressable>
            ))}

            {/* Bottom Menu Items */}
          </VStack>
          <VStack space="xs" mt="$6">
            {bottomMenuItems.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => {
                  if (item.key === "help") {
                    setIsHelpDrawerOpen(true);
                  } else if (item.key === "about") {
                    setIsAboutDrawerOpen(true);
                  } else {
                    onMenuItemPress(item.key);
                    onClose();
                  }
                }}
                p="$3"
                borderRadius="$md"
                $pressed={{
                  bg: FIXED_COLORS.background[700],
                }}
              >
                <HStack space="md" alignItems="center">
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={FIXED_COLORS.text[400]}
                  />
                  <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                    {item.label}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
          <TouchableOpacity onPress={handleLogout}>
            <HStack
              flexDirection="row"
              alignItems="center"
              gap="$4"
              cursor="pointer"
              borderWidth={1}
              borderColor={FIXED_COLORS.error[500]}
              borderRadius="$md"
              p="$2"
              mb={Platform.OS === "android" ? "$8" : "$0"}
            >
              <FontAwesome
                name="sign-out"
                size={24}
                color={FIXED_COLORS.error[500]}
              />
              <Text color={FIXED_COLORS.primary[600]} fontSize="$md">
                {t("home.logout")}
              </Text>
            </HStack>
          </TouchableOpacity>
        </VStack>
      </Animated.View>

      {/* Help Drawer */}
      <HelpDrawer
        isOpen={isHelpDrawerOpen}
        onClose={() => setIsHelpDrawerOpen(false)}
      />

      {/* About Drawer */}
      <AboutDrawer
        isOpen={isAboutDrawerOpen}
        onClose={() => setIsAboutDrawerOpen(false)}
      />
    </Modal>
  );
};
