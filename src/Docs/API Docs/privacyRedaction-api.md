# Privacy Redaction Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Privacy Redaction Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Privacy Redaction Agent API
  version: 1.0.0
  description: >
    Endpoints for redacting sensitive information from documents and data.
servers:
  - url: /api/privacy-redaction

paths:
  /run:
    post:
      summary: Flexible gateway for privacy redaction actions
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
          description: Redaction result
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
- Use `/run` for all privacy redaction operations (text, document, etc.).
