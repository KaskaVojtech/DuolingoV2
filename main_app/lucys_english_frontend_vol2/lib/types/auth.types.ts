export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
