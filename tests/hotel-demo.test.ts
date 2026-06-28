import { describe, expect, it } from "vitest";
import { buildRevenueMarkdownReport } from "../core/reports/markdownReport";
import { analyzeCustomerVoice } from "../core/revenue/revenueEngine";
import { hotelDemoData, hotelDemoInput } from "../demo/datasets";

describe("hotel demo data", () => {
  it("includes complete synthetic hotel demo input fields", () => {
    expect(hotelDemoData.name).toBe("Korean Summer Hotel Reviews");
    expect(hotelDemoData.description).toContain("Synthetic sample data");
    expect(hotelDemoData.reviewsText.split("\n").filter(Boolean).length).toBeGreaterThanOrEqual(30);
    expect(hotelDemoData.competitorReviewsText.split("\n").filter(Boolean).length).toBeGreaterThanOrEqual(20);
    expect(hotelDemoData.salesNotesText.split("\n").filter(Boolean).length).toBeGreaterThanOrEqual(15);
    expect(hotelDemoData.leadCsv.split("\n").filter(Boolean).length).toBeGreaterThanOrEqual(16);
    expect(hotelDemoData.leadCsv).toContain(
      "name,channel,industry,interest,budget,lastContactDate,lastMessage,status,objection,urgency,potentialValue,notes"
    );
  });

  it("turns hotel demo input into all six revenue signals", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);

    expect(result.revenueSignals.map((signal) => signal.type)).toEqual([
      "top_customer_objection",
      "top_buying_trigger",
      "leads_to_rescue",
      "content_to_publish",
      "script_to_improve",
      "competitor_weakness"
    ]);
    expect(result.revenueSignals).toHaveLength(6);
    expect(result.demoLabel).toBe("Demo Data · Korean Summer Hotel Reviews");
  });

  it("captures hotel-specific revenue concerns and triggers", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const haystack = [
      ...result.objections.map((item) => `${item.title} ${item.explanation}`),
      ...result.buyingTriggers.map((item) => `${item.title} ${item.explanation}`),
      ...result.competitorWeaknesses.map((item) => `${item.title} ${item.explanation}`),
      ...result.revenueSignals.map((signal) => `${signal.title} ${signal.whyItMatters}`)
    ].join(" ");

    for (const phrase of [
      "parking",
      "breakfast",
      "soundproofing",
      "price",
      "comparison",
      "family"
    ]) {
      expect(haystack.toLowerCase()).toContain(phrase);
    }
  });

  it("creates hotel follow-up messages for family and price concerns", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const messages = result.followupMessages.map((message) => message.message).join("\n");

    expect(result.followupMessages.some((message) => message.scenario === "family_discussion")).toBe(true);
    expect(result.followupMessages.some((message) => message.scenario === "price_pressure")).toBe(true);
    expect(messages).toContain("가족");
    expect(messages).toContain("성수기");
    expect(messages).toContain("총비용");
  });

  it("includes the demo label in markdown export", () => {
    const result = analyzeCustomerVoice(hotelDemoInput);
    const markdown = buildRevenueMarkdownReport(result);

    expect(markdown).toContain("Demo Data · Synthetic Korean Summer Hotel Reviews");
  });
});
