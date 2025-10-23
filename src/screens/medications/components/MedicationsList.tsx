import React, { useState, useEffect } from "react";
import { VStack, HStack, Text, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
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

      // Usar data local do dispositivo em vez de UTC
      const today = new Date();
      const todayLocal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const medicationsWithDefaults = data.map((medication: any) => {
        const lastConsumedDate = medication.last_consumed_at
          ? medication.last_consumed_at.split("T")[0]
          : null;
        const isTakenToday = lastConsumedDate === todayLocal;

        return {
          ...medication,
          dosage: medication.amount,
          is_taken: isTakenToday,
          category: "other" as const,
        };
      });

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
    const medication = medications.find((m) => m.id === medicationId);
    if (!medication) return;

    // Usar data local do dispositivo
    const today = new Date();
    const todayLocal = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    setMedications((prev) =>
      prev.map((m) =>
        m.id === medicationId ? { ...m, is_taken: !m.is_taken } : m
      )
    );

    // Se já foi marcado como tomado, remover do histórico
    if (medication.is_taken) {
      medicationsService
        .removeMedicationHistory({
          medication_id: medicationId,
          date: todayLocal,
        })
        .then(() => {
          loadMedications();
        })
        .catch((error: any) => {
          console.error("Error removing medication history:", error);
          setMedications((prev) =>
            prev.map((m) =>
              m.id === medicationId ? { ...m, is_taken: !m.is_taken } : m
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
        medication_id: medicationId,
        recorded_at: localISOString,
        timezone: "America/Sao_Paulo",
        notes: "",
      };

      medicationsService
        .recordMedicationHistory(payload)
        .then(() => {
          loadMedications();
        })
        .catch((error: any) => {
          setMedications((prev) =>
            prev.map((m) =>
              m.id === medicationId ? { ...m, is_taken: !m.is_taken } : m
            )
          );
        });
    }
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
