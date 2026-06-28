# Review-to-Revenue AI Architecture

This document captures the Sprint 1.5 product-aligned architecture direction.

The product is organized around this loop:

> Customer Voice -> Revenue Signal -> Revenue Action -> Outcome Tracking -> Revenue Intelligence

## Implemented Module Map

- `company/`: operating rules and sprint constraints. This is the source of truth for what the product is and what the current sprint must not do.
- `docs/`: product, validation, architecture, and future implementation notes. This keeps product decisions out of component code.
- `app/`: Next.js routes and page composition. Pages should orchestrate modules, not own product logic.
- `core/customerVoice/`: customer language and voice interpretation helpers. This is where multilingual signal extraction lives before it becomes revenue logic.
- `core/revenue/`: the revenue engine. It converts customer voice into revenue signals, revenue actions, follow-up messages, content ideas, and script suggestions.
- `core/reports/`: report generation. Markdown and future PDF/export-friendly report builders belong here.
- `core/outcomes/`: outcome tracking helpers. This owns action outcome storage keys, status merging, and recovered revenue estimates.
- `demo/datasets/`: synthetic sample datasets. Demo data should stay separate from product logic and UI.
- `ui/revenue/`: reusable revenue workspace components. Components here should display product entities without owning analysis rules.
- `shared/`: cross-module utilities that are not product-specific, such as money parsing.
- `types/`: shared TypeScript contracts for product entities.

## Future Architecture Proposal

The codebase should grow toward this structure without another major rewrite:

```text
company/
docs/
app/
core/
  customerVoice/
  revenue/
  actions/
  reports/
  outcomes/
  demo/
ui/
shared/
```

### Why Each Folder Exists

- `company/` defines operating constraints, sprint boundaries, and product principles.
- `docs/` records product strategy, architecture decisions, validation plans, and implementation checklists.
- `app/` contains routes, metadata, and page-level composition only.
- `core/customerVoice/` owns raw customer text interpretation, source language handling, and evidence extraction.
- `core/revenue/` owns the conversion from interpreted customer voice into revenue signals and revenue intelligence.
- `core/actions/` should eventually own `RevenueAction` prioritization, status transitions, and action templates once action logic grows beyond the revenue engine.
- `core/reports/` owns export-ready report structures and copy assembly.
- `core/outcomes/` owns manual outcome events and future outcome analytics.
- `core/demo/` can own demo orchestration if demo behavior grows beyond static datasets.
- `ui/` owns presentational components organized by product area.
- `shared/` owns utilities that are stable across modules and do not encode product strategy.

## Module Boundaries

- Customer Voice modules should not know about localStorage, routes, or UI.
- Revenue modules may create signals and actions, but should not own visual layout.
- Report modules should accept typed analysis results and return export-ready strings or documents.
- Outcome modules should accept actions and outcome events, then return status and summary data.
- Demo modules should provide synthetic input only. They should not define business rules.
- UI modules should render typed entities and call callbacks from pages.

## Product Identity Impact Checklist For Sprint 2

Product Identity should be implemented later. It will affect:

- Landing headline and subheadline in `app/page.tsx`.
- Dashboard hero copy, metric labels, and section titles in `app/page.tsx`.
- Report titles and section labels in `core/reports/markdownReport.ts`.
- Navigation labels and CTA copy in `app/page.tsx`, `app/sample-report/page.tsx`, `app/outcomes/page.tsx`, and `app/validation-kit/page.tsx`.
- Metadata and SEO in `app/layout.tsx`.
- README positioning, demo instructions, and limitations in `README.md`.
- Product strategy and roadmap language in `docs/PRODUCT_STRATEGY.md`, `docs/ROADMAP.md`, and `docs/VALIDATION_PLAN.md`.
- Validation kit framing in `app/validation-kit/page.tsx`.
- Sample report framing in `app/sample-report/page.tsx` and `docs/SAMPLE_REPORT.md`.
- Demo dataset labels and vertical examples in `demo/datasets/`.
- Component names and exported UI names in `ui/revenue/RevenueWorkspaceComponents.tsx` if the product language becomes more specific.
- Test assertions in `tests/home-copy.test.ts`, `tests/revenue-engine.test.ts`, and related copy tests.
- Route naming if Product Identity introduces a clearer public information architecture.

## Current Alignment Risks

- `AnalysisResult` remains a broad legacy name. It is acceptable for Sprint 1.5, but Sprint 2 or 3 should consider a product-specific result contract.
- `RevenueSignal` is still produced inside the same engine that creates `RevenueAction`. This is stable now, but should split once action prioritization becomes more sophisticated.
- `leadCsv` still resembles CRM import language. It should eventually become one customer voice source among several, not a CRM abstraction.
- Outcome tracking is localStorage-only and intentionally manual.
