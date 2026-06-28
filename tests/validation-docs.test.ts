import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("validation documentation", () => {
  it("documents the 30-second clarity test for the action-board MVP", () => {
    const checklist = readFileSync("docs/VALIDATION_CHECKLIST.md", "utf8");

    expect(checklist).toContain("30-second clarity test");
    expect(checklist).toContain("Can the user see who to contact today within 30 seconds?");
    expect(checklist).toContain("Can the user see what content to publish this week within 30 seconds?");
    expect(checklist).toContain("Can the user see what sales script to improve within 30 seconds?");
    expect(checklist).toContain(
      "Can the user track whether an action was copied, sent, replied, booked, or won?"
    );
  });
});
