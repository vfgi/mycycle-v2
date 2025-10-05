export interface MuscleGroup {
  value: string;
  key: string;
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  { value: "Antebracos", key: "Antebracos" },
  { value: "Biceps", key: "Biceps" },
  { value: "Cardio", key: "Cardio" },
  { value: "Costas", key: "Costas" },
  { value: "Eretores_da_espinha", key: "Eretores_da_espinha" },
  { value: "Gluteos", key: "Gluteos" },
  { value: "Ombros", key: "Ombros" },
  { value: "Panturrilhas", key: "Panturrilhas" },
  { value: "Peitoral", key: "Peitoral" },
  { value: "Pernas", key: "Pernas" },
  { value: "Trapezio", key: "Trapezio" },
  { value: "Triceps", key: "Triceps" },
];

// Mapeamento dos grupos musculares para a API
export const MUSCLE_GROUP_MAPPING: Record<string, string> = {
  chest: "Peitoral",
  back: "Costas",
  shoulders: "Ombros",
  biceps: "Biceps",
  triceps: "Triceps",
  legs: "Pernas",
  glutes: "Gluteos",
  calves: "Panturrilhas",
  forearms: "Antebracos",
  lumbar: "Eretores_da_espinha",
  traps: "Trapezio",
  cardio: "Cardio",
};
