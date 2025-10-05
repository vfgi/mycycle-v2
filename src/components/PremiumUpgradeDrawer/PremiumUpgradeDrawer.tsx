import React, { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  ScrollView,
  Pressable,
} from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { CustomButton, CustomDrawer } from "../";
import { getPremiumPlans, PremiumPlan, CURRENCY_SYMBOLS } from "./premiumPlans";

interface PremiumUpgradeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (planId: string) => void;
}

export const PremiumUpgradeDrawer: React.FC<PremiumUpgradeDrawerProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen]);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const plansData = await getPremiumPlans();
      setPlans(plansData);
    } catch (error) {
      console.error("Error loading premium plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    if (selectedPlan) {
      onUpgrade(selectedPlan);
    }
  };

  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose} minHeight={650}>
      <VStack flex={1} minHeight={400}>
        {/* Header */}
        <VStack p="$6" pb="$4" space="md">
          <HStack justifyContent="space-between" alignItems="center">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$2xl"
              fontWeight="$bold"
            >
              {t("premium.upgradeTitle")}
            </Text>
            <Pressable onPress={onClose}>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$lg"
                fontWeight="$bold"
              >
                ✕
              </Text>
            </Pressable>
          </HStack>

          <Text
            color={FIXED_COLORS.text[300]}
            fontSize="$md"
            textAlign="center"
            lineHeight="$md"
          >
            {t("premium.upgradeDescription")}
          </Text>
        </VStack>

        {/* Content */}
        <ScrollView
          flex={1}
          px="$6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            minHeight: 200,
          }}
        >
          {isLoading ? (
            <VStack alignItems="center" py="$8">
              <Text color={FIXED_COLORS.text[400]} fontSize="$md">
                {t("common.loading")}
              </Text>
            </VStack>
          ) : (
            <VStack space="lg" pb="$6">
              {/* Planos */}
              {plans.map((plan) => (
                <VStack
                  key={plan.id}
                  borderWidth={1}
                  borderColor={
                    selectedPlan === plan.id
                      ? FIXED_COLORS.primary[600]
                      : FIXED_COLORS.background[600]
                  }
                  borderRadius="$lg"
                  p="$4"
                  space="md"
                  bg={FIXED_COLORS.background[900]}
                >
                  <Pressable onPress={() => setSelectedPlan(plan.id)}>
                    <VStack space="sm">
                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <VStack>
                          <Text
                            color={FIXED_COLORS.text[50]}
                            fontSize="$lg"
                            fontWeight="$bold"
                          >
                            {t(plan.nameKey)}
                          </Text>
                          {/* {plan.isPopular && (
                            <Text
                              color={FIXED_COLORS.primary[500]}
                              fontSize="$xs"
                              fontWeight="$bold"
                            >
                              {t("premium.mostPopular")}
                            </Text>
                          )} */}
                        </VStack>

                        <VStack alignItems="flex-end">
                          <Text
                            color={FIXED_COLORS.text[50]}
                            fontSize="$2xl"
                            fontWeight="$bold"
                          >
                            {CURRENCY_SYMBOLS[plan.currency] || plan.currency}{" "}
                            {plan.price.toFixed(2)}
                          </Text>
                          <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                            {t("premium.perMonth")}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Features */}
                      <VStack space="xs" mt="$2">
                        {plan.features.map((feature, index) => (
                          <HStack key={index} alignItems="center" space="sm">
                            <Text
                              color={FIXED_COLORS.success[500]}
                              fontSize="$sm"
                            >
                              ✓
                            </Text>
                            <Text
                              color={FIXED_COLORS.text[300]}
                              fontSize="$sm"
                              flex={1}
                            >
                              {t(feature)}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
                  </Pressable>
                </VStack>
              ))}
            </VStack>
          )}
        </ScrollView>

        {/* Footer */}
        <VStack
          p="$6"
          pt="$4"
          borderTopWidth={1}
          borderTopColor={FIXED_COLORS.background[600]}
        >
          <CustomButton
            text={t("premium.upgradeNow")}
            onPress={handleUpgrade}
            isLoading={isLoading}
            isDisabled={!selectedPlan}
          />

          <Text
            color={FIXED_COLORS.text[500]}
            fontSize="$xs"
            textAlign="center"
            mt="$2"
          >
            {t("premium.termsAndConditions")}
          </Text>
        </VStack>
      </VStack>
    </CustomDrawer>
  );
};
