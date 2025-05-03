# Error Recovery Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Error Recovery Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Error Recovery Agent API
  version: 1.0.0
  description: >
    Endpoints for error recovery, defining recovery strategies, and reporting on recovery actions.
servers:
  - url: /api/error-recovery

paths:
  /recover:
    post:
      summary: Attempt automated recovery from an error
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [error, context]
              properties:
                error: { type: object }
                context: { type: object }
      responses:
        '200':
          description: Recovery action and suggestion
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  action: { type: string }
                  suggestion: { type: string }

  /define-recovery-strategy:
    post:
      summary: Define or update a recovery strategy
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, description]
              properties:
                name: { type: string }
                description: { type: string }
      responses:
        '200':
          description: Strategy definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /recovery-report:
    post:
      summary: Get a summary of recovery actions within a time window
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
          description: Recovery action summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback error recovery logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [error, attemptedAction]
              properties:
                error: { type: object }
                attemptedAction: { type: string }
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
- Use `/run` for advanced or catch-all error recovery operations.
