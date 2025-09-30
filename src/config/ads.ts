import { Platform } from "react-native";

export const AD_CONFIG = {
  test: {
    bannerId: "ca-app-pub-3940256099942544/6300978111",
  },

  production: {
    bannerId:
      Platform.OS === "ios"
        ? "ca-app-pub-6187420726942020/4625556932"
        : "ca-app-pub-6187420726942020/8737026480",
  },

  keywords: ["health", "nutrition", "diet", "fitness", "workout"],
};

export const getAdIds = () => {
  if (__DEV__) {
    return AD_CONFIG.test;
  }
  return AD_CONFIG.production;
};

export const getAdRequestOptions = () => ({
  requestNonPersonalizedAdsOnly: true,
  keywords: AD_CONFIG.keywords,
});

