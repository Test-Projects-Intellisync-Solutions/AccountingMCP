// src/agents/Agent.ts
import type { ToolResult } from "../modelcontextprotocol/tool";

/**
 * BaseAgent interface for all MCP agents.
 * Ensures consistency and type safety across the agent orchestration pipeline.
 */
export interface BaseAgent {
  name: string;
  description: string;
  run(params: { parameters: any; context: any }): Promise<ToolResult>;
  resources?: Record<string, any>;
  tools?: Record<string, (...args: any[]) => any>;
  prompts?: Record<string, any>;
}

// Shared resources for all agents
export type AgentLogLevel = "debug" | "info" | "warn" | "error" | "metric" | "cache";
export type AgentLogEntry = {
  key: string;
  value: any;
  level?: AgentLogLevel;
  timestamp: number;
  expiresAt?: number;
  meta?: Record<string, any>;
};

export const baseAgentResources = {
  supportedFormats: ["csv", "pdf", "xlsx", "json", "jpg", "png"],
  logs: [] as AgentLogEntry[],        // Operational logs
  config: {},                         // Global settings and feature toggles
  secrets: {},                        // API keys and credentials
  schemas: {},                        // Common data model schemas (JSON Schema)
  dataStores: {},                     // Connections to databases/vector stores
  policyRules: {},                    // Access-control and validation rules
};

// Shared tools for all agents
export const baseAgentTools = {
  fetchJson: async (url: string, options?: any) => {
    // HTTP GET returning JSON
    const res = await fetch(url, options);
    return res.json();
  },
  postJson: async (url: string, payload: any, options?: any) => {
    // HTTP POST with JSON payload
    const res = await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload), ...options });
    return res.json();
  },
  addLog: (entry: Omit<AgentLogEntry, "timestamp">) => {
    const logEntry = { ...entry, timestamp: Date.now() };
    baseAgentResources.logs.push(logEntry);
  },
  getLogs: (filter?: { level?: AgentLogLevel; key?: string }) => {
    return baseAgentResources.logs.filter(log =>
      (!filter?.level || log.level === filter.level) &&
      (!filter?.key || log.key === filter.key)
    );
  },
  cleanupExpiredLogs: () => {
    const now = Date.now();
    baseAgentResources.logs = baseAgentResources.logs.filter(log =>
      !log.expiresAt || log.expiresAt > now
    );
  },
  setInCache: (key: string, value: any, ttl?: number) => {
    const expiresAt = ttl ? Date.now() + ttl : undefined;
    baseAgentTools.addLog({ key, value, level: "cache", expiresAt });
  },
  getFromCache: (key: string) => {
    baseAgentTools.cleanupExpiredLogs();
    const entry = baseAgentResources.logs.find(
      log => log.key === key && log.level === "cache"
    );
    return entry?.value;
  },
  validateParams: (schema: any, params: any) => {
    // JSON-schema validation stub
    // Integrate with a validator like Ajv or Zod
    return true;
  },
  logDebug: (message: string, meta?: any) => {
    baseAgentTools.addLog({ key: "debug", value: message, level: "debug", meta });
    console.debug(`[Debug] ${message}`, meta);
  },
  logError: (message: string, meta?: any) => {
    baseAgentTools.addLog({ key: "error", value: message, level: "error", meta });
    console.error(`[Error] ${message}`, meta);
  },
  recordMetric: (name: string, value: number) => {
    baseAgentTools.addLog({ key: name, value, level: "metric" });
    console.info(`[Metric] ${name}: ${value}`);
  },
  checkPermission: (user: any, action: string, resource: string) => {
    // Authorization stub; integrate with policyRules
    return true;
  },
};

// Shared prompts for all agents
export const baseAgentPrompts = {
  systemInit: "Hello! I’m your intelligent assistant—ready to help with financial analysis or data operations.",
  genericError: "Oops—an error occurred while processing your request.",
  clarification: "I need a bit more information to proceed. Could you clarify?",
  fallbackHelp: "I’m not sure I understand. Here’s what I can do: [list of capabilities].",
  confirmation: "Got it! Your request was completed successfully.",
};

/**
 * Factory function to create a new agent by merging base resources, tools, and prompts
 * with agent-specific overrides.
 */
export function createAgent<T extends object>(overrides: {
  resources?: object;
  tools?: object;
  prompts?: object;
  [key: string]: any;
}) {
  return {
    resources: { ...baseAgentResources, ...overrides.resources },
    tools: { ...baseAgentTools, ...overrides.tools },
    prompts: { ...baseAgentPrompts, ...overrides.prompts },
    ...overrides,
  };
}
