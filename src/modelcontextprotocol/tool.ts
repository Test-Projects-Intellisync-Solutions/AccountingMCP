export interface Tool {
  name: string;
  description?: string;
  run: (args: { parameters: any; context: any }) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  result?: any;
}
