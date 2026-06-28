import { describe, expect, it } from "vitest";
import { buildRevenueMarkdownReport } from "../core/reports/markdownReport";
import { analyzeCustomerVoice } from "../core/revenue/revenueEngine";
import { hotelDemoInput } from "../demo/datasets";

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
    const result = analyzeCustomerVoice(hotelDemoInput);

    expect(result.revenueSignals).toHaveLength(6);
    expect(result.revenueSignals.map((signal) => signal.type)).toEqual(requiredSignalTypes);

    for (const signal of result.revenueSignals) {
      expect(signal.title).not.toHaveLength(0);
      expect(signal.whyItMatters).not.toHaveLength(0);
      expect(signal.evidence.length).toBeGreaterThan(0);
      expect(signal.evidenceSnippet).not.toHaveLength(0);
      expect(signal.recommendedAction).not.toHaveLength(0);
      expect(signal.confidenceScore).toBeGreaterThanOrEqual(40);
      expect(["low", "medium", "high"]).toContain(signal.urgencyLevel);
      expect(["low", "medium", "high"]).toContain(signal.impactLevel);
    }
  });

  it("builds a markdown report with every required section", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const markdown = buildRevenueMarkdownReport(result);

    expect(result.markdownReport).toBe(markdown);
    expect(markdown).toContain("# Review-to-Revenue Action Report");
    expect(markdown).toContain("## This Week’s Revenue Actions");
    expect(markdown).toContain("## Leads to Rescue");
    expect(markdown).toContain("## Top Customer Objections");
    expect(markdown).toContain("## Buying Triggers");
    expect(markdown).toContain("## Competitor Weaknesses");
    expect(markdown).toContain("## Follow-up Message Library");
    expect(markdown).toContain("## Content Ideas");
    expect(markdown).toContain("## Sales Script Improvements");
    expect(markdown).toContain("## Outcome Tracking Summary");
    expect(markdown).toContain("## Data Quality / Confidence Notes");
    expect(markdown).toContain("## This Week's Revenue Signals");
    expect(markdown).toContain("## Trust Barriers");
    expect(markdown).toContain("## Weekly Action Plan");
  });

  it("creates follow-up messages for family, price, and comparison objections", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const scenarios = result.followupMessages.map((message) => message.scenario);

    expect(scenarios).toContain("family_discussion");
    expect(scenarios).toContain("price_pressure");
    expect(scenarios).toContain("brand_comparison");

    for (const message of result.followupMessages) {
      expect(["soft", "professional", "urgent", "trust-building"]).toContain(message.tone);
      expect(message.whenToUse).not.toHaveLength(0);
    }
  });

  it("handles empty input without crashing", () => {
    const result = analyzeCustomerVoice({
      competitorReviewsText: "",
      leadCsv: "",
      reviewsText: "",
      salesNotesText: ""
    });

    expect(result.revenueSignals).toHaveLength(0);
    expect(result.summary).toContain(
      "Load sample data or paste customer voice data to generate signals"
    );
    expect(result.revenueActions).toHaveLength(0);
    expect(result.markdownReport).toContain("Load sample data or paste customer voice data");
  });

  it("uses RevenueAction as the executable weekly plan entity", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const lead = result.leadRescueOpportunities[0];
    const content = result.contentIdeas[0];
    const script = result.salesScriptSuggestions[0];
    const action = result.revenueActions[0];

    expect(lead.segment).not.toHaveLength(0);
    expect(lead.status).not.toHaveLength(0);
    expect(lead.likelyObjection).not.toHaveLength(0);
    expect(lead.recommendedMessage).not.toHaveLength(0);
    expect(lead.expectedValue).not.toHaveLength(0);

    expect(content.angle).not.toHaveLength(0);
    expect(content.targetObjection).not.toHaveLength(0);
    expect(content.hook).not.toHaveLength(0);
    expect(content.whyItWillWork).not.toHaveLength(0);

    expect(script.currentProblem).not.toHaveLength(0);
    expect(script.improvedLine).not.toHaveLength(0);
    expect(script.whyItWorks).not.toHaveLength(0);

    expect(action.title).not.toHaveLength(0);
    expect(action.recommendedAction).not.toHaveLength(0);
    expect(action.expectedOutcome).not.toHaveLength(0);
    expect(action.status).toBe("ready");
  });

  it("excludes closed leads from rescue candidates", () => {
    const result = analyzeCustomerVoice({
      competitorReviewsText: "",
      leadCsv: [
        "name,budget,status,days_since_last_contact,last_note",
        "완료고객,3억,won,5,가격 부담 언급",
        "실패고객,2억,lost,6,가족 상의 후 중단",
        "회수고객,2억,waiting,8,월순익과 회수기간 질문"
      ].join("\n"),
      reviewsText: "",
      salesNotesText: ""
    });

    expect(result.leadRescueOpportunities.map((lead) => lead.leadName)).toEqual(["회수고객"]);
  });
});
