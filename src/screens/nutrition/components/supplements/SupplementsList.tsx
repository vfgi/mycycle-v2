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

      // Usar data local do dispositivo em vez de UTC
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const supplementsWithDefaults = data.map((supplement: any) => {
        const lastConsumedDate = supplement.last_consumed_at
          ? supplement.last_consumed_at.split("T")[0]
          : null;
        const isTakenToday = lastConsumedDate === todayLocal;

        return {
          ...supplement,
          dosage: supplement.amount,
          is_taken: isTakenToday,
          image: getSupplementImage("protein"),
          nutrients:
            supplement.protein ||
            supplement.carbohydrates ||
            supplement.calories
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
        };
      });

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
    const supplement = supplements.find((s) => s.id === supplementId);
    if (!supplement) return;

    // Usar data local do dispositivo
    const today = new Date();
    const todayLocal = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    setSupplements((prev) =>
      prev.map((s) =>
        s.id === supplementId ? { ...s, is_taken: !s.is_taken } : s
      )
    );

    // Se já foi marcado como tomado, remover do histórico
    if (supplement.is_taken) {
      supplementsService
        .removeSupplementHistory({
          supplement_id: supplementId,
          date: todayLocal,
        })
        .then(() => {
          loadSupplements();
        })
        .catch((error: any) => {
          console.error("Error removing supplement history:", error);
          setSupplements((prev) =>
            prev.map((s) =>
              s.id === supplementId ? { ...s, is_taken: !s.is_taken } : s
            )
          );
        });
    } else {
      // Registrar como tomado
      const now = new Date();
      // Criar ISO string com a data/hora local (não UTC)
      const localISOString = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString();

      const payload = {
        supplement_id: supplementId,
        recorded_at: localISOString,
        timezone: "America/Sao_Paulo",
        notes: "",
      };

      supplementsService
        .recordSupplementHistory(payload)
        .then(() => {
          loadSupplements();
        })
        .catch((error: any) => {
          setSupplements((prev) =>
            prev.map((s) =>
              s.id === supplementId ? { ...s, is_taken: !s.is_taken } : s
            )
          );
        });
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
