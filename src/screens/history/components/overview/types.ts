export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
}

export interface MeasurementRecord {
  id: string;
  date: string;
  measurements: {
    chest: number;
    waist: number;
    hip: number;
    bicep: number;
    thigh: number;
    neck: number;
    forearm: number;
    calf: number;
  };
}

export interface ProgressAnalysis {
  weightTrend: "increasing" | "decreasing" | "stable";
  bodyFatTrend: "increasing" | "decreasing" | "stable";
  muscleMassTrend: "increasing" | "decreasing" | "stable";
  overallProgress: "excellent" | "good" | "moderate" | "needs_improvement";
  recommendations: string[];
}

export type PeriodType =
  | "1week"
  | "1month"
  | "3months"
  | "6months"
  | "1year"
  | "all";

export interface PeriodOption {
  key: PeriodType;
  label: string;
  days: number | null; // null for 'all'
}
