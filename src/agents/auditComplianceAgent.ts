/**
 * Audit & Compliance Agent
 * Monitors transactions and changes for regulatory compliance and generates audit logs.
 * Supports auditability and regulatory reporting.
 */
import type { ToolResult } from "../modelcontextprotocol/tool";
import { createAgent } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

// Agent-specific types
export type AuditRule = { name: string; description: string };
export type AuditLog = { rule: string; passed: boolean; checkedAt: string };
export type Exception = { exceptionId: string; resource: string; expiresAt: string; justification: string };

export interface AuditComplianceResources {
  complianceStandards: string[];
  auditLogEnabled: boolean;
  auditRules: AuditRule[];
  auditLogs: AuditLog[];
  exceptionsList: Exception[];
}

export interface AuditComplianceAgent {
  resources: AuditComplianceResources;
  tools: {
    runAudit: (rule: string, data: any) => ToolResult | Promise<ToolResult>;
    defineAuditRule: (name: string, description: string) => ToolResult | Promise<ToolResult>;
    auditReport: (window: { from: string; to: string }) => ToolResult | Promise<ToolResult>;
    exceptionReport: (window: { from: string; to: string }) => ToolResult | Promise<ToolResult>;
    auditSummaryReport: (window: { from: string; to: string }) => ToolResult | Promise<ToolResult>;
    [key: string]: (...args: any[]) => ToolResult | Promise<ToolResult>;
  };
  prompts: object;
  run: ({ parameters, context }: { parameters: any; context: any }) => Promise<ToolResult>;
}

function isPromise<T>(val: any): val is Promise<T> {
  return !!val && typeof val.then === "function";
}

const auditComplianceAgent = createAgent({
  resources: {
    complianceStandards: ["GAAP", "IFRS", "SOX"],
    auditLogEnabled: true,
    auditRules: [],
    auditLogs: [],
    exceptionsList: []
  },
  tools: {
    runAudit: function (this: any, rule: string, data: any): ToolResult | Promise<ToolResult> {
      const auditRule = this.resources.auditRules.find((r: AuditRule) => r.name === rule);
      if (!auditRule) return { success: false, result: { message: `Rule '${rule}' not found.` } };
      let passed = false;
      if (rule === "Segregation of Duties" && data) {
        passed = data.approvedBy && data.executedBy && data.approvedBy !== data.executedBy;
      }
      this.resources.auditLogs.push({ rule, passed, checkedAt: new Date().toISOString() });
      return { success: true, result: { rule, passed } };
    },
    defineAuditRule: function (this: any, name: string, description: string): ToolResult | Promise<ToolResult> {
      const idx = this.resources.auditRules.findIndex((r: AuditRule) => r.name === name);
      if (idx !== -1) {
        this.resources.auditRules[idx].description = description;
      } else {
        this.resources.auditRules.push({ name, description });
      }
      return { success: true, result: { message: "Audit rule defined." } };
    },
    auditReport: function (this: any, window: { from: string; to: string }): ToolResult | Promise<ToolResult> {
      const from = new Date(window.from);
      const to = new Date(window.to);
      const logs = this.resources.auditLogs.filter((l: AuditLog) => {
        const ts = new Date(l.checkedAt);
        return ts >= from && ts <= to;
      });
      const summary = logs.reduce((acc: Record<string, { passed: number; failed: number }>, l: AuditLog) => {
        if (!acc[l.rule]) acc[l.rule] = { passed: 0, failed: 0 };
        if (l.passed) acc[l.rule].passed++;
        else acc[l.rule].failed++;
        return acc;
      }, {} as Record<string, { passed: number; failed: number }>);
      return { success: true, result: { summary } };
    },
    exceptionReport: function (this: any, window: { from: string; to: string }): ToolResult | Promise<ToolResult> {
      // TODO: List active exceptions within window
      return { success: true, result: { exceptions: this.resources.exceptionsList } };
    },
    auditSummaryReport: function (this: any, window: { from: string; to: string }): ToolResult | Promise<ToolResult> {
      // TODO: Aggregate findings
      return { success: true, result: { summary: {} } };
    }
  },
  prompts: {
    runSoxAudit: {
      messages: [
        { role: "user", content: { type: "text", text: "Run a SOX compliance audit on all transactions this quarter and flag any exception. Provide a summary of findings and reference the compliance policy." } }
      ]
    },
    addException: {
      messages: [
        { role: "user", content: { type: "text", text: "Add an exception for vendor <vendor> until <expiry>. Exception must be justified." } }
      ]
    },
    summarizeFindings: {
      messages: [
        { role: "user", content: { type: "text", text: "Summarize all audit findings for this period." } }
      ]
    }
  },
  run: async () => ({ success: false, result: { message: 'Not implemented' } })
}) as AuditComplianceAgent;

// Attach a run method for orchestrated agent calls
// Allows for both sync and async tool execution
(auditComplianceAgent as AuditComplianceAgent).run = async function({ parameters, context }: { parameters: any; context: any }): Promise<ToolResult> {
  const { action, payload } = parameters || {};
  if (!action || typeof auditComplianceAgent.tools[action] !== "function") {
    return { success: false, result: { message: `Invalid or missing action: '${action}'` } };
  }
  try {
    const toolFn = auditComplianceAgent.tools[action];
    let result;
    if (Array.isArray(payload)) {
      result = toolFn.apply(auditComplianceAgent, payload);
    } else if (payload && typeof payload === "object") {
      result = toolFn.call(auditComplianceAgent, ...(Object.values(payload)));
    } else {
      result = toolFn.call(auditComplianceAgent, payload);
    }
    if (isPromise<ToolResult>(result)) {
      result = await result;
    }
    return result;
  } catch (err: any) {
    return { success: false, result: { message: err?.message || "Agent run error" } };
  }
};

export { auditComplianceAgent };
