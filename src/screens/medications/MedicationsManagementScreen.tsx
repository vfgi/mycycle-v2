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
import { SimpleMedicationCard } from "./components/SimpleMedicationCard";
import { MedicationDetailsDrawer } from "./components/MedicationDetailsDrawer";
import { Medication } from "./types";

export const MedicationsManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const isPremium = user?.is_premium || false;
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive">(
    "active"
  );

  useFocusEffect(
    React.useCallback(() => {
      loadMedications();
    }, [])
  );

  const loadMedications = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementar serviço de medicamentos
      const mockMedications: Medication[] = [
        {
          id: "1",
          name: "Paracetamol",
          description: "Analgésico e antipirético",
          brand: "Tylenol",
          category: "analgesic",
          dosage: "500mg",
          frequency: "A cada 8 horas",
          is_active: true,
          is_taken: false,
          time_of_day: ["08:00", "16:00", "00:00"],
        },
        {
          id: "2",
          name: "Amoxicilina",
          description: "Antibiótico",
          brand: "Amoxil",
          category: "antibiotic",
          dosage: "875mg",
          frequency: "A cada 12 horas",
          is_active: true,
          is_taken: false,
          time_of_day: ["08:00", "20:00"],
        },
        {
          id: "3",
          name: "Ibuprofeno",
          description: "Anti-inflamatório não esteroide",
          brand: "Advil",
          category: "antiinflammatory",
          dosage: "400mg",
          frequency: "A cada 6 horas",
          is_active: false,
          is_taken: false,
          time_of_day: ["06:00", "12:00", "18:00", "00:00"],
        },
      ];
      setMedications(mockMedications);
    } catch (error) {
      console.error("Error loading medications:", error);
      setMedications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedications = useMemo(() => {
    let filtered = medications;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (medication) =>
          medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medication.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medication.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    filtered = filtered.filter((medication) => {
      if (filterStatus === "active") {
        return medication.is_active;
      } else {
        return !medication.is_active;
      }
    });

    return filtered;
  }, [medications, searchQuery, filterStatus]);

  const activeMedicationsCount = medications.filter((s) => s.is_active).length;
  const inactiveMedicationsCount = medications.filter(
    (s) => !s.is_active
  ).length;
  const totalMedicationsCount = medications.length;

  const handleMedicationPress = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDrawerOpen(true);
  };

  const handleToggleActive = async (medication: Medication) => {
    try {
      // TODO: Implementar chamada para API
      console.log("Toggle active:", medication.id, !medication.is_active);

      setMedications((prev) =>
        prev.map((s) =>
          s.id === medication.id ? { ...s, is_active: !s.is_active } : s
        )
      );

      showSuccess(
        medication.is_active
          ? t("medications.deactivatedSuccess")
          : t("medications.activatedSuccess")
      );
    } catch (error) {
      console.error("Error updating medication status:", error);
      showError(t("medications.updateError"));
    }
  };

  const handleDeleteMedication = (medication: Medication) => {
    Alert.alert(
      t("medications.delete.title"),
      t("medications.delete.message", { name: medication.name }),
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
              // TODO: Implementar chamada para API
              console.log("Delete medication:", medication.id);

              setMedications((prev) =>
                prev.filter((s) => s.id !== medication.id)
              );

              showSuccess(t("medications.deleteSuccess"));
              setIsDrawerOpen(false);
            } catch (error) {
              console.error("Error deleting medication:", error);
              showError(t("medications.deleteError"));
            }
          },
        },
      ]
    );
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMedication(null);
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
                      {totalMedicationsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("medications.management.total")}
                    </Text>
                  </VStack>

                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.success[500]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {activeMedicationsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("medications.management.active")}
                    </Text>
                  </VStack>

                  <VStack alignItems="center">
                    <Text
                      color={FIXED_COLORS.warning[500]}
                      fontSize="$xl"
                      fontWeight="$bold"
                    >
                      {inactiveMedicationsCount}
                    </Text>
                    <Text
                      color={FIXED_COLORS.text[400]}
                      fontSize="$sm"
                      fontWeight="$medium"
                    >
                      {t("medications.management.inactive")}
                    </Text>
                  </VStack>
                </HStack>

                {/* Search and Filter */}
                <VStack space="md">
                  <Box zIndex={10}>
                    <FloatingTextInput
                      label={t("medications.management.searchPlaceholder")}
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
                        {t("medications.management.active")}
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
                        {t("medications.management.inactive")}
                      </Text>
                    </Pressable>
                  </HStack>
                </VStack>

                {/* Medications List */}
                {isLoading ? (
                  <VStack space="sm" alignItems="center" py="$8">
                    <Text color={FIXED_COLORS.text[400]} textAlign="center">
                      {t("common.loading")}
                    </Text>
                  </VStack>
                ) : filteredMedications.length === 0 ? (
                  <VStack space="sm" alignItems="center" py="$8">
                    <Ionicons
                      name="medical-outline"
                      size={48}
                      color={FIXED_COLORS.text[400]}
                    />
                    <Text color={FIXED_COLORS.text[400]} textAlign="center">
                      {searchQuery.trim()
                        ? t("medications.management.noResults")
                        : t("medications.management.noMedications")}
                    </Text>
                  </VStack>
                ) : (
                  <VStack space="sm">
                    {filteredMedications.map((medication) => (
                      <SimpleMedicationCard
                        key={medication.id}
                        medication={medication}
                        onPress={() => handleMedicationPress(medication)}
                        onToggleActive={() => handleToggleActive(medication)}
                        onDelete={() => handleDeleteMedication(medication)}
                      />
                    ))}
                  </VStack>
                )}
              </VStack>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeContainer>

      <MedicationDetailsDrawer
        medication={selectedMedication}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        showActions={true}
        onToggleActive={
          selectedMedication
            ? () => handleToggleActive(selectedMedication)
            : undefined
        }
        onDelete={
          selectedMedication
            ? () => handleDeleteMedication(selectedMedication)
            : undefined
        }
      />
    </>
  );
};
