# Notification Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Notification Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Notification Agent API
  version: 1.0.0
  description: >
    Endpoints for sending notifications, defining notification templates, and generating notification reports.
servers:
  - url: /api/notification

paths:
  /send:
    post:
      summary: Send a notification to a recipient via a channel
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [recipient, message, channel]
              properties:
                recipient: { type: string }
                message: { type: string }
                channel: { type: string }
      responses:
        '200':
          description: Notification send result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /define-channel:
    post:
      summary: Define or update a notification template for a channel
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [channel, config]
              properties:
                channel: { type: string }
                config:
                  type: object
                  properties:
                    template: { type: string }
      responses:
        '200':
          description: Channel/template definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /report:
    post:
      summary: Generate a notification activity report for a time window
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
          description: Notification report
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback notification logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                action: { type: string }
                recipient: { type: string }
                message: { type: string }
                channel: { type: string }
                config: { type: object }
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
- Use `/run` for advanced or catch-all notification operations.
