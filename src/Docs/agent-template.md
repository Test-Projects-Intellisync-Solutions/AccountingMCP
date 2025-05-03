# Agent Refactor Template (TypeScript)

This template provides a robust, type-safe, and maintainable pattern for all agents in your codebase. Use it as a reference for creating or refactoring agents to ensure consistency and code quality.

---

```typescript
/**
 * [AgentName] Agent
 * [Brief description of the agent's domain and responsibilities]
 */
import type { ToolResult } from "../modelcontextprotocol/tool";
import { createAgent } from "./BaseAgent";
// import { callOpenAI } from "../llm/openaiClient"; // If LLM integration is needed

// --- Specialized Types ---
type [ResourceType] = { /* ... */ };
type [HistoryType] = { /* ... */ };

// --- Agent Interface ---
export interface [AgentName]Agent {
  resources: {
    // Specialized resources for this agent
  };
  tools: {
    // Tool methods specific to this agent
    [key: string]: (...args: any[]) => ToolResult | Promise<ToolResult>;
  };
  prompts: object;
  run: ({ parameters, context }: { parameters: any; context: any }) => Promise<ToolResult>;
}

// --- Utility: Promise Type Guard ---
function isPromise<T>(val: any): val is Promise<T> {
  return !!val && typeof val.then === "function";
}

// --- Agent Definition ---
const agent = createAgent({
  resources: {
    // agent-specific resources
  },
  tools: {
    // agent-specific tool methods
  },
  prompts: {
    // agent-specific prompts
  },
  // Placeholder run to satisfy type, will be overwritten below
  run: async () => ({ success: false, result: { message: "Not implemented" } })
});

// --- Attach the run method for orchestration ---
const agentTyped = agent as [AgentName]Agent;

agentTyped.run = async function({ parameters, context }: { parameters: any; context: any }): Promise<ToolResult> {
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
    return { success: false, result: { message: err?.message || "[AgentName]Agent run error" } };
  }
};

export { agentTyped as [agentName]Agent };
```

---

## How to Use

1. **Replace** `[AgentName]`, `[agentName]`, `[ResourceType]`, `[HistoryType]` with your agent’s specifics.
2. **Fill in** the `resources`, `tools`, and `prompts` with the agent’s specialized logic and data.
3. **Copy this structure** for each agent file in your `/src/agents/` directory.

---

## Refactor Checklist

- [ ] Implements base agent interface
- [ ] Has a `run` method for orchestration
- [ ] Maintains agent-specific resources, tools, and prompts
- [ ] Removes all duplication and legacy code
- [ ] Ensures strong typing and clean, maintainable code
