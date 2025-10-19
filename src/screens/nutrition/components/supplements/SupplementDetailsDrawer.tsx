import React from "react";
import { ImageBackground, ScrollView } from "react-native";
import {
  VStack,
  HStack,
  Text,
  Box,
  Pressable,
  Switch,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { CustomDrawer } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { Supplement } from "./types";

interface SupplementDetailsDrawerProps {
  supplement: Supplement | null;
  isOpen: boolean;
  onClose: () => void;
  showActions?: boolean;
  onToggleActive?: () => void;
  onDelete?: () => void;
}

export const SupplementDetailsDrawer: React.FC<
  SupplementDetailsDrawerProps
> = ({
  supplement,
  isOpen,
  onClose,
  showActions = false,
  onToggleActive,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (!supplement) return null;

  const getCategoryIcon = () => {
    switch (supplement.category) {
      case "protein":
        return "fitness-outline";
      case "vitamin":
        return "leaf-outline";
      case "mineral":
        return "diamond-outline";
      case "preworkout":
        return "flash-outline";
      default:
        return "medical-outline";
    }
  };

  const getCategoryColor = () => {
    switch (supplement.category) {
      case "protein":
        return FIXED_COLORS.primary[500];
      case "vitamin":
        return FIXED_COLORS.success[500];
      case "mineral":
        return FIXED_COLORS.warning[500];
      case "preworkout":
        return FIXED_COLORS.error[500];
      default:
        return FIXED_COLORS.text[400];
    }
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
              source={supplement.image}
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
                  padding: 20,
                  justifyContent: "flex-end",
                }}
              >
                <VStack space="sm">
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$2xl"
                    fontWeight="$bold"
                  >
                    {supplement.name}
                  </Text>
                  {supplement.brand && (
                    <Text color="rgba(255, 255, 255, 0.8)" fontSize="$lg">
                      {supplement.brand}
                    </Text>
                  )}
                </VStack>
              </LinearGradient>
            </ImageBackground>
          </Box>

          {/* Informações básicas */}
          <VStack space="md">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$semibold"
            >
              {t("nutrition.supplements.details.information")}
            </Text>

            <VStack space="sm">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {t("nutrition.supplements.details.category")}
                </Text>
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name={getCategoryIcon()}
                    size={16}
                    color={getCategoryColor()}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$sm"
                    fontWeight="$medium"
                  >
                    {t(
                      `nutrition.supplements.categories.${supplement.category}`
                    )}
                  </Text>
                </HStack>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {t("nutrition.supplements.details.dosage")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {supplement.dosage}
                </Text>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {t("nutrition.supplements.details.frequency")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {supplement.frequency}
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Informações nutricionais */}
          {supplement.nutrients && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("nutrition.supplements.details.nutrition")}
              </Text>

              <VStack space="sm">
                {supplement.nutrients.protein && (
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                      Proteína
                    </Text>
                    <Text
                      color={FIXED_COLORS.primary[500]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.protein}g
                    </Text>
                  </HStack>
                )}

                {supplement.nutrients.carbs && (
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                      Carboidratos
                    </Text>
                    <Text
                      color={FIXED_COLORS.warning[500]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.carbs}g
                    </Text>
                  </HStack>
                )}

                {supplement.nutrients.fat && (
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                      Gordura
                    </Text>
                    <Text
                      color={FIXED_COLORS.error[500]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.fat}g
                    </Text>
                  </HStack>
                )}

                {supplement.nutrients.calories && (
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                      Calorias
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$sm"
                      fontWeight="$semibold"
                    >
                      {supplement.nutrients.calories}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          )}

          {/* Descrição */}
          {supplement.description && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("nutrition.supplements.details.description")}
              </Text>
              <Text
                color={FIXED_COLORS.text[300]}
                fontSize="$sm"
                lineHeight="$sm"
              >
                {supplement.description}
              </Text>
            </VStack>
          )}

          {/* Ações */}
          {showActions && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("nutrition.supplements.details.actions")}
              </Text>

              <VStack space="sm">
                {onToggleActive && (
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                      {t("nutrition.supplements.details.active")}
                    </Text>
                    <Switch
                      value={supplement.is_active}
                      onValueChange={onToggleActive}
                      trackColor={{
                        false: FIXED_COLORS.background[600],
                        true: FIXED_COLORS.primary[500],
                      }}
                      thumbColor={
                        supplement.is_active
                          ? FIXED_COLORS.text[50]
                          : FIXED_COLORS.text[400]
                      }
                    />
                  </HStack>
                )}

                {onDelete && (
                  <Pressable
                    onPress={onDelete}
                    bg={FIXED_COLORS.error[500]}
                    borderRadius="$md"
                    p="$3"
                    alignItems="center"
                  >
                    <HStack alignItems="center" space="xs">
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={FIXED_COLORS.text[50]}
                      />
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$sm"
                        fontWeight="$semibold"
                      >
                        {t("nutrition.supplements.details.delete")}
                      </Text>
                    </HStack>
                  </Pressable>
                )}
              </VStack>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};
