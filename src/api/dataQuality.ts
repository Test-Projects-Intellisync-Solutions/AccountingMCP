import { Router, Request, Response } from 'express';
import { dataQualityAgent, dataQualityAgentTools } from '../agents/dataQualityAgent';
const router = Router();

// POST /api/data-quality/run-quality-check
router.post('/run-quality-check', (req: Request, res: Response) => {
  try {
    const { rule, data } = req.body;
    if (!rule || !data) {
      return res.status(400).json({ success: false, error: 'Missing required fields: rule, data' });
    }
    const result = dataQualityAgentTools.runQualityCheck(rule, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to run quality check', details: error });
  }
});

// POST /api/data-quality/define-quality-rule
router.post('/define-quality-rule', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, description' });
    }
    const result = dataQualityAgentTools.defineQualityRule(name, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define quality rule', details: error });
  }
});

// POST /api/data-quality/quality-report
router.post('/quality-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = dataQualityAgentTools.qualityReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate quality report', details: error });
  }
});

// POST /api/data-quality/quality-summary-report
router.post('/quality-summary-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = dataQualityAgentTools.qualitySummaryReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate quality summary report', details: error });
  }
});

// POST /api/data-quality/anomaly-report
router.post('/anomaly-report', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = await dataQualityAgentTools.anomalyReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate anomaly report', details: error });
  }
});

// POST /api/data-quality/run
router.post('/run', async (req: Request, res: Response) => {
  try {
    const result = await dataQualityAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Data Quality agent failed', details: error });
  }
});

export default router;
