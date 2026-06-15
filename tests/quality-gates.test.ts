import { describe, expect, it } from "vitest";
import { analyzeReview } from "../lib/analyze";
import { qualitySamples } from "./quality-samples";

describe("quality sample bank", () => {
  it("contains 50 samples across the planned review groups", () => {
    expect(qualitySamples).toHaveLength(50);
    expect(countGroup("ko_coded")).toBe(10);
    expect(countGroup("ja_subtle")).toBe(10);
    expect(countGroup("zh_warning")).toBe(10);
    expect(countGroup("en_trap")).toBe(10);
    expect(countGroup("neutral")).toBe(10);
  });

  it.each(qualitySamples)("meets local quality expectations for $id", (sample) => {
    const report = analyzeReview(sample.input);

    expect(report.detectedLanguage).toBe(sample.expectedLanguage);
    expect(report.severityScore).toBeGreaterThanOrEqual(sample.expectedMinSeverity);

    if (sample.expectedMaxSeverity) {
      expect(report.severityScore).toBeLessThanOrEqual(sample.expectedMaxSeverity);
    }

    if (typeof sample.expectedObfuscation === "boolean") {
      expect(report.obfuscationDetected).toBe(sample.expectedObfuscation);
    }

    for (const phrase of sample.expectedEvidence ?? []) {
      expect(
        report.evidencePhrases.some((evidence) =>
          evidence.toLowerCase().includes(phrase.toLowerCase())
        )
      ).toBe(true);
    }
  });
});

function countGroup(group: (typeof qualitySamples)[number]["group"]) {
  return qualitySamples.filter((sample) => sample.group === group).length;
}
