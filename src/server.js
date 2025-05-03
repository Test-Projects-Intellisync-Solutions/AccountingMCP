import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import parserRoutes from './api/parser';
import documentsRoutes from './api/documents';
import validatorRoutes from './api/validator';
import qualityRoutes from './api/quality';
import insightsRoutes from './api/insights';
import categorizerRoutes from './api/categorizer';
import crudRoutes from './api/crud';
import analyzerRoutes from './api/analyzer';
import recommenderRoutes from './api/recommender';
import errorRecoveryRoutes from './api/errorRecovery';
import accessControlRoutes from './api/accessControl';
import explainabilityRoutes from './api/explainability';
import auditComplianceRoutes from './api/auditCompliance';
import userFeedbackRoutes from './api/userFeedback';
import notificationRoutes from './api/notification';
import integrationRoutes from './api/integration';
import privacyRedactionRoutes from './api/privacyRedaction';
import localizationRoutes from './api/localization';
import sessionStateRoutes from './api/sessionState';
import summarizationRoutes from './api/summarization';
import documentConversionRoutes from './api/documentConversion';
import financialMetricsRoutes from './api/financialMetrics';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware

// Parser Agent endpoints
app.use('/api/parser', parserRoutes);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));



// Multi-format document upload route
app.use('/api/documents', documentsRoutes);
// Statement Validator Agent endpoints
app.use('/api/validator', validatorRoutes);
// Data Quality Agent endpoints
app.use('/api/quality', qualityRoutes);
// Insights UI Agent endpoints
app.use('/api/insights', insightsRoutes);
// Categorizer Agent endpoints
app.use('/api/categorizer', categorizerRoutes);
// Financial Metrics Agent endpoints
app.use('/api/financial-metrics', financialMetricsRoutes);
// CRUD Agent endpoints
app.use('/api/crud', crudRoutes);
// Analyzer Agent endpoints
app.use('/api/analyzer', analyzerRoutes);
// Recommender Agent endpoints
app.use('/api/recommender', recommenderRoutes);
// Error Recovery Agent endpoints
app.use('/api/error-recovery', errorRecoveryRoutes);
// Access Control Agent endpoints
app.use('/api/access-control', accessControlRoutes);
// Explainability Agent endpoints
app.use('/api/explainability', explainabilityRoutes);
// Audit Compliance Agent endpoints
app.use('/api/audit-compliance', auditComplianceRoutes);
// User Feedback Agent endpoints
app.use('/api/user-feedback', userFeedbackRoutes);
// Notification Agent endpoints
app.use('/api/notification', notificationRoutes);
// Integration Agent endpoints
app.use('/api/integration', integrationRoutes);
// Privacy Redaction Agent endpoints
app.use('/api/privacy-redaction', privacyRedactionRoutes);
// Localization Agent endpoints
app.use('/api/localization', localizationRoutes);
// Session State Agent endpoints
app.use('/api/session-state', sessionStateRoutes);
// Summarization Agent endpoints
app.use('/api/summarization', summarizationRoutes);
// Document Conversion Agent endpoints
app.use('/api/document-conversion', documentConversionRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
