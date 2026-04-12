import { useState, useEffect, useCallback, useRef } from "react";
import type { TFunction } from "i18next";
import type { Measurements, User } from "../../../types/auth";
import { userService } from "../../../services/userService";
import { goalsService } from "../../../services/goalsService";
import type { Goals } from "../../../types/goals";
import {
  type AssistantProfileDraft,
  type ChatMessage,
  type AssistantChatPhase,
  MEASUREMENT_CHAT_KEYS,
  emptyAssistantDraft,
} from "./assistantProfileDraftTypes";
import { buildAssistantProfilePayload } from "./buildAssistantProfilePayload";
import {
  mapUserToAssistantDraft,
  resolveCountryForFullPlan,
} from "./mapUserToAssistantDraft";
import { assistantSetupStorage } from "../../../services/assistantSetupStorage";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const GOAL_OTHER = "__other__";

export type ChipOption = { label: string; value: string };

type UseAssistantProfileChatArgs = {
  visible: boolean;
  t: TFunction;
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
  updateUser: (user: User) => void;
  getCurrentLanguage: () => string;
  onFlowComplete?: () => void;
  assistantUserId?: string | null;
  translateMeasurementLabel: (key: keyof Measurements) => string;
  measurementUnitLabel: (key: keyof Measurements) => string;
  convertInputToMetric: (value: string, type: "height" | "body") => number;
  metricToDisplayInput: (key: keyof Measurements, metric: number) => string;
};

export function useAssistantProfileChat({
  visible,
  t,
  showError,
  showSuccess,
  updateUser,
  getCurrentLanguage,
  onFlowComplete,
  assistantUserId,
  translateMeasurementLabel,
  measurementUnitLabel,
  convertInputToMetric,
  metricToDisplayInput,
}: UseAssistantProfileChatArgs) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<AssistantChatPhase>("idle");
  const [draft, setDraft] = useState<AssistantProfileDraft>(
    emptyAssistantDraft()
  );
  const [inputText, setInputText] = useState("");
  const [measurementIndex, setMeasurementIndex] = useState(0);
  const [workoutSelection, setWorkoutSelection] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const draftRef = useRef<AssistantProfileDraft>(emptyAssistantDraft());
  draftRef.current = draft;

  const updateUserRef = useRef(updateUser);
  updateUserRef.current = updateUser;

  const appendAssistant = useCallback(
    (text: string) => {
      setMessages((m) => [
        ...m,
        { id: newId(), role: "assistant", text },
      ]);
    },
    []
  );

  const appendUser = useCallback((text: string) => {
    setMessages((m) => [...m, { id: newId(), role: "user", text }]);
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setPhase("idle");
    setDraft(emptyAssistantDraft());
    setInputText("");
    setMeasurementIndex(0);
    setWorkoutSelection([]);
    setIsSaving(false);
  }, []);

  useEffect(() => {
    if (!visible) {
      reset();
      return;
    }
    let cancelled = false;
    setInputText("");
    setMeasurementIndex(0);
    setWorkoutSelection([]);
    setIsSaving(false);
    setPhase("welcome");
    setMessages([
      {
        id: newId(),
        role: "assistant",
        text: t("home.assistantChat.loadingProfile"),
      },
    ]);
    void (async () => {
      try {
        const profile = await userService.getProfile();
        if (cancelled) return;
        updateUserRef.current(profile);
        setDraft(mapUserToAssistantDraft(profile));
      } catch {
        if (!cancelled) setDraft(emptyAssistantDraft());
      }
      if (cancelled) return;
      setMessages([
        {
          id: newId(),
          role: "assistant",
          text: t("home.assistantChat.welcome"),
        },
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, reset, t]);

  useEffect(() => {
    if (!visible) return;
    const d = draftRef.current;
    if (phase === "birth_date") setInputText(d.birth_date ?? "");
    else if (phase === "health_issues") setInputText(d.health_issues ?? "");
    else if (phase === "allergies") setInputText(d.allergies ?? "");
    else if (phase === "goal_other") setInputText(d.goalsObjectiveText ?? "");
    else if (phase === "training_duration")
      setInputText(d.training_duration ?? "");
    else if (phase === "sleep_hours")
      setInputText(d.sleep_hours != null ? String(d.sleep_hours) : "");
    else if (phase === "measurement") {
      const k = MEASUREMENT_CHAT_KEYS[measurementIndex];
      const v = d.measurements[k];
      setInputText(v != null ? metricToDisplayInput(k, v) : "");
    }
  }, [visible, phase, measurementIndex, metricToDisplayInput]);

  useEffect(() => {
    if (!visible || phase !== "workout_type") return;
    setWorkoutSelection(draftRef.current.workout_type ?? []);
  }, [visible, phase, draft.workout_type]);

  const afterAllergies = useCallback(() => {
    appendAssistant(t("home.assistantChat.askGoal"));
    setPhase("goal_pick");
  }, [appendAssistant, t]);

  const afterGoalPick = useCallback(() => {
    setMeasurementIndex(0);
    setPhase("measurement");
    const key = MEASUREMENT_CHAT_KEYS[0];
    const unit = measurementUnitLabel(key);
    const label = translateMeasurementLabel(key);
    appendAssistant(
      t("home.assistantChat.askMeasurement", { label, unit })
    );
  }, [appendAssistant, t, translateMeasurementLabel, measurementUnitLabel]);

  const submitBirthDate = useCallback(() => {
    const raw = inputText.trim();
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw)
      ? raw
      : null;
    if (!iso) {
      showError(t("home.assistantChat.invalidBirthDate"));
      return;
    }
    const d = new Date(`${iso}T12:00:00`);
    if (Number.isNaN(d.getTime())) {
      showError(t("home.assistantChat.invalidBirthDate"));
      return;
    }
    appendUser(iso);
    setDraft((d0) => ({ ...d0, birth_date: iso }));
    setInputText("");
    appendAssistant(t("home.assistantChat.askBiologicalSex"));
    setPhase("gender");
  }, [inputText, appendUser, appendAssistant, showError, t]);

  const submitHealthIssues = useCallback(() => {
    const v = inputText.trim();
    appendUser(v.length > 0 ? v : t("home.assistantChat.skipped"));
    setDraft((d0) => ({ ...d0, health_issues: v }));
    setInputText("");
    appendAssistant(t("home.assistantChat.askAllergies"));
    setPhase("allergies");
  }, [inputText, appendUser, appendAssistant, t]);

  const submitAllergies = useCallback(() => {
    const v = inputText.trim();
    appendUser(v.length > 0 ? v : t("home.assistantChat.skipped"));
    setDraft((d0) => ({ ...d0, allergies: v }));
    setInputText("");
    afterAllergies();
  }, [inputText, appendUser, appendAssistant, afterAllergies, t]);

  const submitGoalOther = useCallback(() => {
    const v = inputText.trim();
    if (!v) {
      showError(t("home.assistantChat.goalRequired"));
      return;
    }
    appendUser(v);
    setDraft((d0) => ({ ...d0, goalsObjectiveText: v }));
    setInputText("");
    afterGoalPick();
  }, [inputText, appendUser, afterGoalPick, showError, t]);

  const submitMeasurement = useCallback(() => {
    const key = MEASUREMENT_CHAT_KEYS[measurementIndex];
    const raw = inputText.trim().replace(",", ".");
    if (!raw) {
      showError(t("home.assistantChat.measurementRequired"));
      return;
    }
    const mType: "height" | "body" = key === "height" ? "height" : "body";
    const metric = convertInputToMetric(raw, mType);
    if (!metric || metric <= 0) {
      showError(t("home.assistantChat.measurementInvalid"));
      return;
    }
    appendUser(`${raw} ${measurementUnitLabel(key)}`);
    setDraft((d0) => ({
      ...d0,
      measurements: { ...d0.measurements, [key]: metric },
    }));
    setInputText("");
    const next = measurementIndex + 1;
    setMeasurementIndex(next);
    if (next >= MEASUREMENT_CHAT_KEYS.length) {
      appendAssistant(t("home.assistantChat.askActivityLevel"));
      setPhase("activity_level");
    } else {
      const nk = MEASUREMENT_CHAT_KEYS[next];
      const unit = measurementUnitLabel(nk);
      const label = translateMeasurementLabel(nk);
      appendAssistant(
        t("home.assistantChat.askMeasurement", { label, unit })
      );
    }
  }, [
    inputText,
    measurementIndex,
    appendUser,
    appendAssistant,
    convertInputToMetric,
    measurementUnitLabel,
    translateMeasurementLabel,
    showError,
    t,
  ]);

  const submitTrainingDuration = useCallback(() => {
    const v = inputText.trim();
    if (!v) {
      showError(t("home.assistantChat.trainingDurationRequired"));
      return;
    }
    appendUser(v);
    setDraft((d0) => ({ ...d0, training_duration: v }));
    setInputText("");
    appendAssistant(t("home.assistantChat.askWasInBetterShape"));
    setPhase("was_in_better_shape");
  }, [inputText, appendUser, appendAssistant, showError, t]);

  const submitSleepHours = useCallback(() => {
    const n = parseInt(inputText.trim(), 10);
    if (Number.isNaN(n) || n < 1 || n > 24) {
      showError(t("home.assistantChat.sleepInvalid"));
      return;
    }
    appendUser(String(n));
    setDraft((d0) => ({ ...d0, sleep_hours: n }));
    setInputText("");
    appendAssistant(t("home.assistantChat.askStressLevel"));
    setPhase("stress_level");
  }, [inputText, appendUser, appendAssistant, showError, t]);

  const selectChip = useCallback(
    (value: string, displayLabel: string) => {
      if (phase === "gender") {
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, gender: value }));
        appendAssistant(t("home.assistantChat.askHealthIssues"));
        setPhase("health_issues");
        return;
      }
      if (phase === "goal_pick") {
        if (value === GOAL_OTHER) {
          appendUser(displayLabel);
          appendAssistant(t("home.assistantChat.askGoalOther"));
          setPhase("goal_other");
          return;
        }
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, goalsObjectiveText: value }));
        afterGoalPick();
        return;
      }
      if (phase === "activity_level") {
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, activity_level: value }));
        appendAssistant(t("home.assistantChat.askWorkoutType"));
        setPhase("workout_type");
        setWorkoutSelection([]);
        return;
      }
      if (phase === "trained_before") {
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, trained_before: value === "true" }));
        appendAssistant(t("home.assistantChat.askTrainingDuration"));
        setPhase("training_duration");
        return;
      }
      if (phase === "was_in_better_shape") {
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, was_in_better_shape: value === "true" }));
        appendAssistant(t("home.assistantChat.askBodySelf"));
        setPhase("body_self_description");
        return;
      }
      if (phase === "body_self_description") {
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, body_self_description: value }));
        appendAssistant(t("home.assistantChat.askSleepHours"));
        setPhase("sleep_hours");
        return;
      }
      if (phase === "stress_level") {
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, stress_level: value }));
        appendAssistant(t("home.assistantChat.askWorkType"));
        setPhase("work_type");
        return;
      }
      if (phase === "work_type") {
        appendUser(displayLabel);
        setDraft((d0) => ({ ...d0, work_type: value }));
        appendAssistant(t("home.assistantChat.readyToSave"));
        setPhase("finalize");
        return;
      }
    },
    [phase, appendUser, appendAssistant, afterGoalPick, t]
  );

  const toggleWorkout = useCallback((value: string) => {
    setWorkoutSelection((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value]
    );
  }, []);

  const confirmWorkouts = useCallback(() => {
    if (workoutSelection.length === 0) {
      showError(t("home.assistantChat.workoutTypeRequired"));
      return;
    }
    appendUser(workoutSelection.join(", "));
    setDraft((d0) => ({ ...d0, workout_type: [...workoutSelection] }));
    appendAssistant(t("home.assistantChat.askTrainedBefore"));
    setPhase("trained_before");
  }, [workoutSelection, appendUser, appendAssistant, showError, t]);

  const startChat = useCallback(() => {
    appendUser(t("home.assistantChat.userStart"));
    appendAssistant(t("home.assistantChat.askBirthDate"));
    setPhase("birth_date");
  }, [appendUser, appendAssistant, t]);

  const sendText = useCallback(() => {
    switch (phase) {
      case "birth_date":
        submitBirthDate();
        break;
      case "health_issues":
        submitHealthIssues();
        break;
      case "allergies":
        submitAllergies();
        break;
      case "goal_other":
        submitGoalOther();
        break;
      case "measurement":
        submitMeasurement();
        break;
      case "training_duration":
        submitTrainingDuration();
        break;
      case "sleep_hours":
        submitSleepHours();
        break;
      default:
        break;
    }
  }, [
    phase,
    submitBirthDate,
    submitHealthIssues,
    submitAllergies,
    submitGoalOther,
    submitMeasurement,
    submitTrainingDuration,
    submitSleepHours,
  ]);

  const validateDraft = useCallback((): boolean => {
    const d = draft;
    if (!d.birth_date || !d.gender) {
      showError(t("home.assistantChat.validationIncomplete"));
      return false;
    }
    if (!d.goalsObjectiveText?.trim()) {
      showError(t("home.assistantChat.validationIncomplete"));
      return false;
    }
    for (const k of MEASUREMENT_CHAT_KEYS) {
      const v = d.measurements[k];
      if (typeof v !== "number" || v <= 0) {
        showError(t("home.assistantChat.validationIncomplete"));
        return false;
      }
    }
    if (!d.activity_level || !d.workout_type?.length) {
      showError(t("home.assistantChat.validationIncomplete"));
      return false;
    }
    if (d.trained_before === undefined || !d.training_duration?.trim()) {
      showError(t("home.assistantChat.validationIncomplete"));
      return false;
    }
    if (d.was_in_better_shape === undefined || !d.body_self_description) {
      showError(t("home.assistantChat.validationIncomplete"));
      return false;
    }
    if (
      d.sleep_hours == null ||
      !d.stress_level ||
      !d.work_type
    ) {
      showError(t("home.assistantChat.validationIncomplete"));
      return false;
    }
    return true;
  }, [draft, showError, t]);

  const saveProfile = useCallback(async () => {
    if (!validateDraft()) return;
    setIsSaving(true);
    let afterProfileSaved = false;
    try {
      const payload = buildAssistantProfilePayload(draft);
      const updated = await userService.updateProfile(payload as any);
      updateUser(updated);
      if (updated.goals) {
        try {
          await goalsService.saveGoals(updated.goals as Goals);
        } catch {
          // ignore storage mismatch
        }
      }
      afterProfileSaved = true;
      appendAssistant(t("home.assistantChat.generatingPlan"));
      setPhase("generating");
      const lang = getCurrentLanguage();
      await userService.generateFullPlan({
        health_issues: draft.health_issues ?? "",
        allergies: draft.allergies ?? "",
        language: lang,
        country: resolveCountryForFullPlan(updated, lang),
      });
      appendAssistant(t("home.assistantChat.planReady"));
      showSuccess(t("home.assistantChat.planReadyToast"));
      if (assistantUserId) void assistantSetupStorage.clear(assistantUserId);
      if (onFlowComplete) {
        onFlowComplete();
      } else {
        setPhase("done");
      }
    } catch (e) {
      console.error(e);
      if (afterProfileSaved) {
        showError(t("home.assistantChat.generatePlanError"));
        appendAssistant(t("home.assistantChat.generatePlanFailed"));
        setPhase("finalize");
      } else {
        showError(t("home.assistantChat.saveError"));
      }
    } finally {
      setIsSaving(false);
    }
  }, [
    draft,
    validateDraft,
    updateUser,
    showSuccess,
    showError,
    appendAssistant,
    t,
    getCurrentLanguage,
    onFlowComplete,
    assistantUserId,
  ]);

  const genderChips: ChipOption[] = [
    { label: t("home.assistantChat.biologicalSexMale"), value: "male" },
    { label: t("home.assistantChat.biologicalSexFemale"), value: "female" },
  ];

  const goalChips: ChipOption[] = [
    {
      label: t("home.assistantChat.goalPreset1Label"),
      value: t("home.assistantChat.goalPreset1Text"),
    },
    {
      label: t("home.assistantChat.goalPreset2Label"),
      value: t("home.assistantChat.goalPreset2Text"),
    },
    {
      label: t("home.assistantChat.goalPreset3Label"),
      value: t("home.assistantChat.goalPreset3Text"),
    },
    {
      label: t("home.assistantChat.goalOtherLabel"),
      value: GOAL_OTHER,
    },
  ];

  const activityChips: ChipOption[] = [
    {
      label: t("home.assistantChat.activitySedentary"),
      value: "sedentary",
    },
    { label: t("home.assistantChat.activityLight"), value: "light" },
    {
      label: t("home.assistantChat.activityModerate"),
      value: "moderate",
    },
    { label: t("home.assistantChat.activityActive"), value: "active" },
    {
      label: t("home.assistantChat.activityVeryActive"),
      value: "very_active",
    },
  ];

  const workoutChips: ChipOption[] = [
    {
      label: t("home.assistantChat.workoutWeightlifting"),
      value: "weightlifting",
    },
    { label: t("home.assistantChat.workoutCardio"), value: "cardio" },
    {
      label: t("home.assistantChat.workoutCalisthenics"),
      value: "calisthenics",
    },
    { label: t("home.assistantChat.workoutSports"), value: "sports" },
    { label: t("home.assistantChat.workoutHiit"), value: "hiit" },
  ];

  const yesNoChips: ChipOption[] = [
    { label: t("common.yes"), value: "true" },
    { label: t("common.no"), value: "false" },
  ];

  const bodySelfChips: ChipOption[] = [
    { label: t("home.assistantChat.bodyLean"), value: "lean" },
    { label: t("home.assistantChat.bodyNormal"), value: "normal" },
    {
      label: t("home.assistantChat.bodyLocalizedFat"),
      value: "localized_fat",
    },
    {
      label: t("home.assistantChat.bodyOverweight"),
      value: "overweight",
    },
  ];

  const stressChips: ChipOption[] = [
    { label: t("home.assistantChat.stressLow"), value: "low" },
    {
      label: t("home.assistantChat.stressModerate"),
      value: "moderate",
    },
    { label: t("home.assistantChat.stressHigh"), value: "high" },
  ];

  const workTypeChips: ChipOption[] = [
    {
      label: t("home.assistantChat.workSedentary"),
      value: "sedentary",
    },
    { label: t("home.assistantChat.workActive"), value: "active" },
    { label: t("home.assistantChat.workMixed"), value: "mixed" },
  ];

  let chips: ChipOption[] | null = null;
  if (phase === "gender") chips = genderChips;
  else if (phase === "goal_pick") chips = goalChips;
  else if (phase === "activity_level") chips = activityChips;
  else if (phase === "trained_before" || phase === "was_in_better_shape")
    chips = yesNoChips;
  else if (phase === "body_self_description") chips = bodySelfChips;
  else if (phase === "stress_level") chips = stressChips;
  else if (phase === "work_type") chips = workTypeChips;

  const showTextInput =
    phase === "birth_date" ||
    phase === "health_issues" ||
    phase === "allergies" ||
    phase === "goal_other" ||
    phase === "measurement" ||
    phase === "training_duration" ||
    phase === "sleep_hours";

  const textInputMultiline =
    phase === "health_issues" || phase === "allergies" || phase === "goal_other";

  const textInputPlaceholder = (() => {
    switch (phase) {
      case "birth_date":
        return t("home.assistantChat.placeholderBirthDate");
      case "health_issues":
        return t("home.assistantChat.placeholderHealth");
      case "allergies":
        return t("home.assistantChat.placeholderAllergies");
      case "goal_other":
        return t("home.assistantChat.placeholderGoal");
      case "measurement":
        return t("home.assistantChat.placeholderNumber");
      case "training_duration":
        return t("home.assistantChat.placeholderTrainingDuration");
      case "sleep_hours":
        return t("home.assistantChat.placeholderSleep");
      default:
        return "";
    }
  })();

  const keyboardType =
    phase === "birth_date" || phase === "training_duration"
      ? "default"
      : phase === "sleep_hours" || phase === "measurement"
        ? "decimal-pad"
        : "default";

  return {
    messages,
    phase,
    draft,
    inputText,
    setInputText,
    chips,
    workoutChips,
    workoutSelection,
    toggleWorkout,
    confirmWorkouts,
    showTextInput,
    textInputMultiline,
    textInputPlaceholder,
    keyboardType,
    isSaving,
    startChat,
    sendText,
    selectChip,
    saveProfile,
    phaseWorkoutType: phase === "workout_type",
    phaseWelcome: phase === "welcome",
    phaseFinalize: phase === "finalize",
    phaseGenerating: phase === "generating",
    phaseDone: phase === "done",
  };
}
