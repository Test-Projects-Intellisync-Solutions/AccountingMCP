import { summarizationAgentTools, summarizationAgentPrompts, summarizationAgent } from '../../src/agents/summarizationAgent';

describe('Summarization Agent', () => {
  it('Tools: should summarize text', () => {
    const result = summarizationAgentTools.summarize('basic', 'file.txt', 'Long text here');
    expect(result).toBeDefined();
  });

  it('Agent: should run summarization agent and return correct structure', async () => {
    const result = await summarizationAgent.run({
      parameters: { action: 'summarize', type: 'basic', file: 'file.txt', content: 'Long text here' },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['summarize', 'summary', 'meeting'];
    Object.entries(summarizationAgentPrompts).forEach(([promptName, promptObj]) => {
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
    expect(summarizationAgentPrompts.summarizeMeeting).toBeDefined();
  });
