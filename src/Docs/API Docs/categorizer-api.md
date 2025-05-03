# Categorizer API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Categorizer Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Categorizer API
  version: 1.0.0
  description: >
    Endpoints for assigning, defining, and reporting on financial categories.
servers:
  - url: /api/categorizer

paths:
  /categorize-item:
    post:
      summary: Assign a category to an item based on text
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [item, text]
              properties:
                item: { type: string }
                text: { type: string }
      responses:
        '200':
          description: Categorization result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  item: { type: string }
                  category: { type: string }

  /define-category:
    post:
      summary: Define or update a category and its rules
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, rules]
              properties:
                name: { type: string }
                rules: { type: array, items: { type: string } }
      responses:
        '200':
          description: Category definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /categorization-report:
    post:
      summary: Get a summary of categorizations within a time window
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
          description: Categorization summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /override-category:
    post:
      summary: Manually override a transaction’s category
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [transactionId, newCategory]
              properties:
                transactionId: { type: string }
                newCategory: { type: string }
      responses:
        '200':
          description: Override result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback categorization (transaction)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [transaction]
              properties:
                transaction: { type: object }
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
- Use `/run` for advanced or catch-all categorization.
