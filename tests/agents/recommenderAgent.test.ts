import { recommenderAgentTools, recommenderResources, recommenderAgentPrompts, recommenderAgent } from '../../src/agents/recommenderAgent';

describe('Recommender Agent', () => {
  it('Tools: should generate a recommendation', async () => {
    const result = await recommenderAgentTools.recommend('save-cost', 'user', {});
    expect(result).toBeDefined();
  });

  it('Resources: should log recommendations', async () => {
    await recommenderAgentTools.recommend('save-cost', 'user', {});
    expect(recommenderResources.recommendationLogs.length).toBeGreaterThan(0);
  });

  it('Agent: should run recommender agent and return correct structure', async () => {
    const result = await recommenderAgent.run({
      parameters: { action: 'recommend', type: 'save-cost', user: 'user', data: {} },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['recommend', 'tip', 'save'];
    Object.entries(recommenderAgentPrompts).forEach(([promptName, promptObj]) => {
      expect(promptObj).toHaveProperty('messages');
      expect(Array.isArray(promptObj.messages)).toBe(true);
      expect(promptObj.messages.length).toBeGreaterThan(0);
      promptObj.messages.forEach((msg: any) => {
        expect(msg).toHaveProperty('content');
        expect(msg.content).toHaveProperty('text');
        requiredKeywords.forEach(keyword => {
          expect(msg.content.text.toLowerCase()).toContain(keyword);
        });
      });
    });
  });
    expect(recommenderAgentPrompts.generateSavingsTip).toBeDefined();
  });
