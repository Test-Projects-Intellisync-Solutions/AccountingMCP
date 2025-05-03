import { Router, Request, Response } from 'express';
import { notificationAgent, notificationAgentTools } from '../agents/notificationAgent';
const router = Router();

// POST /api/notification/send
router.post('/send', (req: Request, res: Response) => {
  try {
    const { recipient, message, channel } = req.body;
    if (!recipient || !message || !channel) {
      return res.status(400).json({ success: false, error: 'Missing required fields: recipient, message, channel' });
    }
    const event = { channel, message };
    const result = notificationAgentTools.sendNotification(event, recipient);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send notification', details: error });
  }
});

// POST /api/notification/define-channel
router.post('/define-channel', (req: Request, res: Response) => {
  try {
    const { channel, config } = req.body;
    if (!channel || !config) {
      return res.status(400).json({ success: false, error: 'Missing required fields: channel, config' });
    }
    const result = notificationAgentTools.defineNotificationTemplate(channel, config.template);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define channel', details: error });
  }
});

// POST /api/notification/report
router.post('/report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = notificationAgentTools.notificationReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate notification report', details: error });
  }
});

// POST /api/notification/run
router.post('/run', async (req: Request, res: Response) => {
  try {
    const result = await notificationAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Notification agent failed', details: error });
  }
});

export default router;
