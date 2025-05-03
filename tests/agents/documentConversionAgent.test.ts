import { documentConversionTools, documentConversionPrompts, documentConversionResources } from '../../src/agents/documentConversionAgent';

describe('Document Conversion Agent', () => {
  it('Tools: should convert document format', () => {
    const result = documentConversionTools.runConversion(
      "PDF to CSV",
      "file.pdf"
    );
    expect(result).toBeDefined();
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['convert', 'template', 'summarize', 'failure', 'document'];
    Object.entries(documentConversionPrompts).forEach(([promptName, promptObj]) => {
      expect(promptObj).toBeDefined();
      const allTexts = (promptObj.messages || [])
        .map((msg: any) => msg.content?.text)
        .filter(Boolean)
        .join(' ');
      requiredKeywords.forEach(keyword => {
        expect(allTexts).toEqual(expect.stringContaining(keyword));
      });
    });
  });

  it('Tools: should define a conversion template', () => {
    const name = 'TestTemplate';
    const description = 'A test conversion template.';
    documentConversionTools.defineConversionTemplate(name, description);
    expect(documentConversionResources.conversionTemplates.some(t => t.name === name && t.description === description)).toBe(true);
  });

  it('Tools: should generate correct conversion report', () => {
    documentConversionResources.conversionLogs.push({
      template: 'TestTemplate',
      status: 'success',
      runAt: new Date().toISOString(),
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = documentConversionTools.conversionReport(window);
    expect(report).toHaveProperty('summary');
    expect(report.summary.TestTemplate.success).toBeGreaterThanOrEqual(1);
  });

  it('Agent: should run document conversion agent and return correct structure', async () => {
    const result = await import('../../src/agents/documentConversionAgent').then(mod => mod.documentConversionAgent.run({
      parameters: { input: 'file.pdf', targetFormat: 'csv' },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('input');
    expect(result.result).toHaveProperty('targetFormat');
    expect(result.result).toHaveProperty('converted');
    expect(result.result).toHaveProperty('message');
  });
});
