export type MealTypeKey = "breakfast" | "lunch" | "dinner" | "snack";

const VALID_MEAL_TYPES: MealTypeKey[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

export function normalizeMealType(value: unknown): MealTypeKey {
  if (
    typeof value === "string" &&
    VALID_MEAL_TYPES.includes(value as MealTypeKey)
  ) {
    return value as MealTypeKey;
  }
  return "lunch";
}

function getOrderedMealTypesForLocalHour(hour: number): MealTypeKey[] {
  if (hour >= 5 && hour <= 10) {
    return ["breakfast", "snack", "lunch", "dinner"];
  }
  if (hour >= 11 && hour <= 14) {
    return ["lunch", "snack", "breakfast", "dinner"];
  }
  if (hour >= 15 && hour <= 17) {
    return ["snack", "lunch", "dinner", "breakfast"];
  }
  if (hour >= 18 && hour <= 22) {
    return ["dinner", "snack", "lunch", "breakfast"];
  }
  return ["dinner", "snack", "breakfast", "lunch"];
}

export function parseScheduledTimeToMinutes(
  value: string | undefined | null
): number | null {
  if (value == null || String(value).trim() === "") return null;
  const s = String(value).trim();
  const timePart = s.includes("T") ? s.split("T")[1]?.slice(0, 5) : s;
  const m = /^(\d{1,2}):(\d{2})/.exec(timePart || s);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  return h * 60 + min;
}

export function sortMealsByLocalTimeOfDay<
  T extends {
    meal_type?: unknown;
    time?: string;
    scheduled_time?: string;
    name?: string;
  },
>(meals: T[]): T[] {
  const hour = new Date().getHours();
  const order = getOrderedMealTypesForLocalHour(hour);
  const typeRank = (type: MealTypeKey) => {
    const i = order.indexOf(type);
    return i === -1 ? 99 : i;
  };

  return [...meals].sort((a, b) => {
    const ra = typeRank(normalizeMealType(a.meal_type));
    const rb = typeRank(normalizeMealType(b.meal_type));
    if (ra !== rb) return ra - rb;

    const ma =
      parseScheduledTimeToMinutes(a.scheduled_time) ??
      parseScheduledTimeToMinutes(a.time);
    const mb =
      parseScheduledTimeToMinutes(b.scheduled_time) ??
      parseScheduledTimeToMinutes(b.time);

    if (ma != null && mb != null && ma !== mb) return ma - mb;
    if (ma != null && mb == null) return -1;
    if (ma == null && mb != null) return 1;

    return (a.name || "").localeCompare(b.name || "", undefined, {
      sensitivity: "base",
    });
  });
}

export function getMealImageForType(mealType: unknown) {
  switch (normalizeMealType(mealType)) {
    case "breakfast":
      return require("../../../../assets/images/food/breakfast.jpg");
    case "lunch":
      return require("../../../../assets/images/food/lunch.jpg");
    case "dinner":
      return require("../../../../assets/images/food/dinner.jpg");
    case "snack":
      return require("../../../../assets/images/food/snacks.jpg");
    default:
      return require("../../../../assets/images/food/lunch.jpg");
  }
}
