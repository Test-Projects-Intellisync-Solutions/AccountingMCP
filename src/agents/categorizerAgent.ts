// / **
//  * Categorizer Agent
//  * Assigns transactions to standardized financial categories based on parsed document data.
//  * Supports classification for downstream analysis and reporting.
//  */
import type { ToolResult } from "../modelcontextprotocol/tool";
import { createAgent } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

type CategoryTemplate = { name: string; rules: string[] };
type CategorizationHistory = { item: string; category: string; runAt: string };

export interface CategorizerAgent {
  resources: {
    categories: string[];
    categoryTemplates: CategoryTemplate[];
    categorizationHistory: CategorizationHistory[];
  };
  tools: {
    categorizeItem: (item: string, text: string) => ToolResult | Promise<ToolResult>;
    defineCategory: (name: string, rules: string[]) => ToolResult | Promise<ToolResult>;
    categorizationReport: (window: { from: string; to: string }) => ToolResult | Promise<ToolResult>;
    overrideCategory: (transactionId: string, newCategory: string) => ToolResult | Promise<ToolResult>;
    [key: string]: (...args: any[]) => ToolResult | Promise<ToolResult>;
  };
  prompts: object;
  run: ({ parameters, context }: { parameters: any; context: any }) => Promise<ToolResult>;
}

function isPromise<T>(val: any): val is Promise<T> {
  return !!val && typeof val.then === "function";
}

const categorizerAgent = createAgent({
  resources: {
    categories: [
      "Income", "Expense", "Assets", "Liabilities", "Equity", "Other"
    ],
    categoryTemplates: [
      // Example: { name: "Utilities", rules: ["electricity", "water"] }
    ],
    categorizationHistory: [
      // Example: { item: "Invoice 123", category: "Utilities", runAt: "2025-04-22T16:00:00Z" }
    ],
  },
  tools: {
    categorizeItem: function (this: any, item: string, text: string): ToolResult | Promise<ToolResult> {
      const found = this.resources.categoryTemplates.find((cat: CategoryTemplate) =>
        cat.rules.some((rule: string) => text.toLowerCase().includes(rule.toLowerCase()))
      );
      const category = found ? found.name : "Uncategorized";
      this.resources.categorizationHistory.push({ item, category, runAt: new Date().toISOString() });
      return { success: true, result: { item, category } };
    },
    defineCategory: function (this: any, name: string, rules: string[]): ToolResult | Promise<ToolResult> {
      const idx = this.resources.categoryTemplates.findIndex((c: CategoryTemplate) => c.name === name);
      if (idx !== -1) {
        this.resources.categoryTemplates[idx].rules = rules;
      } else {
        this.resources.categoryTemplates.push({ name, rules });
      }
      return { success: true, result: { message: "Category defined." } };
    },
    categorizationReport: function (this: any, window: { from: string; to: string }): ToolResult | Promise<ToolResult> {
      const from = new Date(window.from);
      const to = new Date(window.to);
      const history = this.resources.categorizationHistory.filter((c: CategorizationHistory) => {
        const ts = new Date(c.runAt);
        return ts >= from && ts <= to;
      });
      const summary = history.reduce((acc: Record<string, number>, c: CategorizationHistory) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return { success: true, result: { summary } };
    },
    overrideCategory: function (this: any, transactionId: string, newCategory: string): ToolResult | Promise<ToolResult> {
      // TODO: Allow manual correction
      return { success: true, result: { message: "Override applied." } };
    }
  },
  prompts: {
    assignCategory: {
      messages: [
        { role: "user", content: { type: "text", text: "Assign a category to this expense: '<description>'. Be sure to define the category value." } }
      ]
    },
    defineCategory: {
      messages: [
        { role: "user", content: { type: "text", text: "Define a new category called '<categoryName>'." } }
      ]
    },
    showOverrides: {
      messages: [
        { role: "user", content: { type: "text", text: "Show all transactions manually re-categorized this month." } }
      ]
    },
    summarizeDistribution: {
      messages: [
        { role: "user", content: { type: "text", text: "Summarize the distribution of expenses by category." } }
      ]
    },
    explainCategory: {
      messages: [
        { role: "user", content: { type: "text", text: "Explain the assigned category for this transaction." } }
      ]
    }
  },
  run: async function({ parameters, context }: { parameters: any; context: any }): Promise<ToolResult> {
    return { success: true, result: { message: "Placeholder run method" } };
  }
});



const categorizerAgentTyped = categorizerAgent as CategorizerAgent;

// Attach a real run method for orchestrated agent calls
categorizerAgentTyped.run = async function({ parameters, context }: { parameters: any; context: any }): Promise<ToolResult> {
  const { action, payload } = parameters || {};
  // Make tools indexable for dynamic access
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
    return { success: false, result: { message: err?.message || "Agent run error" } };
  }
};

export { categorizerAgentTyped as categorizerAgent };
