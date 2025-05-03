import { dataQualityAgentResources, dataQualityAgentTools, dataQualityPrompts } from '../../src/agents/dataQualityAgent';

describe('Data Quality Agent', () => {
  it('Resources: should store and retrieve quality rules', () => {
    dataQualityAgentTools.defineQualityRule('no-missing', 'No missing values');
    const rule = dataQualityAgentResources.qualityRules.find(r => r.name === 'no-missing');
    expect(rule).toBeDefined();
    expect(rule.description).toBe('No missing values');
  });

  it('Tools: should run a quality check and log results', () => {
    dataQualityAgentTools.runQualityCheck('no-missing', [{a: 1}, {a: null}]);
    expect(dataQualityAgentResources.qualityLogs.length).toBeGreaterThan(0);
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['quality', 'check', 'rule', 'anomaly', 'summarize'];
    Object.entries(dataQualityPrompts).forEach(([promptName, promptObj]) => {
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

  it('Tools: should generate correct quality report', () => {
    dataQualityAgentResources.qualityLogs.push({
      rule: 'no-missing',
      passed: true,
      checkedAt: new Date().toISOString(),
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = dataQualityAgentTools.qualityReport(window);
    expect(report).toHaveProperty('summary');
    expect(report.summary['no-missing'].passed).toBeGreaterThanOrEqual(1);
  });

  it('Tools: should generate anomaly report', async () => {
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const result = await dataQualityAgentTools.anomalyReport(window);
    expect(result).toHaveProperty('anomalies');
  });

  it('Agent: should run data quality agent and return correct structure', async () => {
    const result = await import('../../src/agents/dataQualityAgent').then(mod => mod.dataQualityAgent.run({
      parameters: { action: 'runCheck', rule: 'no-missing', data: { a: 1, b: null } },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });
});
