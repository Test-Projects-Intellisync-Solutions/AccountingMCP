import { Router, Request, Response } from 'express';
import { documentConversionAgent, documentConversionTools } from '../agents/documentConversionAgent';
const router = Router();

// POST /api/document-conversion/run-conversion
router.post('/run-conversion', (req: Request, res: Response) => {
  try {
    const { template, input } = req.body;
    if (!template || !input) {
      return res.status(400).json({ success: false, error: 'Missing required fields: template, input' });
    }
    const result = documentConversionTools.runConversion(template, input);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to run conversion', details: error });
  }
});

// POST /api/document-conversion/define-conversion-template
router.post('/define-conversion-template', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, description' });
    }
    const result = documentConversionTools.defineConversionTemplate(name, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define conversion template', details: error });
  }
});

// POST /api/document-conversion/conversion-report
router.post('/conversion-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = documentConversionTools.conversionReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate conversion report', details: error });
  }
});

// POST /api/document-conversion/run
router.post('/run', async (req, res) => {
  try {
    const result = await documentConversionAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Document Conversion agent failed', details: error });
  }
});

export default router;
