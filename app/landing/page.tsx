import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";
import { leakDiagnosticSample } from "@/shared/leakDiagnosticSample";

export const metadata: Metadata = {
  title: "매출 누수 무료 진단 | Review-to-Revenue AI",
  description:
    "상담 메모 10~20개로 조용해진 리드와 이번 주 보낼 후속 메시지를 진단하는 외부 공개 랜딩페이지."
};

export default function LandingPage() {
  return <LandingPageClient sample={leakDiagnosticSample} />;
}
