export interface PremiumPlan {
  id: string;
  nameKey: string; // Chave de tradução para o nome
  price: number;
  currency: string;
  period: "monthly" | "yearly";
  originalPrice?: number; // Para mostrar desconto
  discount?: number; // Percentual de desconto
  features: string[]; // Chaves de tradução para as features
  isPopular?: boolean;
  isRecommended?: boolean;
}

// Mapeamento de currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  BRL: "R$",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
};

// Mock data - atualmente apenas um plano
export const premiumPlans: PremiumPlan[] = [
  {
    id: "premium-monthly",
    nameKey: "premium.plans.premium",
    price: 19.99,
    currency: "EUR",
    period: "monthly",
    features: [
      "premium.plans.features.aiWorkoutGeneration",
      "premium.plans.features.personalizedPlans",
      "premium.plans.features.advancedProgressTracking",
      "premium.plans.features.exerciseLibrary",
      "premium.plans.features.virtualPersonalTrainer",
      "premium.plans.features.intelligentPerformanceAnalysis",
      "premium.plans.features.detailedEvolutionReports",
      "premium.plans.features.deviceSync",
      "premium.plans.features.automaticBackup",
    ],
    isPopular: true,
    isRecommended: true,
  },
];

// Função para simular carregamento dos planos
export const getPremiumPlans = async (): Promise<PremiumPlan[]> => {
  // Simula delay da API
  await new Promise((resolve) => setTimeout(resolve, 500));
  return premiumPlans;
};
