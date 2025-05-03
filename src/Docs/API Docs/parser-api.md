# Parser Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Parser Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Parser Agent API
  version: 1.0.0
  description: >
    Endpoints for document parsing and extraction, including PDF and text extraction for downstream processing.
servers:
  - url: /api/parser

paths:
  /parse:
    post:
      summary: Parse a document (PDF, text, etc.)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                file: { type: string, description: 'Base64-encoded document or file path' }
                options: { type: object }
      responses:
        '200':
          description: Parse result
          content:
            application/json:
              schema:
                type: object
                properties:
                  message: { type: string }
```

---

**Usage Notes:**
- All endpoints expect `Content-Type: application/json`.
- All responses include a message or result object.
- Extend the `/parse` endpoint for additional file types as needed.
