# Review Lens Trust and Conversion Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make today's Review Lens changes improve trust and validation speed without spending OpenAI credits.

**Architecture:** Keep the paste-first MVP intact. Add one local analyzer safety gate for weak evidence, then tighten the first-screen CTA copy so users understand the next action before running analysis. No live AI calls, no scraping, no database, no payment flow.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest.

---

## File Structure

- Modify: `tests/analyze.test.ts`
  - Adds the failing regression test for weak single-signal overclaiming.
- Modify: `lib/analyze.ts`
  - Adds local evidence-strength logic and cautious summary copy.
- Create: `tests/home-copy.test.ts`
  - Verifies the conversion copy exists without adding UI test dependencies.
- Modify: `app/page.tsx`
  - Changes the primary CTA, sample CTA, empty-result preview, and early B2B pilot cue.
- Modify: `app/globals.css`
  - Adds small styles for the early B2B pilot cue.

## Guardrails

- Do not call `RUN_AI_QUALITY=1`.
- Do not use OpenAI API or any paid external service.
- Do not add scraping, OAuth, DB, payment, or automatic reply behavior.
- If `node_modules` is missing, run `npm ci` only if package install is allowed. Otherwise report that verification is blocked by missing dependencies.

---

### Task 1: Add Evidence-Strength Gate

**Files:**
- Modify: `tests/analyze.test.ts`
- Modify: `lib/analyze.ts`

- [ ] **Step 1: Write the failing test**

Add this test to `tests/analyze.test.ts`:

```ts
  it("keeps a single soft warning cautious", () => {
    const report = analyzeReview({
      reviewText: "굳이 추천하진 않아요. 위치는 편했고 직원은 친절했습니다.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    });

    expect(report.severityScore).toBeLessThanOrEqual(3);
    expect(report.confidenceScore).toBeLessThanOrEqual(55);
    expect(report.hiddenWarningSummary).toContain("주의 신호");
    expect(report.hiddenWarningSummary).toContain("단정하지 않습니다");
  });
```

- [ ] **Step 2: Run the targeted test to verify RED**

Run:

```bash
npm run test -- tests/analyze.test.ts
```

Expected before implementation: the new test fails because the current confidence is too high or the summary does not use cautious wording.

- [ ] **Step 3: Implement minimal evidence-strength logic**

In `lib/analyze.ts`, add a helper near `calculateConfidence`:

```ts
function hasStrongEvidence(matches: SignalMatch[]) {
  return matches.some((match) => match.signal.severityHint >= 5);
}

function shouldUseCautiousSummary(matches: SignalMatch[]) {
  return matches.length === 1 && !hasStrongEvidence(matches);
}
```

Then update the `confidenceScore` assignment in `analyzeReview`:

```ts
  const rawConfidenceScore = calculateConfidence(
    matches.length,
    text.length,
    obfuscationTypes.length
  );
  const confidenceScore = shouldUseCautiousSummary(matches)
    ? Math.min(rawConfidenceScore, 55)
    : rawConfidenceScore;
```

Then update `buildHiddenWarningSummary` so weak single signals use cautious copy:

```ts
  if (shouldUseCautiousSummary(matches)) {
    const match = matches[0];
    return outputLanguage === "ko"
      ? `주의 신호: "${match.phrase}"는 ${match.signal.meaning} 다만 단일 표현만으로 강한 경고를 단정하지 않습니다.`
      : `Caution signal: "${match.phrase}" may mean ${match.signal.meaning} Do not treat one phrase alone as a strong warning.`;
  }
```

Place that block after the `matches.length === 0` guard and before the existing multi-signal summary.

- [ ] **Step 4: Run the targeted test to verify GREEN**

Run:

```bash
npm run test -- tests/analyze.test.ts
```

Expected: all tests in `tests/analyze.test.ts` pass.

- [ ] **Step 5: Run the quality gate**

Run:

```bash
npm run test:quality
```

Expected: all quality-gate tests pass. If this fails because an existing sample depends on overconfident single weak evidence, keep the gate and adjust only the expected confidence/wording, not the safety principle.

---

### Task 2: Tighten First-Screen Conversion Copy

**Files:**
- Create: `tests/home-copy.test.ts`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing copy test**

Create `tests/home-copy.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync("app/page.tsx", "utf8");

describe("home page conversion copy", () => {
  it("shows fast risk-check and pilot-report actions", () => {
    expect(pageSource).toContain("숨은 예약 위험 30초 확인");
    expect(pageSource).toContain("샘플 결과 먼저 보기");
    expect(pageSource).toContain("리뷰 30개로 $49 파일럿 리포트");
    expect(pageSource).toContain("위험도 / 근거 문장 / 예약 전 확인할 것 / 사장님이 오늘 고칠 3가지");
  });
});
```

- [ ] **Step 2: Run the copy test to verify RED**

Run:

```bash
npm run test -- tests/home-copy.test.ts
```

Expected before implementation: the test fails because the new copy is not present.

- [ ] **Step 3: Update the home page copy**

In `app/page.tsx`:

Change the primary analyze button label:

```tsx
{isLoading ? "Analyzing..." : "숨은 예약 위험 30초 확인"}
```

Change the sample button label:

```tsx
샘플 결과 먼저 보기
```

Add this early B2B cue after the `.hint` block inside the input panel:

```tsx
<div className="pilot-cue">
  <strong>숙소 운영자라면</strong>
  <span>리뷰 30개로 $49 파일럿 리포트 요청까지 검증합니다.</span>
  <a href="/sample-report">파일럿 범위 보기</a>
</div>
```

Update the empty result panel copy:

```tsx
위험도 / 근거 문장 / 예약 전 확인할 것 / 사장님이 오늘 고칠 3가지가 여기에 표시됩니다.
```

- [ ] **Step 4: Add small styling**

In `app/globals.css`, add this after `.hint`:

```css
.pilot-cue {
  align-items: center;
  background: #fbfbf8;
  border: 1px solid var(--line);
  border-radius: 8px;
  display: grid;
  gap: 6px;
  margin-top: 12px;
  padding: 12px;
}

.pilot-cue strong {
  color: var(--accent-strong);
  font-size: 13px;
}

.pilot-cue span {
  color: #35433c;
  font-size: 13px;
  line-height: 1.45;
}

.pilot-cue a {
  color: var(--accent-strong);
  font-size: 13px;
  font-weight: 850;
  text-decoration: none;
}
```

- [ ] **Step 5: Run the copy test to verify GREEN**

Run:

```bash
npm run test -- tests/home-copy.test.ts
```

Expected: the test passes.

---

### Task 3: Final Local Verification

**Files:**
- No new file edits unless verification exposes a real issue.

- [ ] **Step 1: Run all local checks**

Run:

```bash
npm run check
```

Expected: typecheck, tests, and build pass.

- [ ] **Step 2: Do not run live AI**

Confirm that no command used this environment variable:

```bash
RUN_AI_QUALITY=1
```

Expected: no live AI quality test was run during this pass.

- [ ] **Step 3: Report exact status**

Report:

- Files changed.
- Commands run.
- Whether `npm run check` passed or why it could not run.
- Next recommended step: build `/pilot` only after today's local trust/conversion pass is verified.
