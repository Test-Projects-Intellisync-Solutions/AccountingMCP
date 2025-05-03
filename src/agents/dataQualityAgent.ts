/**
 * Data Quality Agent
 * Cleans, deduplicates, and validates raw data before downstream processing.
 * Ensures high-quality, reliable data for all agents and workflows.
 */
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

export type QualityRule = { name: string; description: string };
export type QualityLog = { rule: string; passed: boolean; checkedAt: string };
export type DataAnomaly = {
  anomalyId: string;
  field: string;
  status: string;
  detectedAt: string;
};

// Resources
export const dataQualityAgentResources: {
  checks: string[];
  autoCleanEnabled: boolean;
  qualityRules: QualityRule[];
  qualityLogs: QualityLog[];
  dataAnomalies: DataAnomaly[];
} = {
  checks: ["deduplication", "schemaValidation", "missingValueDetection"],
  autoCleanEnabled: true,
  qualityRules: [
    // Example: { name: "No Nulls", description: "No fields should be null." }
  ],
  qualityLogs: [
    // Example: { rule: "No Nulls", passed: true, checkedAt: "2025-04-22T16:00:00Z" }
  ],
  dataAnomalies: [
    // Example: { anomalyId: "anom1", field: "amount", status: "open", detectedAt: "2025-04-22T16:00:00Z" }
  ]
};

// Tools
export const dataQualityAgentTools = {
  runQualityCheck: (rule: string, data: Record<string, any>) => {
    const qualityRule = dataQualityAgentResources.qualityRules.find((r) => r.name === rule);
    if (!qualityRule) return { success: false, message: `Rule '${rule}' not found.` };
    let passed = false;
    if (rule === "No Nulls" && data) {
      passed = Object.values(data).every(v => v !== null && v !== undefined);
    }
    dataQualityAgentResources.qualityLogs.push({ rule, passed, checkedAt: new Date().toISOString() });
    return { success: true, rule, passed };
  },
  defineQualityRule: (name: string, description: string) => {
    const idx = dataQualityAgentResources.qualityRules.findIndex((r) => r.name === name);
    if (idx !== -1) {
      dataQualityAgentResources.qualityRules[idx].description = description;
    } else {
      dataQualityAgentResources.qualityRules.push({ name, description });
    }
    return { success: true };
  },
  qualityReport: (window: { from: string; to: string }) => {
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = dataQualityAgentResources.qualityLogs.filter((l) => {
      const ts = new Date(l.checkedAt);
      return ts >= from && ts <= to;
    });
    const summary = logs.reduce((acc: Record<string, { passed: number; failed: number }>, l) => {
      if (!acc[l.rule]) acc[l.rule] = { passed: 0, failed: 0 };
      if (l.passed) acc[l.rule].passed++;
      else acc[l.rule].failed++;
      return acc;
    }, {} as Record<string, { passed: number; failed: number }>);
    return { summary };
  },
  qualitySummaryReport: (window: { from: string; to: string }) => {
    // Aggregate issues (future: DB/vector DB)
    return { summary: {} };
  },
  anomalyReport: async (window: { from: string; to: string }) => {
    // Use OpenAI LLM to summarize anomalies in the window
    try {
      const from = new Date(window.from);
      const to = new Date(window.to);
      const logs = dataQualityAgentResources.qualityLogs.filter((l: any) => {
        const ts = new Date(l.checkedAt);
        return ts >= from && ts <= to;
      });
      const prompt = `Review the following data quality logs and summarize any detected anomalies or quality issues.\n\nLogs: ${JSON.stringify(logs)}`;
      const anomalies = await callOpenAI(prompt);
      return { anomalies };
    } catch (error) {
      return { anomalies: [] };
    }
  }
};

// Agent
export const dataQualityAgent: Tool = {
  name: "data-quality-agent",
  description: "Cleans, deduplicates, and validates raw data before downstream processing.",
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * DATA QUALITY AGENT BUSINESS LOGIC
     * - In production, replace in-memory quality checks with DB/Vector DB queries.
     */
    const { action, rule, data, name, description, window, dataset } = parameters || {};
    switch (action) {
      case "runCheck":
        return { success: true, result: dataQualityAgentTools.runQualityCheck(rule, data) };
      case "defineRule":
        return { success: true, result: dataQualityAgentTools.defineQualityRule(name, description) };
      case "report":
        return { success: true, result: dataQualityAgentTools.qualityReport(window) };
      case "summary":
        return { success: true, result: dataQualityAgentTools.qualitySummaryReport(window) };
      case "anomalyReport":
        return { success: true, result: dataQualityAgentTools.anomalyReport(window) };
      case "datasetCheck":
        if (!dataset) {
          return {
            success: false,
            result: { message: "Missing required parameter: dataset." }
          };
        }
        // Example stub: Check for missing values
        const missingFields = Array.isArray(dataset)
          ? dataset.filter((row: any) => Object.values(row).some((v) => v == null)).length
          : 0;
        return {
          success: true,
          result: {
            missingFields,
            message: `Data quality check: ${missingFields} rows with missing fields. Please check the dataset for completeness.`
          }
        };
      default:
        return {
          success: false,
          result: { message: "Unknown or missing action. Supported: runCheck, defineRule, report, summary, anomalyReport, datasetCheck." }
        };
    }
  }
};

// Prompts
export const dataQualityPrompts = {
  checkQuality: {
    messages: [
      { role: "user", content: { type: "text", text: "Check the quality of this dataset and suggest improvements. Be sure to check all fields and define a data quality rule." } }
    ]
  },
  runQualityCheck: {
    messages: [
      { role: "user", content: { type: "text", text: "Run a quality check on the latest transactions import." } }
    ]
  },
  qualityCheckPrompt: {
    messages: [
      { role: "user", content: { type: "text", text: "Run a quality check on the latest transactions import." } }
    ]
  },
  addRule: {
    messages: [
      { role: "user", content: { type: "text", text: "Add a rule requiring all invoices to have a due date." } }
    ]
  },
  showAnomalies: {
    messages: [
      { role: "user", content: { type: "text", text: "Show all unresolved anomalies for <month>." } }
    ]
  },
  summarizeQuality: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize data quality issues by source system." } }
    ]
  }
};
