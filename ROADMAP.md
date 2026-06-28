# Review-to-Revenue AI Roadmap

## Product Direction

Review-to-Revenue AI converts reviews, inquiries, sales notes, competitor reviews, and lead CSV data into this week's revenue actions.

The product is not a review summarizer and not a CRM. The core loop is:

> Customer Voice -> Revenue Action -> Outcome Data

## Current Foundation

Sprint 1 is focused on product foundation, not new features.

- Next.js paste-first workspace
- Local rule-based revenue signal engine
- `RevenueAction[]` as the main executable entity
- Synthetic demo datasets
- Markdown action report export
- Lead rescue CSV export
- Local outcome tracking
- No login, database, billing, CRM sync, scraping, or external AI call

## Phase 1: Product Foundation

Status: in progress

- Remove old analyzer/API contracts
- Keep dashboard, demo data, revenue actions, Markdown export, and outcome tracking
- Simplify the component hierarchy
- Keep `RevenueAction` central across the dashboard, report, and outcome flow

## Phase 2: Validation

Status: next

- Test whether users can identify who to contact today within 30 seconds
- Test whether users would use generated follow-up messages
- Test whether content ideas and script suggestions change real team behavior
- Record outcome events locally and export them for review

## Phase 3: AI Adapter

Status: later, after validation

- Add an analysis service abstraction
- Add OpenAI-backed semantic clustering behind the same `AnalysisResult` contract
- Keep the local rule engine as fallback
- Add quality guardrails before any production AI usage

## Phase 4: Commercial SaaS

Status: later

- Saved workspaces
- Team workspace
- Supabase persistence
- CRM export or sync
- Stripe billing
- Account-level reporting

## Not Yet

- Payment
- Authentication
- Supabase
- Stripe
- OpenAI API
- Automated outreach
- Review scraping
