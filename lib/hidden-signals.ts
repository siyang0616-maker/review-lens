export type HiddenSignal = {
  language: string;
  pattern: RegExp;
  label: string;
  normalized?: string;
  meaning: string;
  categories: string[];
  severityHint: number;
  obfuscationType?: string;
};

export const hiddenSignals: HiddenSignal[] = [
  {
    language: "ko",
    pattern: /굳이|구지|구지이/i,
    label: "굳이",
    meaning: "완곡하지만 추천하지 않는다는 신호일 수 있습니다.",
    categories: ["value", "expectation_gap"],
    severityHint: 3
  },
  {
    language: "ko",
    pattern: /쩔때|절때|절대\s*오지|오찌마|오쥐마/i,
    label: "절대 오지 마세요",
    normalized: "절대 오지 마세요",
    meaning: "같은 언어권 여행자에게 보내는 강한 회피 경고입니다.",
    categories: ["strong_warning", "trust"],
    severityHint: 5,
    obfuscationType: "phonetic_misspelling"
  },
  {
    language: "ko",
    pattern: /쨕쪙|작썽|작성/i,
    label: "작성 발음 표기",
    normalized: "작성",
    meaning: "같은 언어권 사용자만 읽기 쉽게 일부러 맞춤법을 꼰 표현일 수 있습니다.",
    categories: ["obfuscation", "native_only_warning"],
    severityHint: 4,
    obfuscationType: "phonetic_misspelling"
  },
  {
    language: "ko",
    pattern: /숙쏘|쑥소|숙소오|홋쓰트|호쓰트/i,
    label: "숙소/호스트 발음 표기",
    normalized: "숙소 또는 호스트",
    meaning: "자동 번역을 피하려고 발음대로 쓴 표현일 수 있습니다.",
    categories: ["obfuscation"],
    severityHint: 4,
    obfuscationType: "phonetic_misspelling"
  },
  {
    language: "ko",
    pattern: /바퀴|빠퀴|벌레|곰팡|냄새|더럽|뜨럽/i,
    label: "위생 경고",
    meaning: "위생 관련 불만은 예약 전환에 직접적인 악영향을 줄 수 있습니다.",
    categories: ["cleanliness"],
    severityHint: 5
  },
  {
    language: "ko",
    pattern: /개고생|깨꼬생|고생길|돈\s*아깝|내\s*돈/i,
    label: "강한 후회 표현",
    meaning: "방문 또는 예약을 후회한다는 강한 부정 신호입니다.",
    categories: ["regret", "value"],
    severityHint: 5,
    obfuscationType: "slang"
  },
  {
    language: "ko",
    pattern: /한국인만|한국분들만|우리나라\s*사람|같은\s*나라/i,
    label: "언어권 내부 경고",
    meaning: "같은 언어권 사용자에게만 경고하려는 의도가 있을 수 있습니다.",
    categories: ["native_only_warning"],
    severityHint: 5,
    obfuscationType: "native_only_warning"
  },
  {
    language: "ja",
    pattern: /微妙|次はない|おすすめしません|写真詐欺|清潔感に欠ける/i,
    label: "일본어 완곡 부정",
    meaning: "정중하거나 완곡하지만 재방문 의사가 낮다는 신호일 수 있습니다.",
    categories: ["expectation_gap", "cleanliness"],
    severityHint: 4
  },
  {
    language: "zh",
    pattern: /避雷|踩雷|别来|坑|照骗|不值/i,
    label: "중국어 회피 경고",
    meaning: "다른 여행자에게 피하라고 알리는 강한 경고 표현입니다.",
    categories: ["strong_warning", "value", "expectation_gap"],
    severityHint: 5
  },
  {
    language: "en",
    pattern: /tourist trap|not worth it|never again|sketchy|overpriced/i,
    label: "영어 강한 비추천",
    meaning: "가격 대비 가치나 신뢰 문제를 암시하는 강한 부정 표현입니다.",
    categories: ["value", "trust"],
    severityHint: 4
  },
  {
    language: "es",
    pattern: /no vale la pena|ni loco vuelvo|trampa para turistas/i,
    label: "스페인어 비추천",
    meaning: "재방문 의사가 없거나 관광객 함정으로 본다는 신호입니다.",
    categories: ["value", "trust"],
    severityHint: 4
  },
  {
    language: "fr",
    pattern: /à fuir|attrape-touristes|plus jamais|bof/i,
    label: "프랑스어 비추천",
    meaning: "피하라는 경고 또는 낮은 만족도를 나타냅니다.",
    categories: ["strong_warning", "value"],
    severityHint: 4
  }
];
