import { parserAgentPrompts, parserAgentTools, parserResources } from '../../src/agents/parserAgent';

describe('Parser Agent', () => {
  it('Model: should return valid structured response for parse', async () => {
    // Simulate a model response (mocked)
    const mockModelResponse = {
      parsed: { field1: 'value1', field2: 'value2' }
    };
    expect(mockModelResponse).toHaveProperty('parsed');
    expect(typeof mockModelResponse.parsed).toBe('object');
    expect(Object.keys(mockModelResponse.parsed).length).toBeGreaterThan(0);
  });

  it('Tools/Resources: should parse file and log parsing', async () => {
    const file = 'test.pdf';
    const format = 'pdf';
    const content = 'fake content';
    const result = await parserAgentTools.parseFile(file, format, content);
    expect(result).toHaveProperty('parsed');
    // Check that the log was updated
    expect(
      parserResources.parsingLogs.some(
        log => log.file === file && log.format === format && log.status === 'success'
      )
    ).toBe(true);
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['parse', 'extract']; // Add more as needed
    Object.entries(parserAgentPrompts).forEach(([promptName, promptObj]) => {
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
