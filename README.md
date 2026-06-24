# Review-to-Revenue AI

Review-to-Revenue AI turns customer voice into weekly revenue actions.

It is not a simple review summarizer, and it is not a CRM. The MVP reads reviews, inquiries, sales notes, competitor reviews, and lead CSV data, then produces the actions a B2B team can run this week: objections to remove, buying triggers to use, leads to rescue, content to publish, scripts to improve, and competitor weaknesses to exploit.

Korean positioning:

> 고객의 말에서 이번 주 매출 액션을 찾아드립니다.

## What Changed From the Previous Direction

The old product direction was centered on interpreting review language. That logic still exists as a lower-level signal layer, but the user-facing product now points at revenue work:

- Customer objections become follow-up material.
- Buying triggers become sales and content angles.
- Hesitation reasons become rescue opportunities.
- Competitor complaints become differentiation messages.
- Repeated questions become publishable content.
- Weak sales notes become script improvements.

## Core Problem

Sales and growth teams already have customer text, but it is scattered across reviews, DMs, inquiry forms, call notes, spreadsheets, and competitor pages. The missing workflow is not another place to store it. The missing workflow is a weekly brief that says:

- What is blocking revenue right now?
- Which leads should we follow up today?
- What message should we send?
- What content should we publish?
- Which part of the sales script is leaking trust?

## Target Users

- B2B service teams handling inbound leads
- Franchise and consulting sales teams
- Agencies reviewing customer voice for clients
- Founders who need fast signal from messy text
- Growth marketers looking for proof-backed content ideas

## MVP Features

- First screen: `This Week’s Revenue Signals`
- Six revenue signal cards:
  - `Top Customer Objection`
  - `Top Buying Trigger`
  - `Leads to Rescue`
  - `Content to Publish`
  - `Script to Improve`
  - `Competitor Weakness`
- Input workspace:
  - `reviewsText`
  - `salesNotesText`
  - `competitorReviewsText`
  - `leadCsv`
- Output sections:
  - Dashboard
  - Detailed Report
  - Follow-up Message Library
  - Content Ideas
  - Sales Script Suggestions
  - Markdown export
  - PDF print through browser print
  - Rescue lead CSV export
- Local storage persistence
- Rule/template-based analysis without external API calls
- Mobile-friendly B2B SaaS interface

## Analysis Schema

Core types live in `types/revenue.ts`.

Main result shape:

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
- `revenueSignals`
- `markdownReport`

The schema keeps UI-friendly fields and integration-friendly aliases together. For example, `RevenueSignal` includes `confidenceScore`/`urgencyLevel` for the current UI and `confidence`/`urgency`/`impact`/`evidence` for future API and CRM adapters. `LeadRescueOpportunity`, `ContentIdea`, `FollowupMessage`, `SalesScriptSuggestion`, and `WeeklyAction` follow the same compatibility rule.

Analysis modules:

- `lib/analysis/revenueSignalEngine.ts`: local rule-based analysis and scoring
- `lib/analysis/lensEngine.ts`: lower-level interpretation signal extraction
- `lib/analysis/reportBuilder.ts`: Markdown report generation
- `lib/analysis/sampleData.ts`: sample franchise/high-ticket consultation dataset

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run test
npm run typecheck
npm run build
npm run check
```

`npm run check` runs typecheck, tests, and production build.

## Export

The app supports:

- Markdown report download
- Markdown copy
- Browser print for PDF
- Lead rescue CSV export

## Future AI Integration

The current MVP intentionally avoids external API usage. This keeps development cheap and validation fast.

Future OpenAI integration should plug into the same analysis boundary:

- Keep `AnalysisResult` stable.
- Add an `analysisService` adapter around the current local engine.
- Let OpenAI enrich evidence, copy, and prioritization.
- Keep the local rule engine as fallback and regression baseline.
- Every AI insight must preserve evidence, confidence, urgency, impact, and next action.

## Future Integrations

Do not build these before validation:

- CRM sync
- CSV upload UI
- Supabase persistence
- Stripe billing
- WhatsApp/Kakao/Instagram DM import
- Review scraping
- Multi-user workspaces

Likely next integrations after validation:

- CSV import polish
- Saved workspaces
- CRM export
- OpenAI-backed analysis
- PDF report template
- Team feedback loop

## Limitations

- Current analysis is rule/template-based.
- CSV parsing is intentionally lightweight.
- No external data is fetched.
- Results should be validated against real customer conversations before automating decisions.

## Product Docs

- `docs/PRODUCT_STRATEGY.md`
- `docs/ROADMAP.md`
- `docs/VALIDATION_PLAN.md`
- `docs/SAMPLE_REPORT.md`
- `docs/AI_PROMPTS.md`
