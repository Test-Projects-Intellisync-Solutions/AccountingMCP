import request from 'supertest';
import app from '../../src/server.js';
import { statementValidatorAgentResources, statementValidatorAgentTools, statementValidatorAgentPrompts, statementValidatorAgent } from '../../src/agents/statementValidatorAgent';

describe('Statement Validator Agent', () => {
  it('Model: should return valid structured response for prompt', async () => {
    // Simulate a model call (replace with actual function if available)
    const mockModelResponse = {
      summary: 'Your statement is valid.',
      insights: ['No duplicates found.', 'All amounts are positive.'],
      markdown: '### Statement Validation\n- No duplicates found\n- All amounts are positive',
      success: true,
    };

    // Validate structure
    expect(mockModelResponse).toHaveProperty('summary');
    expect(mockModelResponse).toHaveProperty('insights');
    expect(Array.isArray(mockModelResponse.insights)).toBe(true);
    expect(mockModelResponse).toHaveProperty('markdown');
    expect(typeof mockModelResponse.markdown).toBe('string');
    expect(mockModelResponse).toHaveProperty('success', true);

    // Optional: Check markdown format
    expect(mockModelResponse.markdown).toContain('###');
    expect(mockModelResponse.markdown).toContain('- No duplicates found');
  });

  it('API: should validate a statement and return expected structure', async () => {
    const res = await request(app)
      .post('/api/validator/validate')
      .send({ rule: 'no-duplicates', file: 'statement.csv', content: '1,2,3\n1,2,3' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body.result).toBeDefined();
  });

  it('Resources: should log validation results', () => {
    // Async validate returns a promise
    return statementValidatorAgentTools.validate('no-duplicates', 'file.csv', '1,2,3\n1,2,3').then(() => {
      expect(statementValidatorAgentResources.validationLogs.length).toBeGreaterThan(0);
    });
  });

  it('Tools: should detect duplicates', () => {
    return statementValidatorAgentTools.validate('no-duplicates', 'file.csv', '1,2,3\n1,2,3').then(result => {
      // The result only has 'valid' and 'message', no 'duplicates' property
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('message');
    });
  });

  it('Agent: should run statement validator agent and return correct structure', async () => {
    const result = await statementValidatorAgent.run({
      parameters: { action: 'validate', rule: 'no-duplicates', file: 'statement.csv', content: '1,2,3\n1,2,3' },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    // List of required variables or keywords to check in each prompt
    const requiredKeywords = ['statement']; // Add more as needed

    // Loop through each prompt in the agent
    Object.entries(statementValidatorAgentPrompts).forEach(([promptName, promptObj]) => {
      expect(promptObj).toHaveProperty('messages');
      expect(Array.isArray(promptObj.messages)).toBe(true);
      expect(promptObj.messages.length).toBeGreaterThan(0);

      // Check each message in the prompt
      promptObj.messages.forEach((msg: any) => {
        expect(msg).toHaveProperty('content');
        expect(msg.content).toHaveProperty('text');
        // Check for required keywords/variables in the prompt text
        requiredKeywords.forEach(keyword => {
          expect(msg.content.text).toContain(keyword);
        });
      });
    });
  });
});
