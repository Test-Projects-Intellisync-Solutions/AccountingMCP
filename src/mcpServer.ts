import dotenv from "dotenv";
import express from "express";
import { Server as MCPServer } from "@modelcontextprotocol/sdk";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import { agents } from "./agents/index";

dotenv.config();

async function main() {
  // Initialize MCP server
  const server = new MCPServer({
    name: "LedgerLens MCP Server",
    version: "1.0.0"
  });

  // Register AI agents/tools
  agents.forEach((agent: any) => server.registerTool(agent));

  // Set up stdio transport (for desktop/CLI integration)
  const stdioTransport = new StdioServerTransport();
  stdioTransport.onmessage = (msg) => server.handleMessage(msg);
  server.onmessage = (msg: any) => stdioTransport.send(msg);
  stdioTransport.start();

  // Set up HTTP+SSE via Express
  const app = express();
  app.use(express.json());

  // SSE endpoint for MCP
  app.get("/mcp", (req, res) => {
    const sseTransport = new SSEServerTransport("/mcp", res);
    sseTransport.onmessage = (msg) => server.handleMessage(msg);
    server.onmessage = (msg: any) => sseTransport.send(msg);
    sseTransport.start();
  });
  // POST endpoint for MCP messages
  app.post("/mcp", (req, res) => {
    const sseTransport = new SSEServerTransport("/mcp", res);
    sseTransport.handlePostMessage(req, res, req.body);
  });

  // Start HTTP server
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`MCP HTTP+SSE at http://localhost:${port}/mcp`));
}

main().catch(err => {
  console.error("Error starting MCP server:", err);
  process.exit(1);
});
