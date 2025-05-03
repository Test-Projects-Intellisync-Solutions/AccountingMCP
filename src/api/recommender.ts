import { Router } from 'express';
import { recommenderAgent } from '../agents/recommenderAgent';
const router = Router();

// POST /api/recommender/run
router.post('/run', async (req, res) => {
  try {
    const result = await recommenderAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Recommender agent failed', details: error });
  }
});

export default router;
