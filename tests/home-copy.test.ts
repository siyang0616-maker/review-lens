import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync("app/page.tsx", "utf8");
const hotelDemoSource = readFileSync("src/lib/sampleData/hotelDemo.ts", "utf8");
const actionOutcomesSource = readFileSync("lib/analysis/actionOutcomes.ts", "utf8");

describe("home page conversion copy", () => {
  it("shows the Review-to-Revenue AI action-board direction on the first screen", () => {
    expect(pageSource).toContain("Review-to-Revenue AI");
    expect(pageSource).toContain("This Week’s Revenue Actions");
    expect(pageSource).toContain("Leads to Rescue");
    expect(pageSource).toContain("Actions Ready");
    expect(pageSource).toContain("Revenue at Risk");
    expect(pageSource).toContain("Estimated from lead CSV potentialValue. Not guaranteed revenue.");
    expect(pageSource).toContain("Today’s Priority Actions");
    expect(pageSource).toContain("Top Customer Objection");
    expect(pageSource).toContain("Top Buying Trigger");
    expect(pageSource).toContain("Content to Publish");
    expect(pageSource).toContain("Script to Improve");
    expect(pageSource).toContain("Competitor Weakness");
    expect(pageSource).toContain("Turn into Action");
    expect(pageSource).toContain("Select demo dataset");
    expect(pageSource).toContain("Load Demo Dataset");
    expect(pageSource).toContain("selectedDataset.demoLabel");
    expect(hotelDemoSource).toContain("Demo Data · Korean Summer Hotel Reviews");
    expect(pageSource).toContain("No customer voice data yet");
    expect(pageSource).toContain("actionOutcomesStorageKey");
    expect(actionOutcomesSource).toContain("reviewToRevenue.actionOutcomes");
    expect(pageSource).toContain("isCompatibleAnalysisResult");
    expect(pageSource).toContain("No outline available");
    expect(pageSource).not.toContain("Review Lens");
  });
});
