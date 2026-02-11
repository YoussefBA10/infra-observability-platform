import { DashboardSummary, CICDResponse, MonitoringResponse, InfrastructureResponse } from '../types/dashboard';
import authService from './auth.service';
import { API_URL } from '../config';

class DashboardService {
  private getHeaders() {
    const token = authService.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getSummary(): Promise<DashboardSummary> {
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard summary');
    }

    return response.json();
  }

  async getCICDStatus(): Promise<CICDResponse> {
    const response = await fetch(`${API_URL}/dashboard/cicd`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CI/CD status');
    }

    return response.json();
  }

  async getMonitoring(): Promise<MonitoringResponse> {
    // This endpoint does not exist on the local backend, returning mock data
    return Promise.resolve({ metrics: [], alerts: [] });
    const response = await fetch(`${API_URL}/dashboard/monitoring`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monitoring data');
    }

    return response.json();
  }

  async getInfrastructureSummary(): Promise<any> {
    const response = await fetch(`${API_URL}/infrastructure/summary`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch infrastructure summary');
    return response.json();
  }

  async getInfrastructureServices(): Promise<any[]> {
    const response = await fetch(`${API_URL}/infrastructure/services`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch infrastructure services');
    return response.json();
  }

  async getInfrastructureContainers(): Promise<any[]> {
    const response = await fetch(`${API_URL}/infrastructure/containers`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch infrastructure containers');
    return response.json();
  }

  async getInfrastructureNodes(): Promise<any[]> {
    const response = await fetch(`${API_URL}/infrastructure/nodes`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch infrastructure nodes');
    return response.json();
  }

  async getInfrastructureRisks(): Promise<string[]> {
    const response = await fetch(`${API_URL}/infrastructure/risks`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch infrastructure risks');
    return response.json();
  }
}

export default new DashboardService();
