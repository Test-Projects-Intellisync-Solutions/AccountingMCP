# Summarization Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Summarization Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Summarization Agent API
  version: 1.0.0
  description: >
    Endpoints for generating summaries from documents and meeting notes.
servers:
  - url: /api/summarization

paths:
  /run:
    post:
      summary: Flexible gateway for summarization actions
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
          description: Summarization result
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
- Use `/run` for all summarization operations.
