# Review-to-Revenue AI

Review-to-Revenue AI is a revenue action platform, not a review summarizer.

It turns reviews, inquiries, sales notes, competitor reviews, and lead CSV data into the work a team can execute this week: follow-up messages, content ideas, script improvements, competitor positioning moves, and manual outcome tracking.

Core flow:

> Customer Voice → Revenue Action → Outcome Data

Korean positioning:

> 고객의 말에서 이번 주 바로 실행할 매출 액션을 찾아드립니다.

## What The MVP Does

- Shows `This Week’s Revenue Actions` as the first screen.
- Estimates `Leads to Rescue`, `Actions Ready`, and `Revenue at Risk`.
- Surfaces the top 3 priority actions for today.
- Generates a `RevenueAction[]` board from customer voice.
- Tracks action outcomes in localStorage with `reviewToRevenue.actionOutcomes`.
- Exports a `Review-to-Revenue Action Report` Markdown file.
- Supports synthetic demo datasets for hotel, wedding vendor, and clinic / med spa workflows.
- Keeps a multilingual architecture ready without adding translation API cost yet.

## Why It Exists

Most review tools stop at summary, sentiment, or topic clusters. The buyer does not pay for another summary. They pay when the product answers:

- Which lead should I follow up today?
- What exact message should I send?
- What repeated objection should I remove?
- What content should I publish?
- Which sales script line is leaking trust?
- What happened after I used the recommendation?

The moat is not review summarization. The moat is the closed loop between customer language, recommended revenue actions, and tracked outcomes.

## Core Types

Core contracts live in `types/revenue.ts`.

- `RevenueAction`
- `ActionOutcome`
- `OutcomeSummary`
- `SupportedLanguage`
- `EvidenceItem`
- `DemoDataset`
- `AnalysisResult`

Key analysis modules:

- `lib/analysis/revenueSignalEngine.ts`: local rule-based revenue action engine
- `lib/analysis/actionOutcomes.ts`: local outcome tracking helpers
- `lib/analysis/reportBuilder.ts`: Markdown action report builder
- `src/lib/sampleData/index.ts`: demo dataset registry
- `src/lib/sampleData/hotelDemo.ts`: synthetic Korean summer hotel data
- `src/lib/sampleData/weddingDemo.ts`: synthetic English wedding vendor data
- `src/lib/sampleData/clinicDemo.ts`: synthetic English clinic / med spa data

## Demo Data

Use the demo selector in the Input Workspace:

- Korean Summer Hotel Reviews
- English Wedding Vendor Leads
- English Clinic Consultation Leads

Click `Load Demo Dataset` to populate the workspace and run the analysis. All demo datasets are synthetic sample data for workflow testing. They are not scraped real reviews.

When the hotel demo is exported, the report identifies it as:

`Demo Data · Synthetic Korean Summer Hotel Reviews`

## Outcome Tracking

Each action card supports:

- Copy message
- Mark as sent
- Mark as replied
- Mark as booked
- Mark as won
- Mark as lost

These status events are stored locally only. The recovered revenue number is a manual MVP estimate from lead CSV `potentialValue`, not guaranteed revenue.

## Multilingual Architecture

Different languages, same revenue intent.

The system should preserve original customer language, normalize intent into a shared revenue taxonomy, and generate output in the user’s preferred language.

Current MVP support:

- `SupportedLanguage = "ko" | "en" | "ja" | "es"`
- `EvidenceItem.originalText`
- `EvidenceItem.sourceLanguage`
- `EvidenceItem.translatedText`
- `AnalysisResult.sourceLanguages`
- `AnalysisResult.outputLanguage`
- Output language selector for English and Korean

No translation API is called yet.

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

## Current Limits

- The analysis engine is still rule/template-based.
- CSV parsing is intentionally lightweight.
- Outcome tracking is localStorage only.
- Revenue at risk and recovered revenue are estimates, not financial proof.
- There is no real CSV upload UI yet.
- There is no Supabase, login, billing, CRM sync, or team workspace yet.

## Future Integration Plan

After validating that users want this workflow:

- OpenAI API for semantic clustering, evidence ranking, and stronger generated messages
- Supabase for saved workspaces and outcome history
- Stripe for paid plan experiments
- CRM export / sync
- Real CSV upload flow
- Vertical templates for hospitality, wedding, clinic / med spa, franchise consulting, real estate, and home remodeling

## Product Docs

- `docs/PRODUCT_STRATEGY.md`
- `docs/ROADMAP.md`
- `docs/VALIDATION_PLAN.md`
- `docs/SAMPLE_REPORT.md`
- `docs/AI_PROMPTS.md`
