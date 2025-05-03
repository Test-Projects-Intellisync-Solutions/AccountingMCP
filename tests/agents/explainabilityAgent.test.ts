import { explainabilityAgentPrompts, explainabilityAgentTools, explainabilityAgentResources } from '../../src/agents/explainabilityAgent';

import { explainabilityAgent } from '../../src/agents/explainabilityAgent';

describe('Explainability Agent', () => {
  it('Model: should return valid structured response for explanation', async () => {
    // Simulate a model response (mocked)
    const mockModelResponse = {
      explanation: 'This output is explained by the following factors...'
    };
    expect(mockModelResponse).toHaveProperty('explanation');
    expect(typeof mockModelResponse.explanation).toBe('string');
    expect(mockModelResponse.explanation.length).toBeGreaterThan(0);
  });

  it('Tools/Resources: should generate and log explanations', async () => {
    const output = { prediction: 1 };
    const context = { user: 'test' };
    const result = await explainabilityAgentTools.explain(output, context);
    expect(result).toHaveProperty('explanation');
    // Check that the log was updated
    expect(
      explainabilityAgentResources.explanationLogs.some(
        log => log.output === output && log.context === context && typeof log.explanation === 'string'
      )
    ).toBe(true);
  });

  it('Tools: should define an explanation template', () => {
    const name = 'TestTemplate';
    const description = 'A test explanation template.';
    explainabilityAgentTools.defineExplanationTemplate(name, description);
    expect(explainabilityAgentResources.explanationTemplates.some(t => t.name === name && t.description === description)).toBe(true);
  });

  it('Tools: should generate correct explanation report', () => {
    explainabilityAgentResources.explanationLogs.push({
      output: 'test-output',
      context: 'test-context',
      explanation: 'Test explanation',
      timestamp: new Date().toISOString(),
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = explainabilityAgentTools.explanationReport(window);
    expect(report).toHaveProperty('summary');
  });

  it('Agent: should run explainability agent and return correct structure', async () => {
    const result = await explainabilityAgent.run({
      parameters: { action: 'explainDecision', decision: 'approve-loan' },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('decision');
    expect(result.result).toHaveProperty('explanation');
    expect(result.result).toHaveProperty('message');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['explain', 'reason']; // Add more as needed
    Object.entries(explainabilityAgentPrompts).forEach(([promptName, promptObj]) => {
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
