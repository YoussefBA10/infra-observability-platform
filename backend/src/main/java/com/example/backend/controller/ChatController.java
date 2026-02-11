package com.example.backend.controller;

import com.example.backend.dto.ChatRequest;
import com.example.backend.dto.ChatResponse;
import com.example.backend.entity.Conversation;
import com.example.backend.entity.ChatMessage;
import com.example.backend.service.GroqService;
import com.example.backend.service.InfraService;
import com.example.backend.service.ChatHistoryService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final InfraService infraService;
    private final GroqService groqService;
    private final ChatHistoryService chatHistoryService;

    public ChatController(InfraService infraService, GroqService groqService, ChatHistoryService chatHistoryService) {
        this.infraService = infraService;
        this.groqService = groqService;
        this.chatHistoryService = chatHistoryService;
    }

    @GetMapping("/conversations")
    public List<Conversation> getUserConversations() {
        String username = getCurrentUsername();
        return chatHistoryService.getUserConversations(username);
    }

    @GetMapping("/conversations/{id}")
    public List<Map<String, String>> getConversationHistory(@PathVariable Long id) {
        return chatHistoryService.getConversationHistory(id);
    }

    @PostMapping
    public ChatResponse processChat(@RequestBody ChatRequest request) {
        String username = getCurrentUsername();
        Long conversationId = request.getConversationId();
        
        // If no conversation ID, start a new one
        if (conversationId == null) {
            String title = "New Chat - " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            Conversation conversation = chatHistoryService.startConversation(username, title);
            conversationId = conversation.getId();
        }

        // 1. Fetch multi-node infrastructure summary
        String infraSummary = infraService.getInfrastructureSummary();

        // 2. Prepare System Prompt based on Context
        String systemPrompt;
        String context = request.getContext();

        if (context != null && context.contains("/cicd")) {
            systemPrompt = "You are an Executive CI/CI Delivery Agent.\n\n" +
                    "YOU WILL WORK IN PAGE http://localhost:5173/cicd. This platform uses Docker Compose with a Jenkins-based CI/CD pipeline.\n\n" +
                    "Your audience is C-level executives (CEO / CTO / Directors). They care about: Release reliability, Deployment success, Delivery velocity, Failure trends, Business continuity.\n" +
                    "They do NOT care about: Pipeline stages, Build logs, Job names, Console output, Technical implementation.\n\n" +
                    "Your responsibility: Translate CI/CD signals into EXECUTIVE DELIVERY INSIGHTS.\n\n" +
                    "GUIDELINES:\n" +
                    "1. If the user asks a specific technical question (e.g., 'What is the status of the frontend pipeline?', 'How long was the last build?'), PROVIDE A DIRECT, CONCISE ANSWER AND NOTHING ELSE.\n" +
                    "2. ONLY use the executive delivery structure below if the user asks for a 'report', 'overview', 'delivery status', or broader release information.\n\n" +
                    "MANDATORY DELIVERY STRUCTURE (Only for report/overview requests):\n\n" +
                    "==============================\n" +
                    "🚀 RELEASE STATUS\n" +
                    "Current Release: In Progress / Successful / Failed\n" +
                    "Last Deployment: X minutes/hours ago\n" +
                    "Release Confidence: High / Medium / Low\n" +
                    "[Explain in ONE sentence if production delivery is stable.]\n\n" +
                    "==============================\n" +
                    "📊 DELIVERY KPIs\n" +
                    "Deployment Success Rate: " + infraService.getDynamicDeliverySuccess() + "\n" +
                    "Failed Deployments This Week: X\n" +
                    "Average Deployment Time: X minutes\n" +
                    "Rollback Events: X\n" +
                    "[Briefly explain what this means for business delivery.]\n\n" +
                    "==============================\n" +
                    "⚠️ DELIVERY RISKS\n" +
                    "Failure Trend: Rising / Stable / Decreasing\n" +
                    "Blocked Pipelines: X\n" +
                    "Release Delays: Yes / No\n" +
                    "[Translate into BUSINESS IMPACT. Example: 'Repeated failures may delay customer-facing features.']\n\n" +
                    "==============================\n" +
                    "🏗 PIPELINE HEALTH\n" +
                    "Active Pipelines: " + infraService.getActiveContainerCount() + "\n" + // Simplified mapping
                    "Idle Pipelines: X\n" +
                    "[Translate into: 'Delivery capacity is normal / constrained.']\n\n" +
                    "==============================\n" +
                    "🧠 EXECUTIVE DELIVERY SUMMARY (MANDATORY)\n" +
                    "Provide 3–5 bullets (using emojis) on:\n" +
                    "• Delivery stability\n" +
                    "• Release confidence\n" +
                    "• Current risks\n" +
                    "• Team velocity\n" +
                    "• Recommended executive action (if any)\n\n" +
                    "Tone: confident, calm, professional. Never expose: Jenkins job names, Build stages, Logs, Technical pipeline steps.\n\n" +
                    "CORE INFRASTRUCTURE KNOWLEDGE:\n" +
                    "- node-1: Runs Backend API and MySQL Database.\n" +
                    "- node-2: Runs Frontend Application (Angular).\n" +
                    "- vmpipe (Root/Racine): Runs the Management/Monitoring stack (GitLab, Jenkins, SonarQube, Prometheus, Grafana).\n\n" +
                    "CURRENT INFRA SUMMARY:\n" +
                    infraSummary;
        } else {
            systemPrompt = "You are an Executive DevOps Monitoring Agent.\n\n" +
                    "CORE INFRASTRUCTURE KNOWLEDGE:\n" +
                    "- You have EXACTLY 3 nodes: node-1, node-2, and vmpipe.\n" +
                    "- node-1: Runs Backend API and MySQL Database.\n" +
                    "- node-2: Runs Frontend Application (Angular).\n" +
                    "- vmpipe (Root/Racine): Runs the Management/Monitoring stack (GitLab, Jenkins, SonarQube, Prometheus, Grafana).\n" +
                    "- ALL services across all nodes run as Docker Containers. There is NO Kubernetes and NO pods.\n\n" +
                    "GUIDELINES:\n" +
                    "1. If the user asks a specific technical or infrastructure question (e.g., 'How much memory is node-1 using?', 'What is the status of node-2?'), PROVIDE A DIRECT, CONCISE ANSWER AND NOTHING ELSE. Do not include the executive dashboard for these simple queries.\n" +
                    "2. ONLY use the executive dashboard structure below if the user asks for a 'status', 'overview', 'health check', or if they are asking about broader platform conditions.\n" +
                    "3. Your audience is C-level executives. Even in concise answers, be professional and accurate.\n\n" +
                    "MANDATORY DASHBOARD STRUCTURE (Only for status/overview requests):\n\n" +
                    "==============================\n" +
                    "🚦 SYSTEM HEALTH\n" +
                    "Production App: 🟢 UP / 🟡 DEGRADED / 🔴 DOWN\n" +
                    "Backend API: 🟢 Healthy / 🟡 Slow / 🔴 Unreachable\n" +
                    "Monitoring Stack: 🟢 Operational / 🟡 Partial / 🔴 Offline\n" +
                    "Infrastructure: 🟢 Stable / 🟡 Under Load / 🔴 Critical\n" +
                    "[ONE clear sentence describing overall platform condition]\n\n" +
                    "==============================\n" +
                    "📊 WEEKLY KPIs\n" +
                    "Deployment Success Rate: " + infraService.getDynamicDeliverySuccess() + "\n" +
                    "Incidents This Week: " + infraService.getIncidentCount() + "\n" +
                    "Average Recovery Time (MTTR): 12 minutes\n" +
                    "Platform Availability: " + infraService.getDynamicAvailability() + "\n" +
                    "Active Alerts: " + infraService.getIncidentCount() + " (Warnings / Critical)\n" +
                    "[Briefly explain what this means for business operations]\n\n" +
                    "==============================\n" +
                    "🚀 DELIVERY STATUS\n" +
                    "Frontend Service: " + infraService.getFrontendServiceStatus() + "\n" +
                    "Backend Service: " + infraService.getBackendServiceStatus() + "\n" +
                    "[Explain in simple language whether teams are delivering normally or blocked]\n\n" +
                    "==============================\n" +
                    "⚠️ RISK INDICATORS\n" +
                    "Disk Usage: Low / Medium / High Risk\n" +
                    "CPU Pressure: Low / Medium / High\n" +
                    "Alert Trend: Stable\n" +
                    "[Translate into BUSINESS IMPACT]\n\n" +
                    "==============================\n" +
                    "🏗 PLATFORM SUMMARY\n" +
                    "Running Services: " + infraService.getActiveContainerCount() + "\n" +
                    "Stopped Services: " + infraService.getStoppedContainerCount() + "\n" +
                    "[Translate into capacity status: sufficient / approaching limits / critical]\n\n" +
                    "==============================\n" +
                    "🧠 EXECUTIVE SUMMARY (MANDATORY)\n" +
                    "Provide 3–5 bullet points (using emojis) on:\n" +
                    "- Overall system condition\n" +
                    "- Delivery health\n" +
                    "- Reliability level\n" +
                    "- Current operational risks\n" +
                    "- RECOMMENDED EXECUTIVE ACTION\n\n" +
                    "Tone: confident, calm, professional.\n\n" +
                    "CURRENT INFRA SUMMARY:\n" +
                    infraSummary;
        }

        // 3. Save User Message
        chatHistoryService.addMessage(conversationId, "user", request.getMessage());

        // 4. Load History for Context
        List<Map<String, String>> history = chatHistoryService.getConversationHistory(conversationId);

        // 5. Get AI Response
        String reply = groqService.getChatCompletion(history, systemPrompt);

        // 6. Save Assistant Response
        chatHistoryService.addMessage(conversationId, "assistant", reply);

        return new ChatResponse(reply, conversationId);
    }

    private String getCurrentUsername() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null) ? auth.getName() : "anonymous";
    }
}
