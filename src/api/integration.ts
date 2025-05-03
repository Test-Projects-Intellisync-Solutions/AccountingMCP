import { Router, Request, Response } from 'express';
import { integrationAgent, integrationAgentTools } from '../agents/integrationAgent';
const router = Router();

// POST /api/integration/connect-service
router.post('/connect-service', async (req: Request, res: Response) => {
  try {
    const { service, credentials } = req.body;
    if (!service || !credentials) {
      return res.status(400).json({ success: false, error: 'Missing required fields: service, credentials' });
    }
    const result = integrationAgentTools.connectService(service, credentials);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to connect service', details: error });
  }
});

// POST /api/integration/define-config
router.post('/define-config', async (req: Request, res: Response) => {
  try {
    const { service, config } = req.body;
    if (!service || !config) {
      return res.status(400).json({ success: false, error: 'Missing required fields: service, config' });
    }
    const result = integrationAgentTools.defineIntegrationConfig(service, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define config', details: error });
  }
});

// POST /api/integration/report
router.post('/report', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = integrationAgentTools.integrationReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate integration report', details: error });
  }
});

// POST /api/integration/run
router.post('/run', async (req: Request, res: Response) => {
  try {
    const result = await integrationAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Integration agent failed', details: error });
  }
});

export default router;
