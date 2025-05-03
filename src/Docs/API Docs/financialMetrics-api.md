# Financial Metrics API (OpenAPI/Swagger)

This document describes the available endpoints for the Financial Metrics Agent, matching all tools and analytics in your backend. It is written in OpenAPI 3.0 (Swagger) YAML format for easy import into Swagger UI, Redoc, or compatible tools.

---

```yaml
openapi: 3.0.3
info:
  title: Financial Metrics API
  version: 1.0.0
  description: >
    Endpoints for advanced financial metrics analysis, matching the FinancialMetricsAgent tools.
servers:
  - url: /api/financial-metrics

paths:
  /calculate:
    post:
      summary: Calculate a specific financial metric for a given period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [metricName, period, historicalData]
              properties:
                metricName: { type: string }
                period: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: Calculation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /compare:
    post:
      summary: Compare a metric between two periods
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [metricName, periodA, periodB, historicalData]
              properties:
                metricName: { type: string }
                periodA: { type: string }
                periodB: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: Comparison result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /trend:
    post:
      summary: Generate a trend for a metric over a period range
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [metricName, startPeriod, endPeriod, historicalData]
              properties:
                metricName: { type: string }
                startPeriod: { type: string }
                endPeriod: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: Trend data
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /summary:
    post:
      summary: Compute and return all metrics for a specific period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [period, historicalData]
              properties:
                period: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: All metrics for the period
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /top:
    post:
      summary: Get the top N metrics by value for a period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [period, n, historicalData]
              properties:
                period: { type: string }
                n: { type: integer }
                historicalData: { type: object }
      responses:
        '200':
          description: Top N metrics
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /bottom:
    post:
      summary: Get the bottom N metrics by value for a period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [period, n, historicalData]
              properties:
                period: { type: string }
                n: { type: integer }
                historicalData: { type: object }
      responses:
        '200':
          description: Bottom N metrics
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /largest-change:
    post:
      summary: Get metrics with the largest change between two periods
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [periodA, periodB, n, historicalData]
              properties:
                periodA: { type: string }
                periodB: { type: string }
                n: { type: integer }
                historicalData: { type: object }
      responses:
        '200':
          description: Largest change metrics
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /trends-summary:
    post:
      summary: Summarize trends across multiple periods for a metric
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [metricName, periods, historicalData]
              properties:
                metricName: { type: string }
                periods: { type: array, items: { type: string } }
                historicalData: { type: object }
      responses:
        '200':
          description: Trends summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /anomalies:
    post:
      summary: Detect anomalies in metrics for a period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [period, stddevThreshold, historicalData]
              properties:
                period: { type: string }
                stddevThreshold: { type: number }
                historicalData: { type: object }
      responses:
        '200':
          description: Anomalies
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /by-category:
    post:
      summary: Group metrics by category for a period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [period, historicalData]
              properties:
                period: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: Grouped metrics
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /narrative:
    post:
      summary: Generate a narrative summary for a period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [period, historicalData]
              properties:
                period: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: Narrative summary
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: string }

  /correlated:
    post:
      summary: Find correlated metrics above a threshold
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [threshold, historicalData]
              properties:
                threshold: { type: number }
                historicalData: { type: object }
      responses:
        '200':
          description: Correlated metrics
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /history:
    post:
      summary: Get the history of a metric across all periods
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [metricName, historicalData]
              properties:
                metricName: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: Metric history
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /inputs:
    get:
      summary: Get required input fields for a specified metric
      parameters:
        - in: query
          name: metricName
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Input fields
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: array, items: { type: string } }

  /explain:
    get:
      summary: Get a detailed explanation of a specified metric
      parameters:
        - in: query
          name: metricName
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Metric explanation
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: string }

  /metrics:
    get:
      summary: List all available metrics and their formulas
      responses:
        '200':
          description: List of metrics
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  metrics:
                    type: array
                    items:
                      type: object
                      properties:
                        name: { type: string }
                        formula: { type: string }

  /periods:
    get:
      summary: List all available periods in the historical data
      parameters:
        - in: query
          name: historicalData
          required: true
          schema: { type: string }
          description: JSON stringified object
      responses:
        '200':
          description: Periods list
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: array, items: { type: string } }

  /threshold:
    post:
      summary: Find metrics above or below a specified threshold for a period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [period, threshold, direction, historicalData]
              properties:
                period: { type: string }
                threshold: { type: number }
                direction: { type: string, enum: [above, below] }
                historicalData: { type: object }
      responses:
        '200':
          description: Metrics above/below threshold
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}

  /missing:
    post:
      summary: Identify missing data fields for a metric in a period
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [metricName, period, historicalData]
              properties:
                metricName: { type: string }
                period: { type: string }
                historicalData: { type: object }
      responses:
        '200':
          description: Missing fields
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: { type: array, items: { type: string } }

  /action:
    post:
      summary: Flexible gateway for any agent action
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                action: { type: string }
      responses:
        '200':
          description: Flexible agent result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  result: {}
```
