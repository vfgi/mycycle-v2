import { SlideCardImage } from "../../components/SlideCard";

export interface HomeSlideData {
  id: string;
  images: SlideCardImage[];
  titleKey: string;
  descriptionKey: string;
  buttonTextKey?: string;
  onPress?: () => void;
  height: number;
  autoPlayInterval?: number;
}

export const workoutImages: SlideCardImage[] = [
  { uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" },
  { uri: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800" },
  { uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" },
];

export const nutritionImages: SlideCardImage[] = [
  { uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800" },
  { uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800" },
  { uri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800" },
];

export const progressImages: SlideCardImage[] = [
  { uri: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800" },
  { uri: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800" },
  { uri: "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800" },
];

export const getHomeSlides = (): HomeSlideData[] => [
  {
    id: "workouts",
    images: workoutImages,
    titleKey: "slideCard.workouts.title",
    descriptionKey: "slideCard.workouts.description",
    buttonTextKey: "slideCard.workouts.buttonText",
    height: 250,
    autoPlayInterval: 10000,
  },
  {
    id: "nutrition",
    images: nutritionImages,
    titleKey: "slideCard.nutrition.title",
    descriptionKey: "slideCard.nutrition.description",
    buttonTextKey: "slideCard.nutrition.buttonText",
    height: 250,
    autoPlayInterval: 9000,
  },
  {
    id: "progress",
    images: progressImages,
    titleKey: "slideCard.progress.title",
    descriptionKey: "slideCard.progress.description",
    buttonTextKey: "slideCard.progress.buttonText",
    height: 250,
    autoPlayInterval: 8000,
  },
];
