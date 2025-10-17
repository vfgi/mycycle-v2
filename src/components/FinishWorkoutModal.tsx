import React from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Spinner,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";

interface FinishWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  workoutName?: string;
  completedExercises?: number;
  totalExercises?: number;
}

export const FinishWorkoutModal: React.FC<FinishWorkoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  workoutName,
  completedExercises = 0,
  totalExercises = 0,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent bg={FIXED_COLORS.background[900]}>
        <ModalHeader>
          <VStack space="xs">
            <HStack alignItems="center" space="sm">
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={FIXED_COLORS.success[500]}
              />
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$semibold"
              >
                {t("history.workout.finish.title")}
              </Text>
            </HStack>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              {t("history.workout.finish.subtitle")}
            </Text>
          </VStack>
          <ModalCloseButton>
            <Ionicons name="close" size={20} color={FIXED_COLORS.text[400]} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            <VStack
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              p="$4"
              space="sm"
            >
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                {workoutName}
              </Text>

              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                  {t("history.workout.finish.exercisesCompleted")}
                </Text>
                <Text
                  color={FIXED_COLORS.primary[500]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {completedExercises}/{totalExercises}
                </Text>
              </HStack>

              <HStack justifyContent="space-between" alignItems="center">
                <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                  {t("history.workout.finish.progress")}
                </Text>
                <Text
                  color={FIXED_COLORS.success[500]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  {Math.round((completedExercises / totalExercises) * 100)}%
                </Text>
              </HStack>
            </VStack>

            <VStack space="sm">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {t("history.workout.finish.warning")}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                {t("history.workout.finish.description")}
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack space="sm" flex={1}>
            <Button
              flex={1}
              variant="outline"
              borderColor={FIXED_COLORS.background[600]}
              onPress={onClose}
              isDisabled={isLoading}
            >
              <ButtonText color={FIXED_COLORS.text[400]}>
                {t("common.cancel")}
              </ButtonText>
            </Button>

            <Button
              flex={1}
              bg={FIXED_COLORS.success[500]}
              onPress={onConfirm}
              isDisabled={isLoading}
            >
              {isLoading ? (
                <HStack alignItems="center" space="xs">
                  <Spinner size="small" color={FIXED_COLORS.text[50]} />
                  <ButtonText color={FIXED_COLORS.text[50]}>
                    {t("history.workout.finish.saving")}
                  </ButtonText>
                </HStack>
              ) : (
                <HStack alignItems="center" space="xs">
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={FIXED_COLORS.text[50]}
                  />
                  <ButtonText color={FIXED_COLORS.text[50]}>
                    {t("history.workout.finish.confirm")}
                  </ButtonText>
                </HStack>
              )}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
