export type ObjectiveType = "weightLoss" | "hypertrophy" | "definition";

export interface Goals {
  objective?: ObjectiveType;
  targetWeight?: number;
  targetBodyFat?: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  weeklyWorkouts?: number;
  dailyExercises?: number;
  waterIntake?: number;
}
