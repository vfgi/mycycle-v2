import React from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  ButtonText,
  Text,
  Heading,
  Icon,
  CloseIcon,
} from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";

interface DeleteWorkoutModalProps {
  isOpen: boolean;
  workoutName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteWorkoutModal: React.FC<DeleteWorkoutModalProps> = ({
  isOpen,
  workoutName,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent bg={FIXED_COLORS.background[800]}>
        <AlertDialogHeader>
          <Heading color={FIXED_COLORS.text[50]} size="lg">
            {t("workouts.deleteWorkout")}
          </Heading>
          <AlertDialogCloseButton disabled={isDeleting}>
            <Icon as={CloseIcon} color={FIXED_COLORS.text[400]} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text color={FIXED_COLORS.text[200]} fontSize="$md" mb="$3">
            {t("workouts.deleteWorkoutConfirmation")}
          </Text>
          <Text
            color={FIXED_COLORS.text[100]}
            fontSize="$md"
            fontWeight="$bold"
            mb="$3"
          >
            {workoutName}
          </Text>
          <Text color={FIXED_COLORS.warning[400]} fontSize="$sm">
            {t("workouts.deleteWorkoutWarning")}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={onClose}
            mr="$3"
            disabled={isDeleting}
            borderColor={FIXED_COLORS.background[600]}
          >
            <ButtonText color={FIXED_COLORS.text[200]}>
              {t("common.cancel")}
            </ButtonText>
          </Button>
          <Button
            bg={FIXED_COLORS.error[600]}
            onPress={onConfirm}
            disabled={isDeleting}
            opacity={isDeleting ? 0.6 : 1}
          >
            <ButtonText>
              {isDeleting ? t("common.deleting") : t("common.delete")}
            </ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
