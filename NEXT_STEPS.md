# Review Lens Next Steps

Use this file as the working queue when continuing from Windows, macOS, or a new Codex thread.

## Current State

- The app is a Next.js paste-first MVP.
- It has no login, no database, no Google scraping, and no automatic review posting.
- The first analyzer is rule-based through `lib/hidden-signals.ts` and `lib/analyze.ts`.
- The product direction is `Review Lens`: hidden review meaning, native-coded warnings, intentional misspellings, slang, and business/traveler actions.
- Use `OPERATING_LOOP.md` as the autonomous next-step rule when the user says "continue" or gives no detailed instruction.
- Run `npm run loop` to print the current blocked items and next unblocked actions.

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
6. Improve the UI with example tabs and a result quality warning when confidence is low. Done.
7. Add a shareable Markdown report download, not only clipboard copy. Done.
8. Build a B2B sample report page for hotel/guesthouse owners. Done.
9. Keep `ROADMAP.md`, `WEEKEND_PLAN.md`, and `MACBOOK_NEXT_WORK.md` updated whenever direction changes.
10. Evidence phrases must come from the original review text. Done.
11. Add overinterpretation guard tests for neutral/positive reviews. Done.
12. Add a 50-sample quality bank and `npm run test:quality`. Done.
13. Run live AI quality review using `QUALITY_REVIEW.md`. Next.
14. Add business viability analysis and adjust roadmap toward validation/sales. Done.
15. Add B2B CTA under analyzer results. Done.
16. Add feedback buttons for result quality. Done.
17. Resolve OpenAI `insufficient_quota` before running more live AI tests. Next.
18. Add a local feedback review/export page at `/feedback`. Done.
19. Add an external validation kit for traveler/B2B interviews. Done.
20. Add expert positioning for traveler anxiety, owner ROI, and purchase psychology. Done.
21. Strengthen sample report with proof phrases, scope, ROI, and staff handoff table. Done.
22. Run the validation kit with 3 travelers and 2 B2B candidates. Next.
23. Replace localStorage feedback with a real lead/feedback capture flow when deployment target is chosen. Later.

## Suggested Next Codex Prompt

```text
Continue the Review Lens MVP from OPERATING_LOOP.md and NEXT_STEPS.md.
First inspect the repo, separate blocked work from unblocked work, then implement the highest-leverage unblocked step.
Keep Windows/macOS compatibility, avoid scraping, preserve the paste-first MVP, update roadmap docs, and run npm run check before finishing.
```

## This Week's Target

- Working MVP: done.
- AI-backed JSON analyzer: done.
- Sample reports: done.
- Quality guardrails: in progress.
- Live AI quality check: blocked by OpenAI `insufficient_quota`.
- Business direction: validate as B2C free tool plus B2B one-time report, not full SaaS yet.
- B2C free tool page plus B2B CTA: done.
- Feedback capture: local browser storage MVP plus `/feedback` review/export page done.
- External validation kit: `/validation-kit` plus `VALIDATION_KIT.md` done.
- Expert positioning: `EXPERT_POSITIONING.md` done.
- Next unblocked action: run 5 validation interviews and record exact reactions.
