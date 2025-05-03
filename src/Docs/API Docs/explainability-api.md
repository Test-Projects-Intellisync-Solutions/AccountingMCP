# Explainability Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Explainability Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Explainability Agent API
  version: 1.0.0
  description: >
    Endpoints for generating explanations, defining templates, and reporting on explanations for AI-driven decisions.
servers:
  - url: /api/explainability

paths:
  /explain:
    post:
      summary: Generate an explanation for a model output
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [output, context]
              properties:
                output: { type: object }
                context: { type: object }
      responses:
        '200':
          description: Explanation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  explanation: { type: string }

  /define-explanation-template:
    post:
      summary: Define or update an explanation template
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

  /explanation-report:
    post:
      summary: Get a summary of explanations generated within a time window
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
          description: Explanation summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback explainability logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [action]
              properties:
                action: { type: string }
                template: { type: string }
                data: { type: object }
                name: { type: string }
                description: { type: string }
                window: { type: object }
                decision: { type: string }
                contextData: { type: object }
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
- Use `/run` for advanced or catch-all explainability operations.
