# Review-to-Revenue AI Operating System

## Product Definition

Review-to-Revenue AI turns unstructured customer text into executable revenue actions for this week.

It is not a review summarizer.
It is not a CRM.
It is not an automated outreach tool.

Core loop:

> Customer Voice -> Revenue Action -> Outcome Data

## Current Sprint

Sprint 1.5: Product Alignment Refactoring.

The goal is to align the existing codebase with the future commercial product direction.
This sprint is not for redesigning UI, adding new features, or implementing Product Identity.

Future product flow:

> Customer Voice -> Revenue Signal -> Revenue Action -> Outcome Tracking -> Revenue Intelligence

## Keep

- Demo datasets
- Dashboard
- Revenue Actions
- Markdown export
- Lead rescue CSV export
- Outcome tracking
- Local rule/template-based analysis
- localStorage persistence

## Do Not Add In Sprint 1.5

- Authentication
- Payments
- Supabase
- Stripe
- OpenAI API
- CRM sync
- Review scraping
- Automated outreach
- New product surfaces beyond cleanup

## Architecture Rules

- Treat `RevenueAction` as the primary executable entity.
- Keep Customer Voice, Revenue, Reports, Outcomes, Demo data, and UI as separable modules.
- Supporting signals, follow-up messages, content ideas, and script suggestions are detail views.
- Reports should describe actions the user can take, not generic summaries.
- Preserve source evidence for every recommendation.
- Keep demo data synthetic and clearly labeled.
- Keep outcome numbers framed as estimates, not guaranteed revenue.

## Verification

Before claiming Sprint 1.5 work is complete, run:

- `npm run test`
- `npm run check`
- `npm run build`
