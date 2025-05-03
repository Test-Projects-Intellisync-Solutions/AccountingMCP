import { Router, Request, Response } from 'express';
import { insightsUIAgent, insightsUIAgentTools } from '../agents/insightsUIAgent';
const router = Router();

// POST /api/insights-ui/generate-dashboard
router.post('/generate-dashboard', (req: Request, res: Response) => {
  try {
    const { config, data } = req.body;
    if (!config || !data) {
      return res.status(400).json({ success: false, error: 'Missing required fields: config, data' });
    }
    const result = insightsUIAgentTools.generateDashboard(config, data);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate dashboard', details: error });
  }
});

// POST /api/insights-ui/define-widget
router.post('/define-widget', (req: Request, res: Response) => {
  try {
    const { name, widgetConfig } = req.body;
    if (!name || !widgetConfig) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, widgetConfig' });
    }
    const result = insightsUIAgentTools.defineWidget(name, widgetConfig);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define widget', details: error });
  }
});

// POST /api/insights-ui/ui-usage-report
router.post('/ui-usage-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = insightsUIAgentTools.uiUsageReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate UI usage report', details: error });
  }
});

// POST /api/insights-ui/run
router.post('/run', async (req: Request, res: Response) => {
  try {
    const result = await insightsUIAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Insights UI agent failed', details: error });
  }
});

export default router;
