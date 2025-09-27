import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { UnitsProvider } from "./src/contexts/UnitsContext";
import { oneSignalService } from "./src/services/oneSignalService";
import { useSystemBars } from "./src/hooks/useSystemBars";
import "./src/i18n";
import "./src/utils/suppressWarnings";

export default function App() {
  // Configurar barras do sistema
  useSystemBars();

  useEffect(() => {
    // Inicializar OneSignal quando o app carrega
    oneSignalService.initialize().catch((error) => {
      console.error("Failed to initialize OneSignal:", error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <UnitsProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </UnitsProvider>
        <StatusBar
          style="light"
          backgroundColor="transparent"
          translucent={true}
        />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
