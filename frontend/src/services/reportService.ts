import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface SonarReport {
    id: number;
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
    coverage: number;
    duplication: number;
}

export interface TrivyFinding {
    id: number;
    cve: string;
    packageName: string;
    severity: number;
}

export interface OwaspFinding {
    id: number;
    dependency: string;
    cvss: number;
    severity: number;
}

export interface Pipeline {
    id: number;
    timestamp: string;
    status: string;
    duration: number;
    commitHash: string;
    component: string;
    appVersion?: string;
    sonarReport?: SonarReport;
    trivyFindings?: TrivyFinding[];
    owaspFindings?: OwaspFinding[];
}

export const reportService = {
    getLatestReport: async (component?: string) => {
        const response = await axios.get<Pipeline>(`${API_URL}/reports/latest`, {
            params: { component }
        });
        return response.data;
    },
    getSonarReport: async (id: number) => {
        const response = await axios.get<SonarReport>(`${API_URL}/reports/${id}/sonar`);
        return response.data;
    },
    getTrivyFindings: async (id: number) => {
        const response = await axios.get<TrivyFinding[]>(`${API_URL}/reports/${id}/trivy`);
        return response.data;
    },
    getOwaspFindings: async (id: number) => {
        const response = await axios.get<OwaspFinding[]>(`${API_URL}/reports/${id}/owasp`);
        return response.data;
    },
    getHistory: async (component?: string) => {
        const response = await axios.get<Pipeline[]>(`${API_URL}/reports/history`, {
            params: { component }
        });
        return response.data;
    }
};
