import React, { useState, useEffect } from "react";
import {
  VStack,
  Text,
  Image,
  ScrollView,
  HStack,
  Box,
} from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { CustomButton } from "../../components";
import { PremiumUpgradeDrawer } from "../../components";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import { workoutsService } from "../../services/workoutsService";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const EmptyWorkoutScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isPremium = user?.is_premium || false;
  const navigation = useNavigation<NavigationProp>();
  const [isUpgradeDrawerOpen, setIsUpgradeDrawerOpen] = useState(false);
  const [hasWorkouts, setHasWorkouts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      checkWorkouts();
    }, [])
  );

  const checkWorkouts = async () => {
    try {
      setIsLoading(true);
      const workouts = await workoutsService.getWorkouts();
      setHasWorkouts(workouts && workouts.length > 0);
    } catch (error) {
      console.error("Error checking workouts:", error);
      setHasWorkouts(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustom = () => {
    navigation.navigate("WorkoutSetup");
  };

  if (isLoading) {
    return (
      <ScrollView
        flex={1}
        backgroundColor={FIXED_COLORS.background[950]}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text color={FIXED_COLORS.text[400]}>{t("common.loading")}...</Text>
      </ScrollView>
    );
  }

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
            {hasWorkouts
              ? t("workouts.createNewPlan")
              : t("workouts.noWorkouts")}
          </Text>

          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$md"
            textAlign="center"
            maxWidth={300}
          >
            {hasWorkouts
              ? t("workouts.createNewPlanDescription")
              : t("workouts.createFirstPlan")}
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
          {/* <VStack
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
          </VStack> */}
        </VStack>

        {/* Card de Análise em Breve */}
        <VStack
          bg={FIXED_COLORS.background[800]}
          borderRadius="$lg"
          p="$4"
          borderWidth={2}
          borderColor={FIXED_COLORS.primary[500]}
          space="md"
          width="100%"
          maxWidth={400}
          mt="$4"
        >
          <HStack alignItems="center" space="sm">
            <Box bg={FIXED_COLORS.primary[500]} borderRadius="$full" p="$2">
              <Ionicons
                name="sparkles"
                size={20}
                color={FIXED_COLORS.background[0]}
              />
            </Box>
            <VStack flex={1}>
              <Text
                color={FIXED_COLORS.primary[500]}
                fontSize="$md"
                fontWeight="$bold"
              >
                {t("history.overview.comingSoon")}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                {t("history.overview.analysisFeatureDescription")}
              </Text>
            </VStack>
          </HStack>

          <VStack space="xs">
            <HStack alignItems="flex-start" space="sm">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={FIXED_COLORS.primary[500]}
                style={{ marginTop: 2 }}
              />
              <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                {t("history.overview.analysisFeatures.detailedAnalysis")}
              </Text>
            </HStack>

            <HStack alignItems="flex-start" space="sm">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={FIXED_COLORS.primary[500]}
                style={{ marginTop: 2 }}
              />
              <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                {t(
                  "history.overview.analysisFeatures.personalizedRecommendations"
                )}
              </Text>
            </HStack>

            <HStack alignItems="flex-start" space="sm">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={FIXED_COLORS.primary[500]}
                style={{ marginTop: 2 }}
              />
              <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                {t("history.overview.analysisFeatures.trendPrediction")}
              </Text>
            </HStack>

            <HStack alignItems="flex-start" space="sm">
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={FIXED_COLORS.primary[500]}
                style={{ marginTop: 2 }}
              />
              <Text color={FIXED_COLORS.text[50]} fontSize="$sm" flex={1}>
                {t(
                  "history.overview.analysisFeatures.mealAndWorkoutAdjustments"
                )}
              </Text>
            </HStack>
          </VStack>

          <Text
            color={FIXED_COLORS.text[300]}
            fontSize="$xs"
            textAlign="center"
            mt="$2"
          >
            {t("history.overview.analysisFeatures.andMore")}
          </Text>
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
