export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  exercises: Exercise[];
  createdAt: string;
  isAIGenerated?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number; // in kg
  restTime: number; // in seconds
  notes?: string;
}

// Mock data - inicialmente vazio para simular usuário sem treinos
export const mockWorkouts: Workout[] = [];

// Função para simular verificação de treinos via API
export const getWorkouts = async (): Promise<Workout[]> => {
  // Simula delay da API (reduzido para carregamento mais rápido)
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockWorkouts;
};
