// src/agents/financialMetricsAgent.ts

/**
 * Metric definition structure for lookup and documentation.
 */
export interface MetricDefinition {
  name: string;
  formula: string; // Human-readable formula
  inputs: { statement: 'Income Statement' | 'Balance Sheet' | 'Cash Flow Statement'; fields: string[] }[];
}

/**
 * Raw parsed financial statement data for a period.
 */
export interface FinancialStatements {
  incomeStatement: Record<string, number>;
  balanceSheet: Record<string, number>;
  cashFlow: Record<string, number>;
}

/**
 * Core financial metric definitions (expandable).
 */
export const metricDefinitions: Record<string, MetricDefinition> = {
  'Current Ratio': {
    name: 'Current Ratio',
    formula: 'Current Assets ÷ Current Liabilities',
    inputs: [
      { statement: 'Balance Sheet', fields: ['currentAssets', 'currentLiabilities'] }
    ]
  },
  'Quick Ratio': {
    name: 'Quick Ratio',
    formula: '(Current Assets – Inventory) ÷ Current Liabilities',
    inputs: [
      { statement: 'Balance Sheet', fields: ['currentAssets', 'inventory', 'currentLiabilities'] }
    ]
  },
  'Cash Ratio': {
    name: 'Cash Ratio',
    formula: 'Cash & Cash Equivalents ÷ Current Liabilities',
    inputs: [
      { statement: 'Balance Sheet', fields: ['cashAndCashEquivalents', 'currentLiabilities'] }
    ]
  },
  'Debt-to-Equity Ratio': {
    name: 'Debt-to-Equity Ratio',
    formula: 'Total Liabilities ÷ Shareholders’ Equity',
    inputs: [
      { statement: 'Balance Sheet', fields: ['totalLiabilities', 'shareholdersEquity'] }
    ]
  },
  'Debt-to-Capital Ratio': {
    name: 'Debt-to-Capital Ratio',
    formula: 'Total Debt ÷ (Total Debt + Shareholders’ Equity)',
    inputs: [
      { statement: 'Balance Sheet', fields: ['totalLiabilities', 'shareholdersEquity'] }
    ]
  },
  'Interest Coverage Ratio': {
    name: 'Interest Coverage Ratio',
    formula: 'EBIT ÷ Interest Expense',
    inputs: [
      { statement: 'Income Statement', fields: ['ebit', 'interestExpense'] }
    ]
  },
  'Debt Service Coverage Ratio': {
    name: 'Debt Service Coverage Ratio',
    formula: 'Operating Cash Flow ÷ (Principal Payments + Interest Paid)',
    inputs: [
      { statement: 'Cash Flow Statement', fields: ['operatingCashFlow', 'principalPayments', 'interestPaid'] }
    ]
  },
  'Equity Multiplier': {
    name: 'Equity Multiplier',
    formula: 'Total Assets ÷ Shareholders’ Equity',
    inputs: [
      { statement: 'Balance Sheet', fields: ['totalAssets', 'shareholdersEquity'] }
    ]
  },
  'Gross Profit Margin': {
    name: 'Gross Profit Margin',
    formula: '(Revenue – Cost of Goods Sold) ÷ Revenue',
    inputs: [
      { statement: 'Income Statement', fields: ['revenue', 'costOfGoodsSold'] }
    ]
  },
  'Operating Margin': {
    name: 'Operating Margin',
    formula: 'Operating Income ÷ Revenue',
    inputs: [
      { statement: 'Income Statement', fields: ['operatingIncome', 'revenue'] }
    ]
  },
  'Net Profit Margin': {
    name: 'Net Profit Margin',
    formula: 'Net Income ÷ Revenue',
    inputs: [
      { statement: 'Income Statement', fields: ['netIncome', 'revenue'] }
    ]
  },
  'Return on Assets (ROA)': {
    name: 'Return on Assets (ROA)',
    formula: 'Net Income ÷ Average Total Assets',
    inputs: [
      { statement: 'Income Statement', fields: ['netIncome'] },
      { statement: 'Balance Sheet', fields: ['totalAssets'] }
    ]
  },
  'Return on Equity (ROE)': {
    name: 'Return on Equity (ROE)',
    formula: 'Net Income ÷ Average Shareholders’ Equity',
    inputs: [
      { statement: 'Income Statement', fields: ['netIncome'] },
      { statement: 'Balance Sheet', fields: ['shareholdersEquity'] }
    ]
  },
  'Return on Invested Capital (ROIC)': {
    name: 'Return on Invested Capital (ROIC)',
    formula: 'NOPAT ÷ (Total Debt + Shareholders’ Equity)',
    inputs: [
      { statement: 'Income Statement', fields: ['nopat'] },
      { statement: 'Balance Sheet', fields: ['totalLiabilities', 'shareholdersEquity'] }
    ]
  },
  'Asset Turnover': {
    name: 'Asset Turnover',
    formula: 'Revenue ÷ Average Total Assets',
    inputs: [
      { statement: 'Income Statement', fields: ['revenue'] },
      { statement: 'Balance Sheet', fields: ['totalAssets'] }
    ]
  },
  'Inventory Turnover': {
    name: 'Inventory Turnover',
    formula: 'Cost of Goods Sold ÷ Average Inventory',
    inputs: [
      { statement: 'Income Statement', fields: ['costOfGoodsSold'] },
      { statement: 'Balance Sheet', fields: ['inventory'] }
    ]
  },
  'Days Inventory Outstanding (DIO)': {
    name: 'Days Inventory Outstanding (DIO)',
    formula: '365 ÷ Inventory Turnover',
    inputs: [
      { statement: 'Income Statement', fields: ['costOfGoodsSold'] },
      { statement: 'Balance Sheet', fields: ['inventory'] }
    ]
  },
  'Receivables Turnover': {
    name: 'Receivables Turnover',
    formula: 'Revenue ÷ Average Accounts Receivable',
    inputs: [
      { statement: 'Income Statement', fields: ['revenue'] },
      { statement: 'Balance Sheet', fields: ['accountsReceivable'] }
    ]
  },
  'Days Sales Outstanding (DSO)': {
    name: 'Days Sales Outstanding (DSO)',
    formula: '365 ÷ Receivables Turnover',
    inputs: [
      { statement: 'Income Statement', fields: ['revenue'] },
      { statement: 'Balance Sheet', fields: ['accountsReceivable'] }
    ]
  },
  'Payables Turnover': {
    name: 'Payables Turnover',
    formula: 'Cost of Goods Sold ÷ Average Accounts Payable',
    inputs: [
      { statement: 'Income Statement', fields: ['costOfGoodsSold'] },
      { statement: 'Balance Sheet', fields: ['accountsPayable'] }
    ]
  },
  'Days Payables Outstanding (DPO)': {
    name: 'Days Payables Outstanding (DPO)',
    formula: '365 ÷ Payables Turnover',
    inputs: [
      { statement: 'Income Statement', fields: ['costOfGoodsSold'] },
      { statement: 'Balance Sheet', fields: ['accountsPayable'] }
    ]
  },
  'Cash Conversion Cycle': {
    name: 'Cash Conversion Cycle',
    formula: 'DSO + DIO – DPO',
    inputs: [
      { statement: 'Income Statement', fields: ['revenue', 'costOfGoodsSold'] },
      { statement: 'Balance Sheet', fields: ['accountsReceivable', 'inventory', 'accountsPayable'] }
    ]
  },
  'Operating Cash Flow': {
    name: 'Operating Cash Flow',
    formula: 'Cash Receipts from Operations – Cash Paid for Operations',
    inputs: [
      { statement: 'Cash Flow Statement', fields: ['operatingCashFlow'] }
    ]
  },
  'Free Cash Flow': {
    name: 'Free Cash Flow',
    formula: 'Operating Cash Flow – Capital Expenditures',
    inputs: [
      { statement: 'Cash Flow Statement', fields: ['operatingCashFlow', 'capitalExpenditures'] }
    ]
  },
  'Cash Flow Margin': {
    name: 'Cash Flow Margin',
    formula: 'Operating Cash Flow ÷ Revenue',
    inputs: [
      { statement: 'Cash Flow Statement', fields: ['operatingCashFlow'] },
      { statement: 'Income Statement', fields: ['revenue'] }
    ]
  },
  'Cash Return on Assets': {
    name: 'Cash Return on Assets',
    formula: 'Operating Cash Flow ÷ Average Total Assets',
    inputs: [
      { statement: 'Cash Flow Statement', fields: ['operatingCashFlow'] },
      { statement: 'Balance Sheet', fields: ['totalAssets'] }
    ]
  },
  'Cash Coverage Ratio': {
    name: 'Cash Coverage Ratio',
    formula: '(Operating Cash Flow + Interest Paid + Taxes Paid) ÷ Interest Paid',
    inputs: [
      { statement: 'Cash Flow Statement', fields: ['operatingCashFlow', 'interestPaid', 'taxPaid'] }
    ]
  },
  'Price to Earnings (P/E)': {
    name: 'Price to Earnings (P/E)',
    formula: 'Share Price ÷ Earnings Per Share',
    inputs: [
      { statement: 'Income Statement', fields: ['earningsPerShare'] }
    ]
  },
  'Price to Book (P/B)': {
    name: 'Price to Book (P/B)',
    formula: 'Share Price ÷ Book Value Per Share',
    inputs: [
      { statement: 'Balance Sheet', fields: ['bookValuePerShare'] }
    ]
  },
  'Dividend Yield': {
    name: 'Dividend Yield',
    formula: 'Annual Dividends Per Share ÷ Share Price',
    inputs: [
      { statement: 'Income Statement', fields: ['dividendsPerShare'] }
    ]
  }
};

export class FinancialMetricsAgent {
  /**
   * Summarize all metrics for a given period.
   */
  public summarizeAllMetricsForPeriod(period: string): Record<string, number | null> {
    return Object.keys(metricDefinitions).reduce((acc, metric) => {
      acc[metric] = this.calculateMetric(metric, period);
      return acc;
    }, {} as Record<string, number | null>);
  }
  private historicalData: Record<string, FinancialStatements>; // keyed by period (e.g., '2024-Q1')

  constructor(historicalData: Record<string, FinancialStatements> = {}) {
    this.historicalData = historicalData;
  }

  /**
   * Calculate a financial metric for a given period.
   */
  calculateMetric(metricName: string, period: string): number | null {
    const def = metricDefinitions[metricName];
    const data = this.historicalData[period];
    if (!def || !data) return null;

    switch (metricName) {
      case 'Current Ratio': {
        const { currentAssets: ca, currentLiabilities: cl } = data.balanceSheet;
        return (cl !== 0) ? ca / cl : null;
      }
      case 'Quick Ratio': {
        const { currentAssets, inventory, currentLiabilities } = data.balanceSheet;
        return (currentLiabilities !== 0) ? (currentAssets - inventory) / currentLiabilities : null;
      }
      case 'Cash Ratio': {
        const { cashAndCashEquivalents, currentLiabilities } = data.balanceSheet;
        return (currentLiabilities !== 0) ? cashAndCashEquivalents / currentLiabilities : null;
      }
      case 'Debt-to-Equity Ratio': {
        const { totalLiabilities: tl, shareholdersEquity: se } = data.balanceSheet;
        return (se !== 0) ? tl / se : null;
      }
      case 'Debt-to-Capital Ratio': {
        const { totalLiabilities, shareholdersEquity } = data.balanceSheet;
        const denom = totalLiabilities + shareholdersEquity;
        return (denom !== 0) ? totalLiabilities / denom : null;
      }
      case 'Interest Coverage Ratio': {
        const { ebit } = data.incomeStatement;
        const { interestExpense } = data.incomeStatement;
        return (interestExpense !== 0) ? ebit / interestExpense : null;
      }
      case 'Debt Service Coverage Ratio': {
        const { operatingCashFlow } = data.cashFlow;
        const { principalPayments, interestPaid } = data.cashFlow;
        const denom = principalPayments + interestPaid;
        return (denom !== 0) ? operatingCashFlow / denom : null;
      }
      case 'Equity Multiplier': {
        const { totalAssets } = data.balanceSheet;
        const { shareholdersEquity } = data.balanceSheet;
        return (shareholdersEquity !== 0) ? totalAssets / shareholdersEquity : null;
      }
      case 'Gross Profit Margin': {
        const { revenue, costOfGoodsSold: cogs } = data.incomeStatement;
        return (revenue !== 0) ? (revenue - cogs) / revenue : null;
      }
      case 'Operating Margin': {
        const { operatingIncome, revenue } = data.incomeStatement;
        return (revenue !== 0) ? operatingIncome / revenue : null;
      }
      case 'Net Profit Margin': {
        const { netIncome, revenue: rev } = data.incomeStatement;
        return (rev !== 0) ? netIncome / rev : null;
      }
      case 'Return on Assets (ROA)': {
        const { netIncome } = data.incomeStatement;
        const { totalAssets: assets } = data.balanceSheet;
        return (assets !== 0) ? netIncome / assets : null;
      }
      case 'Return on Equity (ROE)': {
        const { netIncome } = data.incomeStatement;
        const { shareholdersEquity } = data.balanceSheet;
        return (shareholdersEquity !== 0) ? netIncome / shareholdersEquity : null;
      }
      case 'Return on Invested Capital (ROIC)': {
        const { nopat } = data.incomeStatement;
        const { totalLiabilities, shareholdersEquity } = data.balanceSheet;
        const denom = totalLiabilities + shareholdersEquity;
        return (denom !== 0) ? nopat / denom : null;
      }
      case 'Asset Turnover': {
        const { revenue } = data.incomeStatement;
        const { totalAssets } = data.balanceSheet;
        return (totalAssets !== 0) ? revenue / totalAssets : null;
      }
      case 'Inventory Turnover': {
        const { costOfGoodsSold } = data.incomeStatement;
        const { inventory } = data.balanceSheet;
        return (inventory !== 0) ? costOfGoodsSold / inventory : null;
      }
      case 'Days Inventory Outstanding (DIO)': {
        const dio = this.calculateMetric('Inventory Turnover', period);
        return (dio !== null && dio !== 0) ? 365 / dio : null;
      }
      case 'Receivables Turnover': {
        const { revenue } = data.incomeStatement;
        const { accountsReceivable } = data.balanceSheet;
        return (accountsReceivable !== 0) ? revenue / accountsReceivable : null;
      }
      case 'Days Sales Outstanding (DSO)': {
        const rto = this.calculateMetric('Receivables Turnover', period);
        return (rto !== null && rto !== 0) ? 365 / rto : null;
      }
      case 'Payables Turnover': {
        const { costOfGoodsSold } = data.incomeStatement;
        const { accountsPayable } = data.balanceSheet;
        return (accountsPayable !== 0) ? costOfGoodsSold / accountsPayable : null;
      }
      case 'Days Payables Outstanding (DPO)': {
        const pto = this.calculateMetric('Payables Turnover', period);
        return (pto !== null && pto !== 0) ? 365 / pto : null;
      }
      case 'Cash Conversion Cycle': {
        const dsoValue = this.calculateMetric('Days Sales Outstanding (DSO)', period);
        const dioValue = this.calculateMetric('Days Inventory Outstanding (DIO)', period);
        const dpoValue = this.calculateMetric('Days Payables Outstanding (DPO)', period);
        if ([dsoValue, dioValue, dpoValue].some(v => v === null)) return null;
        return (dsoValue as number) + (dioValue as number) - (dpoValue as number);
      }
      case 'Operating Cash Flow': {
        return data.cashFlow.operatingCashFlow ?? null;
      }
      case 'Free Cash Flow': {
        const { operatingCashFlow, capitalExpenditures } = data.cashFlow;
        return (operatingCashFlow !== undefined && capitalExpenditures !== undefined)
          ? operatingCashFlow - capitalExpenditures : null;
      }
      case 'Cash Flow Margin': {
        const ocf = data.cashFlow.operatingCashFlow;
        const revFlow = data.incomeStatement.revenue;
        return (revFlow !== 0) ? ocf / revFlow : null;
      }
      case 'Cash Return on Assets': {
        const ocfAssets = data.cashFlow.operatingCashFlow;
        const assetsCR = data.balanceSheet.totalAssets;
        return (assetsCR !== 0) ? ocfAssets / assetsCR : null;
      }
      case 'Cash Coverage Ratio': {
        const { operatingCashFlow: ocfCover, interestPaid: ipCover, taxPaid } = data.cashFlow;
        return (ipCover !== 0) ? (ocfCover + ipCover + (taxPaid ?? 0)) / ipCover : null;
      }
      case 'Price to Earnings (P/E)': {
        const eps = data.incomeStatement.earningsPerShare as number;
        const sp = data.incomeStatement.sharePrice as number;
        return (eps !== 0) ? sp / eps : null;
      }
      case 'Price to Book (P/B)': {
        const bvps = data.balanceSheet.bookValuePerShare as number;
        const spBook = data.incomeStatement.sharePrice as number;
        return (bvps !== 0) ? spBook / bvps : null;
      }
      case 'Dividend Yield': {
        const dps = data.incomeStatement.dividendsPerShare as number;
        const spDiv = data.incomeStatement.sharePrice as number;
        return (spDiv !== 0) ? dps / spDiv : null;
      }
      default:
        return null;
    }
  }

  /**
   * Compare a metric between two periods (returns delta and percent change).
   */
  compareMetrics(metricName: string, periodA: string, periodB: string): { delta: number; percentChange: number } | null {
    const valA = this.calculateMetric(metricName, periodA);
    const valB = this.calculateMetric(metricName, periodB);
    if (valA === null || valB === null) return null;
    const delta = valB - valA;
    const percentChange = valA !== 0 ? (delta / Math.abs(valA)) * 100 : 0;
    return { delta, percentChange };
  }

  /**
   * Generate a trend (time series) for a metric between two periods (inclusive).
   * Assumes periods are sortable strings (e.g., '2024-Q1', '2024-Q2', ...).
   */
  generateTrend(metricName: string, startPeriod: string, endPeriod: string): Array<{ period: string; value: number | null }> {
    const periods = Object.keys(this.historicalData).sort();
    const startIdx = periods.indexOf(startPeriod);
    const endIdx = periods.indexOf(endPeriod);
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return [];
    return periods.slice(startIdx, endIdx + 1).map(period => ({
      period,
      value: this.calculateMetric(metricName, period)
    }));
  }

  /**
   * Monitor a metric and trigger a callback if a threshold is crossed.
   */
  alertOnThreshold(
    metricName: string,
    threshold: number,
    direction: 'above' | 'below',
    callback: (alert: { period: string; value: number }) => void
  ) {
    for (const period in this.historicalData) {
      const value = this.calculateMetric(metricName, period);
      if (value === null) continue;
      if ((direction === 'above' && value > threshold) || (direction === 'below' && value < threshold)) {
        callback({ period, value });
      }
    }
  }

  // Extension: Add prompt handling, LLM integration, more metrics, etc.
}

// =====================
// Resources
// =====================

export const financialMetricsAgentResources = {
  metricDefinitions,
  // Optionally, add mock/historical data here for development or testing:
  // historicalData: { ... }
};

// =====================
// Tools
// =====================

export const financialMetricsAgentTools = {
  /**
   * List all available metrics and their formulas.
   */
  listAvailableMetrics: () => Object.values(metricDefinitions).map(m => ({ name: m.name, formula: m.formula })),

  /**
   * Explain a metric: formula, required fields, and description.
   */
  explainMetric: ({ metricName }: { metricName: string }) =>
    metricDefinitions[metricName] || { message: "Metric not found." },

  /**
   * List all available periods in the historical data.
   */
  listPeriods: ({ historicalData }: { historicalData: Record<string, FinancialStatements> }) =>
    Object.keys(historicalData),

  /**
   * Get required input fields for a metric.
   */
  getMetricInputs: ({ metricName }: { metricName: string }) =>
    metricDefinitions[metricName]?.inputs || [],

  /**
   * Summarize all metrics for a given period.
   */
  summarizeAllMetricsForPeriod: ({ period, historicalData }: { period: string, historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    return agent.summarizeAllMetricsForPeriod(period);
  },

  /**
   * Find metrics above or below a threshold for a period.
   */
  findMetricsAboveBelowThreshold: ({ period, threshold, direction, historicalData }: { period: string, threshold: number, direction: 'above' | 'below', historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    return Object.keys(metricDefinitions).filter(metric => {
      const value = agent.calculateMetric(metric, period);
      if (value === null) return false;
      return direction === 'above' ? value > threshold : value < threshold;
    });
  },

  /**
   * Rank metrics by their percentage change between two periods.
   */
  rankMetricsByChange: ({ periodA, periodB, historicalData }: { periodA: string, periodB: string, historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    const changes = Object.keys(metricDefinitions).map(metric => {
      const cmp = agent.compareMetrics(metric, periodA, periodB);
      return {
        metric,
        percentChange: cmp ? cmp.percentChange : null
      };
    });
    return changes.sort((a, b) => (b.percentChange ?? 0) - (a.percentChange ?? 0));
  },

  /**
   * Get missing data fields for a metric for a given period.
   */
  getMissingDataForMetric: ({ metricName, period, historicalData }: { metricName: string, period: string, historicalData: Record<string, FinancialStatements> }) => {
    const def = metricDefinitions[metricName];
    const data = historicalData[period];
    if (!def || !data) return [];
    const missing: string[] = [];
    def.inputs.forEach(input => {
      const section =
        input.statement === 'Income Statement' ? data.incomeStatement :
        input.statement === 'Balance Sheet' ? data.balanceSheet :
        input.statement === 'Cash Flow Statement' ? data.cashFlow : undefined;
      if (section) {
        input.fields.forEach(field => {
          if (!(field in section) || section[field] === undefined || section[field] === null) {
            missing.push(`${input.statement}: ${field}`);
          }
        });
      }
    });
    return missing;
  },
  /**
   * Calculate a metric for a given period.
   */
  calculateMetric: ({ metricName, period, historicalData }: { metricName: string, period: string, historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    return agent.calculateMetric(metricName, period);
  },

  /**
   * Compare a metric between two periods.
   */
  compareMetrics: ({ metricName, periodA, periodB, historicalData }: { metricName: string, periodA: string, periodB: string, historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    return agent.compareMetrics(metricName, periodA, periodB);
  },

  /**
   * Generate a trend for a metric over a period range.
   */
  generateTrend: ({ metricName, startPeriod, endPeriod, historicalData }: { metricName: string, startPeriod: string, endPeriod: string, historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    return agent.generateTrend(metricName, startPeriod, endPeriod);
  },

  /**
   * Monitor a metric and trigger a callback if a threshold is crossed.
   */
  alertOnThreshold: ({ metricName, threshold, direction, historicalData, callback }: { metricName: string, threshold: number, direction: 'above' | 'below', historicalData: Record<string, FinancialStatements>, callback: (alert: { period: string, value: number }) => void }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    return agent.alertOnThreshold(metricName, threshold, direction, callback);
  },

  /**
   * Get the top N metrics by value for a period.
   */
  getTopNMetricsByValue: ({ period, historicalData, n }: { period: string, historicalData: Record<string, FinancialStatements>, n: number }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    const all = Object.keys(metricDefinitions).map(metric => ({
      metric,
      value: agent.calculateMetric(metric, period)
    })).filter(m => typeof m.value === 'number');
    return all.sort((a, b) => (b.value as number) - (a.value as number)).slice(0, n);
  },

  /**
   * Get the bottom N metrics by value for a period.
   */
  getBottomNMetricsByValue: ({ period, historicalData, n }: { period: string, historicalData: Record<string, FinancialStatements>, n: number }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    const all = Object.keys(metricDefinitions).map(metric => ({
      metric,
      value: agent.calculateMetric(metric, period)
    })).filter(m => typeof m.value === 'number');
    return all.sort((a, b) => (a.value as number) - (b.value as number)).slice(0, n);
  },

  /**
   * Get metrics with the largest absolute change between two periods.
   */
  getMetricsWithLargestChange: ({ periodA, periodB, historicalData, n }: { periodA: string, periodB: string, historicalData: Record<string, FinancialStatements>, n: number }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    const changes = Object.keys(metricDefinitions).map(metric => {
      const cmp = agent.compareMetrics(metric, periodA, periodB);
      return {
        metric,
        absChange: cmp ? Math.abs(cmp.delta) : null,
        percentChange: cmp ? cmp.percentChange : null
      };
    }).filter(m => m.absChange !== null);
    return changes.sort((a, b) => (b.absChange as number) - (a.absChange as number)).slice(0, n);
  },

  /**
   * Summarize trends across periods: improving, declining, stable.
   */
  summarizeTrendsAcrossPeriods: ({ metricName, periods, historicalData }: { metricName: string, periods: string[], historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    const values = periods.map(p => agent.calculateMetric(metricName, p)).filter(v => typeof v === 'number') as number[];
    if (values.length < 2) return { trend: 'insufficient data', values };
    const diffs = values.slice(1).map((v, i) => v - values[i]);
    const sum = diffs.reduce((a, b) => a + b, 0);
    const trend = sum > 0 ? 'improving' : sum < 0 ? 'declining' : 'stable';
    return { trend, values };
  },

  /**
   * Detect anomalies: metrics that deviate from their historical average by more than X std deviations.
   */
  detectAnomaliesInMetrics: ({ period, historicalData, stddevThreshold }: { period: string, historicalData: Record<string, FinancialStatements>, stddevThreshold: number }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    const periods = Object.keys(historicalData);
    return Object.keys(metricDefinitions).map(metric => {
      const values = periods.map(p => agent.calculateMetric(metric, p)).filter(v => typeof v === 'number') as number[];
      if (values.length < 2) return null;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const stddev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length);
      const curr = agent.calculateMetric(metric, period);
      if (curr === null) return null;
      if (Math.abs(curr - avg) > stddevThreshold * stddev) {
        return { metric, value: curr, avg, stddev, anomaly: true };
      }
      return null;
    }).filter(Boolean);
  },

  /**
   * Group metrics by category for a period.
   */
  groupMetricsByCategory: ({ period, historicalData }: { period: string, historicalData: Record<string, FinancialStatements> }) => {
    // You may want to maintain a category map externally for full flexibility
    const categories: Record<string, string[]> = {
      Liquidity: ['Current Ratio', 'Quick Ratio', 'Cash Ratio'],
      Solvency: ['Debt-to-Equity Ratio', 'Debt-to-Capital Ratio', 'Interest Coverage Ratio', 'Debt Service Coverage Ratio', 'Equity Multiplier'],
      Profitability: ['Gross Profit Margin', 'Operating Margin', 'Net Profit Margin', 'Return on Assets (ROA)', 'Return on Equity (ROE)', 'Return on Invested Capital (ROIC)'],
      Efficiency: ['Asset Turnover', 'Inventory Turnover', 'Days Inventory Outstanding (DIO)', 'Receivables Turnover', 'Days Sales Outstanding (DSO)', 'Payables Turnover', 'Days Payables Outstanding (DPO)', 'Cash Conversion Cycle'],
      'Cash Flow': ['Operating Cash Flow', 'Free Cash Flow', 'Cash Flow Margin', 'Cash Return on Assets', 'Cash Coverage Ratio'],
      Market: ['Price to Earnings (P/E)', 'Price to Book (P/B)', 'Dividend Yield']
    };
    const agent = new FinancialMetricsAgent(historicalData);
    const result: Record<string, Record<string, number | null>> = {};
    for (const [cat, metrics] of Object.entries(categories)) {
      result[cat] = {};
      metrics.forEach(metric => {
        result[cat][metric] = agent.calculateMetric(metric, period);
      });
    }
    return result;
  },

  /**
   * Generate a narrative summary of financial health for a period.
   */
  generateNarrativeSummary: ({ period, historicalData }: { period: string, historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    const summary = agent.summarizeAllMetricsForPeriod(period);
    // This could be enhanced with LLM or template logic
    return `Financial summary for ${period}:\n` +
      Object.entries(summary)
        .map(([metric, value]) => `${metric}: ${typeof value === 'number' ? value.toFixed(3) : 'N/A'}`)
        .join('\n');
  },

  /**
   * Find metrics that are highly correlated across periods.
   */
  findCorrelatedMetrics: ({ historicalData, threshold }: { historicalData: Record<string, FinancialStatements>, threshold: number }) => {
    // Simple Pearson correlation between all pairs
    const agent = new FinancialMetricsAgent(historicalData);
    const periods = Object.keys(historicalData);
    const metrics = Object.keys(metricDefinitions);
    const series: Record<string, number[]> = {};
    metrics.forEach(metric => {
      series[metric] = periods.map(p => agent.calculateMetric(metric, p)).filter(v => typeof v === 'number') as number[];
    });
    const result: Array<{ metricA: string, metricB: string, correlation: number }> = [];
    for (let i = 0; i < metrics.length; i++) {
      for (let j = i + 1; j < metrics.length; j++) {
        const a = series[metrics[i]];
        const b = series[metrics[j]];
        if (a.length !== b.length || a.length < 2) continue;
        const meanA = a.reduce((x, y) => x + y, 0) / a.length;
        const meanB = b.reduce((x, y) => x + y, 0) / b.length;
        const num = a.map((v, idx) => (v - meanA) * (b[idx] - meanB)).reduce((x, y) => x + y, 0);
        const denom = Math.sqrt(a.map(v => Math.pow(v - meanA, 2)).reduce((x, y) => x + y, 0) * b.map(v => Math.pow(v - meanB, 2)).reduce((x, y) => x + y, 0));
        if (denom === 0) continue;
        const corr = num / denom;
        if (Math.abs(corr) >= threshold) {
          result.push({ metricA: metrics[i], metricB: metrics[j], correlation: corr });
        }
      }
    }
    return result;
  },

  /**
   * Get the time-series history for a metric.
   */
  getMetricHistory: ({ metricName, historicalData }: { metricName: string, historicalData: Record<string, FinancialStatements> }) => {
    const agent = new FinancialMetricsAgent(historicalData);
    return Object.keys(historicalData).sort().map(period => ({
      period,
      value: agent.calculateMetric(metricName, period)
    }));
  },

};

// =====================
// Prompts
// =====================

export const financialMetricsAgentPrompts = {
  getTopNMetricsByValue: {
    messages: [
      { role: "user", content: { type: "text", text: "What are the top {n} metrics for {period}?" } }
    ]
  },
  getBottomNMetricsByValue: {
    messages: [
      { role: "user", content: { type: "text", text: "What are the bottom {n} metrics for {period}?" } }
    ]
  },
  getMetricsWithLargestChange: {
    messages: [
      { role: "user", content: { type: "text", text: "Which metrics changed the most between {periodA} and {periodB}?" } }
    ]
  },
  summarizeTrendsAcrossPeriods: {
    messages: [
      { role: "user", content: { type: "text", text: "Summarize the trend for {metricName} across {periods}." } }
    ]
  },
  detectAnomaliesInMetrics: {
    messages: [
      { role: "user", content: { type: "text", text: "Are there any anomalies in our metrics for {period}?" } }
    ]
  },
  groupMetricsByCategory: {
    messages: [
      { role: "user", content: { type: "text", text: "Group all metrics by category for {period}." } }
    ]
  },
  generateNarrativeSummary: {
    messages: [
      { role: "user", content: { type: "text", text: "Generate a narrative summary of our financial health for {period}." } }
    ]
  },
  findCorrelatedMetrics: {
    messages: [
      { role: "user", content: { type: "text", text: "Find any metrics that are highly correlated over all periods." } }
    ]
  },
  getMetricHistory: {
    messages: [
      { role: "user", content: { type: "text", text: "Show the history of {metricName} across all periods." } }
    ]
  },
  calculateMetric: {
    messages: [
      { role: "user", content: { type: "text", text: "What is our {metricName} for {period}?" } }
    ]
  },
  compareMetrics: {
    messages: [
      { role: "user", content: { type: "text", text: "Compare our {metricName} between {periodA} and {periodB}." } }
    ]
  },
  generateTrend: {
    messages: [
      { role: "user", content: { type: "text", text: "Show a chart of {metricName} from {startPeriod} to {endPeriod}." } }
    ]
  },
  alertOnThreshold: {
    messages: [
      { role: "user", content: { type: "text", text: "Alert me if {metricName} goes {direction} {threshold}." } }
    ]
  }
};

const financialMetricsAgentPrompts = {
  // Add agent-specific prompts here
};

const mergedResources = { ...baseAgentResources, ...financialMetricsAgentResources };
const mergedTools = { ...baseAgentTools, ...financialMetricsAgentTools };
const mergedPrompts = { ...baseAgentPrompts, ...financialMetricsAgentPrompts };

export const financialMetricsAgent: Tool = {
  name: "financial-metrics-agent",
  description: "Compute, compare, and monitor business financial ratios and metrics.",
  async run({ parameters, context }): Promise<ToolResult> {
    // Example: { action: 'calculateMetric', metricName, period, historicalData }
    const { action, metricName, period, periodA, periodB, startPeriod, endPeriod, threshold, direction, historicalData } = parameters || {};
    const agent = new FinancialMetricsAgent(historicalData || {});
    let result: any = null;
    switch (action) {
      case 'calculateMetric':
        result = agent.calculateMetric(metricName, period);
        break;
      case 'compareMetrics':
        result = agent.compareMetrics(metricName, periodA, periodB);
        break;
      case 'generateTrend':
        result = agent.generateTrend(metricName, startPeriod, endPeriod);
        break;
      case 'alertOnThreshold':
        result = agent.alertOnThreshold(metricName, threshold, direction, (alert) => {
          // This callback could be extended to push notifications or logs
          // For now, just return the alert object
          return alert;
        });
        break;
      default:
        result = { message: 'Unknown or missing action.' };
    }
    return { success: true, result };
  }
};

// Extension points: export helpers, add more metrics, integrate with other agents, etc.
