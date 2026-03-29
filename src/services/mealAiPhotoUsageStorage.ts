import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@MyCycle:mealAiPhotoDailyUses";

export const AI_MEAL_PHOTO_DAILY_LIMIT = 8;

type Stored = {
  dayKey: string;
  count: number;
};

export function getLocalCalendarDayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function readNormalized(): Promise<{ dayKey: string; count: number }> {
  const today = getLocalCalendarDayKey();
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { dayKey: today, count: 0 };
    }
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed.dayKey || typeof parsed.count !== "number") {
      return { dayKey: today, count: 0 };
    }
    if (parsed.dayKey !== today) {
      const reset = { dayKey: today, count: 0 };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
      return reset;
    }
    return {
      dayKey: today,
      count: Math.min(
        AI_MEAL_PHOTO_DAILY_LIMIT,
        Math.max(0, parsed.count),
      ),
    };
  } catch {
    return { dayKey: today, count: 0 };
  }
}

export async function getMealAiPhotoQuota(): Promise<{
  used: number;
  remaining: number;
  limit: number;
}> {
  const { count } = await readNormalized();
  return {
    used: count,
    remaining: Math.max(0, AI_MEAL_PHOTO_DAILY_LIMIT - count),
    limit: AI_MEAL_PHOTO_DAILY_LIMIT,
  };
}

export async function incrementMealAiPhotoUsage(): Promise<void> {
  const { dayKey, count } = await readNormalized();
  const next = Math.min(AI_MEAL_PHOTO_DAILY_LIMIT, count + 1);
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ dayKey, count: next }),
  );
}
