export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
}
