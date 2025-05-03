import { Router, Request, Response } from 'express';
import { auditComplianceAgent, auditComplianceTools } from '../agents/auditComplianceAgent';
const router = Router();

// POST /api/audit-compliance/run-audit
router.post('/run-audit', (req: Request, res: Response) => {
  try {
    const { rule, data } = req.body;
    if (!rule || !data) {
      return res.status(400).json({ success: false, error: 'Missing required fields: rule, data' });
    }
    const result = auditComplianceTools.runAudit(rule, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to run audit', details: error });
  }
});

// POST /api/audit-compliance/define-audit-rule
router.post('/define-audit-rule', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, description' });
    }
    const result = auditComplianceTools.defineAuditRule(name, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to define audit rule', details: error });
  }
});

// POST /api/audit-compliance/audit-report
router.post('/audit-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = auditComplianceTools.auditReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate audit report', details: error });
  }
});

// POST /api/audit-compliance/exception-report
router.post('/exception-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = auditComplianceTools.exceptionReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate exception report', details: error });
  }
});

// POST /api/audit-compliance/audit-summary-report
router.post('/audit-summary-report', (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const result = auditComplianceTools.auditSummaryReport({ from, to });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate audit summary report', details: error });
  }
});

// POST /api/audit-compliance/run
router.post('/run', async (req, res) => {
  try {
    const result = await auditComplianceAgent.run({ parameters: req.body, context: {} });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Audit Compliance agent failed', details: error });
  }
});

export default router;
