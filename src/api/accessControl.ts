import { Router, Request, Response } from 'express';
import { accessControlAgent, accessControlTools } from '../agents/accessControlAgent';
const router = Router();

// POST /api/access-control/check-access
router.post('/check-access', (req: Request, res: Response) => {
  try {
    const { user, action, resource } = req.body;
    if (!user || !action || !resource) {
      return res.status(400).json({ success: false, error: 'Missing required fields: user, action, resource' });
    }
    const result = accessControlTools.checkAccess(user, action, resource);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to check access', details: error });
  }
});

// POST /api/access-control/define-policy
router.post('/define-policy', (req: Request, res: Response) => {
  try {
    const { role, permissions } = req.body;
    if (!role || !permissions) {
      return res.status(400).json({ success: false, error: 'Missing required fields: role, permissions' });
    }
    const result = accessControlTools.defineAccessPolicy(role, permissions);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define policy', details: error });
  }
});

// POST /api/access-control/access-log-report
router.post('/access-log-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = accessControlTools.accessLogReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate access log report', details: error });
  }
});

// POST /api/access-control/run
router.post('/run', async (req, res) => {
  try {
    const result = await accessControlAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Access Control agent failed', details: error });
  }
});

export default router;
