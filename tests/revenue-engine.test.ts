import { describe, expect, it } from "vitest";
import { buildRevenueMarkdownReport } from "../lib/analysis/reportBuilder";
import { analyzeRevenueSignals } from "../lib/analysis/revenueSignalEngine";
import { sampleCustomerVoiceInput } from "../lib/analysis/sampleData";

const requiredSignalTypes = [
  "top_customer_objection",
  "top_buying_trigger",
  "leads_to_rescue",
  "content_to_publish",
  "script_to_improve",
  "competitor_weakness"
];

describe("review-to-revenue engine", () => {
  it("turns sample customer voice into six revenue signals", () => {
    const result = analyzeRevenueSignals(sampleCustomerVoiceInput);

    expect(result.revenueSignals).toHaveLength(6);
    expect(result.revenueSignals.map((signal) => signal.type)).toEqual(requiredSignalTypes);

    for (const signal of result.revenueSignals) {
      expect(signal.title).not.toHaveLength(0);
      expect(signal.whyItMatters).not.toHaveLength(0);
      expect(signal.evidenceSnippet).not.toHaveLength(0);
      expect(signal.recommendedAction).not.toHaveLength(0);
      expect(signal.confidenceScore).toBeGreaterThanOrEqual(40);
      expect(["low", "medium", "high"]).toContain(signal.urgencyLevel);
      expect(["low", "medium", "high"]).toContain(signal.impactLevel);
    }
  });

  it("builds a markdown report with every required section", () => {
    const markdown = buildRevenueMarkdownReport(analyzeRevenueSignals(sampleCustomerVoiceInput));

    expect(markdown).toContain("# Review-to-Revenue AI Report");
    expect(markdown).toContain("## This Week's Revenue Signals");
    expect(markdown).toContain("## Customer Objections");
    expect(markdown).toContain("## Buying Triggers");
    expect(markdown).toContain("## Trust Barriers");
    expect(markdown).toContain("## Competitor Weaknesses");
    expect(markdown).toContain("## Lead Rescue Opportunities");
    expect(markdown).toContain("## Content Ideas");
    expect(markdown).toContain("## Follow-up Message Library");
    expect(markdown).toContain("## Sales Script Suggestions");
    expect(markdown).toContain("## Weekly Action Plan");
  });

  it("creates follow-up messages for family, price, and comparison objections", () => {
    const result = analyzeRevenueSignals(sampleCustomerVoiceInput);
    const scenarios = result.followupMessages.map((message) => message.scenario);

    expect(scenarios).toContain("family_discussion");
    expect(scenarios).toContain("price_pressure");
    expect(scenarios).toContain("brand_comparison");
  });

  it("handles empty input without crashing", () => {
    const result = analyzeRevenueSignals({
      competitorReviewsText: "",
      leadCsv: "",
      reviewsText: "",
      salesNotesText: ""
    });

    expect(result.revenueSignals).toHaveLength(0);
    expect(result.summary).toContain(
      "Load sample data or paste customer voice data to generate signals"
    );
    expect(result.weeklyActionPlan).toHaveLength(0);
  });
});
