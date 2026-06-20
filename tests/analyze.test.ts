import { describe, expect, it } from "vitest";
import { analyzeReview } from "../lib/analyze";
import { analysisReportSchema } from "../lib/analysis-schema";
import { reviewFixtures } from "./fixtures";

describe("local analyzer contract", () => {
  it.each(reviewFixtures)("returns a valid report for %#", (fixture) => {
    const report = analyzeReview(fixture);
    const parsed = analysisReportSchema.safeParse(report);

    expect(parsed.success).toBe(true);
    expect(report.riskCategories.length).toBeGreaterThan(0);
    expect(report.limitations.length).toBeGreaterThan(0);
  });

  it("detects high-risk Korean native-coded warning reviews", () => {
    const report = analyzeReview(reviewFixtures[0]);

    expect(report.detectedLanguage).toBe("ko");
    expect(report.obfuscationDetected).toBe(true);
    expect(report.severityScore).toBe(5);
    expect(report.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(report.evidencePhrases).toContain("한국분들만");
    expect(report.evidencePhrases).toContain("빠퀴");
    expect(report.normalizedReview).toContain("바퀴벌레");
    expect(report.normalizedReview).toContain("절대 오지 마세요");
    expect(report.riskCategories.some((risk) => risk.evidence.includes("한국분들만"))).toBe(true);
  });

  it("does not overclaim hidden warnings for ordinary positive reviews", () => {
    const report = analyzeReview(reviewFixtures[4]);

    expect(report.obfuscationDetected).toBe(false);
    expect(report.severityScore).toBe(1);
    expect(report.confidenceScore).toBeLessThanOrEqual(32);
    expect(report.hiddenWarningSummary).toBe("No strong hidden warning pattern was detected yet.");
  });

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
});
