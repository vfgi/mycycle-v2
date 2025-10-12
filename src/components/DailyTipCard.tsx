import React from "react";
import { VStack, HStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";

interface DailyTipCardProps {
  title?: string;
  tip?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  colors?: string[];
}

const dailyTips = [
  {
    title: "Hidratação",
    tip: "Beba pelo menos 2 litros de água por dia para manter seu corpo hidratado e acelerar o metabolismo.",
    icon: "water-outline" as keyof typeof Ionicons.glyphMap,
    colors: [FIXED_COLORS.primary[500], FIXED_COLORS.secondary[300]],
  },
  {
    title: "Descanso",
    tip: "Durma de 7-9 horas por noite. O sono adequado é essencial para a recuperação muscular e queima de gordura.",
    icon: "moon-outline" as keyof typeof Ionicons.glyphMap,
    colors: ["#6366f1", "#8b5cf6"],
  },
  {
    title: "Proteína",
    tip: "Consuma proteína em todas as refeições. Ela ajuda na construção muscular e aumenta a saciedade.",
    icon: "nutrition-outline" as keyof typeof Ionicons.glyphMap,
    colors: [FIXED_COLORS.success[500], "#10b981"],
  },
  {
    title: "Movimento",
    tip: "Faça pelo menos 30 minutos de atividade física por dia, mesmo que seja uma caminhada.",
    icon: "walk-outline" as keyof typeof Ionicons.glyphMap,
    colors: ["#f59e0b", "#f97316"],
  },
  {
    title: "Consistência",
    tip: "Pequenos hábitos diários são mais eficazes que grandes mudanças esporádicas. Seja consistente!",
    icon: "checkmark-circle-outline" as keyof typeof Ionicons.glyphMap,
    colors: ["#ef4444", "#ec4899"],
  },
];

export const DailyTipCard: React.FC<DailyTipCardProps> = ({
  title,
  tip,
  icon,
  colors,
}) => {
  const { t } = useTranslation();

  const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
  const displayTitle = title || randomTip.title;
  const displayTip = tip || randomTip.tip;
  const displayIcon = icon || randomTip.icon;
  const displayColors = colors || randomTip.colors;

  return (
    <LinearGradient
      colors={displayColors as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <VStack space="sm">
        <HStack alignItems="center" space="sm">
          <Box
            bg={FIXED_COLORS.background[0]}
            borderRadius="$full"
            p="$2"
            opacity={0.9}
          >
            <Ionicons name={displayIcon} size={20} color={displayColors[0]} />
          </Box>
          <Text
            color={FIXED_COLORS.background[0]}
            fontSize="$lg"
            fontWeight="$bold"
            flex={1}
          >
            💡 Dica do Dia: {displayTitle}
          </Text>
        </HStack>

        <Text
          color={FIXED_COLORS.background[0]}
          fontSize="$sm"
          lineHeight="$sm"
          opacity={0.9}
        >
          {displayTip}
        </Text>
      </VStack>
    </LinearGradient>
  );
};
