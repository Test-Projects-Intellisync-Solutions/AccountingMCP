# Data Quality Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Data Quality Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Data Quality Agent API
  version: 1.0.0
  description: >
    Endpoints for running quality checks, defining rules, and reporting on data quality and anomalies.
servers:
  - url: /api/data-quality

paths:
  /run-quality-check:
    post:
      summary: Run a data quality check using a rule
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [rule, data]
              properties:
                rule: { type: string }
                data: { type: object }
      responses:
        '200':
          description: Quality check result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  rule: { type: string }
                  passed: { type: boolean }

  /define-quality-rule:
    post:
      summary: Define or update a data quality rule
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
          description: Rule definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /quality-report:
    post:
      summary: Get a summary of quality checks within a time window
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
          description: Quality check summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /quality-summary-report:
    post:
      summary: Get an aggregated summary of quality issues
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
          description: Quality summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /anomaly-report:
    post:
      summary: Get a report of detected anomalies within a time window
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
          description: Anomaly report
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback data quality logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [action]
              properties:
                action: { type: string }
                rule: { type: string }
                data: { type: object }
                name: { type: string }
                description: { type: string }
                window: { type: object }
                dataset: { type: object }
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
- Use `/run` for advanced or catch-all data quality operations.
