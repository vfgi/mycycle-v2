import React from "react";
import { VStack, HStack, Text, Switch } from "@gluestack-ui/themed";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { TrainingPlanResponse } from "../../../../types/training";

interface TrainingPlanCardHeaderProps {
  plan: TrainingPlanResponse;
  totalExercises: number;
  onToggleActive: (plan: TrainingPlanResponse) => void;
  onEdit: (plan: TrainingPlanResponse) => void;
  onDelete: (plan: TrainingPlanResponse) => void;
  isExpanded?: boolean;
}

export const TrainingPlanCardHeader: React.FC<TrainingPlanCardHeaderProps> = ({
  plan,
  totalExercises,
  onToggleActive,
  onEdit,
  onDelete,
  isExpanded = false,
}) => {
  const { t } = useTranslation();

  return (
    <VStack flex={1}>
      {/* Linha superior: Título e botões de ação */}
      <HStack alignItems="center" justifyContent="space-between">
        <Text
          flex={1}
          color={FIXED_COLORS.text[100]}
          fontSize="$lg"
          fontWeight="$bold"
          mr="$3"
        >
          {plan.name}
        </Text>

        {/* Botões de ação */}
        <HStack alignItems="center" space="sm">
          {/* Botão Excluir */}
          <Pressable
            onPress={() => onDelete(plan)}
            style={{
              padding: 6,
              borderRadius: 6,
            }}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={FIXED_COLORS.error[400]}
            />
          </Pressable>

          {/* Botão Editar */}
          <Pressable
            onPress={() => onEdit(plan)}
            style={{
              padding: 6,
              borderRadius: 6,
            }}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={FIXED_COLORS.primary[400]}
            />
          </Pressable>
          {/* Switch Ativo/Inativo */}
          <Switch
            value={plan.is_active}
            onToggle={() => onToggleActive(plan)}
            size="sm"
            trackColor={{
              false: FIXED_COLORS.background[600],
              true: FIXED_COLORS.success[400],
            }}
          />
        </HStack>
      </HStack>

      {/* Linha inferior: Info e expand/collapse */}
      <HStack
        alignItems="center"
        justifyContent="space-between"
        pt="$2"
        pr="$1"
      >
        <HStack alignItems="center" space="xs" flex={1}>
          <Ionicons
            name={plan.is_active ? "checkmark-circle" : "pause-circle-outline"}
            size={16}
            color={
              plan.is_active
                ? FIXED_COLORS.success[400]
                : FIXED_COLORS.warning[400]
            }
          />
          <Text
            color={FIXED_COLORS.text[300]}
            fontSize="$sm"
            fontWeight="$medium"
          >
            {plan.workouts.length} {t("workouts.workouts")}
          </Text>
          <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
            •
          </Text>
          <Text
            color={FIXED_COLORS.text[300]}
            fontSize="$sm"
            fontWeight="$medium"
          >
            {totalExercises} {t("workouts.exercises")}
          </Text>
          {plan.description && (
            <>
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                •
              </Text>
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                numberOfLines={1}
                flex={1}
              >
                {plan.description}
              </Text>
            </>
          )}
        </HStack>

        {/* Chevron para expand/collapse - alinhado à direita */}
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={FIXED_COLORS.text[400]}
        />
      </HStack>
    </VStack>
  );
};
