/**
 * Localization Agent
 * Adapts outputs (reports, recommendations, UI) to the user's locale, language, and currency.
 * Enables multi-language and region-aware support.
 */
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

export type LocalizationRule = {
  locale: string;
  rule: Record<string, any>;
};
export type LocalizationLog = {
  text: string;
  locale: string;
  result: string;
  timestamp: string;
};

// Resources
export const localizationAgentResources: {
  supportedLocales: string[];
  currencyFormats: string[];
  localizationRules: LocalizationRule[];
  localizationLogs: LocalizationLog[];
} = {
  supportedLocales: ["en-US", "fr-FR", "es-ES", "zh-CN"],
  currencyFormats: ["USD", "EUR", "CNY"],
  localizationRules: [
    // Example: { locale: "fr-FR", rule: { date: "DD/MM/YYYY", currency: "EUR" } }
  ],
  localizationLogs: [
    // Example: { text: "Invoice", locale: "fr-FR", result: "Facture", timestamp: "2025-04-22T16:00:00Z" }
  ]
};

// Tools
export const localizationAgentTools = {
  localizeText: async (text: string, locale: string) => {
    // Use OpenAI LLM for translation/localization
    let result = `[${locale}] ${text}`;
    try {
      const prompt = `Translate and localize the following text to locale '${locale}'.\n\nText: ${text}`;
      result = await callOpenAI(prompt);
    } catch (error) {
      // fallback to template localization
      result = `[${locale}] ${text}`;
    }
    localizationAgentResources.localizationLogs.push({
      text,
      locale,
      result,
      timestamp: new Date().toISOString(),
    });
    return { localized: result, message: `Localization complete. Localize operation performed for locale: ${locale}.` };
  },
  defineLocalizationRule: (rule: LocalizationRule) => {
    // In-memory rule definition; in production, store in DB
    const idx = localizationAgentResources.localizationRules.findIndex(r => r.locale === rule.locale);
    if (idx !== -1) {
      localizationAgentResources.localizationRules[idx] = rule;
    } else {
      localizationAgentResources.localizationRules.push(rule);
    }
    return { success: true };
  },
  localizationReport: (window: { from: string; to: string }) => {
    // Summarize logs in window
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = localizationAgentResources.localizationLogs.filter(l => {
      const ts = new Date(l.timestamp);
      return ts >= from && ts <= to;
    });
    return { summary: logs };
  },
};

// Prompts
export const localizationAgentPrompts = {
  localizeInvoice: {
    messages: [
      { role: "user", content: { type: "text", text: "Localize this invoice for France." } }
    ]
  },
  addRule: {
    messages: [
      { role: "user", content: { type: "text", text: "Add a rule to localize date formatting in Japan for invoices. Ensure the invoice date format is correct." } }
    ]
  },
  showErrors: {
    messages: [
      { role: "user", content: { type: "text", text: "Show all localization errors in <month>. Please localize all relevant fields and ensure localization is correct." } }
    ]
  },
  summarizeRequests: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize and localize localization requests by locale." } }
    ]
  }
};

// Agent
export const localizationAgent: Tool = {
  name: "localization-agent",
  description: "Adapts outputs to user’s locale, language, and currency.",
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * LOCALIZATION AGENT BUSINESS LOGIC
     * - In production, replace in-memory localization with DB/Vector DB-powered translations.
     */
    const { action, text, locale, rule, window } = parameters || {};
    switch (action) {
      case "localizeText":
        return { success: true, result: localizationAgentTools.localizeText(text, locale) };
      case "defineRule":
        return { success: true, result: localizationAgentTools.defineLocalizationRule(rule) };
      case "report":
        return { success: true, result: localizationAgentTools.localizationReport(window) };
      default:
        return {
          success: false,
          result: { message: "Unknown or missing action. Supported: localizeText, defineRule, report. Please specify a localization (localize) action." }
        };
    }
  }
};
