import { Router, Request, Response } from 'express';
import { errorRecoveryAgent, errorRecoveryTools } from '../agents/errorRecoveryAgent';
const router = Router();

// POST /api/error-recovery/recover
router.post('/recover', async (req: Request, res: Response) => {
  try {
    const { error, context } = req.body;
    if (!error || !context) {
      return res.status(400).json({ success: false, error: 'Missing required fields: error, context' });
    }
    const result = await errorRecoveryTools.recover(error, context);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to recover from error', details: error });
  }
});

// POST /api/error-recovery/define-recovery-strategy
router.post('/define-recovery-strategy', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, description' });
    }
    const result = errorRecoveryTools.defineRecoveryStrategy(name, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define recovery strategy', details: error });
  }
});

// POST /api/error-recovery/recovery-report
router.post('/recovery-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = errorRecoveryTools.recoveryReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate recovery report', details: error });
  }
});

// POST /api/error-recovery/run
router.post('/run', async (req, res) => {
  try {
    const result = await errorRecoveryAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error Recovery agent failed', details: error });
  }
});

export default router;
