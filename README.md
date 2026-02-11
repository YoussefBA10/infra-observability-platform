# Executive DevOps Visibility Platform

A leadership-grade observability platform designed to translate technical infrastructure signals into business-level executive insights. This platform provides a single source of truth for production health, delivery confidence, and operational risk.

## 🎯 Executive Value

- **Instant Production Visibility**: Real-time health signals across a multi-node cluster.
- **Infrastructure Command Center**: Visual oversight of containers (CPU, Mem, Uptime) and physical nodes.
- **Delivery Confidence**: Direct visibility into team delivery pipelines.
- **Operational Risk Awareness**: Early warning systems for cluster capacity and service stability.
- **AI-Powered Insights**: Executive-level summaries and recommendations via embedded AI panels.

## 🏗 Platform Components

The platform is designed for **Docker Compose** environments, prioritizing stability and clarity over orchestration complexity.

- `frontend/`: Executive Dashboard (React, TypeScript, Three.js).
- `backend/`: Business Intelligence Layer (Spring Boot, Security, JPA).

### Leadership Tech Stack

- **Intelligence**: Groq AI (Llama 3.3 70B) for executive reporting and real-time analysis.
- **Observability**: Prometheus, cAdvisor, and Node Exporter for cluster-wide telemetry.
- **Security**: JWT-based authentication and secure backend relay.
- **Core**: Spring Boot 3.3.2 & React 18 with TypeScript.

## 🛠 Setup & Configuration

### Prerequisites
- Node.js (v18+)
- JDK 17
- MySQL instance
- Docker & Docker Compose

### Configuration

#### Intelligence Layer (`backend/.env`)
```env
DB_URL=jdbc:mysql://<host>:<port>/devops_db
JWT_SECRET=<secure-key>
GROQ_API_KEY=<key>
PROMETHEUS_URL=http://<host>:9090
```

#### Dashboard Layer (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8880/api
```

## 🐳 Deployment

The platform is fully containerized using **Docker Compose** for high reliability and simple maintenance.

```sh
docker-compose up -d
```

## 🤝 Governance & Contributions

Guidelines for platform evolution and contributions are managed via pull requests.
