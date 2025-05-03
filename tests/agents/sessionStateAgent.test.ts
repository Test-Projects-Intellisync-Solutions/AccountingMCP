import { sessionStateTools, sessionStateAgentPrompts, sessionStateAgent } from '../../src/agents/sessionStateAgent';

describe('Session State Agent', () => {
  it('Tools: should update session state', () => {
    const result = sessionStateTools.getSessionState('session1');
    expect(result).toBeDefined();
  });

  it('Agent: should run session state agent and return correct structure', async () => {
    const result = await sessionStateAgent.run({
      parameters: { action: 'getSessionState', sessionId: 'session1' },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['session']; // Add more as needed
    Object.entries(sessionStateAgentPrompts).forEach(([promptName, promptObj]) => {
      expect(promptObj).toHaveProperty('messages');
      expect(Array.isArray(promptObj.messages)).toBe(true);
      expect(promptObj.messages.length).toBeGreaterThan(0);
      promptObj.messages.forEach((msg: any) => {
        expect(msg).toHaveProperty('content');
        expect(msg.content).toHaveProperty('text');
        requiredKeywords.forEach(keyword => {
          expect(msg.content.text).toContain(keyword);
        });
      });
    });
  });
});
