export interface Measurements {
  height?: number;
  weight?: number;
  neck_size?: number;
  back_size?: number;
  biceps_size?: number;
  forearm_size?: number;
  wrist_size?: number;
  chest_size?: number;
  abdomen_size?: number;
  waist_size?: number;
  hip_size?: number;
  thigh_size?: number;
  calf_size?: number;
  foot_size?: number;
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
  is_premium?: boolean;
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
