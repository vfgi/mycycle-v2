import React from "react";
import { ImageBackground, ScrollView } from "react-native";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CustomDrawer } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useUnits } from "../../../../contexts/UnitsContext";
import {
  HistoryEntry,
  MealHistoryEntry,
} from "../../../../services/mealsHistoryService";

// Função para obter a imagem baseada no tipo de refeição
const getMealImage = (mealType: string) => {
  switch (mealType) {
    case "breakfast":
      return require("../../../../../assets/images/food/breakfast.jpg");
    case "lunch":
      return require("../../../../../assets/images/food/lunch.jpg");
    case "dinner":
      return require("../../../../../assets/images/food/dinner.jpg");
    case "snack":
      return require("../../../../../assets/images/food/snacks.jpg");
    default:
      return require("../../../../../assets/images/food/lunch.jpg");
  }
};

interface MealHistoryDetailsDrawerProps {
  mealHistory: (MealHistoryEntry | HistoryEntry) | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MealHistoryDetailsDrawer: React.FC<
  MealHistoryDetailsDrawerProps
> = ({ mealHistory, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();

  // Calcular dados nutricionais a partir dos ingredientes
  const nutrition = React.useMemo(() => {
    if (!mealHistory) {
      return {
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        total_fiber: 0,
        total_sodium: 0,
        total_sugar: 0,
        ingredients: [],
      };
    }
    if (mealHistory.nutrition_data) {
      return mealHistory.nutrition_data;
    }

    const isMealHistoryEntry = mealHistory && "ingredients" in mealHistory;
    const mealEntry = isMealHistoryEntry
      ? (mealHistory as MealHistoryEntry)
      : null;
    if (mealEntry?.ingredients && mealEntry.ingredients.length > 0) {
      const ingredients = mealEntry.ingredients;
      const totals = ingredients.reduce(
        (acc: any, ingredient: any) => ({
          total_calories: acc.total_calories + (ingredient.calories || 0),
          total_protein: acc.total_protein + (ingredient.protein || 0),
          total_carbs: acc.total_carbs + (ingredient.carbs || 0),
          total_fat: acc.total_fat + (ingredient.fat || 0),
          total_fiber: acc.total_fiber + (ingredient.fiber || 0),
          total_sodium: acc.total_sodium + (ingredient.sodium || 0),
          total_sugar: acc.total_sugar + (ingredient.sugar || 0),
        }),
        {
          total_calories: 0,
          total_protein: 0,
          total_carbs: 0,
          total_fat: 0,
          total_fiber: 0,
          total_sodium: 0,
          total_sugar: 0,
        }
      );

      return {
        ...totals,
        ingredients: mealEntry!.ingredients,
      };
    }

    // Fallback para valores padrão
    return {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
      total_fiber: 0,
      total_sodium: 0,
      total_sugar: 0,
      ingredients: [],
    };
  }, [mealHistory]);

  if (!mealHistory) return null;

  const recordedAt = new Date(mealHistory.recorded_at);
  const timeString = recordedAt.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = recordedAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const getMealTypeIcon = () => {
    // Tentar extrair o tipo de refeição das notas ou usar padrão
    const notes = mealHistory.notes?.toLowerCase() || "";
    if (notes.includes("café") || notes.includes("breakfast"))
      return "sunny-outline";
    if (notes.includes("almoço") || notes.includes("lunch"))
      return "restaurant-outline";
    if (notes.includes("jantar") || notes.includes("dinner"))
      return "moon-outline";
    if (notes.includes("lanche") || notes.includes("snack"))
      return "cafe-outline";
    return "restaurant-outline";
  };

  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose} minHeight={650}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      >
        <VStack space="lg">
          {/* Header com imagem */}
          <Box borderRadius="$lg" overflow="hidden">
            <ImageBackground
              source={getMealImage("lunch")} // Usar imagem padrão por enquanto
              style={{
                width: "100%",
                height: 200,
                justifyContent: "flex-end",
              }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />

              <VStack p="$4" space="xs">
                <HStack alignItems="center" space="sm">
                  <Ionicons
                    name={getMealTypeIcon()}
                    size={24}
                    color={FIXED_COLORS.text[50]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$2xl"
                    fontWeight="$bold"
                  >
                    {mealHistory.notes || t("history.consumption.meal")}
                  </Text>
                </HStack>

                <HStack alignItems="center" space="md">
                  <HStack alignItems="center" space="xs">
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color="rgba(255, 255, 255, 0.8)"
                    />
                    <Text color="rgba(255, 255, 255, 0.8)" fontSize="$sm">
                      {timeString}
                    </Text>
                  </HStack>

                  <HStack alignItems="center" space="xs">
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="rgba(255, 255, 255, 0.8)"
                    />
                    <Text color="rgba(255, 255, 255, 0.8)" fontSize="$sm">
                      {dateString}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </ImageBackground>
          </Box>

          {/* Informações nutricionais */}
          <VStack space="md">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
            >
              {t("history.consumption.nutritionalInfo")}
            </Text>

            {/* Calorias principais */}
            <Box
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              p="$4"
              borderWidth={1}
              borderColor={FIXED_COLORS.primary[600]}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <HStack alignItems="center" space="sm">
                  <Ionicons
                    name="flame"
                    size={20}
                    color={FIXED_COLORS.primary[500]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$lg"
                    fontWeight="$semibold"
                  >
                    {t("history.consumption.calories")}
                  </Text>
                </HStack>
                <Text
                  color={FIXED_COLORS.primary[500]}
                  fontSize="$xl"
                  fontWeight="$bold"
                >
                  {nutrition.total_calories} kcal
                </Text>
              </HStack>
            </Box>

            {/* Macronutrientes */}
            <HStack space="sm">
              <Box
                bg={FIXED_COLORS.background[800]}
                borderRadius="$lg"
                p="$3"
                flex={1}
                borderWidth={1}
                borderColor={FIXED_COLORS.success[600]}
              >
                <VStack alignItems="center" space="xs">
                  <Ionicons
                    name="fitness"
                    size={16}
                    color={FIXED_COLORS.success[500]}
                  />
                  <Text
                    color={FIXED_COLORS.success[500]}
                    fontSize="$sm"
                    fontWeight="$semibold"
                  >
                    {t("history.consumption.protein")}
                  </Text>
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$lg"
                    fontWeight="$bold"
                  >
                    {convertMacronutrient(
                      nutrition.total_protein
                    ).value.toFixed(1)}
                    {getMacroUnit()}
                  </Text>
                </VStack>
              </Box>

              <Box
                bg={FIXED_COLORS.background[800]}
                borderRadius="$lg"
                p="$3"
                flex={1}
                borderWidth={1}
                borderColor={FIXED_COLORS.warning[600]}
              >
                <VStack alignItems="center" space="xs">
                  <Ionicons
                    name="leaf"
                    size={16}
                    color={FIXED_COLORS.warning[500]}
                  />
                  <Text
                    color={FIXED_COLORS.warning[500]}
                    fontSize="$sm"
                    fontWeight="$semibold"
                  >
                    {t("history.consumption.carbs")}
                  </Text>
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$lg"
                    fontWeight="$bold"
                  >
                    {convertMacronutrient(nutrition.total_carbs).value.toFixed(
                      1
                    )}
                    {getMacroUnit()}
                  </Text>
                </VStack>
              </Box>

              <Box
                bg={FIXED_COLORS.background[800]}
                borderRadius="$lg"
                p="$3"
                flex={1}
                borderWidth={1}
                borderColor={FIXED_COLORS.error[600]}
              >
                <VStack alignItems="center" space="xs">
                  <Ionicons
                    name="water"
                    size={16}
                    color={FIXED_COLORS.error[500]}
                  />
                  <Text
                    color={FIXED_COLORS.error[500]}
                    fontSize="$sm"
                    fontWeight="$semibold"
                  >
                    {t("history.consumption.fat")}
                  </Text>
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$lg"
                    fontWeight="$bold"
                  >
                    {convertMacronutrient(nutrition.total_fat).value.toFixed(1)}
                    {getMacroUnit()}
                  </Text>
                </VStack>
              </Box>
            </HStack>

            {/* Informações adicionais */}
            {(nutrition.total_fiber > 0 ||
              nutrition.total_sodium > 0 ||
              nutrition.total_sugar > 0) && (
              <VStack space="sm">
                <Text
                  color={FIXED_COLORS.text[300]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {t("history.consumption.additionalInfo")}
                </Text>

                <HStack space="sm">
                  {nutrition.total_fiber > 0 && (
                    <Box
                      bg={FIXED_COLORS.background[800]}
                      borderRadius="$md"
                      p="$2"
                      flex={1}
                    >
                      <VStack alignItems="center" space="xs">
                        <Text
                          color={FIXED_COLORS.text[400]}
                          fontSize="$xs"
                          fontWeight="$medium"
                        >
                          {t("history.consumption.fiber")}
                        </Text>
                        <Text
                          color={FIXED_COLORS.text[50]}
                          fontSize="$sm"
                          fontWeight="$semibold"
                        >
                          {nutrition.total_fiber}g
                        </Text>
                      </VStack>
                    </Box>
                  )}

                  {nutrition.total_sodium > 0 && (
                    <Box
                      bg={FIXED_COLORS.background[800]}
                      borderRadius="$md"
                      p="$2"
                      flex={1}
                    >
                      <VStack alignItems="center" space="xs">
                        <Text
                          color={FIXED_COLORS.text[400]}
                          fontSize="$xs"
                          fontWeight="$medium"
                        >
                          {t("history.consumption.sodium")}
                        </Text>
                        <Text
                          color={FIXED_COLORS.text[50]}
                          fontSize="$sm"
                          fontWeight="$semibold"
                        >
                          {nutrition.total_sodium}mg
                        </Text>
                      </VStack>
                    </Box>
                  )}

                  {nutrition.total_sugar > 0 && (
                    <Box
                      bg={FIXED_COLORS.background[800]}
                      borderRadius="$md"
                      p="$2"
                      flex={1}
                    >
                      <VStack alignItems="center" space="xs">
                        <Text
                          color={FIXED_COLORS.text[400]}
                          fontSize="$xs"
                          fontWeight="$medium"
                        >
                          {t("history.consumption.sugar")}
                        </Text>
                        <Text
                          color={FIXED_COLORS.text[50]}
                          fontSize="$sm"
                          fontWeight="$semibold"
                        >
                          {nutrition.total_sugar}g
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </HStack>
              </VStack>
            )}

            {/* Ingredientes */}
            {nutrition.ingredients && nutrition.ingredients.length > 0 && (
              <VStack space="sm">
                <Text
                  color={FIXED_COLORS.text[300]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {t("history.consumption.ingredients")}
                </Text>

                <VStack space="xs">
                  {nutrition.ingredients.map(
                    (ingredient: any, index: number) => (
                      <Box
                        key={index}
                        bg={FIXED_COLORS.background[800]}
                        borderRadius="$md"
                        p="$3"
                        borderWidth={1}
                        borderColor={FIXED_COLORS.background[700]}
                      >
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <VStack flex={1}>
                            <Text
                              color={FIXED_COLORS.text[50]}
                              fontSize="$sm"
                              fontWeight="$medium"
                            >
                              {ingredient.name}
                            </Text>
                            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                              {ingredient.quantity} {ingredient.unit}
                            </Text>
                          </VStack>

                          <VStack alignItems="flex-end" space="xs">
                            <Text
                              color={FIXED_COLORS.primary[500]}
                              fontSize="$sm"
                              fontWeight="$semibold"
                            >
                              {ingredient.calories} kcal
                            </Text>
                            <HStack space="sm">
                              <Text
                                color={FIXED_COLORS.text[400]}
                                fontSize="$2xs"
                              >
                                P: {ingredient.protein}g
                              </Text>
                              <Text
                                color={FIXED_COLORS.text[400]}
                                fontSize="$2xs"
                              >
                                C: {ingredient.carbs}g
                              </Text>
                              <Text
                                color={FIXED_COLORS.text[400]}
                                fontSize="$2xs"
                              >
                                G: {ingredient.fat}g
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                      </Box>
                    )
                  )}
                </VStack>
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};

export default MealHistoryDetailsDrawer;
