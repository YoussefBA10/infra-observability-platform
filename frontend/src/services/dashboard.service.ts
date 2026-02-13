import { DashboardSummary, CICDResponse, MonitoringResponse, InfrastructureResponse } from '../types/dashboard';
import api from './api';

class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get('/dashboard');
    return response.data;
  }

  async getCICDStatus(): Promise<CICDResponse> {
    const response = await api.get('/dashboard/cicd');
    return response.data;
  }

  async getMonitoring(): Promise<MonitoringResponse> {
    // This endpoint does not exist on the local backend, returning mock data
    return Promise.resolve({ metrics: [], alerts: [] });
  }

  async getInfrastructureSummary(): Promise<any> {
    const response = await api.get('/infrastructure/summary');
    return response.data;
  }

  async getInfrastructureServices(): Promise<any[]> {
    const response = await api.get('/infrastructure/services');
    return response.data;
  }

  async getInfrastructureContainers(): Promise<any[]> {
    const response = await api.get('/infrastructure/containers');
    return response.data;
  }

  async getInfrastructureNodes(): Promise<any[]> {
    const response = await api.get('/infrastructure/nodes');
    return response.data;
  }

  async getInfrastructureRisks(): Promise<string[]> {
    const response = await api.get('/infrastructure/risks');
    return response.data;
  }
}

export default new DashboardService();
