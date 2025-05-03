import { userFeedbackAgentTools, userFeedbackAgentPrompts, userFeedbackAgent } from '../../src/agents/userFeedbackAgent';

describe('User Feedback Agent', () => {
  it('Tools: should submit feedback', () => {
    const result = userFeedbackAgentTools.submitFeedback('Great!', 'user1');
    expect(result).toBeDefined();
  });
  

  it('Agent: should run user feedback agent and return correct structure', async () => {
    const result = await userFeedbackAgent.run({
      parameters: { action: 'submitFeedback', feedback: 'Great!', user: 'user1' },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['feedback', 'dashboard'];
    Object.entries(userFeedbackAgentPrompts).forEach(([promptName, promptObj]) => {
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
