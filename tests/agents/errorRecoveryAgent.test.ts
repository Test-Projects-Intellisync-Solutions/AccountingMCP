import { errorRecoveryTools, errorRecoveryResources, errorRecoveryAgentPrompts } from '../../src/agents/errorRecoveryAgent';

describe('Error Recovery Agent', () => {
  it('Tools: should attempt recovery', async () => {
    const result = await errorRecoveryTools.recover('test-error', {});
    expect(result).toBeDefined();
  });

  it('Resources: should log recovery actions', async () => {
    await errorRecoveryTools.recover('test-error', {});
    expect(errorRecoveryResources.recoveryLogs.length).toBeGreaterThan(0);
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['recover', 'strategy', 'failure', 'error'];
    Object.entries(errorRecoveryAgentPrompts).forEach(([promptName, promptObj]) => {
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

  it('Tools: should define a recovery strategy', () => {
    const name = 'TestStrategy';
    const description = 'A test recovery strategy.';
    errorRecoveryTools.defineRecoveryStrategy(name, description);
    expect(errorRecoveryResources.recoveryStrategies.some(s => s.name === name && s.description === description)).toBe(true);
  });

  it('Tools: should generate correct recovery report', () => {
    errorRecoveryResources.recoveryLogs.push({
      error: 'test-error',
      context: {},
      action: 'auto-retry',
      suggestion: 'Try again',
      timestamp: new Date().toISOString(),
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = errorRecoveryTools.recoveryReport(window);
    expect(report).toHaveProperty('summary');
    expect(report.summary['auto-retry'].count).toBeGreaterThanOrEqual(1);
  });

  it('Agent: should run error recovery agent and return correct structure', async () => {
    const result = await import('../../src/agents/errorRecoveryAgent').then(mod => mod.errorRecoveryAgent.run({
      parameters: { error: 'test-error', attemptedAction: 'retry' },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('error');
    expect(result.result).toHaveProperty('attemptedAction');
    expect(result.result).toHaveProperty('recovered');
    expect(result.result).toHaveProperty('message');
  });
});
