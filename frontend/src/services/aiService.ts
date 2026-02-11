import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface AiAnalysisResponse {
    summary: string;
    recommendations: string[];
}

export const aiService = {
    analyzePage: async (page: string, pipelineId: number, data: any) => {
        const response = await axios.post<AiAnalysisResponse>(
            `${API_URL}/ai/analyze`,
            { page, pipelineId, data },
            { timeout: 3000 }
        );
        return response.data;
    }
};
