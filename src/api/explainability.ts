import { Router, Request, Response } from 'express';
import { explainabilityAgent, explainabilityAgentTools } from '../agents/explainabilityAgent';
const router = Router();

// POST /api/explainability/explain
router.post('/explain', async (req: Request, res: Response) => {
  try {
    const { output, context } = req.body;
    if (!output || !context) {
      return res.status(400).json({ success: false, error: 'Missing required fields: output, context' });
    }
    const result = await explainabilityAgentTools.explain(output, context);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate explanation', details: error });
  }
});

// POST /api/explainability/define-explanation-template
router.post('/define-explanation-template', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, description' });
    }
    const result = explainabilityAgentTools.defineExplanationTemplate(name, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define explanation template', details: error });
  }
});

// POST /api/explainability/explanation-report
router.post('/explanation-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = explainabilityAgentTools.explanationReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate explanation report', details: error });
  }
});

// POST /api/explainability/run
router.post('/run', async (req, res) => {
  try {
    const result = await explainabilityAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Explainability agent failed', details: error });
  }
});

export default router;
