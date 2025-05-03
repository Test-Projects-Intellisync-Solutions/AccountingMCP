import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

// Use GPT-4.1-nano as default model per project/user rules
const OPENAI_MODEL = "gpt-4.1-nano";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables.");
}

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Call OpenAI with a prompt and return the response text.
 * @param prompt - The prompt string to send to the model.
 * @param options - Optional overrides (model, temperature, etc.)
 */
export async function callOpenAI(prompt: string, options?: {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}): Promise<string> {
  const model = options?.model || OPENAI_MODEL;
  const temperature = options?.temperature ?? 0.7;
  const max_tokens = options?.max_tokens ?? 512;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are an expert financial assistant." },
      { role: "user", content: prompt }
    ],
    temperature,
    max_tokens
  });

  // Return the first response choice
  return response.choices[0]?.message?.content?.trim() || "";
}

// Example usage (uncomment to test)
// (async () => {
//   const result = await callOpenAI("Summarize the latest financial trends.");
//   console.log(result);
// })();
