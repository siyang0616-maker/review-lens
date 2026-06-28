import { describe, expect, it } from "vitest";
import {
  mergeActionOutcome,
  summarizeActionOutcomes
} from "../core/outcomes/actionOutcomes";
import { buildRevenueMarkdownReport } from "../core/reports/markdownReport";
import { analyzeCustomerVoice } from "../core/revenue/revenueEngine";
import { demoDatasets, hotelDemoInput } from "../demo/datasets";
import type { ActionOutcome, RevenueAction } from "../types/revenue";

describe("revenue action board", () => {
  it("generates at least eight revenue actions for the hotel demo", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);

    expect(result.revenueActions.length).toBeGreaterThanOrEqual(8);
    expect(new Set(result.revenueActions.map((action) => action.type))).toEqual(
      new Set(["follow_up", "content", "script", "competitor_gap", "trust_asset"])
    );
  });

  it("adds language metadata while keeping raw evidence compatible", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const signal = result.revenueSignals[0];

    expect(result.sourceLanguages).toContain("ko");
    expect(result.outputLanguage).toBe("en");
    expect(signal.evidence.length).toBeGreaterThan(0);
    expect(signal.evidenceItems[0]).toMatchObject({
      originalText: signal.evidence[0],
      sourceLanguage: "ko"
    });
  });

  it("keeps follow-up, content, and script actions execution-ready", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);

    expect(result.followupMessages.every((message) => message.whyThisWorks)).toBe(true);
    expect(result.followupMessages.every((message) => message.recommendedTiming)).toBe(true);
    expect(result.contentIdeas.every((idea) => idea.outline.length > 0)).toBe(true);
    expect(result.contentIdeas.every((idea) => idea.callToAction.length > 0)).toBe(true);
    expect(result.salesScriptSuggestions.every((script) => script.objectionHandled)).toBe(true);
    expect(result.salesScriptSuggestions.every((script) => script.exampleUseCase)).toBe(true);
  });

  it("summarizes action outcomes and estimated recovered revenue", () => {
    const actions: RevenueAction[] = [
      actionFixture("a1", "follow_up", "55만원"),
      actionFixture("a2", "content", "250000"),
      actionFixture("a3", "script", "not set")
    ];
    const outcomes: ActionOutcome[] = [
      { actionId: "a1", status: "copied", timestamp: "2026-06-24T00:00:00.000Z" },
      { actionId: "a1", status: "sent", timestamp: "2026-06-24T00:01:00.000Z" },
      { actionId: "a1", status: "won", timestamp: "2026-06-24T00:02:00.000Z" },
      { actionId: "a2", status: "booked", timestamp: "2026-06-24T00:03:00.000Z" }
    ];

    expect(mergeActionOutcome(outcomes.slice(0, 1), outcomes[1])).toHaveLength(2);
    expect(summarizeActionOutcomes(actions, outcomes)).toMatchObject({
      bookingsRecovered: 1,
      estimatedRecoveredRevenue: 550000,
      followupsCopied: 1,
      followupsSent: 1,
      repliesRecovered: 0,
      wonDeals: 1
    });
  });

  it("exposes the demo dataset selector options", () => {
    expect(demoDatasets.map((dataset) => dataset.id)).toEqual([
      "korean-summer-hotel",
      "english-wedding-vendor",
      "english-clinic-med-spa"
    ]);
    expect(demoDatasets.map((dataset) => dataset.name)).toEqual([
      "Korean Summer Hotel Reviews",
      "English Wedding Vendor Leads",
      "English Clinic Consultation Leads"
    ]);
    expect(demoDatasets.every((dataset) => dataset.description.includes("Synthetic"))).toBe(true);
  });

  it("puts contact, content, and script work in the first three priority actions", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);

    expect(result.revenueActions.slice(0, 3).map((action) => action.type)).toEqual([
      "follow_up",
      "content",
      "script"
    ]);
  });

  it("creates hotel-specific script improvements for the required booking objections", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const scripts = result.salesScriptSuggestions
      .map((script) => `${script.currentProblem} ${script.improvedLine} ${script.objectionHandled}`)
      .join("\n");

    for (const requiredPhrase of ["총비용", "오션뷰", "가족", "부모님", "비교"]) {
      expect(scripts).toContain(requiredPhrase);
    }
  });

  it("builds a revenue action markdown report", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const markdown = buildRevenueMarkdownReport(result, {
      outcomeSummary: {
        bookingsRecovered: 0,
        estimatedRecoveredRevenue: 0,
        followupsCopied: 0,
        followupsSent: 0,
        repliesRecovered: 0,
        wonDeals: 0
      }
    });

    expect(markdown).toContain("# Review-to-Revenue Action Report");
    expect(markdown).toContain("## This Week’s Revenue Actions");
    expect(markdown).toContain("## Outcome Tracking Summary");
    expect(markdown).toContain("## Data Quality / Confidence Notes");
  });

  it("keeps markdown export stable for older saved results without revenueActions", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const legacyResult = {
      ...result,
      contentIdeas: result.contentIdeas.map((idea) => ({
        ...idea,
        outline: undefined
      })),
      revenueActions: undefined
    } as unknown as typeof result;

    expect(() => buildRevenueMarkdownReport(legacyResult)).not.toThrow();
    expect(buildRevenueMarkdownReport(legacyResult)).toContain("- No revenue action yet.");
  });
});

function actionFixture(
  id: string,
  type: RevenueAction["type"],
  potentialValue: string
): RevenueAction {
  return {
    createdAt: "2026-06-24T00:00:00.000Z",
    evidence: ["test evidence"],
    expectedOutcome: "Test expected outcome",
    id,
    potentialValue,
    priority: "high",
    recommendedAction: "Test recommended action",
    status: "ready",
    targetSegment: "Test segment",
    title: "Test action",
    type,
    whyNow: "Test why now"
  };
}
