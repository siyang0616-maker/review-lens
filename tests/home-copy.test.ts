import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync("app/page.tsx", "utf8");

describe("home page conversion copy", () => {
  it("shows the Review-to-Revenue AI direction on the first screen", () => {
    expect(pageSource).toContain("Review-to-Revenue AI");
    expect(pageSource).toContain("This Week’s Revenue Signals");
    expect(pageSource).toContain("Top Customer Objection");
    expect(pageSource).toContain("Top Buying Trigger");
    expect(pageSource).toContain("Leads to Rescue");
    expect(pageSource).toContain("Content to Publish");
    expect(pageSource).toContain("Script to Improve");
    expect(pageSource).toContain("Competitor Weakness");
    expect(pageSource).not.toContain("Review Lens");
  });
});
