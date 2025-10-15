import React from "react";
import { VStack, HStack, Text, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";

interface WorkoutCardHeaderProps {
  workoutName: string;
  lastExecutionDate: string;
  exercisesCount: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const WorkoutCardHeader: React.FC<WorkoutCardHeaderProps> = ({
  workoutName,
  lastExecutionDate,
  exercisesCount,
  isCompleted,
  isExpanded,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <HStack flex={1} alignItems="center" space="sm">
      <VStack flex={1} space="xs">
        <HStack justifyContent="space-between" alignItems="center">
          <Text
            color={FIXED_COLORS.text[100]}
            fontSize="$lg"
            fontWeight="$bold"
            flex={1}
            mr="$3"
          >
            {workoutName}
          </Text>

          <HStack space="xs" alignItems="center">
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              p={6}
              borderRadius="$md"
              bg={FIXED_COLORS.background[700]}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={FIXED_COLORS.primary[400]}
              />
            </Pressable>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              p={6}
              borderRadius="$md"
              bg={FIXED_COLORS.background[700]}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={FIXED_COLORS.error[400]}
              />
            </Pressable>
          </HStack>
        </HStack>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          pt="$2"
        >
          <HStack flex={1} alignItems="center" space="md">
            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$sm"
              fontWeight="$medium"
            >
              {lastExecutionDate}
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              •
            </Text>
            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$sm"
              fontWeight="$medium"
            >
              {exercisesCount} {t("workouts.exercises")}
            </Text>
          </HStack>

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={FIXED_COLORS.text[400]}
          />
        </HStack>
      </VStack>
    </HStack>
  );
};
