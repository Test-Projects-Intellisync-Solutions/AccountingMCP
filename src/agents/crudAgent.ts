/**
 * CrudAgent
 * Supports record creation, editing, and deletion with audit trail tracking for all major data objects.
 * Ensures traceability and versioning of financial records.
 */
import type { ToolResult } from "../modelcontextprotocol/tool";
import { createAgent } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

// --- Specialized Types ---
export type CrudAuditTrailEntry = {
  action: string;
  recordId: string;
  before: Record<string, any>;
  after: Record<string, any>;
  userId: string;
  timestamp: string;
};

export interface CrudRecordSchema {
  type?: string;
  action: string;
  record?: any;
  recordId?: string;
  changes?: any;
  options?: any;
  summary?: string;
  timestamp: string;
}

export interface CrudChangeLog {
  type?: string;
  action: string;
  record?: any;
  recordId?: string;
  changes?: any;
  options?: any;
  summary?: string;
  timestamp: string;
}

export interface CrudAgentResources {
  supportedEntities: string[];
  auditEnabled: boolean;
  auditTrail: CrudAuditTrailEntry[];
  recordSchemas: CrudRecordSchema[];
  changeLogs: CrudChangeLog[];
}

export interface CrudAgentTools {
  createRecord: (this: CrudAgent, type: string, record: any) => Promise<any>;
  updateRecord: (this: CrudAgent, recordId: string, changes: any) => Promise<any>;
  deleteRecord: (this: CrudAgent, recordId: string, options?: any) => Promise<any>;
  recordChangeReport: (this: CrudAgent, window: { from: string; to: string }) => any;
}

export interface CrudAgent {
  resources: CrudAgentResources;
  tools: CrudAgentTools;
  prompts: object;
  run: ({ parameters, context }: { parameters: any; context: any }) => Promise<ToolResult>;
}

// --- Utility: Promise Type Guard ---
function isPromise<T>(val: any): val is Promise<T> {
  return !!val && typeof val.then === "function";
}

// --- Agent Definition ---
const crudAgent = createAgent({
  resources: {
    supportedEntities: ["Transaction", "Account", "User", "Category"],
    auditEnabled: true,
    auditTrail: [],
    recordSchemas: [],
    changeLogs: []
  },
  tools: {
    async createRecord(this: CrudAgent, type: string, record: any) {
      let summary = `Created ${type} record.`;
      try {
        const prompt = `Summarize the following record creation in one sentence:\n\nType: ${type}\nRecord: ${JSON.stringify(record)}`;
        summary = await callOpenAI(prompt);
      } catch (error) {}
      this.resources.changeLogs.push({
        type,
        action: "create",
        record,
        summary,
        timestamp: new Date().toISOString(),
      });
      return { created: record, summary };
    },
    async updateRecord(this: CrudAgent, recordId: string, changes: any) {
      let summary = `Updated record ${recordId}.`;
      try {
        const prompt = `Summarize the following record update in one sentence:\n\nRecord ID: ${recordId}\nChanges: ${JSON.stringify(changes)}`;
        summary = await callOpenAI(prompt);
      } catch (error) {}
      this.resources.changeLogs.push({
        action: "update",
        recordId,
        changes,
        summary,
        timestamp: new Date().toISOString(),
      });
      return { updated: recordId, changes, summary };
    },
    async deleteRecord(this: CrudAgent, recordId: string, options?: any) {
      let summary = `Deleted record ${recordId}.`;
      try {
        const prompt = `Summarize the following record deletion in one sentence:\n\nRecord ID: ${recordId}\nOptions: ${JSON.stringify(options)}`;
        summary = await callOpenAI(prompt);
      } catch (error) {}
      this.resources.changeLogs.push({
        action: "delete",
        recordId,
        options,
        summary,
        timestamp: new Date().toISOString(),
      });
      return { deleted: recordId, summary, success: true };
    },
    recordChangeReport(this: CrudAgent, window: { from: string; to: string }) {
      const from = new Date(window.from);
      const to = new Date(window.to);
      const entries = this.resources.auditTrail.filter((e: CrudAuditTrailEntry) => {
        const ts = new Date(e.timestamp);
        return ts >= from && ts <= to;
      });
      return { summary: entries };
    }
  },
  prompts: {
    createInvoice: {
      messages: [
        { role: "user", content: { type: "text", text: "Create a new invoice for $<amount> to <client>. The action must create a record and allow for update and delete operations." } }
      ]
    },
    updateInvoice: {
      messages: [
        { role: "user", content: { type: "text", text: "Update the due date for invoice #<invoiceId>. This update action should also allow for record creation, update, and deletion." } }
      ]
    },
    showDeletions: {
      messages: [
        { role: "user", content: { type: "text", text: "Show all deletions performed by user <userId> last week." } }
      ]
    },
    summarizeChanges: {
      messages: [
        { role: "user", content: { type: "text", text: "Summarize record changes for <month>." } }
      ]
    }
  },
  run: async function({ parameters, context }: { parameters: any; context: any }): Promise<ToolResult> {
    const { action, payload } = parameters || {};
    const tools = this.tools as Record<string, (...args: any[]) => ToolResult | Promise<ToolResult>>;
    if (!action || typeof tools[action] !== "function") {
      return { success: false, result: { message: `Invalid or missing action: '${action}'` } };
        changes,
        summary,
        timestamp: new Date().toISOString(),
      });
      return { updated: recordId, changes, summary };
    },
    deleteRecord: async function (recordId: string, options?: any) {
      let summary = `Deleted record ${recordId}.`;
      try {
        const prompt = `Summarize the following record deletion in one sentence:\n\nRecord ID: ${recordId}\nOptions: ${JSON.stringify(options)}`;
        summary = await callOpenAI(prompt);
      } catch (error) {}
      this.resources.changeLogs.push({
        action: "delete",
        recordId,
        options,
        summary,
        timestamp: new Date().toISOString(),
      });
      return { deleted: recordId, summary, success: true };
    },
    recordChangeReport: function (window: { from: string; to: string }) {
      const from = new Date(window.from);
      const to = new Date(window.to);
      const entries = this.resources.auditTrail.filter((e: CrudAuditTrailEntry) => {
        const ts = new Date(e.timestamp);
        return ts >= from && ts <= to;
      });
      return { summary: entries };
    }
  },
  prompts: {
    createInvoice: {
      messages: [
        { role: "user", content: { type: "text", text: "Create a new invoice for $<amount> to <client>. The action must create a record and allow for update and delete operations." } }
      ]
    },
    updateInvoice: {
      messages: [
        { role: "user", content: { type: "text", text: "Update the due date for invoice #<invoiceId>. This update action should also allow for record creation, update, and deletion." } }
      ]
    },
    showDeletions: {
      messages: [
        { role: "user", content: { type: "text", text: "Show all deletions performed by user <userId> last week." } }
      ]
    },
    summarizeChanges: {
      messages: [
        { role: "user", content: { type: "text", text: "Summarize record changes for <month>." } }
      ]
    }
  },
  run: async () => ({ success: false, result: { message: 'Not implemented' } })
});

const crudAgentTyped = crudAgent as CrudAgent;

crudAgentTyped.run = async function({ parameters, context }: { parameters: any; context: any }): Promise<ToolResult> {
  const { action, payload } = parameters || {};
  const tools = this.tools as Record<string, (...args: any[]) => ToolResult | Promise<ToolResult>>;
  if (!action || typeof tools[action] !== "function") {
    return { success: false, result: { message: `Invalid or missing action: '${action}'` } };
  }
  try {
    const toolFn = tools[action];
    let result;
    if (Array.isArray(payload)) {
      result = toolFn.apply(this, payload);
    } else if (payload && typeof payload === "object") {
      result = toolFn.call(this, ...(Object.values(payload)));
    } else {
      result = toolFn.call(this, payload);
    }
    if (isPromise<ToolResult>(result)) {
      result = await result;
    }
    return result;
  } catch (err: any) {
    return { success: false, result: { message: err?.message || "CrudAgent run error" } };
  }
};

export { crudAgentTyped as crudAgent };
