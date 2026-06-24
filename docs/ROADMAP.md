# Roadmap

## Today

- Rename and align the product surface as Review-to-Revenue AI.
- Replace the first screen with `This Week’s Revenue Signals`.
- Add sample franchise/high-ticket consultation data.
- Add local analysis types and engine.
- Stabilize `AnalysisResult` with integration-friendly fields for future AI/CRM adapters.
- Add Markdown report builder.
- Add localStorage persistence.
- Add copyable follow-up message library.
- Add lead rescue CSV export.
- Add focused regression tests.

## Tomorrow

- Run 3 to 5 real pasted datasets through the MVP.
- Compare whether the six signal cards produce usable sales actions.
- Collect where the local rule engine over-prioritizes or misses context.
- Tighten keyword categories based on real objections.
- Add optional saved sample scenarios by vertical:
  - Franchise
  - Agency
  - SaaS demo calls
  - Local service consultations

## This Week

- Improve CSV parsing around common exports.
- Add a real CSV upload control on top of the current textarea parser.
- Add better empty and low-evidence states.
- Add a printable one-page executive report layout.
- Add a lightweight feedback capture panel:
  - accurate
  - weak
  - overinterpreted
  - missed signal
- Create 2 to 3 landing page proof examples using generated reports.

## Later

- Introduce `analysisService` with two adapters:
  - local rule engine
  - OpenAI-backed analysis
- Add saved workspaces.
- Add CRM export.
- Add PDF template generation.
- Add team comments or review workflow.
- Add integrations only after repeated manual validation.

## Not Yet

- Stripe
- Supabase
- Login
- Automated scraping
- WhatsApp, Instagram, Kakao imports
- Fully automated outreach
