import React from "react";
import {
  VStack,
  Text,
  Image,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { TrainingExercise } from "../../../types/training";

interface ExerciseVideoModalProps {
  exercise: TrainingExercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExerciseVideoModal: React.FC<ExerciseVideoModalProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent
        maxWidth="90%"
        maxHeight="80%"
        bg={FIXED_COLORS.background[800]}
        borderRadius="$xl"
      >
        <ModalHeader bg={FIXED_COLORS.background[800]} pb="$2">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$semibold"
            flex={1}
            numberOfLines={2}
          >
            {exercise && t(`exercises.${exercise.name}`)}
          </Text>
          <ModalCloseButton>
            <Ionicons name="close" size={24} color={FIXED_COLORS.text[50]} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody bg={FIXED_COLORS.background[800]} p="$4">
          {exercise && exercise.videoURL ? (
            <VStack space="md" alignItems="center">
              {/* GIF do exercício */}
              <Image
                source={{ uri: exercise.videoURL }}
                alt={t(`exercises.${exercise.name}`)}
                style={{
                  width: "100%",
                  height: 300,
                }}
                resizeMode="contain"
              />

              {/* Informações adicionais */}
              <VStack space="sm" width="100%">
                <Text
                  color={FIXED_COLORS.primary[400]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                  textAlign="center"
                >
                  {exercise.muscle_group}
                </Text>

                {exercise.instructions && (
                  <Text
                    color={FIXED_COLORS.text[300]}
                    fontSize="$sm"
                    textAlign="center"
                    lineHeight="$sm"
                  >
                    {exercise.instructions}
                  </Text>
                )}
              </VStack>
            </VStack>
          ) : (
            <VStack space="md" alignItems="center" py="$8">
              <Ionicons
                name="videocam-off-outline"
                size={48}
                color={FIXED_COLORS.text[400]}
              />
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$md"
                textAlign="center"
              >
                {t("workouts.noVideoAvailable")}
              </Text>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
