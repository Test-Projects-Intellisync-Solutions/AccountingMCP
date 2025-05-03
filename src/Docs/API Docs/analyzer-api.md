# Analyzer API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Analyzer Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Analyzer API
  version: 1.0.0
  description: >
    Endpoints for trend analysis, forecasting, and metric definition.
servers:
  - url: /api/analyzer

paths:
  /run-analysis:
    post:
      summary: Run an analysis template on data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [template, data]
              properties:
                template: { type: string }
                data: { type: object }
      responses:
        '200':
          description: Analysis result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /define-metric:
    post:
      summary: Define or update a metric and its formula
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, formula]
              properties:
                name: { type: string }
                formula: { type: string }
      responses:
        '200':
          description: Metric definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /simulate-forecast:
    post:
      summary: Simulate a forecast for a scenario
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [scenario]
              properties:
                scenario: { type: object }
      responses:
        '200':
          description: Simulated forecast
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /analysis-report:
    post:
      summary: Get a summary of analyses run within a time window
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
          description: Analysis report summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback analytics (reportType, data)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [reportType, data]
              properties:
                reportType: { type: string }
                data: { type: object }
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
- All responses include a `success` boolean and a `result` object.
- Use `/run` for advanced or catch-all analytics.
