export interface Measurements {
  height: number;
  weight: number;
  arm_size: number;
  leg_size: number;
  neck_size: number;
  waist_size: number;
  hip_size: number;
  chest_size: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  image?: string;
  role: string;
  is_active: boolean;
  measurements?: Measurements;
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
