// src/api/financialMetrics.ts
import express, { Request, Response } from 'express';
import { financialMetricsAgent, financialMetricsAgentResources, financialMetricsAgentTools } from '../agents/financialMetricsAgent';

const router = express.Router();

function getParameters(req: Request) {
  return { ...req.body, ...req.query };
}

// POST /api/financial-metrics/calculate
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { metricName, period, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'calculateMetric', metricName, period, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/compare
router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { metricName, periodA, periodB, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'compareMetrics', metricName, periodA, periodB, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/trend
router.post('/trend', async (req: Request, res: Response) => {
  try {
    const { metricName, startPeriod, endPeriod, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'generateTrend', metricName, startPeriod, endPeriod, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/summary
router.post('/summary', async (req: Request, res: Response) => {
  try {
    const { period, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'summarizeAllMetricsForPeriod', period, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/top
router.post('/top', async (req: Request, res: Response) => {
  try {
    const { period, n, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'getTopNMetricsByValue', period, n, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/bottom
router.post('/bottom', async (req: Request, res: Response) => {
  try {
    const { period, n, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'getBottomNMetricsByValue', period, n, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/largest-change
router.post('/largest-change', async (req: Request, res: Response) => {
  try {
    const { periodA, periodB, n, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'getMetricsWithLargestChange', periodA, periodB, n, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/trends-summary
router.post('/trends-summary', async (req: Request, res: Response) => {
  try {
    const { metricName, periods, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'summarizeTrendsAcrossPeriods', metricName, periods, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/anomalies
router.post('/anomalies', async (req: Request, res: Response) => {
  try {
    const { period, stddevThreshold, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'detectAnomaliesInMetrics', period, stddevThreshold, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/by-category
router.post('/by-category', async (req: Request, res: Response) => {
  try {
    const { period, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'groupMetricsByCategory', period, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/narrative
router.post('/narrative', async (req: Request, res: Response) => {
  try {
    const { period, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'generateNarrativeSummary', period, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/correlated
router.post('/correlated', async (req: Request, res: Response) => {
  try {
    const { threshold, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'findCorrelatedMetrics', threshold, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/history
router.post('/history', async (req: Request, res: Response) => {
  try {
    const { metricName, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'getMetricHistory', metricName, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/financial-metrics/inputs?metricName=...
router.get('/inputs', (req: Request, res: Response) => {
  try {
    const { metricName } = req.query;
    const result = financialMetricsAgentTools.getMetricInputs({ metricName: String(metricName) });
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/financial-metrics/explain?metricName=...
router.get('/explain', (req: Request, res: Response) => {
  try {
    const { metricName } = req.query;
    const result = financialMetricsAgentTools.explainMetric({ metricName: String(metricName) });
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/financial-metrics/metrics
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const metrics = Object.values(financialMetricsAgentResources.metricDefinitions).map(m => ({ name: m.name, formula: m.formula }));
    res.json({ success: true, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/financial-metrics/periods
router.get('/periods', (req: Request, res: Response) => {
  try {
    // This endpoint expects historicalData as a JSON string in the query
    const { historicalData } = req.query;
    const parsed = historicalData ? JSON.parse(String(historicalData)) : {};
    const result = financialMetricsAgentTools.listPeriods({ historicalData: parsed });
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/threshold
router.post('/threshold', async (req: Request, res: Response) => {
  try {
    const { period, threshold, direction, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'findMetricsAboveBelowThreshold', period, threshold, direction, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/missing
router.post('/missing', async (req: Request, res: Response) => {
  try {
    const { metricName, period, historicalData } = req.body;
    const result = await financialMetricsAgent.run({ parameters: { action: 'getMissingDataForMetric', metricName, period, historicalData }, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/financial-metrics/action
router.post('/action', async (req: Request, res: Response) => {
  try {
    const parameters = getParameters(req);
    const result = await financialMetricsAgent.run({ parameters, context: {} });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/financial-metrics/metrics
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const metrics = Object.values(financialMetricsAgentResources.metricDefinitions).map(m => ({ name: m.name, formula: m.formula }));
    res.json({ success: true, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
