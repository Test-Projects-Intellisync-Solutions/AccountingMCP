import { Router } from 'express';
import { dataQualityAgent } from '../agents/dataQualityAgent';

const router = Router();

// POST /api/quality/check
router.post('/check', async (req, res) => {
  const { rule, data } = req.body;
  try {
    const result = await dataQualityAgent.run({ parameters: { action: 'runCheck', rule, data }, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Quality check failed', details: error });
  }
});

// POST /api/quality/defineRule
router.post('/defineRule', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await dataQualityAgent.run({ parameters: { action: 'defineRule', name, description }, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Rule definition failed', details: error });
  }
});

// GET /api/quality/report
router.get('/report', async (req, res) => {
  const { from, to } = req.query;
  try {
    const result = await dataQualityAgent.run({ parameters: { action: 'report', window: { from, to } }, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Report generation failed', details: error });
  }
});

export default router;
