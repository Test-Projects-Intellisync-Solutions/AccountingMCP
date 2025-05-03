// / **
//  * Integration Agent
//  * Handles data exchange with third-party services and manages API authentication and mapping.
//  * Enables seamless interoperability with external platforms.
//  */
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

export type IntegrationConfig = {
  service: string;
  config: Record<string, any>;
};
export interface IntegrationLog {
  event: string;
  error?: string;
  summary: string;
  timestamp: string;
}

// Resources
export const integrationAgentResources: {
  supportedAPIs: string[];
  oauthEnabled: boolean;
  integrationConfigs: IntegrationConfig[];
  integrationLogs: IntegrationLog[];
} = {
  supportedAPIs: ["Plaid", "Stripe", "QuickBooks"],
  oauthEnabled: true,
  integrationConfigs: [
    // Example: { service: "QuickBooks", config: { ... } }
  ],
  integrationLogs: [
    // Example: { service: "QuickBooks", event: "connected", status: "success", timestamp: "2025-04-22T16:00:00Z" }
  ]
};

// Tools
export const integrationAgentTools = {
  connectService: (service: string, credentials: Record<string, any>) => {
    // In-memory connection; in production, connect to API/DB
    const event = { service, credentials };
    const result = integrationAgentTools.summarizeIntegrationEvent(event);
    return { status: "connected" };
  },
  summarizeIntegrationEvent: async (event: any, error?: any) => {
    // Use OpenAI LLM for integration event summary
    let summary = "Integration event processed.";
    try {
      const prompt = `Summarize the following integration event. If there is an error, include it in the summary.\n\nEvent: ${JSON.stringify(event)}\nError: ${JSON.stringify(error)}`;
      summary = await callOpenAI(prompt);
    } catch (err) {
      summary = "Integration event processed.";
    }
    integrationAgentResources.integrationLogs.push({
      event: JSON.stringify(event),
      error: error ? JSON.stringify(error) : undefined,
      summary,
      timestamp: new Date().toISOString(),
    });
    return { summary };
  },
  defineIntegrationConfig: (service: string, config: Record<string, any>) => {
    // In-memory config; in production, store in DB
    const idx = integrationAgentResources.integrationConfigs.findIndex(c => c.service === service);
    if (idx !== -1) {
      integrationAgentResources.integrationConfigs[idx].config = config;
    } else {
      integrationAgentResources.integrationConfigs.push({ service, config });
    }
    return { success: true };
  },
  integrationReport: (window: { from: string; to: string }) => {
    // Summarize logs in window
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = integrationAgentResources.integrationLogs.filter(l => {
      const ts = new Date(l.timestamp);
      return ts >= from && ts <= to;
    });
    return { summary: logs };
  },
};

// Prompts
export const integrationAgentPrompts = {
  connectQuickBooks: {
    messages: [
      { role: "user", content: { type: "text", text: "Connect to QuickBooks with these credentials. Begin integration process." } }
    ]
  },
  defineIntegration: {
    messages: [
      { role: "user", content: { type: "text", text: "Define a new integration for <service>. Ensure you connect the service properly." } }
    ]
  },
  showFailures: {
    messages: [
      { role: "user", content: { type: "text", text: "Show all failed integrations this month." } }
    ]
  },
  summarizeIntegrations: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize integration activity by service." } }
    ]
  }
};

// Agent
export const integrationAgent: Tool = {
  name: "integration-agent",
  description: "Handles data exchange with third-party services and manages API integration.",
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * INTEGRATION AGENT BUSINESS LOGIC
     * - In production, replace in-memory logic with DB/Vector DB-powered integrations.
     */
    const { action, service, credentials, config, window } = parameters || {};
    switch (action) {
      case "connectService":
        return { success: true, result: { ...integrationAgentTools.connectService(service, credentials), message: 'Integration with ' + service + ' completed.' } };
      case "defineConfig":
        return { success: true, result: integrationAgentTools.defineIntegrationConfig(service, config) };
      case "report":
        return { success: true, result: integrationAgentTools.integrationReport(window) };
      default:
        return {
          success: false,
          result: { message: "Unknown or missing action. Supported: connectService, defineConfig, report. Integration action required." }
        };
    }
  }
};
