/**
 * Insights UI Agent
 * Translates structured data into visual dashboards and summaries for end-users.
 * Supports customizable, interactive financial visualizations.
 */
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

export type InsightsUIDashboardConfig = {
  name: string;
  widgets: string[];
};
export type InsightsUIUsageLog = {
  userId: string;
  dashboard: string;
  viewedAt: string;
};

// Resources
export const insightsUIAgentResources: {
  chartTypes: string[];
  dashboardConfigurable: boolean;
  dashboardConfigs: InsightsUIDashboardConfig[];
  uiUsageLogs: InsightsUIUsageLog[];
} = {
  chartTypes: ["bar", "line", "pie", "heatmap", "stacked area"],
  dashboardConfigurable: true,
  dashboardConfigs: [
    // Example: { name: "CashFlow", widgets: ["chart", "table"] }
  ],
  uiUsageLogs: [
    // Example: { userId: "user1", dashboard: "CashFlow", viewedAt: "2025-04-22T16:00:00Z" }
  ]
};

// Tools
export const insightsUIAgentTools = {
  generateDashboard: (config: InsightsUIDashboardConfig, data: Record<string, any>[]) => {
    // In-memory dashboard summary; in production, render from DB/vector DB
    const total = Array.isArray(data) ? data.reduce((sum, row) => sum + (row.amount || 0), 0) : 0;
    return { dashboard: { name: config.name, total, widget: 'summaryWidget' } };
  },
  defineWidget: (name: string, config: Record<string, any>) => {
    // In-memory widget definition; in production, store in DB
    const idx = insightsUIAgentResources.dashboardConfigs.findIndex(d => d.name === name);
    if (idx !== -1) {
      insightsUIAgentResources.dashboardConfigs[idx].widgets.push(...(config.widgets || []));
    } else {
      insightsUIAgentResources.dashboardConfigs.push({ name, widgets: config.widgets || [] });
    }
    return { success: true };
  },
  uiUsageReport: (window: { from: string; to: string }) => {
    // Summarize usage logs in window
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = insightsUIAgentResources.uiUsageLogs.filter(l => {
      const ts = new Date(l.viewedAt);
      return ts >= from && ts <= to;
    });
    return { summary: logs };
  },
};

// Prompts
export const insightsUIAgentPrompts = {
  generateDashboard: {
    messages: [
      { role: "user", content: { type: "text", text: "Generate a dashboard widget for monthly cash flow. The dashboard should include at least one widget and provide an insight." } }
    ]
  },
  addWidget: {
    messages: [
      { role: "user", content: { type: "text", text: "Add a widget to show top 5 expenses." } }
    ]
  },
  showDashboards: {
    messages: [
      { role: "user", content: { type: "text", text: "Show all dashboards viewed by user <userId>." } }
    ]
  },
  summarizeUsage: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize dashboard usage trends." } }
    ]
  }
};

// Agent
export const insightsUIAgent: Tool = {
  name: "insights-ui-agent",
  description: "Translate structured data into visual dashboards and summaries.",
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * INSIGHTS UI AGENT BUSINESS LOGIC
     * - In production, replace in-memory summaries with DB/Vector DB-powered dashboards.
     */
    const { action, config, data, name, widgetConfig, window } = parameters || {};
    switch (action) {
      case "generateDashboard":
        return { success: true, result: insightsUIAgentTools.generateDashboard(config, data) };
      case "defineWidget":
        return { success: true, result: insightsUIAgentTools.defineWidget(name, widgetConfig) };
      case "uiUsageReport":
        return { success: true, result: insightsUIAgentTools.uiUsageReport(window) };
      default:
        return {
          success: false,
          result: { message: "Unknown or missing action. Supported: generateDashboard, defineWidget, uiUsageReport. Each dashboard should include at least one widget." }
        };
    }
  }
};
