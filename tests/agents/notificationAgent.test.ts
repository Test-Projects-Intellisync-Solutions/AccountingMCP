import { notificationAgentPrompts, notificationAgent } from '../../src/agents/notificationAgent';

describe('Notification Agent', () => {
  it('Agent: should run notification agent and return correct structure', async () => {
    const result = await notificationAgent.run({
      parameters: { action: 'notify', type: 'alert', message: 'Test alert' },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['alert', 'notification']; // Add more as needed
    Object.entries(notificationAgentPrompts).forEach(([promptName, promptObj]) => {
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
});
