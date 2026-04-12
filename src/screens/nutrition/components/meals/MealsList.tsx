import React, { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { MealCard } from "./MealCard";
import { MealDetailsDrawer } from "./MealDetailsDrawer";
import { AiMealAnalysisDrawer } from "./AiMealAnalysisDrawer";
import { mealsService } from "../../../../services/mealsService";
import { mealsHistoryService } from "../../../../services/mealsHistoryService";
import { useToast } from "../../../../hooks/useToast";
import { useAuth } from "../../../../contexts/AuthContext";
import { Meal } from "./types";
import { captureMealPhotoWithCamera } from "../../utils/captureMealPhoto";
import { analyzeMealPhoto } from "../../../../services/aiMealPhotoService";
import type { MealPhotoAnalysisResult } from "../../../../types/mealPhotoAiAnalysis";
import {
  buildNutritionDataFromGemini,
  hasAiDetectedFood,
} from "../../utils/buildNutritionDataFromGemini";
import {
  getMealImageForType,
  normalizeMealType,
  sortMealsByLocalTimeOfDay,
} from "../../utils/mealPresentation";
import {
  getMealAiPhotoQuota,
  incrementMealAiPhotoUsage,
  AI_MEAL_PHOTO_DAILY_LIMIT,
} from "../../../../services/mealAiPhotoUsageStorage";

interface MealsListProps {
  onViewAll?: () => void;
  onMealConsumptionChange?: () => void;
}

export const MealsList: React.FC<MealsListProps> = ({
  onViewAll,
  onMealConsumptionChange,
}) => {
  const { t, getCurrentLanguage } = useTranslation();
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAnalyzingMealPhoto, setIsAnalyzingMealPhoto] = useState(false);
  const [aiMealAnalysis, setAiMealAnalysis] =
    useState<MealPhotoAnalysisResult | null>(null);
  const [aiMealPhotoUri, setAiMealPhotoUri] = useState<string | null>(null);
  const [isAiAnalysisDrawerOpen, setIsAiAnalysisDrawerOpen] = useState(false);
  const [isSavingAiScan, setIsSavingAiScan] = useState(false);
  const [aiPhotoRemaining, setAiPhotoRemaining] = useState(
    AI_MEAL_PHOTO_DAILY_LIMIT,
  );

  const refreshAiPhotoQuota = React.useCallback(async () => {
    const q = await getMealAiPhotoQuota();
    setAiPhotoRemaining(q.remaining);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadMeals();
      void refreshAiPhotoQuota();
    }, []),
  );

  const loadMeals = async () => {
    try {
      setIsLoading(true);

      // Usar data local do dispositivo em vez de UTC
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const response = await mealsService.getMealsWithNutrition(todayLocal);
      const data = response?.meals || [];

      if (!data || !Array.isArray(data)) {
        setMeals([]);
        return;
      }

      const mealsWithDefaults = data.map((meal) => {
        const totals = mealsService.calculateMealTotals(meal);
        const mealType = normalizeMealType(meal.meal_type);

        const isConsumedToday = meal.last_consumed_at
          ? meal.last_consumed_at.split("T")[0] === todayLocal
          : false;

        const scheduled =
          meal.scheduled_time ??
          (meal as { time?: string }).time ??
          "";

        return {
          ...meal,
          active: meal.is_active,
          is_consumed: isConsumedToday,
          calories: totals.calories,
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat,
          fiber: totals.fiber,
          meal_type: mealType,
          time: scheduled,
          scheduled_time: meal.scheduled_time,
          image: getMealImageForType(mealType),
          ingredients: meal.ingredients.map((ingredient) => ({
            ...ingredient,
            unit: "g",
          })),
        };
      });
      setMeals(mealsWithDefaults);
    } catch (error) {
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const mealsToShow = useMemo(
    () =>
      sortMealsByLocalTimeOfDay(meals.filter((meal) => meal.active)),
    [meals]
  );

  const handleMealPress = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsDrawerOpen(true);
  };

  const handleToggleConsumed = async (mealId: string) => {
    try {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal) return;

      const now = new Date();
      // Usar data local do dispositivo
      const todayLocal = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (!meal.is_consumed) {
        // Adicionar ao histórico
        const nutritionData = {
          total_calories: meal.calories || 0,
          total_protein: meal.protein || 0,
          total_carbs: meal.carbs || 0,
          total_fat: meal.fat || 0,
          total_fiber: 0, // Não temos este dado no tipo Meal
          total_sodium: 0, // Não temos este dado
          total_sugar: 0, // Não temos este dado
          ingredients:
            meal.ingredients?.map((ingredient) => ({
              name: ingredient.name,
              quantity: ingredient.quantity || 0,
              unit: ingredient.unit || "g",
              calories:
                (ingredient.calories_per_unit || 0) *
                (ingredient.quantity || 0),
              protein:
                (ingredient.protein_per_unit || 0) * (ingredient.quantity || 0),
              carbs:
                (ingredient.carbs_per_unit || 0) * (ingredient.quantity || 0),
              fat: (ingredient.fat_per_unit || 0) * (ingredient.quantity || 0),
            })) || [],
        };

        // Criar ISO string com a data/hora local (não UTC)
        const localISOString = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000
        ).toISOString();

        const mealPayload = {
          meal_id: mealId,
          recorded_at: localISOString,
          timezone,
          nutrition_data: nutritionData,
          notes: `${meal.meal_type} - ${meal.name}`,
        };

        await mealsHistoryService.addMealToHistory(mealPayload);

        showSuccess(t("nutrition.meals.addedToHistory"));
      } else {
        // Remover do histórico
        await mealsHistoryService.removeMealFromHistory({
          meal_id: mealId,
          date: todayLocal,
          client_id: user?.id,
        });

        showSuccess(t("nutrition.meals.removedFromHistory"));
      }

      // Recarregar dados para obter informações atualizadas
      await loadMeals();

      // Notificar o componente pai para atualizar o gráfico
      if (onMealConsumptionChange) {
        onMealConsumptionChange();
      }
    } catch (error) {
      showError(t("nutrition.meals.toggleError"));
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMeal(null);
  };

  const handleCloseAiAnalysisDrawer = () => {
    setIsAiAnalysisDrawerOpen(false);
  };

  useEffect(() => {
    if (!isAiAnalysisDrawerOpen) {
      const id = setTimeout(() => {
        setAiMealAnalysis(null);
        setAiMealPhotoUri(null);
      }, 400);
      return () => clearTimeout(id);
    }
  }, [isAiAnalysisDrawerOpen]);

  const executePhotoMealWithAI = async () => {
    const quotaBefore = await getMealAiPhotoQuota();
    if (quotaBefore.remaining <= 0) {
      showError(t("nutrition.meals.aiPhotoNoUsesLeft"));
      await refreshAiPhotoQuota();
      return;
    }

    try {
      const capture = await captureMealPhotoWithCamera();
      if (capture.status === "permission_denied") {
        showError(t("nutrition.meals.cameraPermissionDenied"));
        return;
      }
      if (capture.status === "cancelled") {
        return;
      }

      const quotaAfterCapture = await getMealAiPhotoQuota();
      if (quotaAfterCapture.remaining <= 0) {
        showError(t("nutrition.meals.aiPhotoNoUsesLeft"));
        await refreshAiPhotoQuota();
        return;
      }

      setIsAnalyzingMealPhoto(true);
      const analysis = await analyzeMealPhoto(
        capture.photo,
        getCurrentLanguage()
      );
      await incrementMealAiPhotoUsage();
      await refreshAiPhotoQuota();
      setAiMealAnalysis(analysis);
      setAiMealPhotoUri(capture.photo.uri);
      setIsAiAnalysisDrawerOpen(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : t("nutrition.meals.mealPhotoAnalysisError");
      showError(message || t("nutrition.meals.mealPhotoAnalysisError"));
    } finally {
      setIsAnalyzingMealPhoto(false);
    }
  };

  const handlePhotoMealAIPress = () => {
    void (async () => {
      const q = await getMealAiPhotoQuota();
      setAiPhotoRemaining(q.remaining);
      if (q.remaining <= 0) {
        Alert.alert(
          t("nutrition.meals.aiPhotoIntroTitle"),
          t("nutrition.meals.aiPhotoNoUsesLeft"),
          [{ text: t("common.confirm"), style: "default" }],
        );
        return;
      }
      const message = `${t("nutrition.meals.aiPhotoIntroBody")}\n\n${t(
        "nutrition.meals.aiPhotoQuotaLine",
        {
          remaining: q.remaining,
          max: AI_MEAL_PHOTO_DAILY_LIMIT,
        },
      )}`;
      Alert.alert(t("nutrition.meals.aiPhotoIntroTitle"), message, [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.continue"),
          onPress: () => {
            void executePhotoMealWithAI();
          },
        },
      ]);
    })();
  };

  const handleSaveAiScan = async () => {
    if (!aiMealAnalysis) return;
    if (!hasAiDetectedFood(aiMealAnalysis)) {
      console.log(
        "[MealPhotoAI] Nenhum alimento detectado — salvamento ignorado.",
        JSON.stringify(aiMealAnalysis, null, 2)
      );
      showError(t("nutrition.meals.aiScanNoFoodDetected"));
      return;
    }
    try {
      setIsSavingAiScan(true);
      const now = new Date();
      const localISOString = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const nutrition_data = buildNutritionDataFromGemini(aiMealAnalysis);
      const mealName =
        aiMealAnalysis.prato?.trim() ||
        t("nutrition.meals.aiAnalysisTitle");
      const scanReturn = await mealsHistoryService.saveScannedMealToHistory({
        recorded_at: localISOString,
        timezone,
        nutrition_data,
        meal_name: mealName,
        notes: t("nutrition.meals.aiScanHistoryNote", { name: mealName }),
      });
      console.log(
        "[MealPhotoAI] retorno meals/history/scan:",
        JSON.stringify(scanReturn ?? null, null, 2)
      );
      showSuccess(t("nutrition.meals.aiScanSaveSuccess"));
      handleCloseAiAnalysisDrawer();
      await loadMeals();
      if (onMealConsumptionChange) {
        onMealConsumptionChange();
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : t("nutrition.meals.aiScanSaveError");
      showError(msg || t("nutrition.meals.aiScanSaveError"));
    } finally {
      setIsSavingAiScan(false);
    }
  };

  return (
    <VStack space="md">
      <HStack justifyContent="space-between" alignItems="center">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$semibold"
        >
          {t("nutrition.meals.meals")}
        </Text>

        <HStack space="sm" alignItems="center" flexShrink={1} flexWrap="wrap">
          <Button
            onPress={() => navigation.navigate("CreateMeal" as never)}
            size="sm"
            bg={FIXED_COLORS.warning[500]}
            borderRadius="$md"
            isDisabled={isAnalyzingMealPhoto}
          >
            <HStack alignItems="center" space="xs">
              <Ionicons
                name="add-circle"
                size={16}
                color={FIXED_COLORS.text[950]}
              />
              <ButtonText
                color={FIXED_COLORS.text[950]}
                fontSize="$xs"
                fontWeight="$semibold"
              >
                {t("nutrition.meals.create")}
              </ButtonText>
            </HStack>
          </Button>

          <Button
            onPress={handlePhotoMealAIPress}
            size="sm"
            bg={FIXED_COLORS.primary[600]}
            borderRadius="$md"
            isDisabled={isAnalyzingMealPhoto}
            px="$3"
            py="$2"
          >
            <VStack alignItems="center" space="xs">
              <HStack alignItems="center" space="xs">
                <Ionicons
                  name="camera-outline"
                  size={16}
                  color={FIXED_COLORS.text[950]}
                />
                <Ionicons
                  name="sparkles"
                  size={14}
                  color={FIXED_COLORS.text[950]}
                />
                <ButtonText
                  color={FIXED_COLORS.text[950]}
                  fontSize="$xs"
                  fontWeight="$semibold"
                  numberOfLines={1}
                >
                  {isAnalyzingMealPhoto
                    ? t("nutrition.meals.analyzingMealPhoto")
                    : t("nutrition.meals.photoMealAI")}
                </ButtonText>
              </HStack>
              <Text
                color={FIXED_COLORS.text[950]}
                fontSize="$2xs"
                fontWeight="$medium"
                opacity={0.82}
                textAlign="center"
              >
                {t("nutrition.meals.aiPhotoUsesBadge", {
                  remaining: aiPhotoRemaining,
                  max: AI_MEAL_PHOTO_DAILY_LIMIT,
                })}
              </Text>
            </VStack>
          </Button>

          {onViewAll && (
            <Pressable onPress={onViewAll}>
              <HStack alignItems="center" space="xs">
                <Text
                  color={FIXED_COLORS.primary[500]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("nutrition.meals.viewAll")}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={FIXED_COLORS.primary[500]}
                />
              </HStack>
            </Pressable>
          )}
        </HStack>
      </HStack>

      {isLoading ? (
        <VStack space="sm">
          <Text color={FIXED_COLORS.text[400]} textAlign="center">
            {t("common.loading")}
          </Text>
        </VStack>
      ) : mealsToShow.length === 0 ? (
        <VStack space="sm" alignItems="center" py="$8">
          <Ionicons
            name="restaurant-outline"
            size={48}
            color={FIXED_COLORS.text[400]}
          />
          <Text color={FIXED_COLORS.text[400]} textAlign="center">
            {t("nutrition.meals.noMeals")}
          </Text>
        </VStack>
      ) : (
        <VStack space="sm">
          {mealsToShow.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => handleMealPress(meal)}
              onToggleConsumed={() => handleToggleConsumed(meal.id)}
            />
          ))}
        </VStack>
      )}

      <MealDetailsDrawer
        meal={selectedMeal}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      <AiMealAnalysisDrawer
        analysis={aiMealAnalysis}
        photoUri={aiMealPhotoUri}
        isOpen={isAiAnalysisDrawerOpen}
        onClose={handleCloseAiAnalysisDrawer}
        onConfirmSave={handleSaveAiScan}
        isSaving={isSavingAiScan}
      />
    </VStack>
  );
};
