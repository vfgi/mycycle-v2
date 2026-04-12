import React from "react";
import { ImageBackground, ScrollView } from "react-native";
import {
  VStack,
  HStack,
  Text,
  Box,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CustomDrawer } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useUnits } from "../../../../contexts/UnitsContext";
import type { MealPhotoAnalysisResult } from "../../../../types/mealPhotoAiAnalysis";
import { hasAiDetectedFood } from "../../utils/buildNutritionDataFromGemini";

const defaultMealImage = require("../../../../../assets/images/food/lunch.jpg");

interface AiMealAnalysisDrawerProps {
  analysis: MealPhotoAnalysisResult | null;
  photoUri: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: () => void | Promise<void>;
  isSaving?: boolean;
}

export const AiMealAnalysisDrawer: React.FC<AiMealAnalysisDrawerProps> = ({
  analysis,
  photoUri,
  isOpen,
  onClose,
  onConfirmSave,
  isSaving = false,
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();

  if (!analysis) return null;

  const nd = analysis.nutrition_data;
  const calories =
    nd?.total_calories ?? analysis.calorias_totais ?? 0;
  const protein =
    nd?.total_protein ?? analysis.macros?.proteina ?? 0;
  const carbs = nd?.total_carbs ?? analysis.macros?.carbo ?? 0;
  const fat = nd?.total_fat ?? analysis.macros?.gordura ?? 0;
  const fiber = nd?.total_fiber;
  const sodium = nd?.total_sodium;
  const sugar = nd?.total_sugar;
  const ingredients = nd?.ingredients ?? [];

  const proteinC = convertMacronutrient(protein);
  const carbsC = convertMacronutrient(carbs);
  const fatC = convertMacronutrient(fat);
  const unit = getMacroUnit();

  const title = analysis.prato?.trim() || t("nutrition.meals.aiAnalysisTitle");
  const itensText =
    analysis.itens?.filter(Boolean).join(" • ") ?? "";
  const canSaveScan = hasAiDetectedFood(analysis);

  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose} minHeight={650}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
      >
        <VStack space="lg">
          <Box borderRadius="$lg" overflow="hidden">
            <ImageBackground
              source={
                photoUri ? { uri: photoUri } : defaultMealImage
              }
              style={{
                width: "100%",
                height: 200,
                justifyContent: "flex-end",
              }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              <VStack p="$4" space="xs">
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={FIXED_COLORS.secondary[300]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$sm"
                    fontWeight="$medium"
                    opacity={0.95}
                  >
                    {t("nutrition.meals.aiAnalysisTitle")}
                  </Text>
                </HStack>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {title}
                </Text>
                {itensText.length > 0 && (
                  <Text
                    color="rgba(255, 255, 255, 0.85)"
                    fontSize="$sm"
                    lineHeight="$sm"
                  >
                    {itensText}
                  </Text>
                )}
              </VStack>
            </ImageBackground>
          </Box>

          <VStack space="md">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$semibold"
            >
              {t("nutrition.meals.nutritionalInfo")}
            </Text>

            <HStack justifyContent="space-between">
              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                mr="$2"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {Math.round(calories)}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  kcal
                </Text>
              </VStack>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                mx="$1"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$bold"
                >
                  {proteinC.value.toFixed(1)}
                  {unit}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.protein")}
                </Text>
              </VStack>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                mx="$1"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$bold"
                >
                  {carbsC.value.toFixed(1)}
                  {unit}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.carbs")}
                </Text>
              </VStack>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
                p="$3"
                alignItems="center"
                flex={1}
                ml="$2"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$bold"
                >
                  {fatC.value.toFixed(1)}
                  {unit}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {t("nutrition.food.nutrients.fat")}
                </Text>
              </VStack>
            </HStack>

            {(fiber != null && fiber > 0) ||
            (sodium != null && sodium > 0) ||
            (sugar != null && sugar > 0) ? (
              <HStack flexWrap="wrap" space="sm">
                {fiber != null && fiber > 0 ? (
                  <Box
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$md"
                    px="$3"
                    py="$2"
                  >
                    <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                      {t("history.consumption.fiber")}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {fiber} g
                    </Text>
                  </Box>
                ) : null}
                {sodium != null && sodium > 0 ? (
                  <Box
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$md"
                    px="$3"
                    py="$2"
                  >
                    <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                      {t("history.consumption.sodium")}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {sodium} g
                    </Text>
                  </Box>
                ) : null}
                {sugar != null && sugar > 0 ? (
                  <Box
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$md"
                    px="$3"
                    py="$2"
                  >
                    <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                      {t("history.consumption.sugar")}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {sugar} g
                    </Text>
                  </Box>
                ) : null}
              </HStack>
            ) : null}
          </VStack>

          {ingredients.length > 0 ? (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("nutrition.meals.ingredients")} ({ingredients.length})
              </Text>
              <VStack space="sm">
                {ingredients.map((ing, index) => (
                  <HStack
                    key={`${ing.name}-${index}`}
                    bg={FIXED_COLORS.background[800]}
                    borderRadius="$md"
                    p="$3"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <VStack flex={1} mr="$2">
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$md"
                        fontWeight="$medium"
                      >
                        {ing.name}
                      </Text>
                    </VStack>
                    <VStack alignItems="flex-end">
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$sm"
                        fontWeight="$semibold"
                      >
                        {ing.quantity} {ing.unit}
                      </Text>
                      {ing.calories > 0 ? (
                        <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                          {Math.round(ing.calories)} kcal
                        </Text>
                      ) : null}
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          ) : null}

          <VStack space="md" pt="$2">
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$2xs"
              lineHeight="$xs"
              textAlign="center"
              px="$1"
            >
              {t("nutrition.meals.aiScanSaveLegalNotice")}
            </Text>
            {!canSaveScan ? (
              <Text
                color={FIXED_COLORS.error[400]}
                fontSize="$2xs"
                textAlign="center"
                px="$1"
              >
                {t("nutrition.meals.aiScanNoFoodDetected")}
              </Text>
            ) : null}
            <Button
              onPress={() => {
                void onConfirmSave();
              }}
              bg={FIXED_COLORS.warning[500]}
              borderRadius="$md"
              isDisabled={isSaving || !canSaveScan}
            >
              <ButtonText
                color={FIXED_COLORS.text[950]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {isSaving
                  ? t("common.saving")
                  : t("nutrition.meals.saveScannedMeal")}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};
