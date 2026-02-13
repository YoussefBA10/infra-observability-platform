import { AuthResponse, LoginRequest } from '../types/auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {

    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async logout(): Promise<void> {
    // No backend endpoint for logout, just clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    return Promise.resolve();
  }

  async refreshToken(): Promise<string> {
    // No backend endpoint for refresh token, just return the existing one or throw error
    const token = this.getAccessToken();
    if (token) {
      return Promise.resolve(token);
    }
    throw new Error('No token available to refresh');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export default new AuthService();
