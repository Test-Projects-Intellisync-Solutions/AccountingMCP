import { MCPServer } from "../mcp/server";
import express from "express";

/**
 * Stub for HTTP+SSE transport. Sets up a Server-Sent Events endpoint for MCP messages.
 */
export function httpSseTransport(server: MCPServer, app: express.Application, path: string): void {
  // TODO: implement actual HTTP+SSE message loop
  app.get(path, (req, res) => {
    res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    res.write('event: connect\n');
    res.write('data: MCP HTTP+SSE stub connected\n\n');
  });
  console.warn("httpSseTransport: stub not fully implemented");
}
