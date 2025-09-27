import React from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import "./src/i18n";
import "./src/utils/suppressWarnings";

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <AppNavigator />
        <StatusBar style="light" backgroundColor="transparent" translucent />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
