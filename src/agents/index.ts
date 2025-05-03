import type { Tool } from "../modelcontextprotocol/tool";
import { parserAgent } from "./parserAgent";
import { categorizeTransactions } from "./categorizerAgent";
import { crudAgent } from "./crudAgent";
import { analyzerAgent } from "./analyzerAgent";
import { recommenderAgent } from "./recommenderAgent";
import { statementValidatorAgent } from "./statementValidatorAgent";
import { insightsUIAgent } from "./insightsUIAgent";
import { dataQualityAgent } from "./dataQualityAgent";
import { errorRecoveryAgent } from "./errorRecoveryAgent";
import { auditComplianceAgent } from "./auditComplianceAgent";
import { userFeedbackAgent } from "./userFeedbackAgent";
import { notificationAgent } from "./notificationAgent";
import { integrationAgent } from "./integrationAgent";
import { privacyRedactionAgent } from "./privacyRedactionAgent";
import { localizationAgent } from "./localizationAgent";
import { sessionStateAgent } from "./sessionStateAgent";
import { summarizationAgent } from "./summarizationAgent";
import { documentConversionAgent } from "./documentConversionAgent";
import { accessControlAgent } from "./accessControlAgent";
import { explainabilityAgent } from "./explainabilityAgent";
import { financialMetricsAgent } from "./financialMetricsAgent";

export const agents: Tool[] = [
  parserAgent,
  categorizeTransactions,
  crudAgent,
  analyzerAgent,
  recommenderAgent,
  statementValidatorAgent,
  insightsUIAgent,
  dataQualityAgent,
  errorRecoveryAgent,
  auditComplianceAgent,
  userFeedbackAgent,
  notificationAgent,
  integrationAgent,
  privacyRedactionAgent,
  localizationAgent,
  sessionStateAgent,
  summarizationAgent,
  documentConversionAgent,
  accessControlAgent,
  explainabilityAgent,
  financialMetricsAgent,
];