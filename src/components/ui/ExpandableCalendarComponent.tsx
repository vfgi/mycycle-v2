import React from "react";
import { VStack } from "@gluestack-ui/themed";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { FIXED_COLORS } from "../../theme/colors";

interface ExpandableCalendarComponentProps {
  selectedDate: string;
  onDayPress: (day: { dateString: string }) => void;
  markedDates?: any;
  children?: React.ReactNode;
}

export const ExpandableCalendarComponent: React.FC<
  ExpandableCalendarComponentProps
> = ({ selectedDate, onDayPress, markedDates = {}, children }) => {
  return (
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
          markedDates={markedDates}
          onDayPress={onDayPress}
        />

        {children}
      </VStack>
    </CalendarProvider>
  );
};

export default ExpandableCalendarComponent;
