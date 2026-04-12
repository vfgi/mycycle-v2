import type { AssistantProfileDraft } from "./assistantProfileDraftTypes";

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) {
      out[k] = v;
    }
  }
  return out as Partial<T>;
}

export function buildAssistantProfilePayload(
  draft: AssistantProfileDraft
): Record<string, unknown> {
  const meas = stripUndefined(
    Object.fromEntries(
      Object.entries(draft.measurements).filter(
        ([, v]) => typeof v === "number" && !Number.isNaN(v) && v > 0
      )
    ) as Record<string, unknown>
  );

  const goals: Record<string, unknown> = {};
  const obj = draft.goalsObjectiveText?.trim();
  if (obj) goals.objective = obj;

  const workout =
    draft.workout_type && draft.workout_type.length > 0
      ? draft.workout_type
      : undefined;

  const raw: Record<string, unknown> = {
    birth_date: draft.birth_date,
    gender: draft.gender,
    health_issues: draft.health_issues ?? "",
    allergies: draft.allergies ?? "",
    goals: stripUndefined(goals as Record<string, unknown>),
    measurements: meas,
    activity_level: draft.activity_level,
    workout_type: workout,
    trained_before: draft.trained_before,
    training_duration: draft.training_duration,
    was_in_better_shape: draft.was_in_better_shape,
    body_self_description: draft.body_self_description,
    sleep_hours: draft.sleep_hours,
    stress_level: draft.stress_level,
    work_type: draft.work_type,
  };

  const cleaned = stripUndefined(raw);
  if (Object.keys(cleaned.goals as object).length === 0) {
    delete cleaned.goals;
  }
  if (Object.keys(cleaned.measurements as object).length === 0) {
    delete cleaned.measurements;
  }
  return cleaned;
}
