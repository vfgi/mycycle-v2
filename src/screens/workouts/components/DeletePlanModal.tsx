import React from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface DeletePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  isDeleting: boolean;
}

export const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
  isDeleting,
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent bg={FIXED_COLORS.background[800]} maxWidth="$96">
        <AlertDialogHeader>
          <HStack space="sm" alignItems="center">
            <Ionicons
              name="trash-outline"
              size={24}
              color={FIXED_COLORS.error[400]}
            />
            <Text
              color={FIXED_COLORS.text[100]}
              fontSize="$lg"
              fontWeight="$bold"
            >
              {t("workouts.deletePlan")}
            </Text>
          </HStack>
          <AlertDialogCloseButton>
            <Ionicons name="close" size={20} color={FIXED_COLORS.text[400]} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>

        <AlertDialogBody>
          <VStack space="md">
            <Text color={FIXED_COLORS.text[200]} fontSize="$md">
              {t("workouts.deletePlanConfirmation")}
            </Text>
            <VStack
              bg={FIXED_COLORS.background[700]}
              borderRadius="$md"
              p="$3"
              borderLeftWidth={3}
              borderLeftColor={FIXED_COLORS.error[400]}
            >
              <Text
                color={FIXED_COLORS.text[100]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                {planName}
              </Text>
            </VStack>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              {t("workouts.deletePlanWarning")}
            </Text>
          </VStack>
        </AlertDialogBody>

        <AlertDialogFooter>
          <HStack space="md" flex={1}>
            <Button
              flex={1}
              variant="outline"
              borderColor={FIXED_COLORS.background[600]}
              onPress={onClose}
              disabled={isDeleting}
            >
              <ButtonText color={FIXED_COLORS.text[300]}>
                {t("common.cancel")}
              </ButtonText>
            </Button>
            <Button
              flex={1}
              bg={FIXED_COLORS.error[500]}
              onPress={onConfirm}
              disabled={isDeleting}
              opacity={isDeleting ? 0.6 : 1}
            >
              <ButtonText color={FIXED_COLORS.text[50]}>
                {isDeleting ? t("common.deleting") : t("common.delete")}
              </ButtonText>
            </Button>
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
