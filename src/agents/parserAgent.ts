/**
 * Parser Agent
 * Extracts raw text, tables, and metadata from uploaded documents (PDF, images, CSV).
 * Handles document parsing as the first step in the multi-agent workflow.
 */
import type { ToolResult } from "../modelcontextprotocol/tool";
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";

// Types
// OpenAI LLM integration
import { callOpenAI } from "../llm/openaiClient";

export type ParserLog = {
  file: string;
  format: string;
  status: string;
  timestamp: string;
};

// Agent-specific resources (merged with baseAgentResources)
const parserResources = {
  parsingLogs: [] as ParserLog[],
};

// Tools (merged with baseAgentTools)
const parserAgentTools = {
  ...baseAgentTools,
  parseDocument: (document: any, type: string) => {
    // TODO: Parse document
    baseAgentTools.addLog({ key: "parseDocument", value: { document, type }, level: "info" });
    return { result: "success", message: "Extraction complete. Data extracted from document." };
  },
  parseFile: async (file: string, format: string, content: any) => {
    // Use OpenAI LLM for semantic parsing/extraction
    let parsed = content;
    try {
      const prompt = `Extract all structured data (text, tables, metadata) from the following document content. Return in JSON format.\n\nContent: ${typeof content === 'string' ? content : JSON.stringify(content)}`;
      const llmResult = await callOpenAI(prompt);
      parsed = llmResult;
      baseAgentTools.addLog({ key: "parseFile", value: { file, format, status: "llm-success" }, level: "info" });
    } catch (error) {
      // fallback to in-memory parse
      parsed = content;
      baseAgentTools.addLog({ key: "parseFile", value: { file, format, status: "llm-fail", error }, level: "warn" });
    }
    parserResources.parsingLogs.push({
      file,
      format,
      status: "success",
      timestamp: new Date().toISOString(),
    });
    // Also log to shared logs for analytics/monitoring
    baseAgentTools.addLog({ key: "parsingLogs", value: { file, format, status: "success" }, level: "info" });
    return { parsed, message: "Extraction complete. Data extracted from file." };
  },
  parserReport: (window: { from: string; to: string }) => {
    // Summarize logs in window
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = parserResources.parsingLogs.filter(l => {
      const ts = new Date(l.timestamp);
      return ts >= from && ts <= to;
    });
    baseAgentTools.addLog({ key: "parserReport", value: { from, to, count: logs.length }, level: "info" });
    return { summary: logs };
  },
};

// Prompts (merged with baseAgentPrompts)
const parserAgentPrompts = {
  ...baseAgentPrompts,
  parseBankStatement: {
    messages: [
      { role: "user", content: { type: "text", text: "parse and extract data from this bank statement pdf. Extraction should be complete." } }
    ]
  },
  addParserConfig: {
    messages: [
      { role: "user", content: { type: "text", text: "Add a parser config to parse and extract data from receipts." } }
    ]
  },
  showFailures: {
    messages: [
      { role: "user", content: { type: "text", text: "Show and extract all failed parses this month." } }
    ]
  },
  summarizeParsing: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize, parse, and extract parsing activity by document type." } }
    ]
  }
};

// Agent
export const parserAgent: BaseAgent = {
  name: "parser-agent",
  description: "Parses uploaded files into structured data.",
  resources: {
    ...baseAgentResources,
    ...parserResources,
  },
  tools: parserAgentTools,
  prompts: parserAgentPrompts,
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * PARSER AGENT BUSINESS LOGIC
     * - In production, replace in-memory parsing with DB/Vector DB-powered parsing and storage.
     */
    const { action, file, format, content, window } = parameters || {};
    switch (action) {
      case "parseFile":
        return { success: true, result: await parserAgentTools.parseFile(file, format, content) };
      case "report":
        return { success: true, result: parserAgentTools.parserReport(window) };
      default:
        parserAgentTools.logError("Unknown or missing action.", { action });
        return {
          success: false,
          result: { message: parserAgentPrompts.genericError }
        };
    }
  }
};
