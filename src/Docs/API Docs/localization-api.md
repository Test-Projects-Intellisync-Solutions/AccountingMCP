# Localization Agent API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Localization Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Localization Agent API
  version: 1.0.0
  description: >
    Endpoints for text localization, locale definition, and localization reporting.
servers:
  - url: /api/localization

paths:
  /translate:
    post:
      summary: Translate text to a target locale
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [text, targetLocale]
              properties:
                text: { type: string }
                targetLocale: { type: string }
      responses:
        '200':
          description: Translation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /define-locale:
    post:
      summary: Define or update a locale configuration
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [locale, config]
              properties:
                locale: { type: string }
                config: { type: object }
      responses:
        '200':
          description: Locale definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }

  /report:
    post:
      summary: Generate a localization activity report for a time window
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
          description: Localization report
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for LLM-powered and fallback localization logic
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                action: { type: string }
                text: { type: string }
                targetLocale: { type: string }
                locale: { type: string }
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
- Use `/run` for advanced or catch-all localization operations.
