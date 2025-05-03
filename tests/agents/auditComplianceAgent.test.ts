import { auditComplianceTools, auditCompliancePrompts, auditComplianceResources } from '../../src/agents/auditComplianceAgent';

describe('Audit Compliance Agent', () => {
  it('Tools: should run audit', () => {
    const result = auditComplianceTools.runAudit(
      "Segregation of Duties",
      { approvedBy: "Alice", executedBy: "Bob" }
    );
    expect(result).toBeDefined();
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['audit', 'exception', 'summary', 'policy']; // Adjust as needed
    Object.entries(auditCompliancePrompts).forEach(([promptName, promptObj]) => {
      expect(promptObj).toBeDefined();
      const allTexts = (promptObj.messages || [])
        .map((msg: any) => msg.content?.text)
        .filter(Boolean)
        .join(' ');
      requiredKeywords.forEach(keyword => {
        expect(allTexts).toEqual(expect.stringContaining(keyword));
      });
    });
  });

  it('Tools: should define an audit rule', () => {
    const name = 'TestRule';
    const description = 'A test audit rule.';
    auditComplianceTools.defineAuditRule(name, description);
    expect(auditComplianceResources.auditRules.some(r => r.name === name && r.description === description)).toBe(true);
  });

  it('Tools: should generate correct audit report', () => {
    auditComplianceResources.auditLogs.push({
      rule: 'TestRule',
      passed: true,
      checkedAt: new Date().toISOString(),
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = auditComplianceTools.auditReport(window);
    expect(report).toHaveProperty('summary');
    expect(report.summary.TestRule.passed).toBeGreaterThanOrEqual(1);
  });

  it('Agent: should run audit compliance agent and return correct structure', async () => {
    const result = await import('../../src/agents/auditComplianceAgent').then(mod => mod.auditComplianceAgent.run({
      parameters: { period: 'Q1', records: [{ approvedBy: 'Alice', executedBy: 'Bob' }] },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('period');
    expect(result.result).toHaveProperty('recordCount');
    expect(result.result).toHaveProperty('message');
  });
});
