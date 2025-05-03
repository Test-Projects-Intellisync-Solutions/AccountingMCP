import { Router } from 'express';
import { statementValidatorAgent } from '../agents/statementValidatorAgent';

const router = Router();

// POST /api/validator/validate
router.post('/validate', async (req, res) => {
  const { rule, file, content } = req.body;
  try {
    const result = await statementValidatorAgent.run({ parameters: { action: 'validate', rule, file, content }, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Validation failed', details: error });
  }
});

// GET /api/validator/report
router.get('/report', async (req, res) => {
  const { from, to } = req.query;
  try {
    const result = await statementValidatorAgent.run({ parameters: { action: 'report', window: { from, to } }, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Report generation failed', details: error });
  }
});

export default router;
