import { Router } from 'express';

const router = Router();

// POST /api/parser/parse
router.post('/parse', (req, res) => {
  // Placeholder: Implement document parsing logic
  res.json({ message: 'Document parsed (placeholder)' });
});

export default router;
