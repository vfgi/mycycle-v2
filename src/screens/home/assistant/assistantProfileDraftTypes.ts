import type { Measurements } from "../../../types/auth";

export type AssistantProfileDraft = {
  birth_date?: string;
  gender?: string;
  health_issues?: string;
  allergies?: string;
  goalsObjectiveText?: string;
  measurements: Partial<Measurements>;
  activity_level?: string;
  workout_type?: string[];
  trained_before?: boolean;
  training_duration?: string;
  was_in_better_shape?: boolean;
  body_self_description?: string;
  sleep_hours?: number;
  stress_level?: string;
  work_type?: string;
};

export function emptyAssistantDraft(): AssistantProfileDraft {
  return { measurements: {} };
}

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export type AssistantChatPhase =
  | "idle"
  | "welcome"
  | "birth_date"
  | "gender"
  | "health_issues"
  | "allergies"
  | "goal_pick"
  | "goal_other"
  | "measurement"
  | "activity_level"
  | "workout_type"
  | "trained_before"
  | "training_duration"
  | "was_in_better_shape"
  | "body_self_description"
  | "sleep_hours"
  | "stress_level"
  | "work_type"
  | "finalize"
  | "generating"
  | "done";

export const MEASUREMENT_CHAT_KEYS: (keyof Measurements)[] = [
  "height",
  "weight",
  "neck",
  "chest",
  "abdomen",
  "waist",
  "hip",
  "thigh",
  "biceps",
  "back",
];
