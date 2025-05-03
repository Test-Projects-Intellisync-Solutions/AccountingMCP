import { Router } from 'express';
import { summarizationAgent } from '../agents/summarizationAgent';
const router = Router();

// POST /api/summarization/run
router.post('/run', async (req, res) => {
  try {
    const result = await summarizationAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Summarization agent failed', details: error });
  }
});

export default router;
