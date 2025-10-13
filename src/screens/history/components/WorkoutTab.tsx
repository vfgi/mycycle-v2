import React, { useState } from "react";
import { VStack, Text, Box } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  ExpandableCalendarComponent,
  WorkoutGoalCard,
} from "../../../components";
import { workoutMockData, WorkoutExercisesList } from "./workout";

export const WorkoutTab: React.FC = () => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const selectedExercises =
    workoutMockData[selectedDate as keyof typeof workoutMockData] || [];

  const getMarkedDates = () => {
    const marked: any = {};
    Object.keys(workoutMockData).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: FIXED_COLORS.primary[500],
      };
    });
    return marked;
  };

  // Calcular estatísticas do dia
  const totalExercises = selectedExercises.length;
  const totalDuration = selectedExercises.reduce(
    (sum, exercise) => sum + exercise.duration,
    0
  );

  return (
    <VStack flex={1}>
      <ExpandableCalendarComponent
        selectedDate={selectedDate}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 16, paddingHorizontal: 16 }}
        >
          {selectedExercises.length > 0 ? (
            <VStack space="md">
              {/* Card de meta de exercícios */}
              <WorkoutGoalCard
                title={t("history.workout.title")}
                currentExercises={totalExercises}
                goalExercises={6} // Meta padrão
                currentDuration={totalDuration}
                goalDuration={45} // Meta padrão
                colors={[
                  FIXED_COLORS.primary[700],
                  FIXED_COLORS.secondary[400],
                ]}
                icon={
                  <Ionicons
                    name="barbell-outline"
                    size={20}
                    color={FIXED_COLORS.primary[500]}
                  />
                }
              />

              {/* Lista de exercícios executados */}
              <WorkoutExercisesList exercises={selectedExercises} />
            </VStack>
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
                  {t("history.workout.noDataForDate")}
                </Text>
              </VStack>
            </Box>
          )}
        </ScrollView>
      </ExpandableCalendarComponent>
    </VStack>
  );
};
