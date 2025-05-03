# User Feedback Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the User Feedback Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: User Feedback Agent API
  version: 1.0.0
  description: >
    Endpoints for collecting and analyzing user feedback.
servers:
  - url: /api/user-feedback

paths:
  /run:
    post:
      summary: Flexible gateway for user feedback actions
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
          description: User feedback result
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
- Use `/run` for all user feedback operations.
