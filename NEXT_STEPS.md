# Review Lens Next Steps

Use this file as the working queue when continuing from Windows, macOS, or a new Codex thread.

## Current State

- The app is a Next.js paste-first MVP.
- It has no login, no database, no Google scraping, and no automatic review posting.
- The first analyzer is rule-based through `lib/hidden-signals.ts` and `lib/analyze.ts`.
- The product direction is `Review Lens`: hidden review meaning, native-coded warnings, intentional misspellings, slang, and business/traveler actions.

## Cross-Platform Rules

- Use Node 22 LTS on both Windows and macOS.
- Install with `npm ci` after pulling from GitHub.
- Run `npm run check` before pushing.
- Keep generated folders out of git: `node_modules`, `.next`, logs, and `tsconfig.tsbuildinfo`.
- Keep secrets in `.env.local`; commit only `.env.example`.
- Do not add scraping or Google OAuth until the paste-first workflow is validated.

## Immediate Product Queue

1. Add an AI-backed analyzer behind the existing `/api/analyze` route. Done.
2. Keep the rule-based dictionary as a pre-analysis context and fallback. Done.
3. Add a strict Zod schema for `AnalysisReport`. Done.
4. Add sample review fixtures for Korean, Japanese, Chinese, and English. Done.
5. Add a small test runner for analyzer output shape and high-risk Korean examples. Done.
6. Improve the UI with example tabs and a result quality warning when confidence is low.
7. Add a shareable Markdown report download, not only clipboard copy.
8. Build a B2B sample report page for hotel/guesthouse owners.

## Suggested Next Codex Prompt

```text
Continue the Review Lens MVP from NEXT_STEPS.md.
First inspect the repo, then implement the next highest-leverage step.
Keep Windows/macOS compatibility, avoid scraping, preserve the paste-first MVP, and run npm run check before finishing.
```

## This Week's Target

- Working MVP: done.
- AI-backed JSON analyzer: next.
- Sample reports: next.
- B2C free tool page plus B2B CTA: after analyzer quality improves.
