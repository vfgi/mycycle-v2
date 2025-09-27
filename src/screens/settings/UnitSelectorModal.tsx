import React from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  VStack,
  HStack,
  Text,
  Pressable,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useUnits } from "../../contexts/UnitsContext";
import { UnitSystem } from "../../services/unitStorage";

interface UnitSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitSelectorModal: React.FC<UnitSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { unitSystem, setUnitSystem } = useUnits();

  const handleUnitChange = async (system: UnitSystem) => {
    try {
      await setUnitSystem(system);
      onClose();
    } catch (error) {
      console.error("Error changing unit system:", error);
    }
  };

  const unitOptions = [
    {
      key: "metric" as UnitSystem,
      label: t("settings.units.metric"),
      description: t("settings.units.metricDesc"),
      examples: "kg, cm, km, °C",
      flag: "🌍",
    },
    {
      key: "imperial" as UnitSystem,
      label: t("settings.units.imperial"),
      description: t("settings.units.imperialDesc"),
      examples: "lbs, ft, mi, °F",
      flag: "🇺🇸",
    },
  ];

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop bg="rgba(0, 0, 0, 0.8)" />
      <AlertDialogContent
        bg={FIXED_COLORS.background[800]}
        borderRadius="$xl"
        borderWidth={1}
        borderColor={FIXED_COLORS.background[600]}
        maxWidth="$96"
        w="90%"
      >
        <AlertDialogHeader>
          <HStack justifyContent="space-between" alignItems="center" w="100%">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
            >
              {t("settings.units.selectUnit")}
            </Text>
            <AlertDialogCloseButton>
              <Ionicons name="close" size={24} color={FIXED_COLORS.text[400]} />
            </AlertDialogCloseButton>
          </HStack>
        </AlertDialogHeader>

        <AlertDialogBody>
          <VStack space="md" mt="$2">
            {unitOptions.map((option) => (
              <Pressable
                key={option.key}
                onPress={() => handleUnitChange(option.key)}
                bg={
                  unitSystem === option.key
                    ? FIXED_COLORS.primary[900]
                    : FIXED_COLORS.background[700]
                }
                borderRadius="$lg"
                p="$4"
                borderWidth={1}
                borderColor={
                  unitSystem === option.key
                    ? FIXED_COLORS.primary[600]
                    : FIXED_COLORS.background[600]
                }
                $pressed={{
                  bg: FIXED_COLORS.background[600],
                }}
              >
                <HStack alignItems="center" space="md">
                  <Text fontSize="$2xl">{option.flag}</Text>

                  <VStack flex={1}>
                    <HStack alignItems="center" space="sm">
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$md"
                        fontWeight="$semibold"
                      >
                        {option.label}
                      </Text>
                      {unitSystem === option.key && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={FIXED_COLORS.primary[400]}
                        />
                      )}
                    </HStack>

                    <Text color={FIXED_COLORS.text[400]} fontSize="$sm" mb="$1">
                      {option.description}
                    </Text>

                    <Text
                      color={FIXED_COLORS.text[500]}
                      fontSize="$xs"
                      fontStyle="italic"
                    >
                      {option.examples}
                    </Text>
                  </VStack>
                </HStack>
              </Pressable>
            ))}
          </VStack>

          <Button
            mt="$6"
            bg={FIXED_COLORS.background[600]}
            borderWidth={1}
            borderColor={FIXED_COLORS.background[500]}
            onPress={onClose}
            $pressed={{
              bg: FIXED_COLORS.background[500],
            }}
          >
            <ButtonText color={FIXED_COLORS.text[50]}>
              {t("common.cancel")}
            </ButtonText>
          </Button>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};
