import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeScreen } from "../screens/home/HomeScreen";
import { WorkoutsScreen } from "../screens/workouts/WorkoutsScreen";
import { NutritionScreen } from "../screens/nutrition/NutritionScreen";
import { CalendarScreen } from "../screens/calendar/CalendarScreen";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";
import { Header, Menu } from "../components";
import { RootStackParamList } from "./AppNavigator";
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

export const BottomTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleNotificationPress = () => {
    // TODO: Implementar navegação para notificações
    console.log("Notification pressed");
  };

  const handleMenuItemPress = (item: string) => {
    console.log("Menu item pressed:", item);

    if (item === "settings") {
      navigation.navigate("Settings");
    }
    // TODO: Implementar navegação para outros itens do menu
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          header: () => (
            <Header onNotificationPress={handleNotificationPress} />
          ),
          tabBarStyle: {
            backgroundColor: FIXED_COLORS.background[800],
            borderTopWidth: 0,
            height: Platform.OS === "ios" ? 80 : 60,
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
