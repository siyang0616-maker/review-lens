import type { CustomerVoiceInput } from "../../types/revenue";

export const sampleReviewsText = [
  "상담은 친절했는데 실제 비용 구조가 조금 더 명확했으면 좋겠어요.",
  "월매출만 설명해줘서 실제 순수익이 어느 정도인지 감이 안 왔습니다.",
  "다른 컨설팅 업체보다 답변은 빨랐지만 자료가 조금 부족했어요.",
  "브랜드 설명보다 제 예산에서 가능한지 먼저 알고 싶었습니다.",
  "가족과 상의해봐야 해서 바로 결정하긴 어려웠습니다."
].join("\n");

export const sampleCompetitorReviewsText = [
  "문의했는데 답장이 너무 늦었어요.",
  "처음 안내받은 비용과 실제 비용이 달라서 신뢰가 떨어졌습니다.",
  "상담은 많았지만 제 상황에 맞는 설명은 부족했습니다.",
  "좋은 매물이라고만 하고 근거 자료가 부족했습니다."
].join("\n");

export const sampleSalesNotesText = [
  "김OO / 3억 예산 / 배스킨라빈스 관심 / 가족 상의 후 연락 준다고 함 / 8일째 미응답",
  "박OO / 1.8억 예산 / 메가커피 관심 / 월순익과 회수기간 질문 / 자료 요청 후 대기",
  "이OO / 직장인 / 풀오토 희망 / 예산 2억 / 실제 운영 부담 걱정",
  "최OO / 브랜드 비교 중 / 컴포즈와 메가커피 고민 / 권리금 조율 가능성 문의",
  "정OO / 가격 부담 언급 / 배우자 설득 필요 / 창업 실패 리스크 걱정"
].join("\n");

export const sampleLeadCsv = [
  "name,budget,interest,status,days_since_last_contact,last_note",
  "김OO,3억,배스킨라빈스,가족 상의 후 미응답,8,가족 상의 후 연락 준다고 함",
  "박OO,1.8억,메가커피,자료 요청 후 대기,3,월순익과 회수기간 질문",
  "이OO,2억,풀오토 창업,운영 부담 검토,5,실제 운영 부담 걱정",
  "최OO,미정,컴포즈와 메가커피 비교,브랜드 비교 중,2,권리금 조율 가능성 문의",
  "정OO,미정,소자본 창업,배우자 설득 필요,4,가격 부담과 실패 리스크 걱정"
].join("\n");

export const sampleCustomerVoiceInput: CustomerVoiceInput = {
  reviewsText: sampleReviewsText,
  competitorReviewsText: sampleCompetitorReviewsText,
  salesNotesText: sampleSalesNotesText,
  leadCsv: sampleLeadCsv
};
