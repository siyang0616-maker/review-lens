import type {
  AnalysisResult,
  ContentIdea,
  CustomerVoiceInput,
  FollowupMessage,
  FollowupScenario,
  ImpactLevel,
  InsightCategory,
  InsightItem,
  LeadRescueOpportunity,
  RevenueAction,
  RevenueSignal,
  RevenueSignalType,
  SalesScriptSuggestion,
  SupportedLanguage,
  UrgencyLevel,
  WeeklyAction
} from "../../types/revenue";
import { extractInterpretationSignals } from "./lensEngine";
import { buildRevenueMarkdownReport } from "./reportBuilder";

type InsightDefinition = {
  id: string;
  category: InsightCategory;
  title: string;
  keywords: string[];
  explanation: string;
  recommendedAction: string;
};

type ParsedLead = {
  leadName: string;
  status: string;
  context: string;
  expectedValue: string;
  daysSinceLastContact?: number;
  tags: string[];
  raw: string;
};

const emptyInputMessage = "Load sample data or paste customer voice data to generate signals";

const hotelDemoLabel = "Demo Data · Korean Summer Hotel Reviews";

const hotelObjectionDefinitions: InsightDefinition[] = [
  {
    category: "objection",
    explanation:
      "Customers are not just complaining about price. They are unsure whether the high summer-season price is justified by room view, breakfast, parking, pool experience, soundproofing, and service reliability.",
    id: "hotel-summer-value-objection",
    keywords: [
      "가격",
      "총비용",
      "성수기",
      "조식",
      "breakfast",
      "buffet",
      "주차",
      "parking",
      "방음",
      "noise",
      "시끄러움",
      "오션뷰",
      "view",
      "수영장",
      "pool",
      "추가비용",
      "extra fee",
      "가족",
      "배우자",
      "비교"
    ],
    recommendedAction:
      "Before discussing price, show total cost, extra fees, view differences, breakfast and pool congestion, parking instructions, and soundproofing expectations in one booking checklist.",
    title: "Summer price/value confidence is missing"
  },
  {
    category: "objection",
    explanation:
      "Families and couples hesitate when room view, noise, breakfast wait time, parking, and pool access are not explained before arrival.",
    id: "hotel-prearrival-uncertainty",
    keywords: ["사전 안내", "문자", "체크인", "대기", "동선", "부모님", "아이", "조식", "주차", "방음"],
    recommendedAction:
      "Send a pre-arrival guide that explains check-in timing, parking, breakfast rush hours, pool congestion, room-view levels, and quiet-room options.",
    title: "Pre-arrival uncertainty blocks booking decisions"
  }
];

const hotelBuyingTriggerDefinitions: InsightDefinition[] = [
  {
    category: "buying_trigger",
    explanation:
      "Beach access, ocean view, clean rooms, friendly guidance, family-friendly facilities, and clear pre-arrival information create booking confidence.",
    id: "hotel-confidence-triggers",
    keywords: [
      "위치",
      "beach",
      "해변",
      "접근성",
      "친절",
      "guidance",
      "안내",
      "청결",
      "clean",
      "아이",
      "family",
      "kids",
      "오션뷰",
      "ocean view",
      "일출",
      "사전 안내",
      "문자"
    ],
    recommendedAction:
      "Lead with the proof customers care about: beach access, real view level, cleanliness, family facilities, and pre-arrival guidance.",
    title: "Clear stay confidence triggers booking intent"
  }
];

const hotelCompetitorWeaknessDefinitions: InsightDefinition[] = [
  {
    category: "competitor_weakness",
    explanation:
      "Competitors are weak on slow check-in, parking guidance, soundproofing, hidden extra costs, mismatch between photos and actual rooms, and delayed response.",
    id: "hotel-competitor-friction",
    keywords: [
      "체크인 대기",
      "사진",
      "실제",
      "숨은",
      "추가비용",
      "방음",
      "주차 안내",
      "불친절",
      "답변",
      "지연",
      "total cost",
      "actual room"
    ],
    recommendedAction:
      "Differentiate with a transparent booking page and follow-up script that explains parking, real room photos, total cost, check-in timing, and response speed.",
    title: "Competitors create avoidable booking friction"
  }
];

const painPointDefinitions: InsightDefinition[] = [
  {
    category: "pain_point",
    explanation: "고객은 월매출보다 실제 손에 남는 돈과 회수기간을 먼저 확인하고 싶어합니다.",
    id: "profit-clarity",
    keywords: ["순수익", "월순익", "회수기간", "월매출", "감이 안"],
    recommendedAction: "상담 첫 10분 안에 예상 순수익, 고정비, 회수기간을 한 장 표로 보여주세요.",
    title: "Profit clarity is missing"
  },
  {
    category: "pain_point",
    explanation: "고객은 브랜드 설명보다 자신의 예산으로 가능한지 먼저 판단하려고 합니다.",
    id: "budget-fit",
    keywords: ["예산", "가능한지", "가격", "비용", "부담"],
    recommendedAction: "예산대별 가능한 선택지와 불가능한 선택지를 먼저 분리해 안내하세요.",
    title: "Budget fit is the first question"
  },
  {
    category: "pain_point",
    explanation: "고객은 좋은 매물이라는 말보다 왜 좋은지 보여주는 자료를 원합니다.",
    id: "proof-gap",
    keywords: ["자료", "근거", "명확", "부족", "신뢰"],
    recommendedAction: "상권, 손익, 기존 사례, 리스크 체크리스트를 기본 첨부 자료로 준비하세요.",
    title: "Proof needs to arrive before persuasion"
  }
];

const objectionDefinitions: InsightDefinition[] = [
  {
    category: "objection",
    explanation: "가격 자체보다 비용 구조와 실패 리스크가 불명확할 때 의사결정이 멈춥니다.",
    id: "cost-risk-objection",
    keywords: ["비용", "가격", "부담", "리스크", "실패", "순수익", "회수기간"],
    recommendedAction: "비용 구조, 예상 순수익, 최악의 경우를 함께 설명하는 리스크 해소 스크립트를 만드세요.",
    title: "Cost, payback, and downside risk block decisions"
  },
  {
    category: "objection",
    explanation: "고액 상담에서는 가족 또는 배우자의 동의가 실제 결제 병목이 됩니다.",
    id: "family-objection",
    keywords: ["가족", "배우자", "상의", "설득"],
    recommendedAction: "가족에게 전달할 1페이지 요약본과 질문 대응 메시지를 후속 연락에 포함하세요.",
    title: "Family approval is a hidden buying committee"
  },
  {
    category: "objection",
    explanation: "브랜드 비교 중인 리드는 더 많은 설명보다 비교 기준표가 필요합니다.",
    id: "comparison-objection",
    keywords: ["비교", "다른", "브랜드", "컴포즈", "메가커피", "배스킨라빈스"],
    recommendedAction: "브랜드별 투자금, 운영 난이도, 회수기간, 리스크를 같은 기준으로 비교하세요.",
    title: "Brand comparison needs a decision frame"
  }
];

const buyingTriggerDefinitions: InsightDefinition[] = [
  {
    category: "buying_trigger",
    explanation: "빠른 응답은 이미 경쟁사 대비 강점으로 인식되고 있습니다.",
    id: "fast-response",
    keywords: ["답변은 빨랐", "빠른", "친절", "상담은 친절"],
    recommendedAction: "빠른 답변 뒤 24시간 안에 근거 자료와 다음 액션을 자동 후속 메시지로 보내세요.",
    title: "Fast response creates trust momentum"
  },
  {
    category: "buying_trigger",
    explanation: "고객은 브랜드 스토리보다 내 예산으로 가능한 선택지를 보는 순간 움직입니다.",
    id: "personal-fit",
    keywords: ["제 예산", "가능한지", "상황", "맞는 설명", "직장인", "풀오토"],
    recommendedAction: "첫 상담 질문을 브랜드 선호가 아니라 예산, 시간, 운영 참여도 순서로 바꾸세요.",
    title: "Personal feasibility beats generic brand pitch"
  },
  {
    category: "buying_trigger",
    explanation: "순수익과 회수기간 질문은 구매 의도가 낮은 질문이 아니라 검토가 깊어진 신호입니다.",
    id: "payback-intent",
    keywords: ["월순익", "순수익", "회수기간", "권리금"],
    recommendedAction: "이 질문이 나온 리드는 계산표와 사례를 보내고 48시간 안에 재접촉하세요.",
    title: "Payback questions indicate buying intent"
  }
];

const trustBarrierDefinitions: InsightDefinition[] = [
  {
    category: "trust_barrier",
    explanation: "숫자와 근거가 부족하면 친절한 상담도 신뢰로 전환되지 않습니다.",
    id: "missing-evidence",
    keywords: ["자료", "근거", "명확", "부족", "감이 안"],
    recommendedAction: "모든 상담 후속 메시지에 최소 1개의 근거 자료와 1개의 다음 질문을 포함하세요.",
    title: "Evidence gap reduces trust"
  },
  {
    category: "trust_barrier",
    explanation: "처음 안내된 비용과 실제 비용이 다르면 경쟁사 리뷰에서처럼 신뢰가 크게 떨어집니다.",
    id: "cost-transparency",
    keywords: ["실제 비용", "처음 안내", "비용 구조", "신뢰", "달라"],
    recommendedAction: "초기 안내부터 필수 비용, 선택 비용, 변동 비용을 분리해서 보여주세요.",
    title: "Cost transparency must be explicit"
  }
];

const competitorWeaknessDefinitions: InsightDefinition[] = [
  {
    category: "competitor_weakness",
    explanation: "경쟁사는 문의 응답 속도에서 신뢰를 잃고 있습니다.",
    id: "slow-response",
    keywords: ["답장이 너무 늦", "늦었", "미응답", "대기"],
    recommendedAction: "우리 메시지에서 24시간 응답 원칙과 다음 단계 일정을 명확히 약속하세요.",
    title: "Competitors are slow to follow up"
  },
  {
    category: "competitor_weakness",
    explanation: "초기 안내와 실제 비용 차이는 경쟁사 고객이 가장 민감하게 보는 신뢰 손상입니다.",
    id: "hidden-cost",
    keywords: ["처음 안내", "실제 비용", "달라", "신뢰가 떨어"],
    recommendedAction: "비용 투명성을 랜딩, 상담 자료, 후속 메시지의 핵심 차별점으로 쓰세요.",
    title: "Competitors lose trust with unclear costs"
  },
  {
    category: "competitor_weakness",
    explanation: "상담량은 많아도 개인 상황에 맞지 않으면 고객은 도움을 받지 못했다고 느낍니다.",
    id: "generic-advice",
    keywords: ["제 상황", "맞는 설명", "부족", "좋은 매물이라고만", "근거 자료"],
    recommendedAction: "예산, 운영 가능 시간, 리스크 허용도를 기준으로 개인화 진단을 전면에 두세요.",
    title: "Competitors sound generic"
  }
];

export function analyzeRevenueSignals(input: CustomerVoiceInput): AnalysisResult {
  const normalizedInput = normalizeInput(input);
  const inputSummary = summarizeInput(normalizedInput);
  const generatedAt = new Date().toISOString();
  const outputLanguage = normalizedInput.outputLanguage ?? "en";

  if (!hasAnyInput(normalizedInput)) {
    return finalizeResult({
      buyingTriggers: [],
      competitorWeaknesses: [],
      contentIdeas: [],
      followupMessages: [],
      generatedAt,
      inputSummary,
      leadRescueOpportunities: [],
      objections: [],
      outputLanguage,
      painPoints: [],
      revenueSignals: [],
      revenueActions: [],
      salesScriptSuggestions: [],
      sourceLanguages: [outputLanguage],
      summary: emptyInputMessage,
      trustBarriers: [],
      weeklyActionPlan: [],
      markdownReport: ""
    });
  }

  const reviewLines = splitEvidence(normalizedInput.reviewsText);
  const competitorLines = splitEvidence(normalizedInput.competitorReviewsText);
  const salesLines = splitEvidence(normalizedInput.salesNotesText);
  const leadRows = parseLeadRows(normalizedInput.salesNotesText, normalizedInput.leadCsv);
  const customerLines = unique([...reviewLines, ...salesLines, ...leadRows.map((lead) => lead.raw)]);
  const allLines = unique([...customerLines, ...competitorLines]);
  const isHotelDemo = isHotelInput(normalizedInput, allLines);
  const sourceLanguages = detectSourceLanguages(normalizedInput, allLines);
  const interpretationSignals = extractInterpretationSignals(allLines.join("\n"));

  const painPoints = buildInsights(painPointDefinitions, customerLines);
  const objections = buildInsights(
    isHotelDemo ? [...hotelObjectionDefinitions, ...objectionDefinitions] : objectionDefinitions,
    customerLines
  );
  const buyingTriggers = buildInsights(
    isHotelDemo
      ? [...hotelBuyingTriggerDefinitions, ...buyingTriggerDefinitions]
      : buyingTriggerDefinitions,
    customerLines
  );
  const trustBarriers = buildInsights(trustBarrierDefinitions, allLines);
  const competitorWeaknesses = buildInsights(
    isHotelDemo
      ? [...hotelCompetitorWeaknessDefinitions, ...competitorWeaknessDefinitions]
      : competitorWeaknessDefinitions,
    [...competitorLines, ...salesLines]
  );
  const leadRescueOpportunities = buildLeadRescueOpportunities(leadRows);
  const contentIdeas = buildContentIdeas({
    buyingTriggers,
    isHotelDemo,
    objections,
    painPoints,
    trustBarriers
  });
  const followupMessages = buildFollowupMessages(allLines, leadRescueOpportunities, isHotelDemo);
  const salesScriptSuggestions = buildSalesScriptSuggestions(
    allLines,
    interpretationSignals.length,
    isHotelDemo
  );
  const revenueSignals = buildRevenueSignals({
    buyingTriggers,
    competitorWeaknesses,
    contentIdeas,
    followupMessages,
    leadRescueOpportunities,
    objections,
    painPoints,
    salesScriptSuggestions,
    trustBarriers
  });
  const weeklyActionPlan = buildWeeklyActionPlan(revenueSignals);
  const revenueActions = buildRevenueActions({
    competitorWeaknesses,
    contentIdeas,
    createdAt: generatedAt,
    followupMessages,
    leadRescueOpportunities,
    objections,
    revenueSignals,
    salesScriptSuggestions
  });

  return finalizeResult({
    buyingTriggers,
    competitorWeaknesses,
    contentIdeas,
    demoLabel: normalizedInput.demoLabel,
    followupMessages,
    generatedAt,
    inputSummary,
    leadRescueOpportunities,
    objections,
    outputLanguage,
    painPoints,
    revenueSignals,
    revenueActions,
    salesScriptSuggestions,
    sourceLanguages,
    summary: buildSummary(objections, leadRescueOpportunities, contentIdeas),
    trustBarriers,
    weeklyActionPlan,
    markdownReport: ""
  });
}

function finalizeResult(result: AnalysisResult): AnalysisResult {
  return {
    ...result,
    markdownReport: buildRevenueMarkdownReport(result)
  };
}

function normalizeInput(input: CustomerVoiceInput): CustomerVoiceInput {
  return {
    competitorReviewsText: input.competitorReviewsText.trim(),
    demoLabel: input.demoLabel?.trim(),
    leadCsv: input.leadCsv.trim(),
    outputLanguage: input.outputLanguage ?? "en",
    reviewsText: input.reviewsText.trim(),
    salesNotesText: input.salesNotesText.trim()
  };
}

function hasAnyInput(input: CustomerVoiceInput) {
  return [
    input.competitorReviewsText,
    input.leadCsv,
    input.reviewsText,
    input.salesNotesText
  ].some((value) => value.trim().length > 0);
}

function isHotelInput(input: CustomerVoiceInput, lines: string[]) {
  if (input.demoLabel === hotelDemoLabel) {
    return true;
  }

  const text = lines.join("\n").toLowerCase();
  const hits = [
    "호텔",
    "리조트",
    "오션뷰",
    "조식",
    "수영장",
    "주차",
    "체크인",
    "해변",
    "hotel",
    "resort",
    "ocean view",
    "breakfast",
    "parking",
    "pool"
  ].filter((keyword) => text.includes(keyword.toLowerCase()));

  return hits.length >= 3;
}

function detectSourceLanguages(
  input: CustomerVoiceInput,
  lines: string[]
): SupportedLanguage[] {
  if (input.demoLabel?.includes("Korean")) {
    return ["ko"];
  }

  const text = lines.join("\n");
  const languages = new Set<SupportedLanguage>();

  if (/[가-힣]/.test(text)) {
    languages.add("ko");
  }

  if (/[A-Za-z]/.test(text)) {
    languages.add("en");
  }

  return languages.size > 0 ? Array.from(languages) : [input.outputLanguage ?? "en"];
}

function summarizeInput(input: CustomerVoiceInput): AnalysisResult["inputSummary"] {
  return {
    competitorReviewLines: splitEvidence(input.competitorReviewsText).length,
    leadRows: parseCsv(input.leadCsv).length,
    reviewLines: splitEvidence(input.reviewsText).length,
    salesNoteLines: splitEvidence(input.salesNotesText).length
  };
}

function splitEvidence(text: string) {
  return unique(
    text
      .split(/\n|(?<=[.!?。！？])\s+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 1)
  );
}

function buildInsights(definitions: InsightDefinition[], evidenceLines: string[]): InsightItem[] {
  const text = evidenceLines.join("\n");

  return definitions
    .map((definition): InsightItem | null => {
      const evidence = findEvidence(evidenceLines, definition.keywords);
      const keywordHits = countKeywordHits(text, definition.keywords);
      const impact: ImpactLevel = definition.category === "buying_trigger" ? "medium" : "high";

      if (evidence.length === 0 && keywordHits === 0) {
        return null;
      }

      return {
        category: definition.category,
        confidenceScore: confidenceFromEvidence(evidence.length, keywordHits),
        description: definition.explanation,
        evidence: evidence.length > 0 ? evidence : [safeFallbackEvidence(evidenceLines)],
        explanation: definition.explanation,
        impact,
        id: definition.id,
        recommendedAction: definition.recommendedAction,
        title: definition.title
      } satisfies InsightItem;
    })
    .filter((item): item is InsightItem => Boolean(item))
    .sort((a, b) => b.confidenceScore - a.confidenceScore);
}

function buildLeadRescueOpportunities(leads: ParsedLead[]): LeadRescueOpportunity[] {
  return leads
    .filter((lead) => !isClosedLead(lead))
    .map((lead, index) => {
      const { reasons, score } = scoreLead(lead);
      const recommendedMessage = chooseLeadMessage(lead);
      const urgency = toUrgency(score);

      return {
        context: lead.context,
        daysSinceLastContact: lead.daysSinceLastContact,
        expectedValue: lead.expectedValue,
        id: `lead-${index + 1}`,
        leadName: lead.leadName,
        likelyObjection: lead.tags[0] ?? "information_gap",
        nextBestAction: recommendedMessage,
        potentialValue: lead.expectedValue,
        recommendedMessage,
        rescueReason: reasons.join(" / "),
        score,
        segment: lead.tags.includes("brand_comparison") ? "brand comparison" : "warm inbound lead",
        status: lead.status,
        suggestedMessage: recommendedMessage,
        tags: lead.tags,
        urgency,
        urgencyLevel: urgency
      } satisfies LeadRescueOpportunity;
    })
    .filter((lead) => lead.score >= 55)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function buildContentIdeas(input: {
  painPoints: InsightItem[];
  buyingTriggers: InsightItem[];
  objections: InsightItem[];
  trustBarriers: InsightItem[];
  isHotelDemo?: boolean;
}): ContentIdea[] {
  const evidence = firstEvidence([
    ...input.painPoints,
    ...input.objections,
    ...input.trustBarriers,
    ...input.buyingTriggers
  ]);

  if (input.isHotelDemo) {
    return [
      {
        angle: "성수기 예약 전 불안을 체크리스트로 선제 해소",
        callToAction: "예약 전 조식, 주차, 방음, 수영장 혼잡도 체크리스트 받기",
        format: "blog",
        hook: "8월 성수기 호텔은 객실가보다 조식, 주차, 방음, 수영장 혼잡도를 먼저 확인해야 합니다.",
        id: "hotel-content-peak-season-checklist",
        outline: ["총비용 확인", "조식 대기 시간", "주차 동선", "방음/객실 위치", "수영장 혼잡도"],
        priority: 1,
        sourceSignal: evidence,
        suggestedHook: "8월 성수기 호텔은 객실가보다 조식, 주차, 방음, 수영장 혼잡도를 먼저 확인해야 합니다.",
        targetObjection: "summer hotel value uncertainty",
        title: "8월 성수기 호텔 예약 전 체크리스트",
        whyItWillWork: "고객이 결제 전에 반복 확인하는 조식, 주차, 방음, 수영장 혼잡도를 한 번에 처리합니다.",
        whyNow: "성수기 가격 부담과 총비용 질문이 반복되고 있습니다."
      },
      {
        angle: "오션뷰 기대 차이를 예약 질문으로 줄임",
        callToAction: "오션뷰 등급별 객실 확인표 받기",
        format: "faq",
        hook: "오션뷰도 정면뷰, 측면뷰, 일부뷰에 따라 만족도가 달라집니다.",
        id: "hotel-content-ocean-view-questions",
        outline: ["정면뷰/측면뷰/일부뷰 구분", "층수 확인", "사진 요청", "환불/변경 조건", "도착 시간"],
        priority: 2,
        sourceSignal: evidence,
        suggestedHook: "오션뷰도 정면뷰, 측면뷰, 일부뷰에 따라 만족도가 달라집니다.",
        targetObjection: "room view clarity",
        title: "오션뷰 객실 예약 전 확인해야 할 5가지",
        whyItWillWork: "사진과 실제 객실 차이에서 생기는 신뢰 장벽을 줄입니다.",
        whyNow: "오션뷰 기대와 실제 뷰 차이에 대한 질문이 반복됩니다."
      },
      {
        angle: "아이 동반 고객의 실사용 불안을 먼저 해결",
        callToAction: "아이 동반 예약 전 혼잡 시간표 확인하기",
        format: "sales_asset",
        hook: "아이와 함께라면 조식과 수영장 혼잡도가 객실가만큼 중요합니다.",
        id: "hotel-content-family-congestion",
        outline: ["조식 피크 시간", "키즈풀 혼잡도", "객실 동선", "주차 위치", "짐 보관"],
        priority: 3,
        sourceSignal: evidence,
        suggestedHook: "아이와 함께라면 조식과 수영장 혼잡도가 객실가만큼 중요합니다.",
        targetObjection: "family comfort",
        title: "아이 동반 호텔 선택 시 조식/수영장 혼잡도 보는 법",
        whyItWillWork: "가족 여행 리드에게 다시 연락할 명분을 제공합니다.",
        whyNow: "아이 동반, 조식 대기, 수영장 혼잡 우려가 함께 나타납니다."
      },
      {
        angle: "부모님 동반 여행의 동선 리스크 제거",
        callToAction: "부모님 동반 객실/주차 동선 상담받기",
        format: "blog",
        hook: "부모님을 모시고 가는 호텔은 뷰보다 주차, 엘리베이터, 방음 동선이 먼저입니다.",
        id: "hotel-content-parents-trip",
        outline: ["엘리베이터 접근", "주차 거리", "조용한 층", "체크인 대기", "조식 좌석"],
        priority: 4,
        sourceSignal: evidence,
        suggestedHook: "부모님을 모시고 가는 호텔은 뷰보다 주차, 엘리베이터, 방음 동선이 먼저입니다.",
        targetObjection: "family comfort",
        title: "부모님 모시고 호텔 갈 때 확인해야 할 동선/주차/방음",
        whyItWillWork: "부모님 동반 고객의 구매 기준을 구체화합니다.",
        whyNow: "부모님 동반 리드가 주차, 동선, 방음을 반복 문의합니다."
      },
      {
        angle: "사진과 실제 객실 차이에 대한 신뢰 회복",
        callToAction: "객실 사진 확인 질문 리스트 받기",
        format: "faq",
        hook: "호텔 사진과 실제 객실 차이는 예약 전 질문으로 줄일 수 있습니다.",
        id: "hotel-content-photo-reality-gap",
        outline: ["최근 사진 요청", "객실 크기", "욕실 상태", "뷰 방향", "성수기 배정 기준"],
        priority: 5,
        sourceSignal: evidence,
        suggestedHook: "호텔 사진과 실제 객실 차이는 예약 전 질문으로 줄일 수 있습니다.",
        targetObjection: "expectation mismatch",
        title: "호텔 사진과 실제 객실 차이를 줄이는 예약 질문법",
        whyItWillWork: "경쟁 호텔의 사진/실제 불만을 우리 쪽 신뢰 메시지로 전환합니다.",
        whyNow: "사진과 실제 객실 차이 불만이 경쟁 리뷰에서 반복됩니다."
      },
      {
        angle: "객실가가 아니라 총비용으로 가격 반박 해소",
        callToAction: "성수기 호텔 총비용 계산표 받기",
        format: "short_video",
        hook: "성수기 호텔은 객실가, 조식, 수영장, 주차, 추가요금을 합쳐 비교해야 합니다.",
        id: "hotel-content-total-cost",
        outline: ["객실가", "조식 비용", "수영장 비용", "주차 비용", "추가요금/보증금"],
        priority: 6,
        sourceSignal: evidence,
        suggestedHook: "성수기 호텔은 객실가, 조식, 수영장, 주차, 추가요금을 합쳐 비교해야 합니다.",
        targetObjection: "price and hidden cost",
        title: "성수기 호텔 총비용 계산법: 객실가, 조식, 수영장, 주차, 추가요금",
        whyItWillWork: "가격 부담 리드를 단순 할인 논의가 아니라 총비용 판단으로 전환합니다.",
        whyNow: "추가비용과 총비용 질문이 결제 직전 보류를 만들고 있습니다."
      }
    ];
  }

  return [
    {
      angle: "순수익과 회수기간을 먼저 보여주는 판단 프레임",
      callToAction: "상담 전 예산과 목표 회수기간을 보내달라고 요청",
      format: "blog",
      hook: "월매출보다 중요한 것은 내 통장에 남는 돈입니다.",
      id: "content-profit-clarity",
      outline: ["월매출 착시", "고정비", "변동비", "회수기간", "상담 전 질문"],
      priority: 1,
      sourceSignal: evidence,
      suggestedHook: "월매출보다 중요한 것은 내 통장에 남는 돈입니다.",
      targetObjection: "profit clarity",
      title: "월매출이 아니라 순수익과 회수기간으로 창업 판단하기",
      whyItWillWork: "반복되는 순수익/회수기간 질문을 상담 전에 해소합니다.",
      whyNow: "순수익, 회수기간, 비용 구조 질문이 반복되고 있습니다."
    },
    {
      angle: "배우자와 가족이 실제로 반대할 질문을 먼저 처리",
      callToAction: "가족 공유용 PDF 또는 카카오 메시지 받기",
      format: "sales_asset",
      hook: "가족이 반대하기 전에 먼저 보여줘야 할 숫자 5가지",
      id: "content-family-onepager",
      outline: ["초기비용", "리스크", "회수기간", "운영 부담", "가족 질문"],
      priority: 2,
      sourceSignal: findEvidenceFromInsights(input.objections, "family") ?? evidence,
      suggestedHook: "가족이 반대하기 전에 먼저 보여줘야 할 숫자 5가지",
      targetObjection: "family approval",
      title: "배우자와 가족 설득용 창업 리스크 체크리스트",
      whyItWillWork: "숨은 구매위원회가 묻는 비용, 실패 리스크, 회수기간을 선제 답변합니다.",
      whyNow: "가족 상의와 배우자 설득이 고액 리드의 실제 병목입니다."
    },
    {
      angle: "브랜드 비교를 같은 기준의 의사결정표로 전환",
      callToAction: "관심 브랜드 2개를 입력하면 비교표 보내기",
      format: "faq",
      hook: "메가커피와 컴포즈를 비교할 때 매출표만 보면 놓치는 것",
      id: "content-brand-comparison",
      outline: ["투자금", "운영 난이도", "회수기간", "권리금", "리스크"],
      priority: 3,
      sourceSignal: findEvidenceFromInsights(input.objections, "comparison") ?? evidence,
      suggestedHook: "메가커피와 컴포즈를 비교할 때 매출표만 보면 놓치는 것",
      targetObjection: "brand comparison",
      title: "브랜드 비교 중인 예비 창업자를 위한 판단 기준표",
      whyItWillWork: "비교 중인 리드가 더 많은 설명 대신 판단 기준을 받게 됩니다.",
      whyNow: "브랜드 비교 리드는 설득보다 기준표에 반응합니다."
    },
    {
      angle: "예산 가능성을 먼저 판단해 상담 시간을 줄임",
      callToAction: "무료 10분 예산 가능성 진단 신청",
      format: "short_video",
      hook: "내 예산으로 가능한 브랜드부터 봐야 상담 시간이 줄어듭니다.",
      id: "content-budget-fit",
      outline: ["예산 범위", "불가능한 선택지", "가능한 선택지", "리스크", "다음 상담"],
      priority: 4,
      sourceSignal: findEvidenceFromInsights(input.painPoints, "budget") ?? evidence,
      suggestedHook: "내 예산으로 가능한 브랜드부터 봐야 상담 시간이 줄어듭니다.",
      targetObjection: "budget fit",
      title: "예산별 가능한 프랜차이즈 선택지 먼저 보기",
      whyItWillWork: "예산이 맞지 않는 선택지를 빨리 제외해 리드의 불확실성을 낮춥니다.",
      whyNow: "브랜드 설명보다 예산 적합성을 먼저 알고 싶다는 신호가 강합니다."
    }
  ];
}

function buildFollowupMessages(
  evidenceLines: string[],
  leads: LeadRescueOpportunity[],
  isHotelDemo = false
): FollowupMessage[] {
  if (isHotelDemo) {
    const hotelMessages: Array<{
      scenario: FollowupScenario;
      title: string;
      keywords: string[];
      message: string;
      nextStep: string;
    }> = [
      {
        keywords: ["가족", "배우자", "부모님", "아이", "상의"],
        message:
          "지난번에 가족분과 상의가 필요하다고 하셨는데, 성수기에는 객실가보다 조식 혼잡도, 주차 동선, 방음, 수영장 이용 조건을 같이 보셔야 합니다. 가족분께 바로 공유하실 수 있게 핵심 체크리스트로 정리해드릴게요.",
        nextStep: "가족 공유용 성수기 예약 체크리스트 전송",
        scenario: "family_discussion",
        title: "가족/배우자 상의 후 미응답 리드"
      },
      {
        keywords: ["가격", "총비용", "예산", "부담", "추가비용"],
        message:
          "성수기 가격이 부담된다고 하셨는데, 객실가만 보면 실제 만족도를 판단하기 어렵습니다. 조식, 수영장, 주차, 뷰 등급, 추가요금까지 포함한 총비용 기준으로 비교표를 정리해드리겠습니다.",
        nextStep: "객실가와 추가비용을 나눈 총비용 비교표 전송",
        scenario: "price_pressure",
        title: "가격 부담 후 미응답 리드"
      },
      {
        keywords: ["비교", "다른 호텔", "다른 곳", "Comparing"],
        message:
          "다른 호텔과 비교 중이시면 가격만 비교하기보다 체크인 대기, 주차 안내, 방음, 실제 객실뷰, 조식 대기까지 같은 기준으로 보시는 게 좋습니다. 비교 기준표를 보내드릴게요.",
        nextStep: "호텔 비교 기준표 전송",
        scenario: "brand_comparison",
        title: "비교 중인 고객"
      },
      {
        keywords: ["주차", "방음", "조식", "수영장", "체크인", "혼잡"],
        message:
          "지난번에 성수기 조식과 수영장 혼잡도, 주차와 방음 문제를 걱정하셨는데, 예약 전에 확인하시면 좋은 시간대와 객실 선택 기준을 정리해드렸습니다.",
        nextStep: "혼잡 시간대와 객실 선택 기준 전송",
        scenario: "proof_gap",
        title: "주차/방음/조식 걱정 고객"
      },
      {
        keywords: ["결제", "Hot", "보류", "오늘"],
        message:
          "결제 직전에 멈추신 이유가 뷰 등급, 총비용, 체크인 대기 중 무엇인지에 따라 추천 객실이 달라집니다. 오늘 예약 전 마지막으로 확인할 항목만 짧게 정리해드릴게요.",
        nextStep: "결제 전 최종 확인 체크리스트 전송",
        scenario: "slow_reply_recovery",
        title: "결제 직전 보류 고객"
      }
    ];

    return hotelMessages
      .map((definition, index): FollowupMessage | null => {
        const evidence = findEvidence(evidenceLines, definition.keywords)[0];

        if (!evidence) {
          return null;
        }

        return {
          evidence,
          id: `hotel-followup-${index + 1}`,
          message: definition.message,
          nextStep: definition.nextStep,
          recommendedTiming: "Send within the 3–14 day warm follow-up window.",
          scenario: definition.scenario,
          targetObjection: definition.title,
          targetLead: findLeadForScenario(leads, definition.scenario),
          title: definition.title,
          tone: toneForScenario(definition.scenario),
          whenToUse: "Use when this booking concern appears in reviews, sales notes, or lead CSV.",
          whyThisWorks: "It gives the lead a concrete booking decision tool instead of asking whether they are still interested."
        } satisfies FollowupMessage;
      })
      .filter((message): message is FollowupMessage => Boolean(message));
  }

  const definitions: Array<{
    scenario: FollowupScenario;
    title: string;
    keywords: string[];
    message: string;
    nextStep: string;
  }> = [
    {
      keywords: ["가족", "배우자", "상의", "설득"],
      message:
        "지난번에 가족분과 상의가 필요하다고 하셔서, 대화하실 때 바로 보여드릴 수 있는 비용/순수익/리스크 요약을 정리해드리려고 합니다. 원하시면 관심 브랜드 기준으로 1페이지로 보내드릴게요.",
      nextStep: "가족 공유용 1페이지 요약본 전송",
      scenario: "family_discussion",
      title: "가족 상의 리드 재접촉"
    },
    {
      keywords: ["가격", "비용", "예산", "부담", "실패 리스크"],
      message:
        "비용이 부담스럽다고 느끼시는 지점이 투자금 자체인지, 회수기간인지, 실패 리스크인지에 따라 답이 달라집니다. 예산 기준으로 가능한 선택지와 피해야 할 선택지를 나눠서 보내드릴게요.",
      nextStep: "예산대별 가능/불가 선택지 비교표 전송",
      scenario: "price_pressure",
      title: "가격 부담 리드 재접촉"
    },
    {
      keywords: ["비교", "브랜드", "컴포즈", "메가커피", "배스킨라빈스"],
      message:
        "브랜드를 비교 중이시면 매출만 보면 판단이 흐려질 수 있습니다. 투자금, 운영 난이도, 예상 순수익, 회수기간을 같은 기준으로 비교한 표를 보내드리겠습니다.",
      nextStep: "브랜드 비교 기준표 전송",
      scenario: "brand_comparison",
      title: "브랜드 비교 리드 재접촉"
    },
    {
      keywords: ["순수익", "월순익", "회수기간", "월매출"],
      message:
        "월매출보다 실제 순수익과 회수기간이 더 중요합니다. 관심 브랜드 기준으로 고정비와 변동비를 나눈 예상 손익표를 먼저 보내드릴게요.",
      nextStep: "예상 손익표와 회수기간표 전송",
      scenario: "profit_clarity",
      title: "순수익 질문 리드 재접촉"
    },
    {
      keywords: ["자료", "근거", "부족", "명확"],
      message:
        "말로 설명드리는 것보다 자료로 보시는 편이 빠를 것 같아 상권 근거, 예상 손익, 리스크 체크포인트를 같이 정리했습니다. 확인 후 걱정되는 항목부터 같이 보겠습니다.",
      nextStep: "근거 자료 3종 전송",
      scenario: "proof_gap",
      title: "자료 요청 리드 재접촉"
    },
    {
      keywords: ["답장이 너무 늦", "미응답", "대기"],
      message:
        "기다리시게 하지 않도록 오늘 안에 가능한 선택지와 다음 확인 일정을 먼저 정리해드리겠습니다. 확인 후 맞지 않는 조건은 바로 제외하겠습니다.",
      nextStep: "오늘 안에 다음 일정 제안",
      scenario: "slow_reply_recovery",
      title: "응답 지연 불안 해소"
    }
  ];

  return definitions
    .map((definition, index) => {
      const evidence = findEvidence(evidenceLines, definition.keywords)[0];

      if (!evidence) {
        return null;
      }

      return {
        evidence,
        id: `followup-${index + 1}`,
        message: definition.message,
        nextStep: definition.nextStep,
        recommendedTiming: "Send within 24 hours of identifying this stalled decision reason.",
        scenario: definition.scenario,
        targetObjection: definition.title,
        targetLead: findLeadForScenario(leads, definition.scenario),
        title: definition.title,
        tone: toneForScenario(definition.scenario),
        whenToUse: definition.nextStep,
        whyThisWorks: "It reopens the conversation with a useful decision asset instead of a vague check-in."
      } satisfies FollowupMessage;
    })
    .filter((message): message is FollowupMessage => Boolean(message));
}

function buildSalesScriptSuggestions(
  evidenceLines: string[],
  interpretationSignalCount: number,
  isHotelDemo = false
): SalesScriptSuggestion[] {
  const proofEvidence = findEvidence(evidenceLines, ["자료", "근거", "부족", "명확"])[0];
  const profitEvidence = findEvidence(evidenceLines, ["순수익", "월순익", "회수기간"])[0];
  const familyEvidence = findEvidence(evidenceLines, ["가족", "배우자", "상의"])[0];
  const comparisonEvidence = findEvidence(evidenceLines, ["비교", "컴포즈", "메가커피"])[0];
  const suggestions: Array<
    Omit<SalesScriptSuggestion, "exampleUseCase" | "objectionHandled"> &
      Partial<Pick<SalesScriptSuggestion, "exampleUseCase" | "objectionHandled">>
  > = [];

  if (isHotelDemo) {
    const priceEvidence =
      findEvidence(evidenceLines, ["가격", "총비용", "조식", "주차", "수영장", "방음"])[0] ??
      safeFallbackEvidence(evidenceLines);
    const viewEvidence =
      findEvidence(evidenceLines, ["오션뷰", "뷰", "사진", "실제", "객실"])[0] ??
      safeFallbackEvidence(evidenceLines);

    suggestions.push(
      {
        currentProblem: "상담 초반에 가격만 안내하면 고객이 비교 모드로 빠진다.",
        evidence: priceEvidence,
        id: "hotel-script-total-value-before-price",
        improvedLine:
          "성수기 호텔은 객실가만 비교하면 실제 만족도를 판단하기 어렵습니다. 조식 혼잡도, 주차, 객실뷰, 방음, 수영장 이용 조건까지 같이 보셔야 총비용 대비 만족도가 맞습니다.",
        improvedScript:
          "성수기 호텔은 객실가만 비교하면 실제 만족도를 판단하기 어렵습니다. 조식 혼잡도, 주차, 객실뷰, 방음, 수영장 이용 조건까지 같이 보셔야 총비용 대비 만족도가 맞습니다.",
        reason: "가격 반박을 할인 논의가 아니라 총비용 대비 만족도 판단으로 전환합니다.",
        situation: "가격만 묻는 성수기 호텔 리드",
        weakLine: "객실가는 1박 기준 이 금액입니다.",
        whyItWorks: "가격 반박을 할인 논의가 아니라 총비용 대비 만족도 판단으로 전환합니다."
      },
      {
        currentProblem: "오션뷰를 단순히 오션뷰라고 안내하면 기대 차이가 생긴다.",
        evidence: viewEvidence,
        id: "hotel-script-view-clarity",
        improvedLine:
          "오션뷰도 고층 정면뷰, 측면뷰, 저층 일부뷰로 만족도가 달라집니다. 원하시는 뷰 수준에 따라 객실 타입을 구분해서 보시는 게 좋습니다.",
        improvedScript:
          "오션뷰도 고층 정면뷰, 측면뷰, 저층 일부뷰로 만족도가 달라집니다. 원하시는 뷰 수준에 따라 객실 타입을 구분해서 보시는 게 좋습니다.",
        reason: "객실 사진과 실제 뷰 차이에서 생기는 신뢰 손실을 줄입니다.",
        situation: "오션뷰 기대치가 불명확한 리드",
        weakLine: "오션뷰 객실입니다.",
        whyItWorks: "객실 사진과 실제 뷰 차이에서 생기는 신뢰 손실을 줄입니다."
      }
    );
  }

  if (proofEvidence) {
    suggestions.push({
      currentProblem: "근거 없이 좋은 매물이라고 설득하고 있음",
      evidence: proofEvidence,
      id: "script-proof-before-pitch",
      improvedLine:
        "좋은 매물이라는 말보다 먼저 판단 기준을 보여드리겠습니다. 투자금, 예상 순수익, 회수기간, 리스크를 한 장으로 보고 맞지 않는 조건은 바로 제외하겠습니다.",
      improvedScript:
        "좋은 매물이라는 말보다 먼저 판단 기준을 보여드리겠습니다. 투자금, 예상 순수익, 회수기간, 리스크를 한 장으로 보고 맞지 않는 조건은 바로 제외하겠습니다.",
      reason: "추상적 설득을 숫자와 제외 기준으로 바꿔 신뢰 장벽을 낮춥니다.",
      situation: "근거 자료가 부족하다고 느끼는 리드",
      weakLine: "이 매물은 괜찮고 요즘 문의가 많습니다.",
      whyItWorks: "추상적 설득을 숫자와 제외 기준으로 바꿔 신뢰 장벽을 낮춥니다."
    });
  }

  if (profitEvidence) {
    suggestions.push({
      currentProblem: "월매출 중심 설명으로 실제 수익 불안을 해소하지 못함",
      evidence: profitEvidence,
      id: "script-profit-before-sales",
      improvedLine:
        "월매출은 참고값이고, 결정은 순수익과 회수기간으로 보시는 게 맞습니다. 먼저 고정비와 변동비를 나눠 현실적인 범위를 계산해보겠습니다.",
      improvedScript:
        "월매출은 참고값이고, 결정은 순수익과 회수기간으로 보시는 게 맞습니다. 먼저 고정비와 변동비를 나눠 현실적인 범위를 계산해보겠습니다.",
      reason: "고객의 실제 판단 질문에 맞춰 상담 순서를 바꿉니다.",
      situation: "월매출 설명만으로 감이 오지 않는 리드",
      weakLine: "월매출은 이 정도까지 나올 수 있습니다.",
      whyItWorks: "고객의 실제 판단 질문에 맞춰 상담 순서를 바꿉니다."
    });
  }

  if (familyEvidence) {
    suggestions.push({
      currentProblem: "가족 상의 리드를 후속 자료 없이 방치함",
      evidence: familyEvidence,
      id: "script-family-buyer-committee",
      improvedLine:
        "가족분이 가장 걱정하실 부분은 비용, 실패 리스크, 회수기간일 가능성이 큽니다. 같이 보실 수 있게 1페이지 요약으로 정리해드릴게요.",
      improvedScript:
        "가족분이 가장 걱정하실 부분은 비용, 실패 리스크, 회수기간일 가능성이 큽니다. 같이 보실 수 있게 1페이지 요약으로 정리해드릴게요.",
      reason: "결정권자 밖의 반박까지 상담 흐름 안으로 끌어옵니다.",
      situation: "가족 또는 배우자 상의가 필요한 리드",
      weakLine: "상의해보시고 연락 주세요.",
      whyItWorks: "결정권자 밖의 반박까지 상담 흐름 안으로 끌어옵니다."
    });
  }

  if (comparisonEvidence) {
    suggestions.push({
      currentProblem: "브랜드 비교 질문에 명확한 판단 기준을 주지 못함",
      evidence: comparisonEvidence,
      id: "script-comparison-frame",
      improvedLine:
        "두 브랜드를 매출만으로 비교하면 위험합니다. 투자금, 운영 강도, 순수익, 회수기간을 같은 기준으로 놓고 어떤 조건이 맞지 않는지 먼저 지우겠습니다.",
      improvedScript:
        "두 브랜드를 매출만으로 비교하면 위험합니다. 투자금, 운영 강도, 순수익, 회수기간을 같은 기준으로 놓고 어떤 조건이 맞지 않는지 먼저 지우겠습니다.",
      reason: "모호한 비교를 의사결정 가능한 기준표로 바꿉니다.",
      situation: "브랜드를 비교 중인 리드",
      weakLine: "둘 다 장단점이 있습니다.",
      whyItWorks: "모호한 비교를 의사결정 가능한 기준표로 바꿉니다."
    });
  }

  if (suggestions.length === 0 && interpretationSignalCount > 0) {
    suggestions.push({
      currentProblem: "완곡한 불안을 직접 다루지 않고 재연락을 기다림",
      evidence: "고객 텍스트에 숨은 부정 신호가 포함되어 있습니다.",
      id: "script-hidden-signal",
      improvedLine:
        "걱정되는 부분을 그냥 넘기지 않고, 비용과 리스크 기준으로 다시 정리해서 판단하실 수 있게 도와드리겠습니다.",
      improvedScript:
        "걱정되는 부분을 그냥 넘기지 않고, 비용과 리스크 기준으로 다시 정리해서 판단하실 수 있게 도와드리겠습니다.",
      reason: "완곡한 불안을 직접 다뤄 다음 대화를 만듭니다.",
      situation: "표면적으로는 약하지만 내부 경고가 있는 텍스트",
      weakLine: "괜찮으시면 다시 연락 주세요.",
      whyItWorks: "완곡한 불안을 직접 다뤄 다음 대화를 만듭니다."
    });
  }

  return suggestions.map((suggestion) => ({
    ...suggestion,
    exampleUseCase:
      suggestion.exampleUseCase ??
      `Use when a lead shows this concern: ${suggestion.situation}`,
    objectionHandled:
      suggestion.objectionHandled ?? suggestion.currentProblem
  }));
}

function buildRevenueActions(input: {
  competitorWeaknesses: InsightItem[];
  contentIdeas: ContentIdea[];
  createdAt: string;
  followupMessages: FollowupMessage[];
  leadRescueOpportunities: LeadRescueOpportunity[];
  objections: InsightItem[];
  revenueSignals: RevenueSignal[];
  salesScriptSuggestions: SalesScriptSuggestion[];
}): RevenueAction[] {
  const actions: RevenueAction[] = [];

  input.followupMessages.slice(0, 5).forEach((message, index) => {
    const matchingLead =
      input.leadRescueOpportunities.find((lead) => lead.leadName === message.targetLead) ??
      input.leadRescueOpportunities[index] ??
      input.leadRescueOpportunities[0];

    actions.push({
      createdAt: input.createdAt,
      evidence: [message.evidence],
      expectedOutcome: "Recover a stalled conversation and move the lead to a concrete next step.",
      id: `action-follow-up-${index + 1}`,
      potentialValue: matchingLead?.potentialValue ?? matchingLead?.expectedValue,
      primaryCTA: "View follow-up messages",
      priority: index < 3 ? "high" : "medium",
      recommendedAction: message.message,
      relatedSignalId: "signal-leads",
      status: "ready",
      suggestedMessage: message.message,
      targetSegment: message.title,
      title:
        index === 0
          ? `Rescue ${input.leadRescueOpportunities.length} warm leads with proof-based follow-ups`
          : message.title,
      type: "follow_up",
      whyNow:
        index === 0
          ? "These leads are within the 3–14 day follow-up window."
          : message.recommendedTiming
    });
  });

  input.contentIdeas.slice(0, 3).forEach((idea, index) => {
    actions.push({
      createdAt: input.createdAt,
      evidence: [idea.sourceSignal],
      expectedOutcome: "Remove repeated buying friction before the next sales conversation.",
      id: `action-content-${index + 1}`,
      primaryCTA: "Copy hook",
      priority: index === 0 ? "high" : "medium",
      recommendedAction: `${idea.title}: ${idea.hook}`,
      relatedSignalId: "signal-content",
      status: "ready",
      suggestedMessage: idea.hook,
      targetSegment: idea.targetObjection,
      title: idea.title,
      type: "content",
      whyNow: idea.whyNow
    });
  });

  input.salesScriptSuggestions.slice(0, 2).forEach((script, index) => {
    actions.push({
      createdAt: input.createdAt,
      evidence: [script.evidence],
      expectedOutcome: "Increase trust before the customer enters price-only comparison mode.",
      id: `action-script-${index + 1}`,
      primaryCTA: "Copy improved script",
      priority: "high",
      recommendedAction: script.improvedLine,
      relatedSignalId: "signal-script",
      status: "ready",
      suggestedMessage: script.improvedLine,
      targetSegment: script.objectionHandled,
      title: script.situation,
      type: "script",
      whyNow: script.whyItWorks
    });
  });

  const competitor = input.competitorWeaknesses[0];
  if (competitor) {
    actions.push({
      createdAt: input.createdAt,
      evidence: competitor.evidence,
      expectedOutcome: "Turn competitor friction into our positioning advantage.",
      id: "action-competitor-gap-1",
      primaryCTA: "Update positioning",
      priority: "medium",
      recommendedAction: competitor.recommendedAction,
      relatedSignalId: "signal-competitor",
      status: "ready",
      targetSegment: "Comparison-shopping leads",
      title: `Use competitor gap: ${competitor.title}`,
      type: "competitor_gap",
      whyNow: competitor.explanation
    });
  }

  const objection = input.objections[0];
  if (objection) {
    actions.push({
      createdAt: input.createdAt,
      evidence: objection.evidence,
      expectedOutcome: "Create a reusable trust asset that answers the objection before sales follow-up.",
      id: "action-trust-asset-1",
      primaryCTA: "Create trust asset",
      priority: "high",
      recommendedAction: objection.recommendedAction,
      relatedSignalId: "signal-objection",
      status: "ready",
      targetSegment: "High-intent hesitant leads",
      title: `Build trust asset for: ${objection.title}`,
      type: "trust_asset",
      whyNow: objection.explanation
    });
  }

  return actions.slice(0, 12);
}

function buildRevenueSignals(input: {
  painPoints: InsightItem[];
  buyingTriggers: InsightItem[];
  objections: InsightItem[];
  trustBarriers: InsightItem[];
  competitorWeaknesses: InsightItem[];
  leadRescueOpportunities: LeadRescueOpportunity[];
  contentIdeas: ContentIdea[];
  followupMessages: FollowupMessage[];
  salesScriptSuggestions: SalesScriptSuggestion[];
}): RevenueSignal[] {
  const topObjection = first(input.objections);
  const topTrigger = first(input.buyingTriggers);
  const topCompetitorWeakness = first(input.competitorWeaknesses);
  const topContent = first(input.contentIdeas);
  const topScript = first(input.salesScriptSuggestions);
  const topLead = first(input.leadRescueOpportunities);

  return [
    topObjection
      ? signal({
          confidenceScore: topObjection.confidenceScore,
          evidenceSnippet: topObjection.evidence[0],
          id: "signal-objection",
          impactLevel: "high",
          label: "Top Customer Objection",
          recommendedAction: topObjection.recommendedAction,
          title: topObjection.title,
          type: "top_customer_objection",
          urgencyLevel: "high",
          whyItMatters: topObjection.explanation
        })
      : null,
    topTrigger
      ? signal({
          confidenceScore: topTrigger.confidenceScore,
          evidenceSnippet: topTrigger.evidence[0],
          id: "signal-trigger",
          impactLevel: "high",
          label: "Top Buying Trigger",
          recommendedAction: topTrigger.recommendedAction,
          title: topTrigger.title,
          type: "top_buying_trigger",
          urgencyLevel: "medium",
          whyItMatters: topTrigger.explanation
        })
      : null,
    topLead
      ? signal({
          confidenceScore: topLead.score,
          evidenceSnippet: topLead.context,
          id: "signal-leads",
          impactLevel: "high",
          label: "Leads to Rescue",
          recommendedAction: `${topLead.leadName}부터 재접촉: ${topLead.recommendedMessage}`,
          title: `${input.leadRescueOpportunities.length} warm leads need proof-based follow-up`,
          type: "leads_to_rescue",
          urgencyLevel: topLead.urgencyLevel,
          whyItMatters: "미응답, 가족 상의, 가격 부담, 비교 중인 리드는 새 리드보다 빠르게 매출로 회수될 수 있습니다."
        })
      : null,
    topContent
      ? signal({
          confidenceScore: 82,
          evidenceSnippet: topContent.sourceSignal,
          id: "signal-content",
          impactLevel: "medium",
          label: "Content to Publish",
          recommendedAction: `${topContent.title} 콘텐츠를 제작하고 CTA를 '${topContent.callToAction}'로 연결하세요.`,
          title: topContent.title,
          type: "content_to_publish",
          urgencyLevel: "medium",
          whyItMatters: topContent.whyNow
        })
      : null,
    topScript
      ? signal({
          confidenceScore: 84,
          evidenceSnippet: topScript.evidence,
          id: "signal-script",
          impactLevel: "high",
          label: "Script to Improve",
          recommendedAction: topScript.improvedLine,
          title: topScript.situation,
          type: "script_to_improve",
          urgencyLevel: "high",
          whyItMatters: topScript.whyItWorks
        })
      : null,
    topCompetitorWeakness
      ? signal({
          confidenceScore: topCompetitorWeakness.confidenceScore,
          evidenceSnippet: topCompetitorWeakness.evidence[0],
          id: "signal-competitor",
          impactLevel: "medium",
          label: "Competitor Weakness",
          recommendedAction: topCompetitorWeakness.recommendedAction,
          title: topCompetitorWeakness.title,
          type: "competitor_weakness",
          urgencyLevel: "medium",
          whyItMatters: topCompetitorWeakness.explanation
        })
      : null
  ].filter((item): item is RevenueSignal => Boolean(item));
}

function buildWeeklyActionPlan(signals: RevenueSignal[]): WeeklyAction[] {
  const actionMap: Record<
    RevenueSignalType,
    Omit<WeeklyAction, "id" | "priority" | "day" | "purpose">
  > = {
    competitor_weakness: {
      action: "경쟁사 약점 1개를 랜딩/상담 오프닝/후속 메시지에 같은 문장으로 반영",
      due: "금요일",
      expectedOutcome: "비교 중인 리드에게 선택 기준을 명확히 제공",
      owner: "Growth",
      sourceSignalType: "competitor_weakness"
    },
    content_to_publish: {
      action: "순수익/회수기간/예산 적합성 콘텐츠 1개 발행",
      due: "목요일",
      expectedOutcome: "반복 질문을 콘텐츠로 선제 처리",
      owner: "Marketing",
      sourceSignalType: "content_to_publish"
    },
    leads_to_rescue: {
      action: "상위 rescue lead 5명에게 맞춤 follow-up 발송",
      due: "내일",
      expectedOutcome: "미응답 리드를 상담 재개 상태로 전환",
      owner: "Sales",
      sourceSignalType: "leads_to_rescue"
    },
    script_to_improve: {
      action: "상담 스크립트 첫 5분을 비용/근거/리스크 중심으로 수정",
      due: "내일",
      expectedOutcome: "상담 후 이탈과 자료 요청 대기 시간을 단축",
      owner: "Sales",
      sourceSignalType: "script_to_improve"
    },
    top_buying_trigger: {
      action: "구매 트리거가 나온 질문에 24시간 내 자료 follow-up 규칙 적용",
      due: "수요일",
      expectedOutcome: "구매 의도 리드의 검토 속도 상승",
      owner: "Sales Ops",
      sourceSignalType: "top_buying_trigger"
    },
    top_customer_objection: {
      action: "가격/순수익/회수기간/리스크 1페이지 반박 자료 제작",
      due: "내일",
      expectedOutcome: "가장 큰 상담 병목을 같은 자료로 반복 제거",
      owner: "Founder",
      sourceSignalType: "top_customer_objection"
    }
  };

  return signals.map((signalItem, index) => ({
    ...actionMap[signalItem.type],
    day: actionMap[signalItem.type].due,
    id: `weekly-action-${index + 1}`,
    purpose: actionMap[signalItem.type].expectedOutcome,
    priority: index + 1
  }));
}

function buildSummary(
  objections: InsightItem[],
  leads: LeadRescueOpportunity[],
  contentIdeas: ContentIdea[]
) {
  const topObjection = first(objections)?.title ?? "the main buying objection";
  const leadCount = leads.length;
  const contentTitle = first(contentIdeas)?.title ?? "one proof-led content asset";

  return `이번 주 핵심 매출 기회는 "${topObjection}"을 먼저 해소하고, ${leadCount}개의 warm lead를 맞춤 follow-up으로 회수하며, "${contentTitle}"를 발행해 반복 질문을 선제 처리하는 것입니다.`;
}

function parseLeadRows(salesNotesText: string, leadCsv: string): ParsedLead[] {
  const noteLeads = splitEvidence(salesNotesText).map(parseSalesNoteLine);
  const csvLeads = parseCsv(leadCsv).map(parseCsvLeadRow);
  const leadMap = new Map<string, ParsedLead>();

  for (const lead of [...noteLeads, ...csvLeads]) {
    const existing = leadMap.get(lead.leadName);

    if (!existing) {
      leadMap.set(lead.leadName, lead);
      continue;
    }

    leadMap.set(lead.leadName, {
      ...existing,
      context: unique([existing.context, lead.context]).join(" / "),
      daysSinceLastContact: existing.daysSinceLastContact ?? lead.daysSinceLastContact,
      expectedValue: existing.expectedValue !== "미확인" ? existing.expectedValue : lead.expectedValue,
      raw: unique([existing.raw, lead.raw]).join(" / "),
      tags: unique([...existing.tags, ...lead.tags])
    });
  }

  return Array.from(leadMap.values());
}

function parseSalesNoteLine(line: string): ParsedLead {
  const parts = line.split(/\s*\/\s*/).map((part) => part.trim());
  const leadName = parts[0] || "Unknown lead";
  const raw = line.trim();
  const daysSinceLastContact = extractDays(raw);
  const expectedValue = parts.find((part) => /예산|억|만원|budget/i.test(part)) ?? "미확인";
  const status =
    parts.find((part) => /미응답|대기|비교|상의|검토|lost|won|계약|성사|실패/i.test(part)) ??
    "active";

  return {
    context: parts.slice(1).join(" / ") || raw,
    daysSinceLastContact,
    expectedValue,
    leadName,
    raw,
    status,
    tags: classifyLeadTags(raw)
  };
}

function parseCsvLeadRow(row: Record<string, string>): ParsedLead {
  const raw = Object.values(row).filter(Boolean).join(" / ");
  const leadName = getField(row, ["name", "lead", "leadname", "customer", "고객", "이름"]) || "CSV lead";
  const daysValue = getField(row, [
    "days_since_last_contact",
    "days",
    "dayssince",
    "last_contact_days",
    "미응답일"
  ]);
  const expectedValue =
    getField(row, ["budget", "expected_value", "value", "예산", "금액"]) || "미확인";
  const status = getField(row, ["status", "상태", "stage", "단계"]) || "active";
  const context = [
    getField(row, ["interest", "관심", "brand", "브랜드"]),
    status,
    getField(row, ["objection", "반박", "concern"]),
    getField(row, ["lastmessage", "last_message", "last_note", "note", "memo", "메모"]),
    getField(row, ["notes", "비고"])
  ]
    .filter(Boolean)
    .join(" / ");

  return {
    context: context || raw,
    daysSinceLastContact: daysValue ? Number.parseInt(daysValue, 10) : extractDays(raw),
    expectedValue,
    leadName,
    raw,
    status,
    tags: classifyLeadTags(raw)
  };
}

function parseCsv(csvText: string) {
  const rows = csvText
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    return [];
  }

  const headers = parseCsvLine(rows[0]).map(normalizeHeader);

  return rows.slice(1).map((row) => {
    const values = parseCsvLine(row);
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index]?.trim() ?? "";
      return acc;
    }, {});
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"" && next === "\"") {
      current += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function getField(row: Record<string, string>, names: string[]) {
  return names
    .map((name) => row[normalizeHeader(name)])
    .find((value) => value && value.trim().length > 0);
}

function classifyLeadTags(text: string) {
  const tags: string[] = [];

  if (/가족|배우자|부모님|아이|상의|설득|Family\/Partner/i.test(text)) {
    tags.push("family_discussion");
  }
  if (/가격|비용|총비용|추가비용|예산|부담|실패 리스크|Price Concern/i.test(text)) {
    tags.push("price_pressure");
  }
  if (/비교|다른 호텔|다른 곳|브랜드|컴포즈|메가커피|배스킨라빈스|Comparing|Comparison Shopping/i.test(text)) {
    tags.push("brand_comparison");
  }
  if (/순수익|월순익|회수기간|월매출/.test(text)) tags.push("profit_clarity");
  if (/자료|근거|부족|명확|정보|안내|뷰|오션뷰|사진|실제|방음|주차|조식|수영장|Information Gap|Trust Barrier|Outcome Uncertainty/i.test(text)) {
    tags.push("proof_gap");
  }
  if (/풀오토|운영 부담|직장인|체크인|대기|Timing Delay/i.test(text)) {
    tags.push("operation_risk");
  }
  if (/미응답|대기|늦|No Response|Waiting|Needs Follow-up|Contacted/i.test(text)) {
    tags.push("delayed_response");
  }

  return unique(tags);
}

function scoreLead(lead: ParsedLead) {
  let score = 36;
  const reasons: string[] = [];

  if (lead.daysSinceLastContact && lead.daysSinceLastContact >= 3 && lead.daysSinceLastContact <= 14) {
    score += 18;
    reasons.push(`${lead.daysSinceLastContact}일째 멈춘 warm lead`);
  } else if (lead.daysSinceLastContact && lead.daysSinceLastContact > 14) {
    score -= lead.daysSinceLastContact > 30 ? 14 : 4;
    reasons.push(
      lead.daysSinceLastContact > 30
        ? "30일 이상 방치되어 회수 가능성 낮음"
        : "장기 미응답이지만 맥락이 남아 있음"
    );
  }

  const tagScores: Record<string, { score: number; reason: string }> = {
    brand_comparison: { reason: "브랜드 비교 중", score: 12 },
    delayed_response: { reason: "응답 지연 또는 대기 상태", score: 12 },
    family_discussion: { reason: "가족/배우자 상의 병목", score: 16 },
    operation_risk: { reason: "운영 부담 우려", score: 10 },
    price_pressure: { reason: "가격/예산/리스크 반박", score: 15 },
    profit_clarity: { reason: "순수익/회수기간 질문", score: 14 },
    proof_gap: { reason: "자료 또는 근거 요청", score: 13 }
  };

  for (const tag of lead.tags) {
    const match = tagScores[tag];

    if (match) {
      score += match.score;
      reasons.push(match.reason);
    }
  }

  if (/억/.test(lead.expectedValue)) {
    score += lead.daysSinceLastContact && lead.daysSinceLastContact > 30 ? 16 : 8;
    reasons.push("고액 예산 단서");
  }

  return {
    reasons: unique(reasons).slice(0, 4),
    score: clamp(score, 0, 96)
  };
}

function isClosedLead(lead: ParsedLead) {
  return /lost|won|계약\s*완료|수주|성사|종료|실패|이미\s*계약/i.test(
    `${lead.status} ${lead.raw}`
  );
}

function toneForScenario(scenario: FollowupScenario): FollowupMessage["tone"] {
  if (scenario === "slow_reply_recovery") return "urgent";
  if (scenario === "proof_gap" || scenario === "profit_clarity") return "trust-building";
  if (scenario === "price_pressure" || scenario === "brand_comparison") return "professional";
  return "soft";
}

function chooseLeadMessage(lead: ParsedLead) {
  if (/호텔|오션뷰|조식|주차|수영장|방음|객실|Hotel Booking/i.test(lead.raw)) {
    if (lead.tags.includes("family_discussion")) {
      return "가족 공유용으로 조식 혼잡도, 주차 동선, 방음, 수영장 이용 조건을 정리한 성수기 예약 체크리스트를 보내세요.";
    }

    if (lead.tags.includes("price_pressure")) {
      return "객실가, 조식, 수영장, 주차, 뷰 등급, 추가요금을 나눈 총비용 비교표로 다시 설명하세요.";
    }

    if (lead.tags.includes("brand_comparison")) {
      return "다른 호텔과 같은 기준으로 체크인 대기, 주차 안내, 방음, 실제 객실뷰, 조식 대기를 비교해 보내세요.";
    }

    if (lead.tags.includes("proof_gap")) {
      return "예약 전 확인할 객실뷰, 조식 혼잡 시간, 주차 위치, 방음 기준을 한 장으로 보내세요.";
    }
  }

  if (lead.tags.includes("family_discussion")) {
    return "가족 공유용 비용/순수익/리스크 1페이지 요약본을 보내고, 반대 질문을 먼저 받아보세요.";
  }

  if (lead.tags.includes("price_pressure")) {
    return "예산대별 가능한 선택지와 피해야 할 선택지를 분리한 표로 다시 접근하세요.";
  }

  if (lead.tags.includes("brand_comparison")) {
    return "브랜드 비교 기준표를 보내고 투자금, 운영 강도, 회수기간을 같은 기준으로 설명하세요.";
  }

  if (lead.tags.includes("profit_clarity")) {
    return "예상 순수익과 회수기간 계산표를 보내고 48시간 안에 해석 콜을 제안하세요.";
  }

  return "마지막 질문을 기준으로 짧은 자료와 다음 확인 일정을 함께 제안하세요.";
}

function findLeadForScenario(leads: LeadRescueOpportunity[], scenario: FollowupScenario) {
  return (
    leads.find((lead) => lead.tags.includes(scenario))?.leadName ??
    leads.find((lead) => {
      if (scenario === "profit_clarity") return lead.tags.includes("profit_clarity");
      if (scenario === "proof_gap") return lead.tags.includes("proof_gap");
      return false;
    })?.leadName ??
    "Relevant warm lead"
  );
}

function extractDays(text: string) {
  const match = text.match(/(\d+)\s*일(?:째|간)?|day[s]?\s*(\d+)/i);
  const value = match?.[1] ?? match?.[2];
  return value ? Number.parseInt(value, 10) : undefined;
}

function findEvidence(lines: string[], keywords: string[]) {
  const lowerKeywords = keywords.map((keyword) => keyword.toLowerCase());

  return unique(
    lines.filter((line) => {
      const lowerLine = line.toLowerCase();
      return lowerKeywords.some((keyword) => lowerLine.includes(keyword));
    })
  ).slice(0, 3);
}

function countKeywordHits(text: string, keywords: string[]) {
  const lowerText = text.toLowerCase();
  return keywords.reduce((total, keyword) => {
    const escaped = escapeRegExp(keyword.toLowerCase());
    const matches = lowerText.match(new RegExp(escaped, "g"));
    return total + (matches?.length ?? 0);
  }, 0);
}

function confidenceFromEvidence(evidenceCount: number, keywordHits: number) {
  return clamp(48 + evidenceCount * 10 + Math.min(keywordHits * 3, 24), 45, 92);
}

function toUrgency(score: number): UrgencyLevel {
  if (score >= 78) return "high";
  if (score >= 62) return "medium";
  return "low";
}

function signal(input: {
  id: string;
  type: RevenueSignalType;
  label: string;
  title: string;
  whyItMatters: string;
  evidenceSnippet: string;
  recommendedAction: string;
  confidenceScore: number;
  urgencyLevel: UrgencyLevel;
  impactLevel: ImpactLevel;
}): RevenueSignal {
  const confidence = clamp(Math.round(input.confidenceScore), 0, 100);
  const evidenceSnippet = input.evidenceSnippet || "No direct evidence yet.";

  return {
    ...input,
    confidence,
    confidenceScore: confidence,
    description: input.whyItMatters,
    evidence: [evidenceSnippet],
    evidenceItems: [
      {
        originalText: evidenceSnippet,
        sourceLanguage: detectLanguage(evidenceSnippet)
      }
    ],
    evidenceSnippet,
    impact: input.impactLevel,
    urgency: input.urgencyLevel
  };
}

function detectLanguage(text: string): SupportedLanguage {
  if (/[가-힣]/.test(text)) {
    return "ko";
  }

  return "en";
}

function first<T>(items: T[]) {
  return items[0];
}

function firstEvidence(items: InsightItem[]) {
  return items.flatMap((item) => item.evidence)[0] ?? "고객 텍스트에서 반복 질문과 불안이 감지되었습니다.";
}

function findEvidenceFromInsights(items: InsightItem[], idPart: string) {
  return items.find((item) => item.id.includes(idPart))?.evidence[0];
}

function safeFallbackEvidence(lines: string[]) {
  return lines[0] ?? "No direct evidence yet.";
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
