import React, { useState, useEffect } from "react";
import { VStack, HStack, Text, Pressable } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
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

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    // TODO: Implementar serviço de medicamentos
    const mockMedications: Medication[] = [
      {
        id: "1",
        name: "Paracetamol",
        description: "Analgésico e antipirético",
        dosage: "500mg",
        frequency: "A cada 8 horas",
        category: "analgesic",
        brand: "Tylenol",
        is_active: true,
        is_taken: false,
        time_of_day: ["08:00", "16:00", "00:00"],
      },
      {
        id: "2",
        name: "Amoxicilina",
        description: "Antibiótico",
        dosage: "875mg",
        frequency: "A cada 12 horas",
        category: "antibiotic",
        brand: "Amoxil",
        is_active: true,
        is_taken: false,
        time_of_day: ["08:00", "20:00"],
      },
    ];
    setMedications(mockMedications);
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
