import { Router } from 'express';
import { insightsUIAgent } from '../agents/insightsUIAgent';
const router = Router();

// POST /api/insights/run
router.post('/run', async (req, res) => {
  try {
    const result = await insightsUIAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Insights agent failed', details: error });
  }
});

export default router;
