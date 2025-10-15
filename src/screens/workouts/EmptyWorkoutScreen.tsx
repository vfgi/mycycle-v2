import React, { useState } from "react";
import { VStack, Text, Image, ScrollView } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { CustomButton } from "../../components";
import { PremiumUpgradeDrawer } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const EmptyWorkoutScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPremium = user?.is_premium || false;
  const navigation = useNavigation<NavigationProp>();
  const [isUpgradeDrawerOpen, setIsUpgradeDrawerOpen] = useState(false);

  const handleCreateCustom = () => {
    navigation.navigate("WorkoutSetup");
  };

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 24,
        minHeight: "100%",
      }}
      backgroundColor={FIXED_COLORS.background[950]}
      showsVerticalScrollIndicator={false}
    >
      <VStack
        justifyContent="center"
        alignItems="center"
        space="lg"
        width="100%"
      >
        {/* Ícone de treino vazio */}
        <VStack alignItems="center" space="md">
          <Image
            source={require("../../../assets/commom-icons/punch-bag.png")}
            alt="Empty workouts"
            width={120}
            height={120}
            resizeMode="contain"
          />

          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$2xl"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("workouts.noWorkouts")}
          </Text>

          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$md"
            textAlign="center"
            maxWidth={300}
          >
            {t("workouts.noWorkoutsDescription")}
          </Text>
        </VStack>

        {/* Opções de criação */}
        <VStack space="md" width="100%" maxWidth={400}>
          {/* Criar plano próprio */}
          <VStack
            borderWidth={1}
            borderColor={FIXED_COLORS.background[0]}
            borderRadius="$lg"
            p="$4"
            space="xs"
          >
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
              textAlign="center"
            >
              {t("workouts.createCustomPlan")}
            </Text>

            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$sm"
              textAlign="center"
              lineHeight="$sm"
            >
              {t("workouts.customPlanDescription")}
            </Text>

            <CustomButton
              text={t("workouts.startCreating")}
              onPress={handleCreateCustom}
              bg={FIXED_COLORS.primary[600]}
            />
          </VStack>

          {/* Criar com IA */}
          <VStack
            borderWidth={1}
            borderColor={FIXED_COLORS.background[0]}
            borderRadius="$lg"
            p="$4"
            space="xs"
          >
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
              textAlign="center"
            >
              {t("workouts.createWithAI")}
            </Text>

            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$sm"
              textAlign="center"
              lineHeight="$sm"
            >
              {t("workouts.aiPlanDescription")}
            </Text>

            <CustomButton
              text={
                isPremium ? t("workouts.startWithAI") : t("workouts.goPremium")
              }
              onPress={() => setIsUpgradeDrawerOpen(true)}
              bg={FIXED_COLORS.primary[600]}
            />

            {!isPremium && (
              <Text
                color={FIXED_COLORS.text[500]}
                fontSize="$xs"
                textAlign="center"
              >
                {t("workouts.aiFeaturePremium")}
              </Text>
            )}
          </VStack>
        </VStack>
      </VStack>

      {/* Premium Upgrade Drawer */}
      <PremiumUpgradeDrawer
        isOpen={isUpgradeDrawerOpen}
        onClose={() => setIsUpgradeDrawerOpen(false)}
        onUpgrade={(planId) => {
          setIsUpgradeDrawerOpen(false);
          // TODO: Implementar lógica de upgrade
        }}
      />
    </ScrollView>
  );
};
