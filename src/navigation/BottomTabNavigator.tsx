import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeScreen } from "../screens/home/HomeScreen";
import { WorkoutsScreen } from "../screens/workouts/WorkoutsScreen";
import { NutritionScreen } from "../screens/nutrition/NutritionScreen";
import { CalendarScreen } from "../screens/calendar/CalendarScreen";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";
import { Header, Menu } from "../components";
import { RootStackParamList } from "./AppNavigator";
import { notificationService } from "../services/notificationService";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export type BottomTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Nutrition: undefined;
  Calendar: undefined;
  Menu: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

type NavigationProp = StackNavigationProp<RootStackParamList>;
type TabNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

export const BottomTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const [tabNavigation, setTabNavigation] = React.useState<any>(null);

  const loadNotificationCount = async () => {
    try {
      const notifications =
        await notificationService.getAllScheduledNotifications();
      const activeNotifications = notifications.filter(
        (notification) => notification.isActive
      );
      setNotificationCount(activeNotifications.length);
    } catch (error) {
      console.error("Error loading notification count:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotificationCount();
    }, [])
  );

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
  };

  const handleMenuItemPress = (item: string) => {
    if (item === "home") {
      // Navegar para a tela Main (que contém o Tab Navigator) e depois para Home tab
      navigation.navigate("Main", { screen: "Home" });
    } else if (item === "settings") {
      navigation.navigate("Settings");
    } else if (item === "measurements") {
      navigation.navigate("Measurements");
    } else if (item === "goals") {
      navigation.navigate("Goals");
    } else if (item === "history") {
      navigation.navigate("History");
    }
  };

  return (
    <>
      <Tab.Navigator
        ref={(nav) => {
          if (nav && !tabNavigation) {
            setTabNavigation(nav);
          }
        }}
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          header: () => (
            <Header
              onNotificationPress={handleNotificationPress}
              notificationCount={notificationCount}
            />
          ),
          tabBarStyle: {
            backgroundColor: FIXED_COLORS.background[800],
            borderTopWidth: 0,
            height: Platform.OS === "ios" ? 80 : 50 + insets.bottom,
            paddingBottom:
              Platform.OS === "android"
                ? Math.max(insets.bottom, 8)
                : insets.bottom,
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarActiveTintColor: FIXED_COLORS.primary[600],
          tabBarInactiveTintColor: FIXED_COLORS.secondary[500],
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        <Tab.Screen
          name="Workouts"
          component={WorkoutsScreen}
          options={{
            tabBarLabel: t("navigation.workouts"),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="dumbbell" size={size - 4} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Nutrition"
          component={NutritionScreen}
          options={{
            tabBarLabel: t("navigation.nutrition"),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="food-variant"
                size={size - 4}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: t("navigation.home"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size + 8} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarLabel: t("navigation.calendar"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-number" size={size - 4} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={HomeScreen}
          options={{
            tabBarLabel: t("navigation.menu"),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu-outline" size={size - 4} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsMenuOpen(true);
            },
          }}
        />
      </Tab.Navigator>

      <Menu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onMenuItemPress={handleMenuItemPress}
      />
    </>
  );
};
