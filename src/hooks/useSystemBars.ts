import { useEffect } from "react";
import { Platform, AppState } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export const useSystemBars = () => {
  useEffect(() => {
    const configureSystemBars = async () => {
      if (Platform.OS === "android") {
        try {
          console.log("🔧 [SystemBars] Configuring navigation bar...");

          // Configurar a barra de navegação com fundo escuro e ícones brancos
          await NavigationBar.setBackgroundColorAsync("#161616");
          await NavigationBar.setButtonStyleAsync("light");

          // Garantir que a barra seja visível
          await NavigationBar.setVisibilityAsync("visible");

          // Usar comportamento normal (não overlay)
          await NavigationBar.setBehaviorAsync("inset-swipe");

          console.log("✅ [SystemBars] Navigation bar configured successfully");
        } catch (error) {
          console.warn(
            "❌ [SystemBars] Failed to configure navigation bar:",
            error
          );
        }
      }
    };

    // Configurar imediatamente
    configureSystemBars();

    // Reconfigurar quando o app volta ao foco
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        console.log("📱 [SystemBars] App became active, reconfiguring...");
        // Pequeno delay para garantir que o sistema está pronto
        setTimeout(configureSystemBars, 100);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);
};
