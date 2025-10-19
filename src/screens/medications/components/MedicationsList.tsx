import React, { useState, useEffect } from "react";
import { VStack, HStack, Text, Pressable } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { medicationsService } from "../../../services/medicationsService";
import { Medication } from "../types";
import { MedicationCard } from "./MedicationCard";
import { MedicationDetailsDrawer } from "./MedicationDetailsDrawer";

interface MedicationsListProps {
  onViewAll: () => void;
}

export const MedicationsList: React.FC<MedicationsListProps> = ({
  onViewAll,
}) => {
  const { t } = useTranslation();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadMedications();
    }, [])
  );

  const loadMedications = async () => {
    try {
      setIsLoading(true);
      const data = await medicationsService.getMedications();

      const medicationsWithDefaults = data.map((medication) => ({
        ...medication,
        dosage: medication.amount,
        is_taken: false,
        category: "other" as const,
      }));

      setMedications(medicationsWithDefaults.filter((m) => m.is_active));
    } catch (error) {
      console.error("Error loading medications:", error);
      setMedications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicationPress = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMedication(null);
  };

  const handleToggleTaken = (medicationId: string) => {
    setMedications((prev) =>
      prev.map((m) =>
        m.id === medicationId ? { ...m, is_taken: !m.is_taken } : m
      )
    );
  };

  if (medications.length === 0) {
    return (
      <VStack space="sm" alignItems="center" py="$8">
        <Text color={FIXED_COLORS.text[400]} textAlign="center">
          {t("medications.noMedications")}
        </Text>
      </VStack>
    );
  }

  return (
    <>
      <VStack space="md" px="$4" width="$full">
        <HStack justifyContent="space-between" alignItems="center">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$semibold"
          >
            {t("medications.medications")}
          </Text>
          <Pressable onPress={onViewAll}>
            <Text
              color={FIXED_COLORS.primary[500]}
              fontSize="$sm"
              fontWeight="$medium"
              textDecorationLine="underline"
            >
              {t("medications.viewAll")}
            </Text>
          </Pressable>
        </HStack>

        <VStack space="sm" width="$full">
          {medications.slice(0, 3).map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onPress={() => handleMedicationPress(medication)}
              onToggleTaken={() => handleToggleTaken(medication.id)}
            />
          ))}
        </VStack>
      </VStack>

      <MedicationDetailsDrawer
        medication={selectedMedication}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
};
