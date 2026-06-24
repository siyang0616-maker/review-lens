import type {
  AnalysisResult,
  ContentIdea,
  FollowupMessage,
  InsightItem,
  LeadRescueOpportunity,
  OutcomeSummary,
  RevenueAction,
  RevenueSignal,
  SalesScriptSuggestion,
  WeeklyAction
} from "../../types/revenue";

type ReportOptions = {
  outcomeSummary?: OutcomeSummary;
};

const emptyOutcomeSummary: OutcomeSummary = {
  bookingsRecovered: 0,
  estimatedRecoveredRevenue: 0,
  followupsCopied: 0,
  followupsSent: 0,
  repliesRecovered: 0,
  wonDeals: 0
};

export function buildRevenueMarkdownReport(result: AnalysisResult, options: ReportOptions = {}) {
  const outcomeSummary = options.outcomeSummary ?? emptyOutcomeSummary;
  const demoLine = result.demoLabel ? `\nSource: ${formatDemoLabel(result.demoLabel)}` : "";
  const sourceLanguages = result.sourceLanguages?.join(", ") ?? "unknown";
  const outputLanguage = result.outputLanguage ?? "en";

  return `# Review-to-Revenue Action Report

Generated: ${result.generatedAt}${demoLine}

Data quality note: This report is generated from user-provided or demo customer voice data. It should be used as a decision-support tool, not as guaranteed revenue prediction.

## Executive Summary

${result.summary}

## This Week’s Revenue Actions

${formatRevenueActions(result.revenueActions)}

## Leads to Rescue

${formatLeads(result.leadRescueOpportunities)}

## Top Customer Objections

${formatInsights(result.objections)}

## Buying Triggers

${formatInsights(result.buyingTriggers)}

## Competitor Weaknesses

${formatInsights(result.competitorWeaknesses)}

## Follow-up Message Library

${formatFollowups(result.followupMessages)}

## Content Ideas

${formatContentIdeas(result.contentIdeas)}

## Sales Script Improvements

${formatScriptSuggestions(result.salesScriptSuggestions)}

## Outcome Tracking Summary

${formatOutcomeSummary(outcomeSummary)}

## Data Quality / Confidence Notes

- Source languages: ${sourceLanguages}
- Output language: ${outputLanguage}
- Demo data is synthetic when a demo label is shown.
- Revenue at risk and recovered revenue are estimates from lead CSV potentialValue fields and manual outcome tracking.
- Review-to-Revenue AI Report compatibility note: this action report replaces the older static analysis report.

## This Week's Revenue Signals

${formatSignals(result.revenueSignals)}

## Trust Barriers

${formatInsights(result.trustBarriers)}

## Weekly Action Plan

${formatActions(result.weeklyActionPlan)}
`;
}

function formatDemoLabel(label: string) {
  if (label === "Demo Data · Korean Summer Hotel Reviews") {
    return "Demo Data · Synthetic Korean Summer Hotel Reviews";
  }

  return label;
}

function formatRevenueActions(actions: RevenueAction[] | undefined) {
  const safeActions = actions ?? [];

  if (safeActions.length === 0) {
    return "- No revenue action yet.";
  }

  return safeActions
    .map(
      (action) => `### ${action.title}

- Type: ${action.type}
- Target: ${action.targetSegment}
- Why now: ${action.whyNow}
- Evidence: ${(action.evidence ?? []).join(" | ") || "No direct evidence yet."}
- Recommended action: ${action.recommendedAction}
- Expected outcome: ${action.expectedOutcome}
- Priority: ${action.priority}
- Status: ${action.status}`
    )
    .join("\n\n");
}

function formatSignals(signals: RevenueSignal[] | undefined) {
  const safeSignals = signals ?? [];

  if (safeSignals.length === 0) {
    return "- No signal yet.";
  }

  return safeSignals
    .map(
      (signal) => `### ${signal.label}: ${signal.title}

- Why it matters: ${signal.whyItMatters}
- Evidence: ${signal.evidenceSnippet}
- Recommended action: ${signal.recommendedAction}
- Confidence: ${signal.confidenceScore}/100
- Urgency: ${signal.urgencyLevel}
- Impact: ${signal.impactLevel}`
    )
    .join("\n\n");
}

function formatInsights(items: InsightItem[] | undefined) {
  const safeItems = items ?? [];

  if (safeItems.length === 0) {
    return "- No signal yet.";
  }

  return safeItems
    .map(
      (item) => `- ${item.title} (${item.confidenceScore}/100)
- Evidence: ${(item.evidence ?? []).join(" | ") || "No direct evidence yet."}
  - Meaning: ${item.explanation}
  - Action: ${item.recommendedAction}`
    )
    .join("\n");
}

function formatLeads(leads: LeadRescueOpportunity[] | undefined) {
  const safeLeads = leads ?? [];

  if (safeLeads.length === 0) {
    return "- No rescue opportunity yet.";
  }

  return safeLeads
    .map(
      (lead) => `- ${lead.leadName} (${lead.score}/100, ${lead.urgencyLevel})
  - Context: ${lead.context}
  - Reason: ${lead.rescueReason}
  - Message: ${lead.recommendedMessage}
  - Expected value: ${lead.expectedValue}`
    )
    .join("\n");
}

function formatContentIdeas(ideas: ContentIdea[] | undefined) {
  const safeIdeas = ideas ?? [];

  if (safeIdeas.length === 0) {
    return "- No content idea yet.";
  }

  return safeIdeas
    .map(
      (idea) => `- P${idea.priority}. ${idea.title} (${idea.format})
  - Target objection: ${idea.targetObjection}
- Hook: ${idea.hook}
  - Outline: ${(idea.outline ?? []).join(" / ") || "No outline available."}
  - Why now: ${idea.whyNow}
  - Source: ${idea.sourceSignal}
  - CTA: ${idea.callToAction}`
    )
    .join("\n");
}

function formatFollowups(messages: FollowupMessage[] | undefined) {
  const safeMessages = messages ?? [];

  if (safeMessages.length === 0) {
    return "- No follow-up message yet.";
  }

  return safeMessages
    .map(
      (message) => `### ${message.title}

- Scenario: ${message.scenario}
- Target objection: ${message.targetObjection}
- Tone: ${message.tone}
- Target: ${message.targetLead}
- Evidence: ${message.evidence}
- Message: ${message.message}
- Why this works: ${message.whyThisWorks}
- Recommended timing: ${message.recommendedTiming}
- Next step: ${message.nextStep}`
    )
    .join("\n\n");
}

function formatScriptSuggestions(suggestions: SalesScriptSuggestion[] | undefined) {
  const safeSuggestions = suggestions ?? [];

  if (safeSuggestions.length === 0) {
    return "- No script suggestion yet.";
  }

  return safeSuggestions
    .map(
      (suggestion) => `- ${suggestion.situation}
  - Current problem: ${suggestion.currentProblem}
  - Improved script: ${suggestion.improvedLine}
  - Why it works: ${suggestion.whyItWorks}
  - Objection handled: ${suggestion.objectionHandled}
  - Example use case: ${suggestion.exampleUseCase}
  - Evidence: ${suggestion.evidence}`
    )
    .join("\n");
}

function formatOutcomeSummary(summary: OutcomeSummary) {
  return [
    `- Follow-ups copied: ${summary.followupsCopied}`,
    `- Follow-ups sent: ${summary.followupsSent}`,
    `- Replies recovered: ${summary.repliesRecovered}`,
    `- Bookings recovered: ${summary.bookingsRecovered}`,
    `- Won deals: ${summary.wonDeals}`,
    `- Estimated recovered revenue: ${formatCurrency(summary.estimatedRecoveredRevenue)}`
  ].join("\n");
}

function formatActions(actions: WeeklyAction[] | undefined) {
  const safeActions = actions ?? [];

  if (safeActions.length === 0) {
    return "- No weekly action yet.";
  }

  return safeActions
    .map(
      (action) => `- P${action.priority}. ${action.action}
  - Owner: ${action.owner}
  - Due: ${action.due}
  - Expected outcome: ${action.expectedOutcome}`
    )
    .join("\n");
}

function formatCurrency(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}
