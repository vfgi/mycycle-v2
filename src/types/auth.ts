import { Goals } from "./goals";

export interface Measurements {
  height?: number;
  weight?: number;
  neck?: number;
  back?: number;
  biceps?: number;
  forearm?: number;
  wrist?: number;
  chest?: number;
  abdomen?: number;
  waist?: number;
  hip?: number;
  thigh?: number;
  calf?: number;
  foot?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
  image?: string;
  role: string;
  is_active: boolean;
  is_premium?: boolean;
  measurements?: Measurements;
  goals?: Goals;
  followUp?: string[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
