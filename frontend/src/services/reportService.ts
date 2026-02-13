import api from './api';

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
        const response = await api.get<Pipeline>('/reports/latest', {
            params: { component }
        });
        return response.data;
    },
    getSonarReport: async (id: number) => {
        const response = await api.get<SonarReport>(`/reports/${id}/sonar`);
        return response.data;
    },
    getTrivyFindings: async (id: number) => {
        const response = await api.get<TrivyFinding[]>(`/reports/${id}/trivy`);
        return response.data;
    },
    getOwaspFindings: async (id: number) => {
        const response = await api.get<OwaspFinding[]>(`/reports/${id}/owasp`);
        return response.data;
    },
    getHistory: async (component?: string) => {
        const response = await api.get<Pipeline[]>('/reports/history', {
            params: { component }
        });
        return response.data;
    }
};
