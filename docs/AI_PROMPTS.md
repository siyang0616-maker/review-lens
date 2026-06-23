# AI Prompt Notes

The current MVP does not call external AI. These notes define the future adapter contract.

## Adapter Contract

The AI adapter must return the same `AnalysisResult` structure used by the local engine.

Required arrays:

- `revenueSignals`
- `painPoints`
- `buyingTriggers`
- `objections`
- `trustBarriers`
- `competitorWeaknesses`
- `leadRescueOpportunities`
- `contentIdeas`
- `followupMessages`
- `salesScriptSuggestions`
- `weeklyActionPlan`

## System Prompt Direction

You are analyzing customer voice for a B2B revenue team. Do not summarize the text generally. Extract only signals that can become revenue actions this week.

Prioritize:

- objections
- buying triggers
- trust barriers
- rescue leads
- follow-up opportunities
- content ideas
- sales script improvements
- competitor weaknesses

Every recommendation must include:

- evidence snippet
- why it matters
- recommended action
- confidence score
- urgency
- impact

## User Prompt Shape

Input:

```json
{
  "reviewsText": "...",
  "salesNotesText": "...",
  "competitorReviewsText": "...",
  "leadCsv": "..."
}
```

Instruction:

Return JSON only. Match the `AnalysisResult` schema. Do not invent specific lead names unless they appear in the input. If evidence is weak, lower confidence and explain the limitation.

## Guardrails

- Do not produce generic marketing advice.
- Do not recommend automated outreach unless the user asked for it.
- Do not claim revenue outcomes with certainty.
- Do not include private data beyond the pasted input.
- Keep local rule-based output as fallback.
