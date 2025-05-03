import { Router } from 'express';
import { privacyRedactionAgent } from '../agents/privacyRedactionAgent';
const router = Router();

// POST /api/privacy-redaction/run
router.post('/run', async (req, res) => {
  try {
    const result = await privacyRedactionAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Privacy Redaction agent failed', details: error });
  }
});

export default router;
