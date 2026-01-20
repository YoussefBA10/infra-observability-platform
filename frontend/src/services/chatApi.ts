/**
 * Chat API Service
 * Handles communication with the chat backend.
 * Currently uses mock responses for development.
 */

import { ChatApiRequest, ChatApiResponse } from '../types/chat';
import { API_URL } from '../config';

// ============================================================
// CONFIGURATION FLAGS
// Set USE_MOCK_API to false to connect to real backend
// Set SIMULATE_ERROR to true to test error handling UI
// ============================================================
const USE_MOCK_API = true;
const SIMULATE_ERROR = false;
const MOCK_DELAY_MS = 1500; // Simulated response delay

/**
 * DevOps-themed mock responses for realistic testing.
 * These simulate what a real DevOps assistant might respond with.
 */
const MOCK_RESPONSES: Record<string, string> = {
    default: "I'm your DevOps assistant. I can help you with infrastructure monitoring, deployment pipelines, container orchestration, and more. What would you like to know?",

    // Infrastructure queries
    kubernetes: "Your Kubernetes cluster is running healthy with 12 nodes. Current resource utilization:\n\n• CPU: 45% average\n• Memory: 62% average\n• Pods: 156/200 capacity\n\nNo critical alerts detected.",

    docker: "Docker daemon is running on all 8 hosts. Active containers: 47\n\n• Production: 28 containers\n• Staging: 12 containers\n• Development: 7 containers\n\nAll images are up to date.",

    deploy: "Last deployment was 2 hours ago to production.\n\n✓ Service: api-gateway v2.4.1\n✓ Status: Healthy\n✓ Rollout: 100% complete\n✓ Health checks: Passing\n\nWould you like me to trigger a new deployment?",

    pipeline: "CI/CD Pipeline Status:\n\n• main branch: ✓ Build passed (2m ago)\n• develop branch: ⏳ Running tests...\n• feature/auth: ✓ Build passed (15m ago)\n\n3 deployments queued for review.",

    monitoring: "Current system health:\n\n📊 Grafana: Online\n📈 Prometheus: Collecting metrics\n🔍 Loki: Ingesting logs\n⚡ Jaeger: Tracing enabled\n\nAll monitoring systems operational.",

    logs: "Recent log summary (last hour):\n\n• INFO: 12,540 events\n• WARN: 234 events\n• ERROR: 12 events\n\nMost common error: Connection timeout to database (3 occurrences). Would you like details?",

    help: "I can help you with:\n\n🚀 **Deployments** - Status, rollback, trigger\n🐳 **Containers** - Docker, K8s management\n📊 **Monitoring** - Metrics, alerts, dashboards\n📋 **Pipelines** - CI/CD status, builds\n🔧 **Infrastructure** - Server health, scaling\n\nJust ask about any of these topics!",
};

/**
 * Analyzes user input to find relevant mock response.
 */
function getMockResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Check for keywords and return appropriate response
    if (lowerMessage.includes('kubernetes') || lowerMessage.includes('k8s') || lowerMessage.includes('cluster')) {
        return MOCK_RESPONSES.kubernetes;
    }
    if (lowerMessage.includes('docker') || lowerMessage.includes('container')) {
        return MOCK_RESPONSES.docker;
    }
    if (lowerMessage.includes('deploy') || lowerMessage.includes('release') || lowerMessage.includes('rollout')) {
        return MOCK_RESPONSES.deploy;
    }
    if (lowerMessage.includes('pipeline') || lowerMessage.includes('ci') || lowerMessage.includes('build')) {
        return MOCK_RESPONSES.pipeline;
    }
    if (lowerMessage.includes('monitor') || lowerMessage.includes('grafana') || lowerMessage.includes('prometheus')) {
        return MOCK_RESPONSES.monitoring;
    }
    if (lowerMessage.includes('log') || lowerMessage.includes('error')) {
        return MOCK_RESPONSES.logs;
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
        return MOCK_RESPONSES.help;
    }

    return MOCK_RESPONSES.default;
}

/**
 * Sends a message to the chat API and returns the response.
 * Uses mock API in development, real API in production.
 * 
 * @param request - The chat request containing the user's message
 * @returns Promise resolving to the bot's response
 * @throws Error if the API request fails
 */
export async function sendChatMessage(request: ChatApiRequest): Promise<ChatApiResponse> {
    // Mock API implementation for development
    if (USE_MOCK_API) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (SIMULATE_ERROR) {
                    reject(new Error('Backend service is unreachable. Please try again later.'));
                } else {
                    resolve({
                        reply: getMockResponse(request.message),
                    });
                }
            }, MOCK_DELAY_MS);
        });
    }

    // Real API implementation
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Unable to connect to the server. Please check your connection.');
        }
        throw error;
    }
}
