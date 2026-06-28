# Review-to-Revenue AI Next Steps

Use this file as the working queue when continuing from Windows, macOS, or a new Codex thread.

## Current State

- The app is a Next.js paste-first MVP.
- The product direction is `Review-to-Revenue AI`.
- The main entity is `RevenueAction`.
- The current engine is local and rule/template-based.
- The app has no login, database, billing, CRM sync, scraping, or external AI call.
- The first screen is `This Week's Revenue Actions`.

## Cross-Platform Rules

- Use Node 22 LTS on both Windows and macOS.
- Install with `npm ci` after pulling from GitHub.
- Run `npm run check` before pushing.
- Keep generated folders out of git: `node_modules`, `.next`, logs, and `tsconfig.tsbuildinfo`.
- Keep secrets in `.env.local`; commit only `.env.example`.

## Sprint 1 Queue

1. Keep `RevenueAction[]` as the dashboard, report, and outcome-tracking source.
2. Keep demo datasets for hotel, wedding vendor, and clinic / med spa.
3. Keep Markdown report export and lead rescue CSV export.
4. Keep localStorage outcome tracking.
5. Remove or quarantine old analyzer/API remnants.
6. Keep supporting signal/message/content/script sections as detail views, not the main entity.
7. Keep validation focused on whether users act on the recommendations this week.

## Suggested Next Codex Prompt

```text
Continue the Review-to-Revenue AI MVP from the current Sprint 1 foundation.
First inspect the repo, preserve dashboard/demo data/revenue actions/Markdown export/outcome tracking,
avoid adding auth, payments, Supabase, Stripe, or OpenAI API, and run npm run check before finishing.
```

## Sprint 2 Candidate Themes

- Analysis service abstraction for a future OpenAI adapter
- Real CSV upload UI
- Saved workspace model
- Outcome analytics
- Vertical templates

Do not start Sprint 2 until Sprint 1 is complete and reviewed.
