import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync("app/page.tsx", "utf8");

describe("home page conversion copy", () => {
  it("shows fast risk-check and pilot-report actions", () => {
    expect(pageSource).toContain("숨은 예약 위험 30초 확인");
    expect(pageSource).toContain("샘플 결과 먼저 보기");
    expect(pageSource).toContain("리뷰 30개로 $49 파일럿 리포트");
    expect(pageSource).toContain(
      "위험도 / 근거 문장 / 예약 전 확인할 것 / 사장님이 오늘 고칠 3가지"
    );
  });
});
