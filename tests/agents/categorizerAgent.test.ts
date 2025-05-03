import { categorizerTools, categorizerPrompts, categorizerResources } from '../../src/agents/categorizerAgent';

describe('Categorizer Agent', () => {
  it('Tools: should categorize transactions', () => {
    const result = categorizerTools.categorizeItem(
      "Invoice 001",
      "Office Supplies"
    );
    expect(result).toBeDefined();
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['category', 'assign', 'define', 'summary', 'explain']; // Adjust as needed
    Object.entries(categorizerPrompts).forEach(([promptName, promptObj]) => {
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

  it('Tools: should define a category', () => {
    const name = 'TestCategory';
    const rules = ['test'];
    categorizerTools.defineCategory(name, rules);
    expect(categorizerTools).toBeDefined();
  });

  it('Tools: should generate correct categorization report', () => {
    categorizerResources.categorizationHistory.push({
      item: 'Invoice 002',
      category: 'TestCategory',
      runAt: new Date().toISOString()
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = categorizerTools.categorizationReport(window);
    expect(report).toHaveProperty('summary');
    expect(report.summary.TestCategory).toBeGreaterThanOrEqual(1);
  });

  it('Agent: should run categorizer agent and return correct structure', async () => {
    const result = await import('../../src/agents/categorizerAgent').then(mod => mod.categorizeTransactions.run({
      parameters: { transaction: { description: 'Coffee at Starbucks' } },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('transaction');
    expect(result.result).toHaveProperty('assignedCategory');
    expect(result.result).toHaveProperty('message');
  });
});
