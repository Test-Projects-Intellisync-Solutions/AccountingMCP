// src/agents/types.ts

export interface ToolResult {
  success: boolean;
  result: any;
}

export interface Tool {
  name: string;
  description: string;
  run: (args: { parameters?: Record<string, any>; context?: Record<string, any> }) => Promise<ToolResult>;
}
