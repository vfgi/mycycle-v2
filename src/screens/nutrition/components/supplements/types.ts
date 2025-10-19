export interface Supplement {
  id: string;
  name: string;
  description: string;
  brand?: string;
  category?: "protein" | "vitamin" | "mineral" | "preworkout" | "other";
  dosage: string;
  amount: string;
  frequency: string;
  time?: string;
  protein?: string;
  carbohydrates?: string;
  calories?: string;
  is_active: boolean;
  is_taken?: boolean;
  image?: any;
  nutrients?: {
    protein?: number;
    carbs?: number;
    fat?: number;
    calories?: number;
    vitamins?: Record<string, number>;
    minerals?: Record<string, number>;
  };
  created_at?: string;
  updated_at?: string;
}

export interface SupplementFormData {
  name: string;
  description: string;
  brand: string;
  category: "protein" | "vitamin" | "mineral" | "preworkout" | "other";
  dosage: string;
  frequency: string;
  nutrients?: {
    protein?: number;
    carbs?: number;
    fat?: number;
    calories?: number;
    vitamins?: Record<string, number>;
    minerals?: Record<string, number>;
  };
}
