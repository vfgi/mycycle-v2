import React from "react";
import { View, StyleSheet, Text } from "react-native";
import useAds from "../hooks/useAds";
import { FIXED_COLORS } from "../theme/colors";

interface AdBannerProps {
  size?:
    | "BANNER"
    | "LARGE_BANNER"
    | "MEDIUM_RECTANGLE"
    | "FULL_BANNER"
    | "LEADERBOARD";
  maxHeight?: number;
  className?: string;
  isPremium?: boolean;
}

const BANNER_DIMENSIONS = {
  BANNER: { width: 320, height: 50 },
  LARGE_BANNER: { width: 320, height: 100 },
  MEDIUM_RECTANGLE: { width: 300, height: 250 },
  FULL_BANNER: { width: 468, height: 60 },
  LEADERBOARD: { width: 728, height: 90 },
};

const AdBanner: React.FC<AdBannerProps> = ({
  size = "BANNER",
  maxHeight = 60,
  className = "",
  isPremium = false,
}) => {
  const { areAdsEnabled, getBannerId, isLoading } = useAds();
  const [bannerId, setBannerId] = React.useState<string>("");

  React.useEffect(() => {
    const loadBannerId = async () => {
      const id = await getBannerId();
      setBannerId(id);
    };

    if (areAdsEnabled && !isLoading) {
      loadBannerId();
    }
  }, [areAdsEnabled, isLoading, getBannerId]);

  if (isPremium || !areAdsEnabled || isLoading || !bannerId) {
    return null;
  }

  const bannerDimensions = BANNER_DIMENSIONS[size] || BANNER_DIMENSIONS.BANNER;
  const actualHeight = Math.min(bannerDimensions.height, maxHeight);

  if (__DEV__) {
    return (
      <View
        style={[
          styles.container,
          {
            height: actualHeight,
            maxHeight,
            width: "100%",
            backgroundColor: FIXED_COLORS.background[600],
            borderColor: FIXED_COLORS.background[700],
          },
          className as any,
        ]}
      >
        <Text
          style={[styles.placeholderText, { color: FIXED_COLORS.text[400] }]}
        >
          [{size} - {bannerDimensions.width}x{bannerDimensions.height}px]
        </Text>
        <Text
          style={[styles.placeholderSubtext, { color: FIXED_COLORS.text[500] }]}
        >
          Dev Mode - {actualHeight}px height
        </Text>
      </View>
    );
  }

  try {
    const {
      BannerAd,
      BannerAdSize,
    } = require("react-native-google-mobile-ads");

    const getBannerAdSize = () => {
      switch (size) {
        case "LARGE_BANNER":
          return BannerAdSize.LARGE_BANNER;
        case "MEDIUM_RECTANGLE":
          return BannerAdSize.MEDIUM_RECTANGLE;
        case "FULL_BANNER":
          return BannerAdSize.FULL_BANNER;
        case "LEADERBOARD":
          return BannerAdSize.LEADERBOARD;
        default:
          return BannerAdSize.BANNER;
      }
    };

    return (
      <View style={[styles.container, { maxHeight }, className as any]}>
        <BannerAd
          unitId={bannerId}
          size={getBannerAdSize()}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            keywords: ["fitness", "health", "workout", "nutrition"],
          }}
        />
      </View>
    );
  } catch (error) {
    return (
      <View
        style={[
          styles.container,
          {
            height: actualHeight,
            maxHeight,
            width: "100%",
            backgroundColor: FIXED_COLORS.background[600],
            borderColor: FIXED_COLORS.background[700],
          },
          className as any,
        ]}
      >
        <Text
          style={[styles.placeholderText, { color: FIXED_COLORS.text[400] }]}
        >
          [{size} - {bannerDimensions.width}x{bannerDimensions.height}px]
        </Text>
        <Text
          style={[styles.placeholderSubtext, { color: FIXED_COLORS.text[500] }]}
        >
          AdMob Unavailable - {actualHeight}px height
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: "600",
  },
  placeholderSubtext: {
    fontSize: 10,
    marginTop: 2,
  },
});

export default AdBanner;
