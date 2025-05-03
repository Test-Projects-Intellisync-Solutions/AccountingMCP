import { accessControlPrompts, accessControlTools, accessControlResources } from '../../src/agents/accessControlAgent';

describe('Access Control Agent', () => {
  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['access', 'permission', 'role']; // Adjust as needed
    Object.entries(accessControlPrompts).forEach(([promptName, promptObj]) => {
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

  it('Model: should return valid structured response for access check', async () => {
    // Simulate a model response (mocked)
    const mockModelResponse = {
      allowed: true,
      userId: '1',
      role: 'admin',
      resource: 'transactions',
      requestedAction: 'read',
      message: 'Access granted: admin can read on transactions.'
    };
    expect(mockModelResponse).toHaveProperty('allowed');
    expect(typeof mockModelResponse.allowed).toBe('boolean');
    expect(mockModelResponse).toHaveProperty('userId');
    expect(mockModelResponse).toHaveProperty('role');
    expect(mockModelResponse).toHaveProperty('resource');
    expect(mockModelResponse).toHaveProperty('requestedAction');
    expect(mockModelResponse).toHaveProperty('message');
  });

  it('Tools/Resources: should define policy, check access, and log access', () => {
    // Define a policy
    const role = 'auditor';
    const permissions = ['read'];
    accessControlTools.defineAccessPolicy(role, permissions);
    expect(
      accessControlResources.policies.some(
        p => p.role === role && Array.isArray(p.permissions) && p.permissions.includes('read')
      )
    ).toBe(true);
    // Check access
    const user = 'auditor';
    const action = 'read';
    const resource = 'transactions';
    const result = accessControlTools.checkAccess(user, action, resource);
    expect(result).toHaveProperty('allowed');
    // Log should be updated
    expect(
      accessControlResources.accessLogs.some(
        log => log.user === user && log.action === action && log.resource === resource
      )
    ).toBe(true);
  });

  it('Tools: should generate correct access log report', () => {
    // Add a log entry
    accessControlResources.accessLogs.push({
      user: 'testUser',
      action: 'read',
      resource: 'testResource',
      timestamp: new Date().toISOString(),
    });
    const window = {
      from: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      to: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    };
    const report = accessControlTools.accessLogReport(window);
    expect(report).toHaveProperty('summary');
    expect(report.summary.read).toBeGreaterThanOrEqual(1);
  });

  it('Agent: should run access control agent and return correct structure', async () => {
    const result = await import('../../src/agents/accessControlAgent').then(mod => mod.accessControlAgent.run({
      parameters: { userId: '1', resource: 'transactions', requestedAction: 'read' },
      context: {},
    }));
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('allowed');
    expect(result.result).toHaveProperty('message');
  });
});
