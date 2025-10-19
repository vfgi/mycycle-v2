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
import { CustomDrawer } from "../../../components";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { Medication } from "../types";

interface MedicationDetailsDrawerProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  showActions?: boolean;
  onToggleActive?: () => void;
  onDelete?: () => void;
}

export const MedicationDetailsDrawer: React.FC<
  MedicationDetailsDrawerProps
> = ({
  medication,
  isOpen,
  onClose,
  showActions = false,
  onToggleActive,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (!medication) return null;

  const getCategoryIcon = () => {
    switch (medication.category) {
      case "analgesic":
        return "bandage-outline";
      case "antibiotic":
        return "shield-checkmark-outline";
      case "vitamin":
        return "nutrition-outline";
      case "antiinflammatory":
        return "fitness-outline";
      default:
        return "medkit-outline";
    }
  };

  const getCategoryColor = () => {
    switch (medication.category) {
      case "analgesic":
        return FIXED_COLORS.error[500];
      case "antibiotic":
        return FIXED_COLORS.primary[500];
      case "vitamin":
        return FIXED_COLORS.success[500];
      case "antiinflammatory":
        return FIXED_COLORS.warning[500];
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
              source={require("../../../../assets/images/supplements/whey-pills.jpg")}
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
                    {medication.name}
                  </Text>
                  {medication.brand && (
                    <Text color="rgba(255, 255, 255, 0.8)" fontSize="$lg">
                      {medication.brand}
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
              {t("medications.details.information")}
            </Text>

            <VStack space="sm">
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {t("medications.details.category")}
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
                    {t(`medications.categories.${medication.category}`)}
                  </Text>
                </HStack>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {t("medications.details.dosage")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {medication.dosage}
                </Text>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                  {t("medications.details.frequency")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {medication.frequency}
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Horários */}
          {medication.time_of_day && medication.time_of_day.length > 0 && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("medications.timeOfDay")}
              </Text>

              <HStack space="sm" flexWrap="wrap">
                {medication.time_of_day.map((time, index) => (
                  <Box
                    key={index}
                    bg={FIXED_COLORS.background[700]}
                    px="$4"
                    py="$2"
                    borderRadius="$md"
                  >
                    <Text
                      color={FIXED_COLORS.text[50]}
                      fontSize="$md"
                      fontWeight="$medium"
                    >
                      {time}
                    </Text>
                  </Box>
                ))}
              </HStack>
            </VStack>
          )}

          {/* Descrição */}
          {medication.description && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("medications.details.description")}
              </Text>

              <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                {medication.description}
              </Text>
            </VStack>
          )}

          {/* Notas */}
          {medication.notes && (
            <VStack space="md">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("medications.details.notes")}
              </Text>

              <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                {medication.notes}
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
                {t("medications.details.actions")}
              </Text>

              {/* Toggle Ativo/Inativo */}
              <HStack
                justifyContent="space-between"
                alignItems="center"
                p="$3"
                bg={FIXED_COLORS.background[800]}
                borderRadius="$md"
              >
                <Text color={FIXED_COLORS.text[50]} fontSize="$sm">
                  {medication.is_active
                    ? t("medications.details.active")
                    : t("medications.details.inactive")}
                </Text>
                <Switch
                  value={medication.is_active}
                  onValueChange={onToggleActive}
                  size="md"
                  trackColor={{
                    false: FIXED_COLORS.background[600],
                    true: FIXED_COLORS.success[500],
                  }}
                  thumbColor={FIXED_COLORS.text[50]}
                />
              </HStack>

              {/* Botão Excluir */}
              <Pressable
                onPress={onDelete}
                p="$3"
                bg={FIXED_COLORS.error[600]}
                borderRadius="$md"
                $pressed={{
                  opacity: 0.8,
                }}
              >
                <HStack space="sm" alignItems="center" justifyContent="center">
                  <Ionicons
                    name="trash"
                    size={20}
                    color={FIXED_COLORS.text[50]}
                  />
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$sm"
                    fontWeight="$semibold"
                  >
                    {t("medications.details.delete")}
                  </Text>
                </HStack>
              </Pressable>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};
