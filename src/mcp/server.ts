import { Tool } from "../modelcontextprotocol/tool";

/**
 * MCPServer
 * Registers and manages all agent tools for the MCP message loop.
 * Intended to be used by src/mcp/messageLoop.ts for request routing.
 */
export class MCPServer {
  private tools: Tool[] = [];

  /**
   * Handle an incoming protocol message.
   * Example assumes messages are of the form: { tool: string, ... }
   */
  async handleMessage(message: any): Promise<any> {
    if (!message.tool) {
      return { error: "Missing 'tool' field in message" };
    }
    const tool = this.getToolByName(message.tool);
    if (!tool) {
      return { error: `Tool '${message.tool}' not found` };
    }
    if (typeof tool.run === "function") {
      try {
        return await tool.run({
          parameters: message.parameters ?? {},
          context: message.context ?? {},
        });
      } catch (err) {
        return { error: `Tool execution error: ${err}` };
      }
    }
    return { error: `Tool '${message.tool}' does not support 'run'` };
  }

  registerTool(tool: Tool) {
    this.tools.push(tool);
  }

  /**
   * Find a tool by its name (agent identifier)
   */
  getToolByName(name: string): Tool | undefined {
    return this.tools.find(t => t.name === name);
  }

  /**
   * Get all registered tools (agents)
   */
  get allTools(): Tool[] {
    return this.tools;
  }

  async start() {
    // --- AGENT REGISTRATION ---
    // Import and register all agents (in-memory, ready for DB/vector DB expansion)
    const { agents } = await import("../agents/index");
    for (const agent of agents) {
      this.registerTool(agent);
    }
  
    // Future: Integrate DB/vector DB context for agent actions
  }
}
