export interface Medication {
  id: string;
  name: string;
  description?: string;
  dosage: string;
  amount: string;
  frequency: string;
  time?: string;
  category?:
    | "analgesic"
    | "antibiotic"
    | "vitamin"
    | "antiinflammatory"
    | "other";
  brand?: string;
  protein?: string;
  carbohydrates?: string;
  calories?: string;
  is_active: boolean;
  is_taken?: boolean;
  start_date?: string;
  end_date?: string;
  time_of_day?: string[];
  notes?: string;
  image?: any;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MedicationFormData {
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  category: string;
  brand?: string;
  start_date?: string;
  end_date?: string;
  time_of_day?: string[];
  notes?: string;
}
