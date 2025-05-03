import { Router, Request, Response } from 'express';
import { categorizeTransactions, categorizerTools } from '../agents/categorizerAgent';
const router = Router();

// POST /api/categorizer/categorize-item
router.post('/categorize-item', (req: Request, res: Response) => {
  try {
    const { item, text } = req.body;
    if (!item || !text) {
      return res.status(400).json({ success: false, error: 'Missing required fields: item, text' });
    }
    const result = categorizerTools.categorizeItem(item, text);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to categorize item', details: error });
  }
});

// POST /api/categorizer/define-category
router.post('/define-category', (req: Request, res: Response) => {
  try {
    const { name, rules } = req.body;
    if (!name || !rules) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, rules' });
    }
    const result = categorizerTools.defineCategory(name, rules);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define category', details: error });
  }
});

// POST /api/categorizer/categorization-report
router.post('/categorization-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = categorizerTools.categorizationReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate categorization report', details: error });
  }
});

// POST /api/categorizer/override-category
router.post('/override-category', (req: Request, res: Response) => {
  try {
    const { transactionId, newCategory } = req.body;
    if (!transactionId || !newCategory) {
      return res.status(400).json({ success: false, error: 'Missing required fields: transactionId, newCategory' });
    }
    const result = categorizerTools.overrideCategory(transactionId, newCategory);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to override category', details: error });
  }
});

// POST /api/categorizer/run
router.post('/run', async (req, res) => {
  try {
    const result = await categorizeTransactions.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Categorizer agent failed', details: error });
  }
});

export default router;
