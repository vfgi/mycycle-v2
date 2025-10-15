export interface TrainingExercise {
  name: string;
  category?: string;
  muscle_group: string;
  difficulty?: string;
  equipment?: string;
  sets: number;
  reps: number;
  weight?: number;
  videoURL?: string;
  imageURL?: string;
  order: number;
  instructions?: string;
}

export interface Workout {
  name: string;
  description?: string;
  weekDays: string[];
  exercises: TrainingExercise[];
}

export interface TrainingPlan {
  name: string;
  description?: string;
  is_active: boolean;
  workouts: Workout[];
}

export interface TrainingPlanResponse {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  workouts: Workout[];
  created_at: string;
  updated_at: string;
}

export interface CreateTrainingPlanRequest {
  name: string;
  description?: string;
  is_active: boolean;
  workouts: Workout[];
}
