/**
 * User Feedback Agent
 * Collects user feedback on AI outputs and routes it for model improvement or manual review.
 * Enables continuous learning and quality assurance.
 */
import type { Tool, ToolResult } from "../modelcontextprotocol/tool";

// Types
// OpenAI LLM integration
import type { BaseAgent } from "./BaseAgent";
import { baseAgentResources, baseAgentTools, baseAgentPrompts } from "./BaseAgent";
import { callOpenAI } from "../llm/openaiClient";

// Resources
type FeedbackForm = { type: string; questions: string[] };
type FeedbackLog = { userId: string; form: string; rating?: number; comment?: string; timestamp: string };

export const userFeedbackAgentResources = {
  ...baseAgentResources,
  feedbackForms: FeedbackForm[];
  feedbackLogs: FeedbackLog[];
} = {
  feedbackForms: [
    // Example: { type: "dashboard", questions: ["How useful was this dashboard?"] }
  ],
  feedbackLogs: [
    // Example: { userId: "user1", form: "dashboard", rating: 4, comment: "Very helpful!", timestamp: "2025-04-22T16:00:00Z" }
  ]
};

// Tools
export const userFeedbackAgentTools = {
  submitFeedback: (form: string, data: Omit<FeedbackLog, "form" | "timestamp">) => {
    userFeedbackAgentResources.feedbackLogs.push({
      ...data,
      form,
      timestamp: new Date().toISOString(),
    });
    return { success: true };
  },
  defineFeedbackForm: (type: string, questions: string[]) => {
    const idx = userFeedbackAgentResources.feedbackForms.findIndex((f: FeedbackForm) => f.type === type);
    if (idx !== -1) {
      userFeedbackAgentResources.feedbackForms[idx].questions = questions;
    } else {
      userFeedbackAgentResources.feedbackForms.push({ type, questions });
    }
    return { success: true };
  },
  feedbackReport: (window: { from: string; to: string }) => {
    const from = new Date(window.from);
    const to = new Date(window.to);
    const logs = userFeedbackAgentResources.feedbackLogs.filter((log: FeedbackLog) => {
      const ts = new Date(log.timestamp);
      return ts >= from && ts <= to;
    });
    type Summary = { count: number; ratings: number[]; averageRating?: number | null };
    const summary: Record<string, Summary> = {};
    logs.forEach((log) => {
      if (!summary[log.form]) summary[log.form] = { count: 0, ratings: [] };
      summary[log.form].count++;
      if (typeof log.rating === "number") summary[log.form].ratings.push(log.rating);
    });
    Object.values(summary).forEach((val) => {
      val.averageRating = val.ratings.length
        ? val.ratings.reduce((a, b) => a + b, 0) / val.ratings.length
        : null;
    });
    return { summary };
  },
};

// Prompts
export const userFeedbackAgentPrompts = {
  submitDashboardFeedback: {
    messages: [
      { role: "user", content: { type: "text", text: "Submit feedback for this dashboard." } }
    ]
  },
  addForm: {
    messages: [
      { role: "user", content: { type: "text", text: "Add a feedback form for report quality." } }
    ]
  },
  showFeedback: {
    messages: [
      { role: "user", content: { type: "text", text: "Show all feedback submitted by user <userId>." } }
    ]
  },
  summarizeFeedback: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize feedback by form type." } }
    ]
  }
};

// Agent
export const userFeedbackAgent: Tool = {
  name: "user-feedback-agent",
  description: "Collects user feedback on AI outputs and routes it for review or model improvement.",
  async run({ parameters, context }): Promise<ToolResult> {
    // LLM-powered feedback analysis
    const { feedback } = parameters || {};
    let message = '';
    if (feedback && typeof feedback === 'string') {
      try {
        message = await callOpenAI(
          `You are a product feedback analyst. Analyze the following user feedback for sentiment and summarize it in 1-2 sentences.\n\nFeedback: ${feedback}`
        );
      } catch (error) {
        message = 'Feedback analysis unavailable.';
      }
    } else {
      message = 'No feedback provided.';
    }
    return {
      success: true,
      result: { message }
    };
  }
};
