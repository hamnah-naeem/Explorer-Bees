export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  city: string;
}

export interface UsernameStatus {
  available: boolean | null;
  checking: boolean;
  message: string;
}

export interface LoadingState {
  countries: boolean;
  states: boolean;
  cities: boolean;
  username: boolean;
}
