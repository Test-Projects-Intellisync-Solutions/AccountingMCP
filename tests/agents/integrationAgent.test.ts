import { integrationAgentPrompts, integrationAgent } from '../../src/agents/integrationAgent';

describe('Integration Agent', () => {
  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['connect', 'integration']; // Add more as needed
    Object.entries(integrationAgentPrompts).forEach(([promptName, promptObj]) => {
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

  it('Agent: should run integration agent and return correct structure', async () => {
    const result = await integrationAgent.run({
      parameters: { action: 'connect', service: 'TestService', credentials: {} },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });
});
