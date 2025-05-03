# Insights UI Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Insights UI Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Insights UI Agent API
  version: 1.0.0
  description: >
    Endpoints for generating dashboards, defining widgets, and reporting UI usage for financial insights.
servers:
  - url: /api/insights-ui

paths:
  /generate-dashboard:
    post:
      summary: Generate a dashboard from config and data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [config, data]
              properties:
                config: { type: object }
                data: { type: array, items: { type: object } }
      responses:
        '200':
          description: Dashboard generation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /define-widget:
    post:
      summary: Define or update a dashboard widget
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, widgetConfig]
              properties:
                name: { type: string }
                widgetConfig: { type: object }
      responses:
        '200':
          description: Widget definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /ui-usage-report:
    post:
      summary: Get a summary of UI usage within a time window
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
          description: UI usage summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback dashboard logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [action]
              properties:
                action: { type: string }
                config: { type: object }
                data: { type: array, items: { type: object } }
                name: { type: string }
                widgetConfig: { type: object }
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
- Use `/run` for advanced or catch-all dashboard operations.
