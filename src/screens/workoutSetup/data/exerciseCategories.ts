export interface ExerciseCategory {
  key: string;
  labelKey: string;
  image: any;
}

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    key: "chest",
    labelKey: "workoutSetup.muscleGroups.chest",
    image: require("../../../../assets/images/exercises/chest.jpg"),
  },
  {
    key: "back",
    labelKey: "workoutSetup.muscleGroups.back",
    image: require("../../../../assets/images/exercises/back.jpg"),
  },
  {
    key: "shoulders",
    labelKey: "workoutSetup.muscleGroups.shoulders",
    image: require("../../../../assets/images/exercises/shoulder.jpg"),
  },
  {
    key: "biceps",
    labelKey: "workoutSetup.muscleGroups.biceps",
    image: require("../../../../assets/images/exercises/biceps.jpg"),
  },
  {
    key: "triceps",
    labelKey: "workoutSetup.muscleGroups.triceps",
    image: require("../../../../assets/images/exercises/triceps.webp"),
  },
  {
    key: "legs",
    labelKey: "workoutSetup.muscleGroups.legs",
    image: require("../../../../assets/images/exercises/legs.webp"),
  },
  {
    key: "glutes",
    labelKey: "workoutSetup.muscleGroups.glutes",
    image: require("../../../../assets/images/exercises/gluts.jpeg"),
  },
  {
    key: "calves",
    labelKey: "workoutSetup.muscleGroups.calves",
    image: require("../../../../assets/images/exercises/calves.jpg"),
  },
  {
    key: "forearms",
    labelKey: "workoutSetup.muscleGroups.forearms",
    image: require("../../../../assets/images/exercises/forearms.webp"),
  },
  {
    key: "lumbar",
    labelKey: "workoutSetup.muscleGroups.lumbar",
    image: require("../../../../assets/images/exercises/lombar.jpg"),
  },
  {
    key: "traps",
    labelKey: "workoutSetup.muscleGroups.traps",
    image: require("../../../../assets/images/exercises/traps.webp"),
  },
  {
    key: "cardio",
    labelKey: "workoutSetup.muscleGroups.cardio",
    image: require("../../../../assets/images/exercises/gym-cardio.jpg"),
  },
];
