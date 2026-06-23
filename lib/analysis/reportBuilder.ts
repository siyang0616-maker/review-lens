import type {
  AnalysisResult,
  ContentIdea,
  FollowupMessage,
  InsightItem,
  LeadRescueOpportunity,
  RevenueSignal,
  SalesScriptSuggestion,
  WeeklyAction
} from "../../types/revenue";

export function buildRevenueMarkdownReport(result: AnalysisResult) {
  return `# Review-to-Revenue AI Report

Generated: ${result.generatedAt}

## Executive Summary

${result.summary}

## This Week's Revenue Signals

${formatSignals(result.revenueSignals)}

## Customer Objections

${formatInsights(result.objections)}

## Buying Triggers

${formatInsights(result.buyingTriggers)}

## Pain Points

${formatInsights(result.painPoints)}

## Trust Barriers

${formatInsights(result.trustBarriers)}

## Competitor Weaknesses

${formatInsights(result.competitorWeaknesses)}

## Lead Rescue Opportunities

${formatLeads(result.leadRescueOpportunities)}

## Content Ideas

${formatContentIdeas(result.contentIdeas)}

## Follow-up Message Library

${formatFollowups(result.followupMessages)}

## Sales Script Suggestions

${formatScriptSuggestions(result.salesScriptSuggestions)}

## Weekly Action Plan

${formatActions(result.weeklyActionPlan)}
`;
}

function formatSignals(signals: RevenueSignal[]) {
  if (signals.length === 0) {
    return "- No signal yet.";
  }

  return signals
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

function formatInsights(items: InsightItem[]) {
  if (items.length === 0) {
    return "- No signal yet.";
  }

  return items
    .map(
      (item) => `- ${item.title} (${item.confidenceScore}/100)
  - Evidence: ${item.evidence.join(" | ")}
  - Meaning: ${item.explanation}
  - Action: ${item.recommendedAction}`
    )
    .join("\n");
}

function formatLeads(leads: LeadRescueOpportunity[]) {
  if (leads.length === 0) {
    return "- No rescue opportunity yet.";
  }

  return leads
    .map(
      (lead) => `- ${lead.leadName} (${lead.score}/100, ${lead.urgencyLevel})
  - Context: ${lead.context}
  - Reason: ${lead.rescueReason}
  - Message: ${lead.recommendedMessage}
  - Expected value: ${lead.expectedValue}`
    )
    .join("\n");
}

function formatContentIdeas(ideas: ContentIdea[]) {
  if (ideas.length === 0) {
    return "- No content idea yet.";
  }

  return ideas
    .map(
      (idea) => `- P${idea.priority}. ${idea.title} (${idea.format})
  - Hook: ${idea.hook}
  - Why now: ${idea.whyNow}
  - Source: ${idea.sourceSignal}
  - CTA: ${idea.callToAction}`
    )
    .join("\n");
}

function formatFollowups(messages: FollowupMessage[]) {
  if (messages.length === 0) {
    return "- No follow-up message yet.";
  }

  return messages
    .map(
      (message) => `### ${message.title}

- Scenario: ${message.scenario}
- Target: ${message.targetLead}
- Evidence: ${message.evidence}
- Message: ${message.message}
- Next step: ${message.nextStep}`
    )
    .join("\n\n");
}

function formatScriptSuggestions(suggestions: SalesScriptSuggestion[]) {
  if (suggestions.length === 0) {
    return "- No script suggestion yet.";
  }

  return suggestions
    .map(
      (suggestion) => `- ${suggestion.situation}
  - Weak line: ${suggestion.weakLine}
  - Improved line: ${suggestion.improvedLine}
  - Why it works: ${suggestion.whyItWorks}
  - Evidence: ${suggestion.evidence}`
    )
    .join("\n");
}

function formatActions(actions: WeeklyAction[]) {
  if (actions.length === 0) {
    return "- No weekly action yet.";
  }

  return actions
    .map(
      (action) => `- P${action.priority}. ${action.action}
  - Owner: ${action.owner}
  - Due: ${action.due}
  - Expected outcome: ${action.expectedOutcome}`
    )
    .join("\n");
}
