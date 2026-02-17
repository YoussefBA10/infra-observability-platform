# Website Technical Details

This document provides detailed information on the technical architecture, data flow, and stack of the Executive DevOps Visibility Platform.

## 🏗 System Architecture

The platform is designed with a 3-layer structure for microservice observability.

```mermaid
graph TD
    subgraph "Frontend (React + Vite)"
        UI[Executive Dashboard]
        API_C[Dashboard Service]
    end

    subgraph "Backend (Spring Boot)"
        CTRL[REST Controllers]
        SVC[Infrastructure/AI Services]
        PROM[Prometheus Client]
        GROQ[Groq/LLM Client]
    end

    subgraph "Infrastructure (Multi-Node Cluster)"
        N1[node-1: Backend/DB]
        N2[node-2: Frontend/Nginx]
        N3[vmpipe: GitLab/Jenkins/Monitoring]
    end

    subgraph "Telemetry Data Sources"
        CAD["cAdvisor (Metrics)"]
        NE["Node Exporter (Host Metrics)"]
        ACT["Spring Actuator"]
    end

    UI --> API_C
    API_C --> CTRL
    CTRL --> SVC
    SVC --> PROM
    SVC --> GROQ
    PROM --> CAD
    PROM --> NE
    SVC --> ACT
```

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Premium Dark Theme)
- **Visualization**: Recharts (Trends), Three.js (Future integration)
- **Icons**: Lucide React
- **State Management**: React Hooks (User-Defined Services)

### Backend
- **Framework**: Spring Boot 3.3.2
- **Security**: Spring Security, JWT
- **Database**: MySQL (JPA/Hibernate)
- **AI Engine**: Groq Cloud API (Llama 3.3 70B Model)
- **Client**: RestTemplate (Prometheus/Actuator API Integration)

### Infrastructure & Monitoring
- **Virtualization**: Docker & Docker Compose
- **Metric Collection**: Prometheus
- **Container Analysis**: Google cAdvisor
- **Host Monitoring**: Prometheus Node Exporter

## 📊 Key Features & Data Flow

### 1. Infrastructure Monitoring
- **Data Source**: Metrics collected via cAdvisor and Node Exporter are scraped by Prometheus.
- **Processing Logic**: `InfrastructureService` iterates through 3 nodes (node-1, node-2, vmpipe) to aggregate metrics.
- **Key Highlight**: Real-time container Uptime calculation and node-level resource usage (CPU, RAM, Disk) visualization.

### 2. Automated Report Pipeline
- **Endpoint**: `POST /api/reports` (Multipart Form Data).
- **Data Flow**: Jenkins/GitLab CI sends JSON artifacts (SonarQube, Trivy, Dependency-Check).
- **Normalization**: `ReportService` parses various tool formats and normalizes security severity and code quality metrics into a unified 1-5 scale for executive scoring.
- **Persistence**: Results are linked to a `Pipeline` entity, enabling historical trend analysis via the **Trends** page.

### 3. Embedded AI Analytics
- **Data Source**: Aggregated findings from the `Pipeline` database entities.
- **Processing Logic**: `AiAnalysisService` performs context-aware synthesis of specific CVEs and code smells using Groq.
- **Persistent AI Observations**: AI summaries and recommendations are stored in the `AiAnalysis` entity, ensuring that executive advice remains consistent even after the underlying logs are rotated.

### 4. Persistent Conversational AI
- **Entities**: `User`, `Conversation`, `ChatMessage`.
- **Infrastructure**: The `ChatHistoryService` manages the lifecycle of interactive sessions, providing a persistent "DevOps Assistant" that remembers past interactions.

### 5. Multi-Node Support
- **Registry**: `node-1` (192.168.126.131), `node-2` (192.168.126.132), `vmpipe` (192.168.126.130).
- **Aggregation**: Total container count, incident counts, and integrated health checks across the entire cluster.

## 🗄️ Database Schema & Object Model
The system uses a relational model managed by JPA/Hibernate. A full architectural visualization can be found in [CLASS_DIAGRAM.md](./CLASS_DIAGRAM.md).
- **Core Entities**: `Pipeline`, `SonarReport`, `TrivyFinding`, `OwaspFinding`.
- **Chat Entities**: `User`, `Conversation`, `ChatMessage`.

## 🔒 Security & Governance
- All APIs support JWT-based authentication (Infrastructure endpoints are currently open for development convenience).
- Dashboard is configured to display actionable statistics while minimizing sensitive log exposure.
