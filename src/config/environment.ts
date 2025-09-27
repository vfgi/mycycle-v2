import Constants from "expo-constants";

export interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
  ENVIRONMENT: "development" | "production";
  ONESIGNAL_APP_ID: string;
}

type Environment = "development" | "production";

const getEnvironmentConfig = (): EnvironmentConfig => {
  const releaseChannel = Constants.expoConfig?.extra?.eas?.channel;
  const isDev = __DEV__;

  let environment: Environment = "development";
  let apiBaseUrl = "https://api.mycycle.com";

  const envFromExpo = process.env.EXPO_PUBLIC_ENVIRONMENT;
  const envFromNode = process.env.NODE_ENV;
  const envFromConstants = Constants.expoConfig?.extra?.environment;

  if (envFromExpo) {
    environment = envFromExpo as Environment;
  } else if (envFromNode) {
    environment = envFromNode as Environment;
  } else if (envFromConstants) {
    environment = envFromConstants as Environment;
  } else if (!isDev) {
    if (releaseChannel === "production" || releaseChannel === "main") {
      environment = "production";
    } else {
      environment = "production";
    }
  } else {
    environment = "development";
  }

  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  } else {
    switch (environment) {
      case "development":
        apiBaseUrl = "https://api.dev.mycycleht.com";
        break;
      case "production":
      default:
        apiBaseUrl = "https://api.mycycleht.com";
        break;
    }
  }

  const apiTimeout = process.env.EXPO_PUBLIC_API_TIMEOUT
    ? parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT, 10)
    : 30000;

  const oneSignalAppId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || 
    Constants.expoConfig?.extra?.oneSignalAppId || 
    "";

  return {
    API_BASE_URL: apiBaseUrl,
    API_TIMEOUT: apiTimeout,
    IS_PRODUCTION: environment === "production",
    IS_DEVELOPMENT: environment === "development",
    ENVIRONMENT: environment,
    ONESIGNAL_APP_ID: oneSignalAppId,
  };
};

export const ENV = getEnvironmentConfig();

export default ENV;
