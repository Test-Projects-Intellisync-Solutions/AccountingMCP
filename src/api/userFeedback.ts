import { Router } from 'express';
import { userFeedbackAgent } from '../agents/userFeedbackAgent';
const router = Router();

// POST /api/user-feedback/run
router.post('/run', async (req, res) => {
  try {
    const result = await userFeedbackAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'User Feedback agent failed', details: error });
  }
});

export default router;
