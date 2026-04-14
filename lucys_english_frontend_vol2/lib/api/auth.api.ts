import { ApiClient } from './client';
import { LoginDto, RegisterDto, AuthResponse } from '../types/auth.types';

export class AuthApi {
  static async login(dto: LoginDto): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/login', dto);
  }

  static async register(dto: RegisterDto): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/register', dto);
  }

  static async logout(): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/logout', {});
  }

  static async resendVerification(email: string): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/register', {
      email,
      password: '',
      confirmPassword: '',
    });
  }

  static async getMe(): Promise<{ id: number; email: string; role: string }> {
    return ApiClient.get('/auth/me');
  }
}
