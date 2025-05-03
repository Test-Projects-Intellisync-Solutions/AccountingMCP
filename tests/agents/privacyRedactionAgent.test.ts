import { privacyRedactionAgentTools, privacyRedactionAgentPrompts, privacyRedactionAgent } from '../../src/agents/privacyRedactionAgent';

describe('Privacy Redaction Agent', () => {
  it('Tools: should redact sensitive info', () => {
    const result = privacyRedactionAgentTools.redact('sin', 'file.pdf', { originalValue: '493-456-982', redactedValue: '' });
    expect(result).toBeDefined();
  });

  it('Agent: should run privacy redaction agent and return correct structure', async () => {
    const result = await privacyRedactionAgent.run({
      parameters: { action: 'redact', pattern: 'sin', file: 'file.pdf', content: { originalValue: '493-456-982', redactedValue: '***-***-982' } },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['redact', 'sin']; // Add more as needed
    Object.entries(privacyRedactionAgentPrompts).forEach(([promptName, promptObj]) => {
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
