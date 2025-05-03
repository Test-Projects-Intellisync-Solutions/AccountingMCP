import { Router, Request, Response } from 'express';
import { crudAgent, crudAgentTools } from '../agents/crudAgent';
const router = Router();

// POST /api/crud/create-record
router.post('/create-record', async (req: Request, res: Response) => {
  try {
    const { type, record } = req.body;
    if (!type || !record) {
      return res.status(400).json({ success: false, error: 'Missing required fields: type, record' });
    }
    const result = await crudAgentTools.createRecord(type, record);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create record', details: error });
  }
});

// POST /api/crud/update-record
router.post('/update-record', async (req: Request, res: Response) => {
  try {
    const { recordId, changes } = req.body;
    if (!recordId || !changes) {
      return res.status(400).json({ success: false, error: 'Missing required fields: recordId, changes' });
    }
    const result = await crudAgentTools.updateRecord(recordId, changes);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update record', details: error });
  }
});

// POST /api/crud/delete-record
router.post('/delete-record', async (req: Request, res: Response) => {
  try {
    const { recordId, options } = req.body;
    if (!recordId) {
      return res.status(400).json({ success: false, error: 'Missing required field: recordId' });
    }
    const result = await crudAgentTools.deleteRecord(recordId, options);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete record', details: error });
  }
});

// POST /api/crud/record-change-report
router.post('/record-change-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = crudAgentTools.recordChangeReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate record change report', details: error });
  }
});

// POST /api/crud/run
router.post('/run', async (req, res) => {
  try {
    const result = await crudAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'CRUD agent failed', details: error });
  }
});

export default router;
