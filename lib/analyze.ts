import type {
  AnalysisMode,
  AnalysisReport,
  BusinessType,
  OutputLanguage,
  RiskCategory
} from "@/types/analysis";
import { hiddenSignals, type HiddenSignal } from "./hidden-signals";

type AnalyzeInput = {
  reviewText: string;
  mode: AnalysisMode;
  businessType: BusinessType;
  outputLanguage: OutputLanguage;
};

type SignalMatch = {
  phrase: string;
  signal: HiddenSignal;
};

const languageMatchers = [
  { code: "ko", pattern: /[ㄱ-ㅎㅏ-ㅣ가-힣]/ },
  { code: "ja", pattern: /[\u3040-\u30ff]/ },
  { code: "zh", pattern: /[\u4e00-\u9fff]/ },
  { code: "es", pattern: /no vale la pena|ni loco|trampa para turistas/i },
  { code: "fr", pattern: /à fuir|attrape-touristes|plus jamais|bof/i }
];

const categoryLabels: Record<OutputLanguage, Record<string, string>> = {
  ko: {
    cleanliness: "청결",
    expectation_gap: "기대 차이",
    native_only_warning: "언어권 내부 경고",
    obfuscation: "난독화",
    regret: "강한 후회",
    strong_warning: "강한 회피 경고",
    trust: "신뢰",
    value: "가격 대비 만족도"
  },
  en: {
    cleanliness: "cleanliness",
    expectation_gap: "expectation gap",
    native_only_warning: "native-only warning",
    obfuscation: "obfuscation",
    regret: "regret",
    strong_warning: "strong warning",
    trust: "trust",
    value: "price/value"
  }
};

const businessTypeLabels: Record<OutputLanguage, Record<BusinessType, string>> = {
  ko: {
    cafe: "카페",
    guesthouse: "게스트하우스",
    hotel: "호텔",
    other: "사업장",
    restaurant: "음식점"
  },
  en: {
    cafe: "cafe",
    guesthouse: "guesthouse",
    hotel: "hotel",
    other: "business",
    restaurant: "restaurant"
  }
};

export function analyzeReview({
  reviewText,
  mode,
  businessType,
  outputLanguage
}: AnalyzeInput): AnalysisReport {
  const text = reviewText.trim();
  const detectedLanguage = detectLanguage(text);
  const matches = collectSignalMatches(text);
  const evidencePhrases = unique(matches.map((match) => match.phrase));
  const obfuscationTypes = Array.from(
    new Set(matches.map((match) => match.signal.obfuscationType).filter(Boolean))
  ) as string[];

  const normalizedReview = normalizeReview(text, matches);
  const riskCategories = buildRiskCategories(matches, outputLanguage);
  const severityScore = Math.max(
    1,
    Math.min(5, Math.max(...matches.map((m) => m.signal.severityHint), 1))
  );
  const rawConfidenceScore = calculateConfidence(
    matches.length,
    text.length,
    obfuscationTypes.length
  );
  const confidenceScore = shouldUseCautiousSummary(matches)
    ? Math.min(rawConfidenceScore, 55)
    : rawConfidenceScore;
  const hiddenWarningSummary = buildHiddenWarningSummary(matches, outputLanguage);
  const nativeSpeakerMeaning = buildNativeMeaning(matches, businessType, outputLanguage);

  return {
    analysisSource: "local",
    detectedLanguage,
    obfuscationDetected: obfuscationTypes.length > 0,
    obfuscationType: obfuscationTypes,
    normalizedReview,
    naturalTranslation: buildNaturalTranslation(normalizedReview, detectedLanguage, outputLanguage),
    nativeSpeakerMeaning,
    hiddenWarningSummary,
    riskCategories,
    severityScore,
    confidenceScore,
    evidencePhrases,
    travelerAdvice: buildTravelerAdvice(matches, severityScore, mode, businessType, outputLanguage),
    businessOwnerActions: buildOwnerActions(riskCategories, businessType, outputLanguage),
    suggestedReplyDraft: buildReplyDraft(riskCategories, businessType, outputLanguage),
    limitations: [
      "AI-assisted interpretation can be imperfect.",
      "Use repeated patterns across multiple reviews before making major decisions.",
      "This MVP analyzes pasted text only and does not verify whether the review is genuine."
    ]
  };
}

function detectLanguage(text: string) {
  const matched = languageMatchers.find((matcher) => matcher.pattern.test(text));
  if (matched) {
    return matched.code;
  }
  return "en";
}

function collectSignalMatches(text: string): SignalMatch[] {
  return hiddenSignals.flatMap((signal) => {
    const flags = signal.pattern.flags.includes("g")
      ? signal.pattern.flags
      : `${signal.pattern.flags}g`;
    const globalPattern = new RegExp(signal.pattern.source, flags);
    const matches: SignalMatch[] = [];

    for (const match of text.matchAll(globalPattern)) {
      if (match[0]) {
        matches.push({ phrase: match[0], signal });
      }
    }

    return matches;
  });
}

const normalizationRules = [
  { pattern: /쨕쪙|작썽/g, replacement: "작성" },
  { pattern: /숙쏘|쑥소|숙소오/g, replacement: "숙소" },
  { pattern: /홋쓰트|호쓰트/g, replacement: "호스트" },
  { pattern: /깨꼬생/g, replacement: "개고생" },
  { pattern: /빠퀴/g, replacement: "바퀴" },
  { pattern: /뜨럽/g, replacement: "더럽" },
  { pattern: /쩔때|절때/g, replacement: "절대" },
  { pattern: /오찌마세요|오쥐마세요|오찌마/g, replacement: "오지 마세요" }
];

function normalizeReview(text: string, matches: SignalMatch[]) {
  let normalized = normalizationRules.reduce(
    (current, rule) => current.replace(rule.pattern, rule.replacement),
    text
  );
  const notes: string[] = [];

  for (const match of matches) {
    if (match.signal.normalized) {
      notes.push(`"${match.phrase}" -> ${match.signal.normalized}`);
    }
  }

  if (notes.length > 0) {
    normalized += `\n\n[normalization notes]\n${unique(notes)
      .map((note) => `- ${note}`)
      .join("\n")}`;
  }

  return normalized;
}

function buildRiskCategories(matches: SignalMatch[], outputLanguage: OutputLanguage): RiskCategory[] {
  const groups = new Map<string, RiskCategory>();

  for (const match of matches) {
    for (const category of match.signal.categories) {
      const existing = groups.get(category);
      if (existing) {
        existing.severity = Math.max(existing.severity, match.signal.severityHint);
        existing.evidence = unique([...existing.evidence, match.phrase]);
      } else {
        groups.set(category, {
          category: categoryLabels[outputLanguage][category] ?? category,
          severity: match.signal.severityHint,
          evidence: [match.phrase]
        });
      }
    }
  }

  if (groups.size === 0) {
    return [
      {
        category: "general review signal",
        severity: 2,
        evidence: []
      }
    ];
  }

  return Array.from(groups.values()).sort((a, b) => b.severity - a.severity);
}

function calculateConfidence(matchCount: number, textLength: number, obfuscationCount: number) {
  const base = matchCount > 0 ? 48 : 24;
  const matchBoost = Math.min(matchCount * 12, 36);
  const lengthBoost = textLength > 120 ? 8 : 0;
  const obfuscationBoost = obfuscationCount > 0 ? 10 : 0;
  return Math.min(92, base + matchBoost + lengthBoost + obfuscationBoost);
}

function hasStrongEvidence(matches: SignalMatch[]) {
  return matches.some((match) => match.signal.severityHint >= 5);
}

function shouldUseCautiousSummary(matches: SignalMatch[]) {
  return matches.length === 1 && !hasStrongEvidence(matches);
}

function buildHiddenWarningSummary(matches: SignalMatch[], outputLanguage: OutputLanguage) {
  if (matches.length === 0) {
    return outputLanguage === "ko"
      ? "뚜렷한 숨은 경고 표현은 아직 감지되지 않았습니다."
      : "No strong hidden warning pattern was detected yet.";
  }

  if (shouldUseCautiousSummary(matches)) {
    const match = matches[0];
    return outputLanguage === "ko"
      ? `주의 신호: "${match.phrase}"는 ${match.signal.meaning} 다만 단일 표현만으로 강한 경고를 단정하지 않습니다.`
      : `Caution signal: "${match.phrase}" may mean ${match.signal.meaning} Do not treat one phrase alone as a strong warning.`;
  }

  const meanings = matches
    .slice(0, 4)
    .map((match) => `"${match.phrase}": ${match.signal.meaning}`);
  return outputLanguage === "ko"
    ? `감지된 핵심 신호: ${meanings.join(" ")}`
    : `Detected signals: ${meanings.join(" ")}`;
}

function buildNativeMeaning(
  matches: SignalMatch[],
  businessType: BusinessType,
  outputLanguage: OutputLanguage
) {
  if (matches.length === 0) {
    return outputLanguage === "ko"
      ? "일반 리뷰 의미는 파악되지만, 원어민 전용 경고나 의도적 난독화 신호는 약합니다."
      : "The review is readable, but native-coded warning or intentional obfuscation signals are weak.";
  }

  const target = businessType === "hotel" || businessType === "guesthouse" ? "숙소" : "매장";
  return outputLanguage === "ko"
    ? `원어민 관점에서는 단순 불만보다 강한 경고에 가깝습니다. 특히 ${target} 선택 전에 가격, 위생, 신뢰, 기대 차이를 다시 확인하라는 뜻으로 해석될 수 있습니다.`
    : `To a native speaker, this can read as more than a simple complaint. It may warn others to re-check value, cleanliness, trust, and expectation gaps before choosing this ${businessType}.`;
}

function buildNaturalTranslation(
  normalizedReview: string,
  detectedLanguage: string,
  outputLanguage: OutputLanguage
) {
  if (detectedLanguage === outputLanguage) {
    return normalizedReview;
  }

  return outputLanguage === "ko"
    ? "초기 MVP는 전문 번역 대신 숨은 신호 해석을 우선 제공합니다. AI 번역은 다음 단계에서 연결합니다."
    : "This MVP prioritizes hidden-signal interpretation first. Full AI translation will be connected in the next phase.";
}

function buildTravelerAdvice(
  matches: SignalMatch[],
  severityScore: number,
  mode: AnalysisMode,
  businessType: BusinessType,
  outputLanguage: OutputLanguage
) {
  const place = businessType === "hotel" || businessType === "guesthouse" ? "booking" : "visit";
  if (severityScore >= 5) {
    return outputLanguage === "ko"
      ? "예약 또는 방문 전에 최근 낮은 평점 리뷰를 더 확인하세요. 위생, 가격 대비 만족도, 실제 사진과 설명의 차이가 반복되는지 보는 것이 좋습니다."
      : `Before you ${place}, check recent low-rated reviews. Look for repeated issues around cleanliness, value, and gaps between photos and reality.`;
  }

  if (matches.length > 0) {
    return outputLanguage === "ko"
      ? "주의할 신호가 일부 있습니다. 같은 표현이 여러 리뷰에서 반복되는지 확인하면 판단이 더 안전합니다."
      : "There are some caution signals. Check whether the same pattern appears across multiple reviews.";
  }

  return mode === "traveler"
    ? outputLanguage === "ko"
      ? "강한 숨은 경고는 보이지 않습니다. 다만 최신 리뷰와 낮은 평점 리뷰를 함께 확인하세요."
      : "No strong hidden warning was found. Still compare recent reviews and low-rated reviews."
    : outputLanguage === "ko"
      ? "현재 입력만으로는 강한 숨은 불만을 단정하기 어렵습니다."
      : "This input alone is not enough to confirm a strong hidden complaint.";
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function buildOwnerActions(
  riskCategories: RiskCategory[],
  businessType: BusinessType,
  outputLanguage: OutputLanguage
) {
  const businessLabel = businessTypeLabels[outputLanguage][businessType];
  const actions = riskCategories.slice(0, 4).map((risk) => {
    if (risk.category.includes("cleanliness") || risk.category.includes("청결")) {
      return outputLanguage === "ko"
        ? "청결 관련 사진, 체크리스트, 실제 객실/테이블 상태를 우선 점검하세요."
        : "Audit cleanliness photos, checklists, and the actual room/table condition first.";
    }
    if (
      risk.category.includes("value") ||
      risk.category.includes("expectation") ||
      risk.category.includes("가격") ||
      risk.category.includes("기대")
    ) {
      return outputLanguage === "ko"
        ? "가격, 포함 사항, 메뉴/객실 구성, 실제 사진을 더 투명하게 안내하세요."
        : "Make pricing, inclusions, menu/room details, and real photos more transparent.";
    }
    if (
      risk.category.includes("warning") ||
      risk.category.includes("trust") ||
      risk.category.includes("경고") ||
      risk.category.includes("신뢰")
    ) {
      return outputLanguage === "ko"
        ? "방어적으로 답하지 말고 문제 인정, 확인 중인 조치, 재발 방지 계획을 짧게 답하세요."
        : "Avoid defensive replies. Acknowledge the issue, mention what is being checked, and state a prevention step.";
    }
    return outputLanguage === "ko"
      ? `${businessLabel} 운영에서 이 표현이 반복되는 원인을 최근 리뷰와 함께 확인하세요.`
      : `Review why this signal repeats in your ${businessLabel} operations.`;
  });

  return Array.from(new Set(actions));
}

function buildReplyDraft(
  riskCategories: RiskCategory[],
  businessType: BusinessType,
  outputLanguage: OutputLanguage
) {
  const topRisk = riskCategories[0]?.category ?? "guest experience";

  if (outputLanguage === "ko") {
    return `소중한 의견을 남겨주셔서 감사합니다. 말씀해주신 ${topRisk} 관련 불편을 가볍게 보지 않고 있으며, 실제 이용 경험과 안내 내용 사이에 차이가 없도록 점검하겠습니다. 같은 문제가 반복되지 않도록 내부 체크리스트를 보완하겠습니다.`;
  }

  return `Thank you for sharing your experience. We are taking the ${topRisk} concern seriously and will review whether our actual guest experience matches what we communicate. We will update our internal checklist so the same issue is less likely to happen again.`;
}
