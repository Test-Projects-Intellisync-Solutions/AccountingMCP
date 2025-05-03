import { Router, Request, Response } from 'express';
import { analyzerAgent, analyzerTools } from '../agents/analyzerAgent';
const router = Router();

// POST /api/analyzer/run-analysis
router.post('/run-analysis', (req: Request, res: Response) => {
  try {
    const { template, data } = req.body;
    if (!template || !data) {
      return res.status(400).json({ success: false, error: 'Missing required fields: template, data' });
    }
    const result = analyzerTools.runAnalysis(template, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to run analysis', details: error });
  }
});

// POST /api/analyzer/define-metric
router.post('/define-metric', (req: Request, res: Response) => {
  try {
    const { name, formula } = req.body;
    if (!name || !formula) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, formula' });
    }
    const result = analyzerTools.defineMetric(name, formula);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define metric', details: error });
  }
});

// POST /api/analyzer/simulate-forecast
router.post('/simulate-forecast', (req: Request, res: Response) => {
  try {
    const { scenario } = req.body;
    if (!scenario) {
      return res.status(400).json({ success: false, error: 'Missing required field: scenario' });
    }
    const result = analyzerTools.simulateForecast(scenario);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to simulate forecast', details: error });
  }
});

// POST /api/analyzer/analysis-report
router.post('/analysis-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = analyzerTools.analysisReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate analysis report', details: error });
  }
});

// POST /api/analyzer/run
router.post('/run', async (req, res) => {
  try {
    const result = await analyzerAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Analyzer agent failed', details: error });
  }
});

export default router;
