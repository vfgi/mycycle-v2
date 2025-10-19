import React, { useState, useEffect } from "react";
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
import { supplementsService } from "../../../../services/supplementsService";
import { SupplementCard } from "./SupplementCard";
import { SupplementDetailsDrawer } from "./SupplementDetailsDrawer";
import { Supplement } from "./types";

// Função para obter a imagem baseada na categoria do suplemento
const getSupplementImage = (category: string) => {
  switch (category) {
    case "protein":
      return require("../../../../../assets/images/supplements/whey-pills.jpg");
    case "vitamin":
      return require("../../../../../assets/images/supplements/whey-pills.jpg");
    case "mineral":
      return require("../../../../../assets/images/supplements/whey-pills.jpg");
    case "preworkout":
      return require("../../../../../assets/images/supplements/whey-pills.jpg");
    default:
      return require("../../../../../assets/images/supplements/whey-pills.jpg");
  }
};

interface SupplementsListProps {
  onViewAll?: () => void;
}

export const SupplementsList: React.FC<SupplementsListProps> = ({
  onViewAll,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplement, setSelectedSupplement] =
    useState<Supplement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadSupplements();
    }, [])
  );

  const loadSupplements = async () => {
    try {
      setIsLoading(true);
      const data = await supplementsService.getSupplements();

      const supplementsWithDefaults = data.map((supplement) => ({
        ...supplement,
        dosage: supplement.amount,
        is_taken: false,
        image: getSupplementImage("protein"),
        nutrients:
          supplement.protein || supplement.carbohydrates || supplement.calories
            ? {
                protein: supplement.protein
                  ? parseInt(supplement.protein)
                  : undefined,
                carbs: supplement.carbohydrates
                  ? parseInt(supplement.carbohydrates)
                  : undefined,
                calories: supplement.calories
                  ? parseInt(supplement.calories)
                  : undefined,
              }
            : undefined,
      }));

      setSupplements(supplementsWithDefaults as any);
    } catch (error) {
      console.error("Error loading supplements:", error);
      setSupplements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const supplementsToShow = supplements.filter(
    (supplement) => supplement.is_active
  );

  const handleSupplementPress = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSupplement(null);
  };

  const handleToggleTaken = (supplementId: string) => {
    setSupplements((prev) =>
      prev.map((supplement) =>
        supplement.id === supplementId
          ? { ...supplement, is_taken: !supplement.is_taken }
          : supplement
      )
    );
  };

  return (
    <VStack space="md">
      <HStack justifyContent="space-between" alignItems="center">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$semibold"
        >
          {t("nutrition.supplements.supplements")}
        </Text>

        {onViewAll && (
          <Pressable onPress={onViewAll}>
            <HStack alignItems="center" space="xs">
              <Text
                color={FIXED_COLORS.primary[600]}
                fontSize="$sm"
                fontWeight="$medium"
                textDecorationLine="underline"
              >
                {t("nutrition.supplements.viewAll")}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={FIXED_COLORS.primary[600]}
              />
            </HStack>
          </Pressable>
        )}
      </HStack>

      {isLoading ? (
        <VStack space="sm">
          <Text color={FIXED_COLORS.text[400]} textAlign="center">
            {t("common.loading")}
          </Text>
        </VStack>
      ) : supplementsToShow.length === 0 ? (
        <VStack space="sm" alignItems="center" py="$8">
          <Ionicons
            name="medical-outline"
            size={48}
            color={FIXED_COLORS.text[400]}
          />
          <Text color={FIXED_COLORS.text[400]} textAlign="center">
            {t("nutrition.supplements.noSupplements")}
          </Text>
        </VStack>
      ) : (
        <VStack space="sm">
          {supplementsToShow.map((supplement) => (
            <SupplementCard
              key={supplement.id}
              supplement={supplement}
              onPress={() => handleSupplementPress(supplement)}
              onToggleTaken={() => handleToggleTaken(supplement.id)}
            />
          ))}
        </VStack>
      )}

      <SupplementDetailsDrawer
        supplement={selectedSupplement}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </VStack>
  );
};
