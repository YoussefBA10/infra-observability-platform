# Backend Class Diagram

This document provides a visualization of the core entities and their relationships within the DevOps Platform backend.

```mermaid
classDiagram
    class Pipeline {
        +Long id
        +LocalDateTime timestamp
        +String status
        +Long duration
        +String commitHash
        +String component
        +String appVersion
    }

    class SonarReport {
        +Long id
        +Integer bugs
        +Integer vulnerabilities
        +Integer codeSmells
        +Double coverage
        +Double duplication
    }

    class TrivyFinding {
        +Long id
        +Integer severity
        +String cve
        +String packageName
    }

    class OwaspFinding {
        +Long id
        +String dependency
        +Double cvss
        +Integer severity
    }

    class AiAnalysis {
        +Long id
        +String page
        +String summary
        +List~String~ recommendations
    }

    class User {
        +Long id
        +String username
        -String password
    }

    class Conversation {
        +Long id
        +String title
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class ChatMessage {
        +Long id
        +String role
        +String content
        +LocalDateTime timestamp
    }

    Pipeline "1" -- "1" SonarReport : has
    Pipeline "1" -- "*" TrivyFinding : has
    Pipeline "1" -- "*" OwaspFinding : has
    Pipeline "1" -- "*" AiAnalysis : analyzed by
    User "1" -- "*" Conversation : owns
    Conversation "1" -- "*" ChatMessage : contains
```

## Entity Relationships

- **Pipeline**: The central entity representing a CI/CD pipeline execution.
    - **SonarReport**: One-to-One relationship. Each pipeline has one quality report.
    - **TrivyFinding**: One-to-Many relationship. A pipeline can have multiple security findings from Trivy.
    - **OwaspFinding**: One-to-Many relationship. A pipeline can have multiple dependency findings from OWASP.
    - **AiAnalysis**: Many-to-One relationship. Multiple AI analyses can be associated with a single pipeline outcome.

- **DevOps Assistant (Chat)**:
    - **User**: Represents a system user.
    - **Conversation**: One-to-Many relationship with User. A user can have multiple chat conversations.
    - **ChatMessage**: One-to-Many relationship with Conversation. Each conversation consists of multiple messages (user/assistant).
