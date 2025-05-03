import { analyzerTools, analyzerResources, analyzerPrompts } from '../../src/agents/analyzerAgent';

describe('Analyzer Agent', () => {
  beforeEach(() => {
    analyzerResources.analysisTemplates.push({ name: "trend", template: "Some template" });
    analyzerResources.analysisHistory.length = 0;
  });

  it('Tools: should run analysis', () => {
    const result = analyzerTools.runAnalysis('trend', [1,2,3]);
    expect(result).toBeDefined();
  });

  it('Resources: should store analysis history', async () => {
    await analyzerTools.runAnalysis('trend', [1,2,3]);
    expect(analyzerResources.analysisHistory.length).toBeGreaterThan(0);
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['analysis', 'metric', 'forecast', 'summary']; // Adjust as needed
    Object.entries(analyzerPrompts).forEach(([promptName, promptObj]) => {
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

  it('Tools: should define a metric', () => {
    const name = 'TestMetric';
    const formula = 'a + b';
    analyzerTools.defineMetric(name, formula);
    expect(analyzerResources.metricsCatalog.some(m => m.name === name && m.formula === formula)).toBe(true);
  });

  it('Tools: should simulate a forecast', () => {
    const scenario = { nextQuarter: true };
    const result = analyzerTools.simulateForecast(scenario);
    expect(result).toHaveProperty('forecast');
  });

  it('Tools: should generate correct analysis report', () => {
    analyzerResources.analysisHistory.push({
      template: 'trend',
      result: {},
      runAt: new Date().toISOString()
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = analyzerTools.analysisReport(window);
    expect(report).toHaveProperty('summary');
    expect(report.summary.count).toBeGreaterThanOrEqual(1);
  });

  it('Agent: should run analyzer agent and return correct structure', async () => {
    const result = await import('../../src/agents/analyzerAgent').then(mod => mod.analyzerAgent.run({
      parameters: { reportType: 'Monthly Summary', data: [{ amount: 100 }, { amount: 200 }] },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('reportType');
    expect(result.result).toHaveProperty('total');
    expect(result.result).toHaveProperty('message');
  });
});
