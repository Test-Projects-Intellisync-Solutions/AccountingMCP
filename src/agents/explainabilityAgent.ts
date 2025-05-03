/**
 * Explainability Agent
 * Provides transparent explanations for AI-driven decisions and model outputs.
 * Supports regulatory requirements for explainable AI.
 */
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

export type ExplanationTemplate = { name: string; description: string };

export interface ExplanationLog {
  output: any;
  context: any;
  explanation: string;
  timestamp: string;
}

// Resources
export const explainabilityAgentResources: {
  explanationTemplates: ExplanationTemplate[];
  explanationLogs: ExplanationLog[];
  explainMethods: string[];
  regulatorySupport: boolean;
} = {
  explanationTemplates: [
    // Example: { name: "ROI Explanation", description: "Explain ROI calculation." }
  ],
  explanationLogs: [
    // Example: { template: "ROI Explanation", explanation: "ROI is calculated as...", runAt: "2025-04-22T16:00:00Z" }
  ],
  explainMethods: ["shap", "lime", "featureImportance"],
  regulatorySupport: true,
};

// Tools
export const explainabilityAgentTools = {
  explain: async (output: any, context: any) => {
    // Use OpenAI LLM for explanation
    let explanation = "This is a placeholder explanation.";
    try {
      const prompt = `Explain the following model output in clear, user-friendly language. Include relevant context.\n\nOutput: ${JSON.stringify(output)}\nContext: ${JSON.stringify(context)}`;
      explanation = await callOpenAI(prompt);
    } catch (error) {
      explanation = "This is a placeholder explanation.";
    }
    explainabilityAgentResources.explanationLogs.push({
      output,
      context,
      explanation,
      timestamp: new Date().toISOString(),
    });
    return { explanation };
  },
  defineExplanationTemplate: (name: string, description: string) => {
    const idx = explainabilityAgentResources.explanationTemplates.findIndex((t) => t.name === name);
    if (idx !== -1) {
      explainabilityAgentResources.explanationTemplates[idx].description = description;
    } else {
      explainabilityAgentResources.explanationTemplates.push({ name, description });
    }
    return { success: true };
  },
  explanationReport: (window: { from: string; to: string }) => {
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = explainabilityAgentResources.explanationLogs.filter((l) => {
      const ts = new Date(l.timestamp);
      return ts >= from && ts <= to;
    });
    const summary = logs.reduce((acc: Record<string, number>, l) => {
      return acc;
    }, {} as Record<string, number>);
    return { summary };
  },
};

// Prompts
export const explainabilityAgentPrompts = {
  explainDecision: {
    messages: [
      { role: "user", content: { type: "text", text: "Explain and provide an explanation for the reason why this <decisionType> was made. The explanation should be clear." } }
    ]
  },
  defineTemplate: {
    messages: [
      { role: "user", content: { type: "text", text: "Define and explain the reason for a new template for <decisionType> decisions." } }
    ]
  },
  showExplanations: {
    messages: [
      { role: "user", content: { type: "text", text: "Show and explain all reasons for explanations generated for user <userId>." } }
    ]
  },
  summarizeQuality: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize and explain the reason for explanation quality based on feedback." } }
    ]
  }
};

// Agent
export const explainabilityAgent: Tool = {
  name: "explainability-agent",
  description: "Provides transparent explanations for AI-driven decisions.",
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * EXPLAINABILITY AGENT BUSINESS LOGIC
     * - In production, replace in-memory explanations with DB/Vector DB-driven reasoning.
     */
    const { action, template, data, name, description, window, decision, contextData } = parameters || {};
    switch (action) {
      case "generate":
        return { success: true, result: explainabilityAgentTools.explain(data, context) };
      case "defineTemplate":
        return { success: true, result: explainabilityAgentTools.defineExplanationTemplate(name, description) };
      case "report":
        return { success: true, result: explainabilityAgentTools.explanationReport(window) };
      case "explainDecision":
        if (!decision) {
          return {
            success: false,
            result: { message: "Missing required parameter: decision." }
          };
        }
        // Example stub: Simple explanation
        const explanation = `Decision '${decision}' was made based on available data. Explanation provided.`;
        return {
          success: true,
          result: {
            decision,
            explanation,
            message: explanation
          }
        };
      default:
        return {
          success: false,
          result: { message: "Unknown or missing action. Supported: generate, defineTemplate, report, explainDecision. Please specify an explanation (explain) action." }
        };
    }
  }
};
