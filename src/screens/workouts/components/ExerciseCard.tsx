import React, { useState } from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Pressable,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import { TrainingExercise } from "../../../types/training";
import { ExerciseVideoModal } from "./ExerciseVideoModal";

interface ExerciseCardProps {
  exercise: TrainingExercise;
  onPlayPress?: (exercise: TrainingExercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPlayPress,
}) => {
  const { t } = useTranslation();
  const { unitSystem } = useUnits();
  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleImagePress = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <Box
      bg={FIXED_COLORS.background[800]}
      borderRadius="$xl"
      borderWidth={1}
      borderColor={FIXED_COLORS.background[600]}
      overflow="hidden"
      mb="$3"
      shadowColor={FIXED_COLORS.background[900]}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={2}
    >
      <VStack space="md" p="$2">
        {/* Nome do exercício no topo */}
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$bold"
          numberOfLines={2}
          lineHeight="$lg"
        >
          {t(`exercises.${exercise.name}`)}
        </Text>

        {/* Imagem e informações lado a lado */}
        <HStack space="md" alignItems="flex-start" flex={1}>
          {/* Imagem do exercício */}
          <Pressable onPress={handleImagePress}>
            <Box
              width="$20"
              height="$20"
              borderRadius="$lg"
              overflow="hidden"
              bg={FIXED_COLORS.background[700]}
              borderWidth={1}
              borderColor={FIXED_COLORS.background[600]}
              position="relative"
            >
              {exercise.imageURL ? (
                <Image
                  source={{ uri: exercise.imageURL }}
                  alt={exercise.name}
                  width={80}
                  height={80}
                  resizeMode="cover"
                />
              ) : (
                <Box
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  bg={FIXED_COLORS.background[600]}
                >
                  <Ionicons
                    name="fitness"
                    size={32}
                    color={FIXED_COLORS.text[400]}
                  />
                </Box>
              )}

              {/* Indicador de vídeo */}
              {exercise.videoURL && (
                <Box
                  position="absolute"
                  bottom="$1"
                  right="$1"
                  bg="rgba(0,0,0,0.7)"
                  borderRadius="$full"
                  p="$1"
                >
                  <Ionicons
                    name="play"
                    size={12}
                    color={FIXED_COLORS.text[50]}
                  />
                </Box>
              )}
            </Box>
          </Pressable>

          {/* Informações do exercício */}
          <VStack flex={1} space="sm" justifyContent="space-between">
            {/* Grupo muscular */}
            <Text
              color={FIXED_COLORS.primary[400]}
              fontSize="$sm"
              fontWeight="$semibold"
            >
              {exercise.muscle_group}
            </Text>

            {/* Sets, Reps, Weight */}
            <HStack
              space="sm"
              flexWrap="wrap"
              justifyContent={onPlayPress ? "flex-start" : "space-between"}
            >
              <Box
                bg={FIXED_COLORS.background[700]}
                borderRadius="$md"
                px="$3"
                py="$2"
                alignItems="center"
                minWidth={onPlayPress ? "$10" : "$16"}
                flex={onPlayPress ? undefined : 1}
              >
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                  mb="$1"
                >
                  {t("workouts.sets")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$bold"
                >
                  {exercise.sets}
                </Text>
              </Box>

              <Box
                bg={FIXED_COLORS.background[700]}
                borderRadius="$md"
                px="$3"
                py="$2"
                alignItems="center"
                minWidth={onPlayPress ? "$10" : "$16"}
                flex={onPlayPress ? undefined : 1}
              >
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                  mb="$1"
                >
                  {t("workouts.reps")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$bold"
                >
                  {exercise.reps}
                </Text>
              </Box>

              <Box
                bg={FIXED_COLORS.background[700]}
                borderRadius="$md"
                px="$3"
                py="$2"
                alignItems="center"
                minWidth={onPlayPress ? "$10" : "$16"}
                flex={onPlayPress ? undefined : 1}
              >
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$xs"
                  fontWeight="$medium"
                  mb="$1"
                >
                  {t("workouts.weight")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$bold"
                >
                  {exercise.weight ?? 0}
                  {weightUnit}
                </Text>
              </Box>
            </HStack>
          </VStack>

          {/* Botão Play - Condicional */}
          {onPlayPress && (
            <Pressable
              onPress={() => onPlayPress?.(exercise)}
              bg={FIXED_COLORS.primary[600]}
              borderRadius="$full"
              width={48}
              height={48}
              justifyContent="center"
              alignItems="center"
              shadowColor={FIXED_COLORS.primary[800]}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={4}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.95 : 1 }],
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons
                name="play"
                size={24}
                color={FIXED_COLORS.text[50]}
                style={{ marginLeft: 2 }}
              />
            </Pressable>
          )}
        </HStack>
      </VStack>

      {/* Modal de vídeo do exercício */}
      <ExerciseVideoModal
        exercise={exercise}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </Box>
  );
};
