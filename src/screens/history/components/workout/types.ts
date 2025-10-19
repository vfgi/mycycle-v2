export interface WorkoutExercise {
  id: string;
  name: string;
  muscle: string;
  weight: number;
  duration: number; // em segundos
  sets: number;
  reps: number;
  restTime: number; // em segundos
  completed: boolean;
  time: string; // horário de execução
}

export interface WorkoutGoal {
  targetDuration: number; // em minutos
  targetExercises: number;
  targetCalories: number;
}
