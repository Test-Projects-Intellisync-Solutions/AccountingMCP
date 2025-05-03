import { Router } from 'express';
import { sessionStateAgent } from '../agents/sessionStateAgent';
const router = Router();

// POST /api/session-state/run
router.post('/run', async (req, res) => {
  try {
    const result = await sessionStateAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Session State agent failed', details: error });
  }
});

export default router;
