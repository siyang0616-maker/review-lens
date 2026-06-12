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
    expect(report.evidencePhrases).toContain("언어권 내부 경고");
  });
});
