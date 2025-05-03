# Integration Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Integration Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Integration Agent API
  version: 1.0.0
  description: >
    Endpoints for connecting to external services, defining integration configs, and generating integration reports.
servers:
  - url: /api/integration

paths:
  /connect-service:
    post:
      summary: Connect to a third-party service
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [service, credentials]
              properties:
                service: { type: string }
                credentials: { type: object }
      responses:
        '200':
          description: Connection result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /define-config:
    post:
      summary: Define or update integration configuration for a service
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [service, config]
              properties:
                service: { type: string }
                config: { type: object }
      responses:
        '200':
          description: Config definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /report:
    post:
      summary: Generate a report of integration activity in a time window
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [from, to]
              properties:
                from: { type: string, format: date-time }
                to: { type: string, format: date-time }
      responses:
        '200':
          description: Integration report
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback integration logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [action]
              properties:
                action: { type: string }
                service: { type: string }
                credentials: { type: object }
                config: { type: object }
                window: { type: object }
      responses:
        '200':
          description: Run result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }
```

---

**Usage Notes:**
- All endpoints expect `Content-Type: application/json`.
- All responses include a `success` boolean and (where applicable) a `result` object.
- Use `/run` for advanced or catch-all integration operations.
