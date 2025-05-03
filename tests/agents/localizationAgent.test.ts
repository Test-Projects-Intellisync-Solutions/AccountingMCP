import { localizationAgentTools, localizationAgentPrompts, localizationAgentResources, localizationAgent } from '../../src/agents/localizationAgent';

describe('Localization Agent', () => {
  it('Tools: should localize text', () => {
    const result = localizationAgentTools.localizeText('Hello', 'fr-FR');
    expect(result).toBeDefined();
  });

  it('Prompts: all agent prompts should include required variables and structure', () => {
    const requiredKeywords = ['localize', 'invoice']; // Add more as needed
    Object.entries(localizationAgentPrompts).forEach(([promptName, promptObj]) => {
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

  it('Tools: should define a locale', () => {
    const rule = {
      name: 'TestLocale',
      locale: 'fr-FR',
      rule: { region: 'TestRegion' },
      config: { region: 'TestRegion' }
    };
    localizationAgentTools.defineLocalizationRule(rule);
    expect(localizationAgentResources.localizationRules.some(rule => rule.locale === 'fr-FR')).toBe(true);
  });

  it('Agent: should run localization agent and return correct structure', async () => {
    const result = await localizationAgent.run({
      parameters: { action: 'localize', text: 'Hello', locale: 'fr-FR' },
      context: {},
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('result');
  });
});
