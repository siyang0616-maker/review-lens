import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync("app/page.tsx", "utf8");
const readmeSource = readFileSync("README.md", "utf8");
const sampleReportSource = readFileSync("app/sample-report/page.tsx", "utf8");
const landingSource = existsSync("app/landing/page.tsx")
  ? readFileSync("app/landing/page.tsx", "utf8")
  : "";
const diagnosticSampleSource = existsSync("shared/leakDiagnosticSample.ts")
  ? readFileSync("shared/leakDiagnosticSample.ts", "utf8")
  : "";

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
    expect(diagnosticSampleSource).toContain("Revenue Leak Score");
    expect(diagnosticSampleSource).toContain("74");
    expect(diagnosticSampleSource).toContain("Leads to Rescue");
    expect(diagnosticSampleSource).toContain("7");
    expect(diagnosticSampleSource).toContain("Recommended Action Count");
    expect(diagnosticSampleSource).toContain("9");
    expect(diagnosticSampleSource).toContain("총 투자금 대비 회수 기간이 불확실합니다");
    expect(diagnosticSampleSource).toContain("회수 기간 질문");
    expect(diagnosticSampleSource).toContain("가족과 상의");
    expect(diagnosticSampleSource).toContain("브랜드 비교");
    expect(sampleReportSource).toContain("@/shared/leakDiagnosticSample");
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
    expect(readmeSource).toContain("/landing");
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

  it("keeps the landing page and sample report on one diagnostic data source", () => {
    expect(existsSync("shared/leakDiagnosticSample.ts")).toBe(true);
    expect(landingSource).toContain("@/shared/leakDiagnosticSample");
    expect(sampleReportSource).toContain("@/shared/leakDiagnosticSample");

    for (const source of [landingSource, sampleReportSource]) {
      expect(source).not.toMatch(/\b74\s*\/\s*100\b/);
      expect(source).not.toContain("7명");
      expect(source).not.toContain("9개");
      expect(source).not.toContain("초기 투자금 대비 회수 기간이 불확실합니다");
    }
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
