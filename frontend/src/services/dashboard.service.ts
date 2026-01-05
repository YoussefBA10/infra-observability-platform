import { DashboardSummary, CICDResponse, MonitoringResponse, InfrastructureResponse } from '../types/dashboard';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8880/api';

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
    // This endpoint does not exist on the local backend, returning mock data
    return Promise.resolve({
      pipelines: [],
      summary: {
        totalPipelines: 0,
        successCount: 0,
        failedCount: 0,
        runningCount: 0,
      },
    });
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

  async getInfrastructure(): Promise<InfrastructureResponse> {
    // This endpoint does not exist on the local backend, returning mock data
    return Promise.resolve({ clusters: [], containers: [], nodes: [] });
    const response = await fetch(`${API_URL}/dashboard/infrastructure`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch infrastructure data');
    }

    return response.json();
  }
}

export default new DashboardService();
