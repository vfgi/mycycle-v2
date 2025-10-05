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
import { Exercise } from "../../../types/exercises";

interface ExercisePreviewModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExercisePreviewModal: React.FC<ExercisePreviewModalProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent
        maxWidth={400}
        maxHeight={600}
        bg={FIXED_COLORS.background[800]}
        borderRadius="$xl"
      >
        <ModalHeader bg={FIXED_COLORS.background[800]}>
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$semibold"
            flex={1}
          >
            {exercise && t(`exercises.${exercise.name}`)}
          </Text>
          <ModalCloseButton>
            <Ionicons name="close" size={24} color={FIXED_COLORS.text[50]} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody bg={FIXED_COLORS.background[800]}>
          {exercise && (
            <Image
              source={{ uri: exercise.imageURL }}
              alt={t(`exercises.${exercise.name}`)}
              style={{
                height: 400,
                width: "100%",
              }}
              resizeMode="contain"
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
