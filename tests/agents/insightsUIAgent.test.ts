import { insightsUIAgentTools, insightsUIAgentResources, insightsUIAgentPrompts } from '../../src/agents/insightsUIAgent';

describe('Insights UI Agent', () => {
  it('Tools: should generate dashboard', () => {
    const dashboardConfig = {
      name: "Main Dashboard",
      widgets: []
    };
    const result = insightsUIAgentTools.generateDashboard(dashboardConfig, []);
    expect(result).toBeDefined();
  });

  it('Resources: should manage dashboard configs', () => {
    insightsUIAgentTools.defineWidget('main', { widgets: [] });
    expect(insightsUIAgentResources.dashboardConfigs.length).toBeGreaterThan(0);
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['dashboard', 'widget', 'insight', 'report'];
    Object.entries(insightsUIAgentPrompts).forEach(([promptName, promptObj]) => {
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

  it('Tools: should define a widget', () => {
    const name = 'TestWidget';
    const config = { widgets: [] };
    insightsUIAgentTools.defineWidget(name, config);
    expect(insightsUIAgentResources.dashboardConfigs.some(cfg => cfg.name === name)).toBe(true);
  });

  it('Agent: should run insights UI agent and return correct structure', async () => {
    const result = await import('../../src/agents/insightsUIAgent').then(mod => mod.insightsUIAgent.run({
      parameters: { dashboard: { name: 'Main Dashboard', widgets: [] }, data: [] },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('dashboard');
    expect(result.result).toHaveProperty('message');
  });
});
