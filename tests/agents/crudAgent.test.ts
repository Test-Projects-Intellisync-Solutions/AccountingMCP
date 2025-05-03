import { crudAgentPrompts, crudAgentTools } from '../../src/agents/crudAgent';

describe('CRUD Agent', () => {
  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['create', 'update', 'delete']; // Adjust as needed
    Object.entries(crudAgentPrompts).forEach(([promptName, promptObj]) => {
      expect(promptObj).toBeDefined();
      // Extract all prompt text from nested messages
      const allTexts = (promptObj.messages || [])
        .map((msg: any) => msg.content?.text)
        .filter(Boolean)
        .join(' ');
      requiredKeywords.forEach(keyword => {
        expect(allTexts).toEqual(expect.stringContaining(keyword));
      });
    });
  });

  it('Tools: should have CRUD tools', () => {
    expect(crudAgentTools.createRecord).toBeDefined();
    expect(crudAgentTools.updateRecord).toBeDefined();
    expect(crudAgentTools.deleteRecord).toBeDefined();
    expect(crudAgentTools.recordChangeReport).toBeDefined();
    if (crudAgentPrompts.showDeletions) {
      expect(crudAgentPrompts.showDeletions).toBeDefined();
    }
  });

  it('Tools: should create, update, and delete a record', async () => {
    const record = { id: 'rec1', type: 'invoice', value: 100 };
    const created = await crudAgentTools.createRecord('invoice', record);
    expect(created).toHaveProperty('created');
    const updated = await crudAgentTools.updateRecord('rec1', { value: 200 });
    expect(updated).toHaveProperty('updated');
    const deleted = await crudAgentTools.deleteRecord('rec1');
    expect(deleted).toHaveProperty('success');
  });

  it('Tools: should generate correct record change report', () => {
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = crudAgentTools.recordChangeReport(window);
    expect(report).toBeDefined();
  });

  it('Agent: should run CRUD agent and return correct structure', async () => {
    const result = await import('../../src/agents/crudAgent').then(mod => mod.crudAgent.run({
      parameters: { action: 'create', record: { id: 'rec2', type: 'invoice', value: 300 } },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });
});
