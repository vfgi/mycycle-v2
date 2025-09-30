import { getAdIds } from "../config/ads";

const adConfig = {
  ...getAdIds(),
};

export interface AdsService {
  initialize(): Promise<void>;
  isInitialized(): boolean;
  getBannerId(): string;
  isPremium(): Promise<boolean>;
  isAdMobAvailable(): boolean;
}

class AdsServiceImpl implements AdsService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.isPremium();
      this.initialized = true;
    } catch (error) {
      console.warn("Failed to initialize ads service:", error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getBannerId(): string {
    return adConfig.bannerId;
  }

  async isPremium(): Promise<boolean> {
    return false;
  }

  isAdMobAvailable(): boolean {
    return !__DEV__;
  }
}

export const adsService = new AdsServiceImpl();

export const useAdsService = () => {
  return {
    initialize: adsService.initialize.bind(adsService),
    isInitialized: adsService.isInitialized.bind(adsService),
    getBannerId: adsService.getBannerId.bind(adsService),
    isPremium: adsService.isPremium.bind(adsService),
    isAdMobAvailable: adsService.isAdMobAvailable.bind(adsService),
  };
};

export const BannerAd = null;
export const BannerAdSize = null;
export const isAdMobAvailable = false;
