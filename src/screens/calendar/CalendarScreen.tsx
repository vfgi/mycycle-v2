import React, { useState, useCallback, useMemo } from "react";
import { VStack, Text, HStack, Pressable } from "@gluestack-ui/themed";
import {
  CalendarProvider,
  ExpandableCalendar,
  AgendaList,
} from "react-native-calendars";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components/SafeContainer";
import { Ionicons } from "@expo/vector-icons";
import { calendarMockData, CalendarEvent } from "./calendarMockData";

export const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Mock data - em produção virá da API
  const mockEvents = calendarMockData;

  // Criar seções para o AgendaList - estrutura correta baseada no exemplo oficial
  const agendaSections = useMemo(() => {
    const datesWithEvents = Object.keys(mockEvents).sort();

    const sections = datesWithEvents.map((date) => ({
      title: date,
      data: mockEvents[date] || [],
    }));

    return sections;
  }, [mockEvents]);

  const renderItem = useCallback(({ item }: { item: CalendarEvent }) => {
    if (!item) {
      return null;
    }
    return (
      <Pressable
        bg={FIXED_COLORS.background[800]}
        p="$4"
        m="$2"
        borderRadius="$lg"
        borderLeftWidth={4}
        borderLeftColor={item.color}
      >
        <HStack space="md" alignItems="center">
          <VStack bg={item.color} width={12} height={12} borderRadius="$full" />
          <VStack flex={1}>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$md"
              fontWeight="$semibold"
            >
              {item.title}
            </Text>
            <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
              {item.time}
            </Text>
            {item.description && (
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs" mt="$1">
                {item.description}
              </Text>
            )}
          </VStack>
          <Ionicons
            name={getEventIcon(item.type)}
            size={20}
            color={item.color}
          />
        </HStack>
      </Pressable>
    );
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "workout":
        return "fitness";
      case "measurement":
        return "analytics";
      case "goal":
        return "flag";
      case "reminder":
        return "alarm";
      default:
        return "calendar";
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    Object.keys(mockEvents).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: FIXED_COLORS.primary[500],
      };
    });
    return marked;
  };

  return (
    <SafeContainer paddingTop={0} paddingBottom={10} paddingHorizontal={0}>
      <CalendarProvider date={selectedDate}>
        <VStack flex={1} bg={FIXED_COLORS.background[950]}>
          <ExpandableCalendar
            theme={{
              backgroundColor: FIXED_COLORS.background[800],
              calendarBackground: FIXED_COLORS.background[800],
              textSectionTitleColor: FIXED_COLORS.text[50],
              selectedDayBackgroundColor: FIXED_COLORS.primary[500],
              selectedDayTextColor: FIXED_COLORS.text[50],
              todayTextColor: FIXED_COLORS.primary[500],
              dayTextColor: FIXED_COLORS.text[50],
              textDisabledColor: FIXED_COLORS.text[600],
              dotColor: FIXED_COLORS.primary[500],
              selectedDotColor: FIXED_COLORS.text[50],
              arrowColor: FIXED_COLORS.primary[500],
              monthTextColor: FIXED_COLORS.text[50],
              indicatorColor: FIXED_COLORS.primary[500],
              textDayFontWeight: "500",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "500",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            markedDates={getMarkedDates()}
            onDayPress={(day) => setSelectedDate(day.dateString)}
          />

          <AgendaList
            sections={agendaSections}
            renderItem={renderItem}
            sectionStyle={{
              backgroundColor: FIXED_COLORS.background[950],
              borderBottomWidth: 1,
              borderBottomColor: FIXED_COLORS.text[50],
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginBottom: 14,
            }}
          />
        </VStack>
      </CalendarProvider>
    </SafeContainer>
  );
};
