import type { User } from "../../../types/auth";
import type { AssistantProfileDraft } from "./assistantProfileDraftTypes";
import { emptyAssistantDraft } from "./assistantProfileDraftTypes";

export function mapUserToAssistantDraft(user: User | null): AssistantProfileDraft {
  const base = emptyAssistantDraft();
  if (!user) return base;
  const wt = user.workout_type;
  const workout_type = Array.isArray(wt)
    ? wt
    : typeof wt === "string" && wt.length > 0
      ? [wt]
      : undefined;
  let goalsObjectiveText: string | undefined;
  if (user.goals?.objective != null) {
    goalsObjectiveText = String(user.goals.objective);
  }
  return {
    ...base,
    birth_date: user.birth_date,
    gender: user.gender,
    health_issues: user.health_issues,
    allergies: user.allergies,
    goalsObjectiveText,
    measurements: {
      ...base.measurements,
      ...(user.measurements ?? {}),
    },
    activity_level: user.activity_level,
    workout_type,
    trained_before: user.trained_before,
    training_duration: user.training_duration,
    was_in_better_shape: user.was_in_better_shape,
    body_self_description: user.body_self_description,
    sleep_hours: user.sleep_hours,
    stress_level: user.stress_level,
    work_type: user.work_type,
  };
}

export function resolveCountryForFullPlan(user: User, language: string): string {
  const trimmed = user.country?.trim() || user.address?.trim();
  if (trimmed) return trimmed;
  const map: Record<string, string> = {
    "pt-BR": "Brasil",
    pt: "Brasil",
    "pt-PT": "Portugal",
    en: "United States",
    "en-US": "United States",
    es: "España",
    "es-ES": "España",
    "es-MX": "México",
  };
  return map[language] ?? "";
}
