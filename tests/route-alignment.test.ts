import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync("app/page.tsx", "utf8");
const readmeSource = readFileSync("README.md", "utf8");
const sampleReportSource = readFileSync("app/sample-report/page.tsx", "utf8");

const oldSampleReportPhrases = [
  "한국분들은 굳이",
  "tourist trap",
  "避雷",
  "踩雷",
  "외국어 리뷰",
  "객실",
  "하우스키핑",
  "엘리베이터"
];

describe("route and sample report alignment", () => {
  it("keeps the sample report aligned to the franchise revenue leak diagnostic", () => {
    expect(sampleReportSource).toContain("Revenue Leak Score");
    expect(sampleReportSource).toContain("74 / 100");
    expect(sampleReportSource).toContain("Leads to Rescue");
    expect(sampleReportSource).toContain("7명");
    expect(sampleReportSource).toContain("Recommended Action Count");
    expect(sampleReportSource).toContain("9개");
    expect(sampleReportSource).toContain("총 투자금 대비 회수 기간이 불확실합니다");
    expect(sampleReportSource).toContain("회수 기간 질문");
    expect(sampleReportSource).toContain("가족 상의");
    expect(sampleReportSource).toContain("브랜드 비교");
    expect(sampleReportSource).toContain("Follow-up Message Examples");
    expect(sampleReportSource).toContain("Content Ideas");
    expect(sampleReportSource).toContain("Sales Script Before / After");
    expect(sampleReportSource).toContain("Customer Voice → Revenue Action → Outcome Data");

    for (const phrase of oldSampleReportPhrases) {
      expect(sampleReportSource).not.toContain(phrase);
    }
  });

  it("links every app route from the home page or README", () => {
    expect(homeSource).toContain('href="/sample-report"');
    expect(homeSource).toContain('href="/outcomes"');
    expect(homeSource).toContain("View full outcome history");
    expect(readmeSource).toContain("/validation-kit");

    const routes = pageRoutes("app");
    const entrySources = `${homeSource}\n${readmeSource}`;
    const missingRoutes = routes.filter((route) => {
      if (route === "/") {
        return false;
      }

      return !entrySources.includes(route);
    });

    expect(missingRoutes).toEqual([]);
  });
});

function pageRoutes(root: string) {
  return collectPageFiles(root)
    .map((file) => {
      const route = relative(root, file)
        .replace(new RegExp(`\\${sep}page\\.tsx$`), "")
        .replace(/page\.tsx$/, "")
        .split(sep)
        .filter(Boolean)
        .join("/");

      return route ? `/${route}` : "/";
    })
    .sort();
}

function collectPageFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return collectPageFiles(fullPath);
    }

    return entry === "page.tsx" && existsSync(fullPath) ? [fullPath] : [];
  });
}
