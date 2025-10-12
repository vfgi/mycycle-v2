import React, { useState } from "react";
import { VStack, Text, HStack, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { ExpandableCalendarComponent } from "../../../components";

export const WorkoutTab: React.FC = () => {
  const { t } = useTranslation();

  const allMockWorkouts = {
    "2025-10-12": {
      name: "Treino de Peito e Tríceps",
      duration: "45 min",
      exercises: 6,
      calories: 320,
      completed: true,
    },
    "2025-10-11": {
      name: "Treino de Costas e Bíceps",
      duration: "52 min",
      exercises: 7,
      calories: 380,
      completed: true,
    },
    "2025-10-10": {
      name: "Treino de Pernas",
      duration: "38 min",
      exercises: 5,
      calories: 420,
      completed: false,
    },
    "2025-10-09": {
      name: "Treino de Ombros",
      duration: "40 min",
      exercises: 6,
      calories: 290,
      completed: true,
    },
    "2025-10-08": {
      name: "Treino de Braços",
      duration: "35 min",
      exercises: 8,
      calories: 250,
      completed: true,
    },
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  console.log("💪 WorkoutTab - selectedDate atual:", selectedDate);

  const handleDayPress = (day: any) => {
    console.log("💪 WorkoutTab - Dia clicado:", day.dateString);
    setSelectedDate(day.dateString);
  };

  const selectedWorkout =
    allMockWorkouts[selectedDate as keyof typeof allMockWorkouts];

  const getMarkedDates = () => {
    const marked: any = {};
    Object.keys(allMockWorkouts).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: FIXED_COLORS.primary[500],
      };
    });
    return marked;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Hoje";
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const renderWorkoutCard = (workout: any) => (
    <Box
      bg={FIXED_COLORS.background[800]}
      borderRadius="$lg"
      p="$4"
      mb="$3"
      borderLeftWidth={4}
      borderLeftColor={
        workout.completed
          ? FIXED_COLORS.success[500]
          : FIXED_COLORS.warning[500]
      }
    >
      <VStack space="sm">
        <HStack alignItems="center" justifyContent="space-between">
          <VStack flex={1}>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$semibold"
            >
              {workout.name}
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              {formatDate(selectedDate)}
            </Text>
          </VStack>

          <HStack alignItems="center" space="xs">
            <Ionicons
              name={workout.completed ? "checkmark-circle" : "time-outline"}
              size={16}
              color={
                workout.completed
                  ? FIXED_COLORS.success[500]
                  : FIXED_COLORS.warning[500]
              }
            />
            <Text
              color={
                workout.completed
                  ? FIXED_COLORS.success[500]
                  : FIXED_COLORS.warning[500]
              }
              fontSize="$xs"
              fontWeight="$medium"
            >
              {workout.completed
                ? t("history.workout.completed")
                : t("history.workout.incomplete")}
            </Text>
          </HStack>
        </HStack>

        <HStack justifyContent="space-between" mt="$2">
          <VStack alignItems="center" space="xs">
            <Ionicons
              name="time-outline"
              size={14}
              color={FIXED_COLORS.text[400]}
            />
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.workout.duration")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$medium"
            >
              {workout.duration}
            </Text>
          </VStack>

          <VStack alignItems="center" space="xs">
            <Ionicons
              name="barbell-outline"
              size={14}
              color={FIXED_COLORS.text[400]}
            />
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.workout.exercises")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$medium"
            >
              {workout.exercises}
            </Text>
          </VStack>

          <VStack alignItems="center" space="xs">
            <Ionicons
              name="flame-outline"
              size={14}
              color={FIXED_COLORS.text[400]}
            />
            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
              {t("history.workout.calories")}
            </Text>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$medium"
            >
              {workout.calories}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <VStack flex={1} space="md">
      <ExpandableCalendarComponent
        selectedDate={selectedDate}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
      >
        {selectedWorkout ? (
          renderWorkoutCard(selectedWorkout)
        ) : (
          <Box
            bg={FIXED_COLORS.background[800]}
            borderRadius="$lg"
            p="$4"
            borderWidth={1}
            borderColor={FIXED_COLORS.background[700]}
            borderStyle="dashed"
          >
            <VStack alignItems="center" space="sm">
              <Ionicons
                name="calendar-outline"
                size={32}
                color={FIXED_COLORS.text[400]}
              />
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                textAlign="center"
              >
                Nenhum treino registrado para esta data
              </Text>
            </VStack>
          </Box>
        )}

        <Box
          bg={FIXED_COLORS.background[800]}
          borderRadius="$lg"
          p="$4"
          borderWidth={1}
          borderColor={FIXED_COLORS.background[700]}
          borderStyle="dashed"
        >
          <VStack alignItems="center" space="sm">
            <Ionicons
              name="add-circle-outline"
              size={32}
              color={FIXED_COLORS.text[400]}
            />
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$sm"
              textAlign="center"
            >
              {t("history.workout.createWorkout")}
            </Text>
          </VStack>
        </Box>
      </ExpandableCalendarComponent>
    </VStack>
  );
};
