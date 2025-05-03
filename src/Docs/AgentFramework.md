# Agent-Based Framework Overview

## 1. System Architecture

This application uses a modular, agent-based architecture to process, analyze, and present financial data. Each agent is responsible for a specific domain, allowing for separation of concerns, extensibility, and robust error handling.

### Agent Communication & Data Flow
- **Primary Pattern:** RESTful APIs and event-driven updates (Supabase triggers or webhooks)
- **Shared Context:** Supabase database for persistent context; API endpoints for structured exchange; in-memory context for per-request flows
- **Session Management:** Managed by the Session & State Agent
- **Observability:** Logging and audit trails for compliance and debugging

---

## 2. Agent Responsibilities

| Agent                      | Responsibility                                                            |
|---------------------------|----------------------------------------------------------------------------|
| Parser Agent               | Extract raw text, tables, and metadata from documents.                    |
| Categorizer Agent          | Assign transactions to standardized financial categories.                 |
| CRUD Agent                 | Support record creation, editing, and deletion with audit trail tracking. |
| Analyzer Agent             | Conduct trend analysis, financial forecasting, and ratio calculations.    |
| Recommender Agent          | Offer AI-suggested financial actions (e.g., reduce overhead).             |
| Statement Validator Agent  | Spot errors, duplicate entries, and regulatory risks.                     |
| Insights UI Agent          | Translate structured data into visual dashboards and summaries.           |
| Data Quality Agent         | Cleans, deduplicates, and validates raw data before downstream processing.|
| Error Recovery Agent       | Monitors for failed operations and attempts automated recovery or escalation.|
| Audit & Compliance Agent   | Monitors transactions and changes for regulatory compliance and audit logging.|
| User Feedback Agent        | Collects user feedback on AI outputs and routes it for review or model improvement.|
| Notification Agent         | Sends real-time alerts for critical events via email, SMS, or in-app notifications.|
| Integration Agent          | Handles data exchange with third-party services and manages API integration.|
| Privacy & Redaction Agent  | Detects and redacts sensitive information for privacy compliance.          |
| Localization Agent         | Adapts outputs to user’s locale, language, and currency.                  |
| Session & State Agent      | Manages user sessions, context, and workflow state.                       |
| Summarization Agent        | Generates concise, human-readable summaries of documents or datasets.      |
| Document Conversion Agent  | Converts between file formats (PDF, CSV, images, etc.).                   |
| Access Control Agent       | Manages permissions for users, roles, and data access.                    |

---

## 3. Agent Interfaces & Data Contracts (Step 1 — Completed)

To ensure consistent data exchange and context sharing between agents, the following TypeScript interfaces define the core entities in the system. These should be referenced and extended as new agents or features are added.

### Example Interfaces

```typescript
// Document uploaded or processed by the system
export interface Document {
  id: string;
  userId: string;
  filename: string;
  type: 'pdf' | 'csv' | 'image' | string;
  uploadedAt: string;
  parsedText?: string;
  metadata?: Record<string, any>;
}

// Financial transaction record
export interface Transaction {
  id: string;
  documentId?: string;
  userId: string;
  date: string;
  amount: number;
  category?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  auditTrail: AuditEvent[];
}

// User session and workflow context
export interface UserSession {
  sessionId: string;
  userId: string;
  createdAt: string;
  lastActive: string;
  workflowState?: string;
}

// Generic agent context for passing data between agents
export interface AgentContext {
  session: UserSession;
  currentDocument?: Document;
  transactions?: Transaction[];
  additionalData?: Record<string, any>;
}

// Audit event for traceability
export interface AuditEvent {
  timestamp: string;
  userId: string;
  action: string;
  details?: Record<string, any>;
}
```

**Purpose:** These interfaces establish a contract for agent communication, data storage, and workflow context. All agents should use these types (and extend as needed) to ensure interoperability and traceability.

---

**Step 1 Completed:** Core interfaces and data contracts defined.

---

## 4. Core Infrastructure (Step 2 — Completed)

To support the agent-based framework, the following core infrastructure is required:

### 1. Database (Supabase)
- **Tables:**
  - `documents`: Stores metadata and parsed content for uploaded documents
  - `transactions`: Stores financial transactions, linked to documents and users
  - `users`: Stores user authentication and profile data
  - `audit_logs`: Stores audit trail events for traceability
  - (Extend as needed for agent-specific data)
- **Features:**
  - Row-level security for access control
  - Triggers/webhooks for event-driven agent invocation

### 2. Backend API (Express.js)
- **Structure:**
  - Modular route structure, one module per agent (e.g., `/api/parser`, `/api/analyzer`)
  - Middleware for authentication, logging, error handling
  - RESTful endpoints for all major data objects and agent actions
- **Authentication:**
  - JWT-based authentication (integrated with Supabase Auth)
  - Session management via Session & State Agent

### 3. Logging & Observability
- **Logging:**
  - Use Winston for structured logging of agent actions and errors
  - Store critical events in `audit_logs` table
- **Monitoring:**
  - Integrate with monitoring tools as needed for uptime and error tracking

### 4. Configuration & Environment
- **.env Management:**
  - Use dotenv for environment variables (API keys, DB URLs, etc.)
- **Security:**
  - Use Helmet middleware for HTTP header security
  - CORS configuration for frontend-backend communication

---

**Step 2 Completed:** Core infrastructure requirements and architectural decisions documented.

| Explainability Agent       | Provides transparent explanations for AI-driven decisions.                 |

---

## 3. Implementation Priorities

| Priority | Step Description                                      |
|----------|------------------------------------------------------|
| 1        | System architecture & agent framework                |
| 2        | Core infrastructure (DB, backend, auth, logging)     |
| 3        | End-to-end agent pipeline (MVP flow)                 |
| 4        | Frontend framework & basic UI                        |
| 5        | Granular agent features & advanced logic             |
| 6        | Testing, observability, and iteration                |

### Recommended Sequence

1. **Define agent interfaces and data contracts**  
   - TypeScript interfaces for all major data types (document, transaction, user session, etc.)
   - Agent input/output documentation
2. **Establish core infrastructure**  
   - Supabase schema, Express.js backend, authentication, logging
3. **Implement MVP agent pipeline**  
   - Document upload → Parsing → Data Quality → Categorization → CRUD → Analysis → Dashboard
4. **Develop frontend framework**  
   - React/TypeScript, Tailwind, shadcn/ui, Vite
5. **Expand agent-specific logic**  
   - Add advanced features (notifications, compliance, explainability, etc.)
6. **Testing and continuous improvement**

---

## 4. Agent Interaction Diagram (Textual)

```
User → [Frontend UI] → [Parser Agent] → [Data Quality Agent] → [Categorizer Agent] → [CRUD Agent]
      → [Analyzer Agent] → [Insights UI Agent] → User (dashboard)
      → [Notification Agent], [Audit & Compliance Agent], [Error Recovery Agent] (as needed)
```

---

## 5. Extending the Framework
- To add a new agent, define its responsibility, API contract, and data dependencies.
- Register new endpoints or event triggers as needed.
- Update shared TypeScript interfaces to reflect new data flows.

---

**This document should be updated as the architecture evolves and new agents/features are added.**
