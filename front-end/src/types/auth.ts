
export interface User {
  email: string;
  name?: string;
}

export interface AuthState {
  userId: string | null;
  token: string | null;
  userName: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}