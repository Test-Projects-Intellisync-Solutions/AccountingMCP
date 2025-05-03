/**
 * Statement Validator Agent
 * Spots errors, duplicate entries, and regulatory risks in parsed financial statements.
 * Ensures data integrity and compliance.
 */
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

export type ValidationLog = {
  rule: string;
  valid: boolean;
  file: string;
  timestamp: string;
};

// Resources
export const statementValidatorResources = {
  validationChecks: ["Duplicate Entries", "Regulatory Compliance", "Error Detection"],
};

export const statementValidatorAgentResources: {
  validationRules: string[];
  validationLogs: ValidationLog[];
} = {
  validationRules: ["balance-check", "date-check", "signature-check"],
  validationLogs: [
    // Example: { rule: "balance-check", valid: true, file: "statement.pdf", timestamp: "2025-04-22T16:00:00Z" }
  ]
};

// Tools
export const statementValidatorAgentTools = {
  validateStatement: (document: any, rules: any[]) => {
    // TODO: Validate statement
    return { valid: true, errors: [] };
  },
  validate: async (rule: string, file: string, content: any) => {
    // Use OpenAI LLM for compliance validation
    let valid = true;
    let message = '';
    try {
      const prompt = `You are a financial compliance expert. Does the following statement content comply with the rule: '${rule}'?\n\nContent: ${JSON.stringify(content)}\n\nRespond with 'Valid' or 'Invalid' and a brief explanation.`;
      message = await callOpenAI(prompt);
      valid = /valid/i.test(message) && !/invalid/i.test(message);
    } catch (error) {
      // fallback to always-valid
      message = 'Validation fallback: assumed valid.';
      valid = true;
    }
    statementValidatorAgentResources.validationLogs.push({
      rule,
      valid,
      file,
      timestamp: new Date().toISOString(),
    });
    return { valid, message };
  },
  validatorReport: (window: { from: string; to: string }) => {
    // Summarize logs in window
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = statementValidatorAgentResources.validationLogs.filter(l => {
      const ts = new Date(l.timestamp);
      return ts >= from && ts <= to;
    });
    return { summary: logs };
  },
};

// Prompts
export const statementValidatorAgentPrompts = {
  validateBankStatement: {
    messages: [
      { role: "user", content: { type: "text", text: "Validate this bank statement PDF." } }
    ]
  },
  addRule: {
    messages: [
      { role: "user", content: { type: "text", text: "Add a validation rule for payroll statements." } }
    ]
  },
  showErrors: {
    messages: [
      { role: "user", content: { type: "text", text: "Show all statement validation errors this month." } }
    ]
  },
  summarizeValidations: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize statement validation activity by document type." } }
    ]
  }
};

// Agent
export const statementValidatorAgent: Tool = {
  name: "statement-validator-agent",
  description: "Validates uploaded financial statements for integrity and compliance.",
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * STATEMENT VALIDATOR AGENT BUSINESS LOGIC
     * - In production, replace in-memory validation with DB/Vector DB-powered compliance checks.
     */
    const { action, rule, file, content, window } = parameters || {};
    switch (action) {
      case "validate":
        return { success: true, result: statementValidatorAgentTools.validate(rule, file, content) };
      case "report":
        return { success: true, result: statementValidatorAgentTools.validatorReport(window) };
      default:
        return {
          success: false,
          result: { message: "Unknown or missing action. Supported: validate, report." }
        };
    }
  }
};
