export interface WeekDay {
  key: string;
  labelKey: string;
}

export const WEEK_DAYS: WeekDay[] = [
  { key: "monday", labelKey: "workoutSetup.days.monday" },
  { key: "tuesday", labelKey: "workoutSetup.days.tuesday" },
  { key: "wednesday", labelKey: "workoutSetup.days.wednesday" },
  { key: "thursday", labelKey: "workoutSetup.days.thursday" },
  { key: "friday", labelKey: "workoutSetup.days.friday" },
  { key: "saturday", labelKey: "workoutSetup.days.saturday" },
  { key: "sunday", labelKey: "workoutSetup.days.sunday" },
];

export const getWeekDayByKey = (key: string): WeekDay | undefined => {
  return WEEK_DAYS.find((day) => day.key === key);
};

export const getWeekDayLabel = (
  key: string,
  t: (key: string) => string
): string => {
  const day = getWeekDayByKey(key);
  return day ? t(day.labelKey) : "";
};
