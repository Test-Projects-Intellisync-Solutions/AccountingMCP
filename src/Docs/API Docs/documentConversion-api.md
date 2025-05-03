# Document Conversion Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Document Conversion Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Document Conversion Agent API
  version: 1.0.0
  description: >
    Endpoints for converting between file formats, defining conversion templates, and reporting on conversions.
servers:
  - url: /api/document-conversion

paths:
  /run-conversion:
    post:
      summary: Run a document conversion using a template
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [template, input]
              properties:
                template: { type: string }
                input: { type: object }
      responses:
        '200':
          description: Conversion result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  template: { type: string }
                  status: { type: string }

  /define-conversion-template:
    post:
      summary: Define or update a conversion template
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
          description: Template definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /conversion-report:
    post:
      summary: Get a summary of conversions within a time window
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
          description: Conversion summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback conversion (input, targetFormat)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [input, targetFormat]
              properties:
                input: { type: object }
                targetFormat: { type: string }
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
- Use `/run` for advanced or catch-all document conversion operations.
