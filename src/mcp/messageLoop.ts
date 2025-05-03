import { MCPServer } from "./server";
import type { Tool } from "../modelcontextprotocol/tool";

/**
 * MCP Message Loop
 * Listens for incoming JSON requests (via stdio) and routes them to the correct agent/tool.
 * Each request should have: { tool: string, parameters: any, context?: any, requestId?: string }
 * Each response: { requestId, success, result, error? }
 */
export async function startMCPMessageLoop(server: MCPServer) {
  // Ensure server is started and agents are registered
  await server.start();
  // Listen on stdin for JSON requests
  process.stdin.setEncoding("utf8");
  let buffer = "";
  process.stdin.on("data", async (chunk) => {
    buffer += chunk;
    let boundary;
    while ((boundary = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 1);
      if (!line.trim()) continue;
      let req;
      try {
        req = JSON.parse(line);
      } catch (err) {
        process.stdout.write(JSON.stringify({ success: false, error: "Invalid JSON", raw: line }) + "\n");
        continue;
      }
      // Route request to the correct tool
      const { tool, parameters, context, requestId } = req;
      const found: Tool | undefined = server["tools"].find((t: Tool) => t.name === tool);
      if (!found) {
        process.stdout.write(JSON.stringify({ requestId, success: false, error: `Tool '${tool}' not found` }) + "\n");
        continue;
      }
      try {
        const result = await found.run({ parameters, context });
        process.stdout.write(JSON.stringify({ requestId, success: true, result }) + "\n");
      } catch (err: any) {
        process.stdout.write(JSON.stringify({ requestId, success: false, error: err?.message || String(err) }) + "\n");
      }
    }
  });
}

// If running as main, start the message loop
async function main() {
  const server = new MCPServer();
  await startMCPMessageLoop(server);
}

if (require.main === module) {
  main();
}
