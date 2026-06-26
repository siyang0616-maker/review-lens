import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("product documentation", () => {
  it("keeps the 30-second validation checklist in the docs folder", () => {
    const checklistPath = "docs/VALIDATION_CHECKLIST.md";

    expect(existsSync(checklistPath)).toBe(true);

    const checklist = readFileSync(checklistPath, "utf8");

    expect(checklist).toContain("30-second clarity test");
    expect(checklist).toContain("Can the user see who to contact today within 30 seconds?");
    expect(checklist).toContain("Can the user see what content to publish this week within 30 seconds?");
    expect(checklist).toContain("Can the user see what sales script to improve within 30 seconds?");
    expect(checklist).toContain("copied, sent, replied, booked, or won");
  });
});
