import { AuthResponse, LoginRequest } from '../types/auth';
import { API_URL } from '../config';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
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
