import { useState, useEffect } from "react";
import { adsService } from "../services/adsService";

export interface AdsHook {
  areAdsEnabled: boolean;
  getBannerId: () => Promise<string>;
  isLoading: boolean;
  isAdMobAvailable: boolean;
}

const useAds = (): AdsHook => {
  const [isLoading, setIsLoading] = useState(true);
  const [areAdsEnabled, setAreAdsEnabled] = useState(false);
  const [isAdMobAvailable, setIsAdMobAvailable] = useState(false);

  useEffect(() => {
    const initializeAds = async () => {
      try {
        setIsLoading(true);
        await adsService.initialize();

        const isPremium = await adsService.isPremium();
        const adMobAvailable = adsService.isAdMobAvailable();

        setAreAdsEnabled(!isPremium);
        setIsAdMobAvailable(adMobAvailable);
      } catch (error) {
        setAreAdsEnabled(false);
        setIsAdMobAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAds();
  }, []);

  const getBannerId = async (): Promise<string> => {
    return adsService.getBannerId();
  };

  return {
    areAdsEnabled,
    getBannerId,
    isLoading,
    isAdMobAvailable,
  };
};

export default useAds;

