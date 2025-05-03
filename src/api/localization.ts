import { Router, Request, Response } from 'express';
import { localizationAgent, localizationAgentTools } from '../agents/localizationAgent';
const router = Router();

// POST /api/localization/translate
router.post('/translate', (req: Request, res: Response) => {
  try {
    const { text, targetLocale } = req.body;
    if (!text || !targetLocale) {
      return res.status(400).json({ success: false, error: 'Missing required fields: text, targetLocale' });
    }
    localizationAgentTools.localizeText(text, targetLocale).then(result => {
      res.json({ success: true, result });
    }).catch(error => {
      res.status(500).json({ success: false, error: 'Failed to translate', details: error });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to translate', details: error });
  }
});

// POST /api/localization/define-locale
router.post('/define-locale', (req: Request, res: Response) => {
  try {
    const { locale, config } = req.body;
    if (!locale || !config) {
      return res.status(400).json({ success: false, error: 'Missing required fields: locale, config' });
    }
    const result = localizationAgentTools.defineLocalizationRule({ locale, ...config });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define locale', details: error });
  }
});

// POST /api/localization/report
router.post('/report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = localizationAgentTools.localizationReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate localization report', details: error });
  }
});

// POST /api/localization/run
router.post('/run', async (req: Request, res: Response) => {
  try {
    const result = await localizationAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Localization agent failed', details: error });
  }
});

export default router;
