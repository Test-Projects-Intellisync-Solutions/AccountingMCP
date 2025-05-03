# Access Control API Documentation (OpenAPI/Swagger)

This document describes the available endpoints for the Access Control Agent. All endpoints accept and return JSON.

---

```yaml
openapi: 3.0.3
info:
  title: Access Control API
  version: 1.0.0
  description: >
    Endpoints for managing user permissions, access policies, and access logs.
servers:
  - url: /api/access-control

paths:
  /check-access:
    post:
      summary: Check if a user (by role) can perform an action on a resource
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [user, action, resource]
              properties:
                user: { type: string }
                action: { type: string }
                resource: { type: string }
      responses:
        '200':
          description: Access check result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result:
                    type: object
                    properties:
                      allowed: { type: boolean }

  /define-policy:
    post:
      summary: Define or update permissions for a role
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [role, permissions]
              properties:
                role: { type: string }
                permissions: { type: array, items: { type: string } }
      responses:
        '200':
          description: Policy definition result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /access-log-report:
    post:
      summary: Get a summary of access logs within a time window
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
          description: Access log summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: object }

  /run:
    post:
      summary: Flexible gateway for agent's main run logic (userId, resource, requestedAction)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId, resource, requestedAction]
              properties:
                userId: { type: string }
                resource: { type: string }
                requestedAction: { type: string }
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
- Use `/run` for advanced or catch-all access control checks.
