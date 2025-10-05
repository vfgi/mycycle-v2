export interface ExerciseCategory {
  key: string;
  labelKey: string;
  image: any;
}

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    key: "chest",
    labelKey: "workoutSetup.exercises.chest",
    image: require("../../../../assets/images/exercises/chest.jpg"),
  },
  {
    key: "back",
    labelKey: "workoutSetup.exercises.back",
    image: require("../../../../assets/images/exercises/back.jpg"),
  },
  {
    key: "shoulders",
    labelKey: "workoutSetup.exercises.shoulders",
    image: require("../../../../assets/images/exercises/shoulder.jpg"),
  },
  {
    key: "biceps",
    labelKey: "workoutSetup.exercises.biceps",
    image: require("../../../../assets/images/exercises/biceps.jpg"),
  },
  {
    key: "triceps",
    labelKey: "workoutSetup.exercises.triceps",
    image: require("../../../../assets/images/exercises/triceps.webp"),
  },
  {
    key: "legs",
    labelKey: "workoutSetup.exercises.legs",
    image: require("../../../../assets/images/exercises/legs.webp"),
  },
  {
    key: "glutes",
    labelKey: "workoutSetup.exercises.glutes",
    image: require("../../../../assets/images/exercises/gluts.jpeg"),
  },
  {
    key: "calves",
    labelKey: "workoutSetup.exercises.calves",
    image: require("../../../../assets/images/exercises/calves.jpg"),
  },
  {
    key: "forearms",
    labelKey: "workoutSetup.exercises.forearms",
    image: require("../../../../assets/images/exercises/forearms.webp"),
  },
  {
    key: "lumbar",
    labelKey: "workoutSetup.exercises.lumbar",
    image: require("../../../../assets/images/exercises/lombar.jpg"),
  },
  {
    key: "traps",
    labelKey: "workoutSetup.exercises.traps",
    image: require("../../../../assets/images/exercises/traps.webp"),
  },
  {
    key: "cardio",
    labelKey: "workoutSetup.exercises.cardio",
    image: require("../../../../assets/images/exercises/gym-cardio.jpg"),
  },
];
