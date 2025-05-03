// / **
//  * Recommender Agent
//  * Offers AI-suggested financial actions based on analysis results (e.g., reduce overhead, optimize spending).
//  * Provides actionable recommendations to users.
//  * /
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import { callOpenAI } from "../llm/openaiClient";

export type RecommendationLog = {
  type: string;
  recommended: number;
  user: string;
  timestamp: string;
};

// Resources
export const recommenderResources = {
  suggestionTypes: ["Reduce Overhead", "Optimize Spending", "Increase Revenue"],
  recommendationTypes: ["savings", "investment", "expense"],
  recommendationLogs: [] as RecommendationLog[],
};

// Tools
export const recommenderAgentTools = {
  generateRecommendation: (context: any) => {
    // TODO: Generate recommendation
    return { recommendation: "", message: "Recommendation generated." };
  },
  recommend: async (type: string, user: string, context: any) => {
    // Use OpenAI LLM for personalized recommendation
    let recommended = 100;
    let message = '';
    try {
      const prompt = `You are a financial assistant. Based on the following user context, recommend an action or amount for type '${type}'.\n\nUser: ${user}\nContext: ${JSON.stringify(context)}`;
      message = await callOpenAI(prompt);
      // Try to extract a recommended amount from the response, fallback to 100
      const match = message.match(/\$?(\d+[\d,]*)/);
      if (match) {
        recommended = parseInt(match[1].replace(/,/g, ''), 10);
      }
    } catch (error) {
      message = `Recommended action for ${type}: $${recommended}`;
    }
    recommenderResources.recommendationLogs.push({
      type,
      recommended,
      user,
      timestamp: new Date().toISOString(),
    });
    return { recommended, message: `Recommendation: ${message}` };
  },
  recommendationReport: (window: { from: string; to: string }) => {
    // Summarize logs in window
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = recommenderResources.recommendationLogs.filter(l => {
      const ts = new Date(l.timestamp);
      return ts >= from && ts <= to;
    });
    return { summary: logs };
  },
};

// Prompts
export const recommenderAgentPrompts = {
  generateSavingsTip: {
    messages: [
      { role: "user", content: { type: "text", text: "recommend a tip or way to save on recurring expenses. The recommendation should be actionable." } }
    ]
  },
  addModel: {
    messages: [
      { role: "user", content: { type: "text", text: "add a new tip or recommendation model to help users save, with saving and investment strategies." } }
    ]
  },
  showRecommendations: {
    messages: [
      { role: "user", content: { type: "text", text: "Show all tips and recommendations accepted by user <userId> to help save." } }
    ]
  },
  summarizeAcceptance: {
    messages: [
      { role: "user", content: { type: "text", text: "summarize tip and save recommendation acceptance rates." } }
    ]
  },
  suggestAction: {
    messages: [
      { role: "user", content: { type: "text", text: "recommend or suggest a financial tip or action to help save in this scenario." } }
    ]
  },
};

// Agent
export const recommenderAgent: Tool = {
  name: "recommender-agent",
  description: "Suggests personalized financial actions based on user data.",
  async run({ parameters, context }): Promise<ToolResult> {
    /**
     * RECOMMENDER AGENT BUSINESS LOGIC
     * - In production, replace in-memory recommendations with DB/Vector DB-powered personalization.
     */
    const { action, type, user, contextData, window } = parameters || {};
    switch (action) {
      case "recommend":
        return { success: true, result: recommenderAgentTools.recommend(type, user, contextData) };
      case "report":
        return { success: true, result: recommenderAgentTools.recommendationReport(window) };
      default:
        return {
          success: false,
          result: { message: "Unknown or missing action. Supported: recommend, report. Recommendation action required." }
        };
    }
    return {
      success: true,
      result: {
        type,
        recommended: 100,
        message: `Recommended action for ${type}: $100`
      }
    };
  }
};
