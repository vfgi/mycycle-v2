import React from "react";
import { VStack } from "@gluestack-ui/themed";
import { useAuth } from "../contexts/AuthContext";
import useAds from "../hooks/useAds";
import { DailyTipCard } from "./DailyTipCard";
import AdBanner from "./AdBanner";

interface DailyContentCardProps {
  // Props para customizar a dica do dia (opcional)
  title?: string;
  tip?: string;
  icon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  colors?: string[];

  // Props para customizar o banner de anúncio (opcional)
  adSize?:
    | "BANNER"
    | "LARGE_BANNER"
    | "MEDIUM_RECTANGLE"
    | "FULL_BANNER"
    | "LEADERBOARD";
  adMaxHeight?: number;
}

export const DailyContentCard: React.FC<DailyContentCardProps> = ({
  title,
  tip,
  icon,
  colors,
  adSize = "LARGE_BANNER",
  adMaxHeight = 100,
}) => {
  const { user } = useAuth();
  const { areAdsEnabled, isLoading } = useAds();

  // Verifica se o usuário é premium
  const isPremium = user?.is_premium || false;

  // Se for premium ou se os anúncios não estão habilitados, mostra a dica do dia
  if (isPremium || !areAdsEnabled || isLoading) {
    return <DailyTipCard title={title} tip={tip} icon={icon} colors={colors} />;
  }

  // Se não for premium e os anúncios estão habilitados, mostra o banner de anúncio
  return (
    <VStack>
      <AdBanner size={adSize} maxHeight={adMaxHeight} isPremium={isPremium} />
    </VStack>
  );
};
