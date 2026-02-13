import api from './api';

export interface AiAnalysisResponse {
    summary: string;
    recommendations: string[];
}

export const aiService = {
    analyzePage: async (page: string, pipelineId: number, data: any) => {
        const response = await api.post<AiAnalysisResponse>(
            '/ai/analyze',
            { page, pipelineId, data },
            { timeout: 3000 }
        );
        return response.data;
    }
};
