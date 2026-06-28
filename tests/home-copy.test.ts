import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync("app/page.tsx", "utf8");
const revenueComponentsSource = readFileSync(
  "ui/revenue/RevenueWorkspaceComponents.tsx",
  "utf8"
);
const hotelDemoSource = readFileSync("demo/datasets/hotelDemo.ts", "utf8");
const actionOutcomesSource = readFileSync("core/outcomes/actionOutcomes.ts", "utf8");
const productSource = `${pageSource}\n${revenueComponentsSource}`;

describe("home page conversion copy", () => {
  it("shows the Review-to-Revenue AI action-board direction on the first screen", () => {
    expect(productSource).toContain("Review-to-Revenue AI");
    expect(productSource).toContain("This Week’s Revenue Actions");
    expect(productSource).toContain("Leads to Rescue");
    expect(productSource).toContain("Actions Ready");
    expect(productSource).toContain("Revenue at Risk");
    expect(productSource).toContain("Estimated from lead CSV potentialValue. Not guaranteed revenue.");
    expect(productSource).toContain("Today’s Priority Actions");
    expect(productSource).toContain("Top Customer Objection");
    expect(productSource).toContain("Top Buying Trigger");
    expect(productSource).toContain("Content to Publish");
    expect(productSource).toContain("Script to Improve");
    expect(productSource).toContain("Competitor Weakness");
    expect(productSource).toContain("Turn into Action");
    expect(productSource).toContain("Select demo dataset");
    expect(productSource).toContain("Load Demo Dataset");
    expect(pageSource).toContain("selectedDataset.demoLabel");
    expect(pageSource).toContain("loadInitialDemoDataset");
    expect(hotelDemoSource).toContain("Demo Data · Korean Summer Hotel Reviews");
    expect(productSource).toContain("No customer voice data yet");
    expect(productSource).toContain("actionOutcomesStorageKey");
    expect(actionOutcomesSource).toContain("reviewToRevenue.actionOutcomes");
    expect(productSource).toContain("followupMessageStorageKey");
    expect(productSource).toContain("contentIdeaStatusStorageKey");
    expect(productSource).toContain("setContentStatuses");
    expect(productSource).toContain("isCompatibleAnalysisResult");
    expect(productSource).toContain("No outline available");
    expect(productSource).not.toContain("Review Lens");
  });
});
