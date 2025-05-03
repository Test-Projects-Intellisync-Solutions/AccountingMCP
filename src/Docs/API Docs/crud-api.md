# CRUD Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the CRUD Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: CRUD Agent API
  version: 1.0.0
  description: >
    Endpoints for creating, updating, deleting, and reporting on records with audit trail support.
servers:
  - url: /api/crud

paths:
  /create-record:
    post:
      summary: Create a new record
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [type, record]
              properties:
                type: { type: string }
                record: { type: object }
      responses:
        '200':
          description: Record creation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /update-record:
    post:
      summary: Update an existing record
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [recordId, changes]
              properties:
                recordId: { type: string }
                changes: { type: object }
      responses:
        '200':
          description: Record update result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /delete-record:
    post:
      summary: Delete a record
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [recordId]
              properties:
                recordId: { type: string }
                options: { type: object }
      responses:
        '200':
          description: Record deletion result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /record-change-report:
    post:
      summary: Get a summary of record changes within a time window
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
          description: Record change summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback CRUD logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [action]
              properties:
                action: { type: string }
                record: { type: object }
                userId: { type: string }
                recordId: { type: string }
                changes: { type: object }
                options: { type: object }
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
- Use `/run` for advanced or catch-all CRUD operations.
