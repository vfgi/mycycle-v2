import React from "react";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Box,
  Image,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { CustomInput } from "../../../components/CustomInput";
import { Exercise } from "../../../types/exercises";

interface SelectedExerciseItemProps {
  exercise: Exercise;
  onRemove: (exercise: Exercise) => void;
  onSwap: (exercise: Exercise) => void;
  onUpdateSets: (exerciseId: string, sets: string) => void;
  onUpdateReps: (exerciseId: string, reps: string) => void;
  onUpdateWeight: (exerciseId: string, weight: string) => void;
  sets: string;
  reps: string;
  weight: string;
}

export const SelectedExerciseItem: React.FC<SelectedExerciseItemProps> = ({
  exercise,
  onRemove,
  onSwap,
  onUpdateSets,
  onUpdateReps,
  onUpdateWeight,
  sets,
  reps,
  weight,
}) => {
  const { t } = useTranslation();

  return (
    <HStack
      space="md"
      p="$3"
      bg={FIXED_COLORS.background[50]}
      borderRadius="$lg"
      borderWidth={1}
      borderColor={FIXED_COLORS.primary[600]}
    >
      {/* Imagem do exercício */}
      <VStack alignItems="center" justifyContent="center" width={60}>
        <Box
          width={60}
          height={60}
          borderRadius="$md"
          overflow="hidden"
          bg={FIXED_COLORS.background[200]}
        >
          <Image
            source={{ uri: exercise.previewImage }}
            alt={t(`exercises.${exercise.name}`)}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
        </Box>
      </VStack>

      {/* Conteúdo principal */}
      <VStack flex={1} space="sm">
        {/* Nome do exercício */}
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$sm"
          fontWeight="$semibold"
          numberOfLines={2}
        >
          {t(`exercises.${exercise.name}`)}
        </Text>

        {/* Inputs para séries, repetições e carga */}
        <HStack space="sm" alignItems="center">
          {/* Séries */}
          <VStack flex={1} space="xs">
            <CustomInput
              value={sets}
              onChangeText={(text) => onUpdateSets(exercise.id, text)}
              placeholder="0"
              keyboardType="numeric"
              label={t("workoutSetup.sets")}
            />
          </VStack>

          {/* Repetições */}
          <VStack flex={1} space="xs">
            <CustomInput
              value={reps}
              onChangeText={(text) => onUpdateReps(exercise.id, text)}
              placeholder="0"
              keyboardType="numeric"
              label={t("workoutSetup.reps")}
            />
          </VStack>

          {/* Carga */}
          <VStack flex={1} space="xs">
            <CustomInput
              label={t("workoutSetup.weight")}
              value={weight}
              onChangeText={(text) => onUpdateWeight(exercise.id, text)}
              placeholder="0"
              keyboardType="numeric"
            />
          </VStack>
        </HStack>
      </VStack>

      {/* Botões de ação */}
      <VStack space="sm" alignItems="center">
        {/* Botão de trocar exercício */}
        <Pressable
          onPress={() => onSwap(exercise)}
          p="$2"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons
            name="swap-horizontal"
            size={20}
            color={FIXED_COLORS.primary[500]}
          />
        </Pressable>

        {/* Botão de excluir exercício */}
        <Pressable
          onPress={() => onRemove(exercise)}
          p="$2"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="trash" size={20} color={FIXED_COLORS.error[500]} />
        </Pressable>
      </VStack>
    </HStack>
  );
};
