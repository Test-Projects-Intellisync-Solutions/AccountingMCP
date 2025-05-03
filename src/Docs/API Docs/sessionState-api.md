# Session State Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Session State Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Session State Agent API
  version: 1.0.0
  description: >
    Endpoints for managing user session state and context.
servers:
  - url: /api/session-state

paths:
  /run:
    post:
      summary: Flexible gateway for session state actions
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                action: { type: string }
                data: { type: object }
      responses:
        '200':
          description: Session state result
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
- Use `/run` for all session state operations.
