export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscle_group: string;
  difficulty: string;
  equipment: string;
  instructions: string;
  imageURL: string;
  previewImage: string;
}

export interface ExerciseResponse {
  exercises: Exercise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
