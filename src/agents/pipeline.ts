import { parserAgent } from "./parserAgent";
import { statementValidatorAgent } from "./statementValidatorAgent";
import { dataQualityAgent } from "./dataQualityAgent";
import { insightsUIAgent } from "./insightsUIAgent";

/**
 * Runs the agent pipeline in sequence: parser -> validator -> data quality -> insights.
 * Each agent receives the result of the previous one.
 */
export async function runPipeline({ file, format, content }: { file: string; format: string; content: any }) {
  // Step 1: Parse
  const parseResult = await parserAgent.run({ parameters: { action: "parseFile", file, format, content }, context: {} });
  if (!parseResult.success) return { error: "Parsing failed", details: parseResult };
  const parsed = (await parseResult.result).parsed || parseResult.result;

  // Step 2: Validate (if agent exists)
  let validated = parsed;
  if (statementValidatorAgent && statementValidatorAgent.run) {
    const valResult = await statementValidatorAgent.run({ parameters: { content: parsed }, context: {} });
    if (valResult.success) validated = valResult.result;
  }

  // Step 3: Data Quality (if agent exists)
  let cleaned = validated;
  if (dataQualityAgent && dataQualityAgent.run) {
    const dqResult = await dataQualityAgent.run({ parameters: { content: validated }, context: {} });
    if (dqResult.success) cleaned = dqResult.result;
  }

  // Step 4: Insights (if agent exists)
  let insights = cleaned;
  if (insightsUIAgent && insightsUIAgent.run) {
    const insResult = await insightsUIAgent.run({ parameters: { content: cleaned }, context: {} });
    if (insResult.success) insights = insResult.result;
  }

  return { parsed, validated, cleaned, insights };
}
