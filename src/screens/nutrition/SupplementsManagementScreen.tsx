import React, { useState, useMemo } from "react";
import {
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { VStack, HStack, Text, Pressable, Box } from "@gluestack-ui/themed";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeContainer, FloatingTextInput, AdBanner } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/useToast";
import { supplementsService } from "../../services/supplementsService";
import { SimpleSupplementCard } from "./components/supplements/SimpleSupplementCard";
import { SupplementDetailsDrawer } from "./components/supplements/SupplementDetailsDrawer";
import { Supplement } from "./components/supplements/types";

export const SupplementsManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const isPremium = user?.is_premium || false;
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplement, setSelectedSupplement] =
    useState<Supplement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive">(
    "active"
  );

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
        category: "protein" as const,
        is_taken: false,
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

  const filteredSupplements = useMemo(() => {
    let filtered = supplements;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (supplement) =>
          supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplement.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplement.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    filtered = filtered.filter((supplement) => {
      if (filterStatus === "active") {
        return supplement.is_active;
      } else {
        return !supplement.is_active;
      }
    });

    return filtered;
  }, [supplements, searchQuery, filterStatus]);

  const activeSupplementsCount = supplements.filter((s) => s.is_active).length;
  const inactiveSupplementsCount = supplements.filter(
    (s) => !s.is_active
  ).length;
  const totalSupplementsCount = supplements.length;

  const handleSupplementPress = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setIsDrawerOpen(true);
  };

  const handleEditSupplement = (supplement: Supplement) => {
    navigation.navigate("CreateSupplement" as never, { supplement } as never);
  };

  const handleToggleActive = async (supplement: Supplement) => {
    try {
      const supplementData = {
        ...supplement,
        amount: supplement.dosage || supplement.amount,
      };

      await supplementsService.updateSupplementStatus(
        supplement.id,
        supplementData as any,
        !supplement.is_active
      );

      setSupplements((prev) =>
        prev.map((s) =>
          s.id === supplement.id ? { ...s, is_active: !s.is_active } : s
        )
      );

      showSuccess(
        supplement.is_active
          ? t("nutrition.supplements.deactivatedSuccess")
          : t("nutrition.supplements.activatedSuccess")
      );
    } catch (error) {
      console.error("Error updating supplement status:", error);
      showError(t("nutrition.supplements.updateError"));
    }
  };

  const handleDeleteSupplement = (supplement: Supplement) => {
    Alert.alert(
      t("nutrition.supplements.delete.title"),
      t("nutrition.supplements.delete.message", { name: supplement.name }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await supplementsService.deleteSupplement(supplement.id);

              setSupplements((prev) =>
                prev.filter((s) => s.id !== supplement.id)
              );

              showSuccess(t("nutrition.supplements.deleteSuccess"));
              setIsDrawerOpen(false);
            } catch (error) {
              console.error("Error deleting supplement:", error);
              showError(t("nutrition.supplements.deleteError"));
            }
          },
        },
      ]
    );
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSupplement(null);
  };

  return (
    <>
      <SafeContainer paddingTop={12} paddingBottom={24} paddingHorizontal={12}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <VStack space="lg">
                {/* Ad Banner */}
                <AdBanner />

                {/* Estatísticas */}
                <HStack justifyContent="space-around">
                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {totalSupplementsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("nutrition.supplements.management.total")}
                    </Text>
                  </VStack>

                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.success[500]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {activeSupplementsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("nutrition.supplements.management.active")}
                    </Text>
                  </VStack>

                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.warning[500]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {inactiveSupplementsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("nutrition.supplements.management.inactive")}
                    </Text>
                  </VStack>
                </HStack>

                {/* Search and Filter */}
                <VStack space="md">
                  <Box zIndex={10}>
                    <FloatingTextInput
                      label={t(
                        "nutrition.supplements.management.searchPlaceholder"
                      )}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      backgroundColor={FIXED_COLORS.background[950]}
                      valueColor={FIXED_COLORS.text[50]}
                      isFocusLabelColor={FIXED_COLORS.primary[500]}
                      isBlurLabelColor={FIXED_COLORS.text[400]}
                      isFocusBorderColor={FIXED_COLORS.primary[500]}
                      isBlurBorderColor={FIXED_COLORS.background[700]}
                      isBlurValueBorderColor={FIXED_COLORS.background[600]}
                    />
                  </Box>

                  {/* Filter Tabs */}
                  <HStack space="sm">
                    <Pressable
                      onPress={() => setFilterStatus("active")}
                      bg={
                        filterStatus === "active"
                          ? FIXED_COLORS.primary[500]
                          : FIXED_COLORS.background[700]
                      }
                      borderRadius="$md"
                      px="$4"
                      py="$2"
                      flex={1}
                      alignItems="center"
                    >
                      <Text
                        color={
                          filterStatus === "active"
                            ? FIXED_COLORS.text[50]
                            : FIXED_COLORS.text[400]
                        }
                        fontSize="$sm"
                        fontWeight="$medium"
                      >
                        {t("nutrition.supplements.management.active")}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setFilterStatus("inactive")}
                      bg={
                        filterStatus === "inactive"
                          ? FIXED_COLORS.primary[500]
                          : FIXED_COLORS.background[700]
                      }
                      borderRadius="$md"
                      px="$4"
                      py="$2"
                      flex={1}
                      alignItems="center"
                    >
                      <Text
                        color={
                          filterStatus === "inactive"
                            ? FIXED_COLORS.text[50]
                            : FIXED_COLORS.text[400]
                        }
                        fontSize="$sm"
                        fontWeight="$medium"
                      >
                        {t("nutrition.supplements.management.inactive")}
                      </Text>
                    </Pressable>
                  </HStack>
                </VStack>

                {/* Supplements List */}
                {isLoading ? (
                  <VStack space="sm" alignItems="center" py="$8">
                    <Text color={FIXED_COLORS.text[400]} textAlign="center">
                      {t("common.loading")}
                    </Text>
                  </VStack>
                ) : filteredSupplements.length === 0 ? (
                  <VStack space="sm" alignItems="center" py="$8">
                    <Ionicons
                      name="medical-outline"
                      size={48}
                      color={FIXED_COLORS.text[400]}
                    />
                    <Text color={FIXED_COLORS.text[400]} textAlign="center">
                      {searchQuery.trim()
                        ? t("nutrition.supplements.management.noResults")
                        : t("nutrition.supplements.management.noSupplements")}
                    </Text>
                  </VStack>
                ) : (
                  <VStack space="sm">
                    {filteredSupplements.map((supplement) => (
                      <SimpleSupplementCard
                        key={supplement.id}
                        supplement={supplement}
                        onPress={() => handleSupplementPress(supplement)}
                        onToggleActive={() => handleToggleActive(supplement)}
                        onEdit={() => handleEditSupplement(supplement)}
                        onDelete={() => handleDeleteSupplement(supplement)}
                      />
                    ))}
                  </VStack>
                )}
              </VStack>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeContainer>

      <SupplementDetailsDrawer
        supplement={selectedSupplement}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        showActions={true}
        onToggleActive={
          selectedSupplement
            ? () => handleToggleActive(selectedSupplement)
            : undefined
        }
        onDelete={
          selectedSupplement
            ? () => handleDeleteSupplement(selectedSupplement)
            : undefined
        }
      />
    </>
  );
};
