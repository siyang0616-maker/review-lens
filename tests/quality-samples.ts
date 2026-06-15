import type { AnalyzeRequest } from "../lib/analysis-schema";

export type QualityExpectation = {
  id: string;
  group: "ko_coded" | "ja_subtle" | "zh_warning" | "en_trap" | "neutral";
  input: AnalyzeRequest;
  expectedLanguage: string;
  expectedMinSeverity: number;
  expectedMaxSeverity?: number;
  expectedObfuscation?: boolean;
  expectedEvidence?: string[];
};

export const qualitySamples: QualityExpectation[] = [
  {
    id: "ko-01",
    group: "ko_coded",
    input: {
      reviewText:
        "한국분들만 알아보게 쨕쪙합니다. 숙쏘는 사진이랑 다르고 빠퀴 봤어요. 쩔때 오찌마세요.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedObfuscation: true,
    expectedEvidence: ["한국분들만", "쨕쪙", "빠퀴"]
  },
  {
    id: "ko-02",
    group: "ko_coded",
    input: {
      reviewText:
        "굳이 여기까지 갈 필요는 없어요. 가격에 비해 방이 낡고 냄새가 좀 났습니다.",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedEvidence: ["굳이", "냄새"]
  },
  {
    id: "ko-03",
    group: "ko_coded",
    input: {
      reviewText: "숙쏘 위치는 좋은데 화장실이 뜨럽고 곰팡이가 보여서 다시는 안 갈 것 같아요.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedObfuscation: true,
    expectedEvidence: ["숙쏘", "뜨럽"]
  },
  {
    id: "ko-04",
    group: "ko_coded",
    input: {
      reviewText: "우리나라 사람들은 현지 리뷰 잘 보고 가세요. 사진만 믿으면 개고생합니다.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedObfuscation: true,
    expectedEvidence: ["우리나라 사람", "개고생"]
  },
  {
    id: "ko-05",
    group: "ko_coded",
    input: {
      reviewText: "절때 오지 마세요. 엘리베이터 없고 방에서 벌레 나왔습니다.",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedObfuscation: true,
    expectedEvidence: ["절때", "벌레"]
  },
  {
    id: "ko-06",
    group: "ko_coded",
    input: {
      reviewText: "구지 추천하진 않아요. 위치는 괜찮지만 가격 대비 방음과 청결이 아쉽습니다.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 3,
    expectedEvidence: ["구지"]
  },
  {
    id: "ko-07",
    group: "ko_coded",
    input: {
      reviewText: "한국인만 보세요. 밤에 소음 심하고 냉장고도 없어서 돈 아깝다는 생각이 들었습니다.",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedObfuscation: true,
    expectedEvidence: ["한국인만", "돈 아깝"]
  },
  {
    id: "ko-08",
    group: "ko_coded",
    input: {
      reviewText: "방은 작고 더럽다는 느낌이 있었고 냄새가 빠지지 않았습니다.",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedEvidence: ["더럽", "냄새"]
  },
  {
    id: "ko-09",
    group: "ko_coded",
    input: {
      reviewText: "같은 나라 사람들한테만 말하면, 사진 보고 기대하면 실망할 수 있습니다. 굳이요.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedObfuscation: true,
    expectedEvidence: ["같은 나라", "굳이"]
  },
  {
    id: "ko-10",
    group: "ko_coded",
    input: {
      reviewText: "홋쓰트 응대는 괜찮았지만 방 상태가 낡고 바퀴가 나와서 추천 어렵습니다.",
      mode: "business",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 5,
    expectedObfuscation: true,
    expectedEvidence: ["홋쓰트", "바퀴"]
  },
  {
    id: "ja-01",
    group: "ja_subtle",
    input: {
      reviewText: "次はないかなと思いました。清潔感に欠ける部屋で、写真より古く感じました。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["次はない"]
  },
  {
    id: "ja-02",
    group: "ja_subtle",
    input: {
      reviewText: "微妙でした。スタッフは親切ですが、部屋の音が気になってよく眠れませんでした。",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["微妙"]
  },
  {
    id: "ja-03",
    group: "ja_subtle",
    input: {
      reviewText: "写真詐欺とまでは言いませんが、実際の部屋はかなり違いました。",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["写真詐欺"]
  },
  {
    id: "ja-04",
    group: "ja_subtle",
    input: {
      reviewText: "おすすめしません。駅から近いですが、浴室のにおいが気になりました。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["おすすめしません"]
  },
  {
    id: "ja-05",
    group: "ja_subtle",
    input: {
      reviewText: "清潔感に欠ける印象でした。朝食は普通ですが、部屋の床が少し汚れていました。",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["清潔感に欠ける"]
  },
  {
    id: "ja-06",
    group: "ja_subtle",
    input: {
      reviewText: "次はないかな。チェックインの説明が少なく、夜の騒音も少し残念でした。",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["次はない"]
  },
  {
    id: "ja-07",
    group: "ja_subtle",
    input: {
      reviewText: "微妙。立地は便利ですが、この価格なら他を探すと思います。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["微妙"]
  },
  {
    id: "ja-08",
    group: "ja_subtle",
    input: {
      reviewText: "写真詐欺っぽいです。ロビーはきれいですが部屋はかなり古いです。",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["写真詐欺"]
  },
  {
    id: "ja-09",
    group: "ja_subtle",
    input: {
      reviewText: "おすすめしません。スタッフ対応よりも、部屋の清潔感が気になりました。",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["おすすめしません"]
  },
  {
    id: "ja-10",
    group: "ja_subtle",
    input: {
      reviewText: "清潔感に欠けるし、写真より狭く感じました。次は別のホテルにします。",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 4,
    expectedEvidence: ["清潔感に欠ける"]
  },
  {
    id: "zh-01",
    group: "zh_warning",
    input: {
      reviewText: "避雷，别来。照片很好看但实际房间很旧，卫生间味道很重。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["避雷"]
  },
  {
    id: "zh-02",
    group: "zh_warning",
    input: {
      reviewText: "踩雷了，位置不错但房间和照片差太多，不值这个价格。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["踩雷"]
  },
  {
    id: "zh-03",
    group: "zh_warning",
    input: {
      reviewText: "照骗，网上看起来很新，到了以后发现设施很旧。",
      mode: "business",
      businessType: "guesthouse",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["照骗"]
  },
  {
    id: "zh-04",
    group: "zh_warning",
    input: {
      reviewText: "别来，卫生间有味道，晚上很吵，服务也一般。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["别来"]
  },
  {
    id: "zh-05",
    group: "zh_warning",
    input: {
      reviewText: "这个地方有点坑，房间小，价格不便宜，体验不值。",
      mode: "business",
      businessType: "guesthouse",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["坑"]
  },
  {
    id: "zh-06",
    group: "zh_warning",
    input: {
      reviewText: "不值这个价格，照片比实际好太多，入住后很失望。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["不值"]
  },
  {
    id: "zh-07",
    group: "zh_warning",
    input: {
      reviewText: "避雷。前台态度还可以，但房间味道和清洁问题很明显。",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["避雷"]
  },
  {
    id: "zh-08",
    group: "zh_warning",
    input: {
      reviewText: "踩雷，早餐一般，电梯很慢，房间隔音差。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["踩雷"]
  },
  {
    id: "zh-09",
    group: "zh_warning",
    input: {
      reviewText: "照骗太严重了，公共区域不错但房间完全不是同一个感觉。",
      mode: "business",
      businessType: "guesthouse",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["照骗"]
  },
  {
    id: "zh-10",
    group: "zh_warning",
    input: {
      reviewText: "别来，位置方便也救不了房间的潮湿和味道。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 5,
    expectedEvidence: ["别来"]
  },
  {
    id: "en-01",
    group: "en_trap",
    input: {
      reviewText: "It felt like a tourist trap. The menu looked nice but everything was overpriced.",
      mode: "traveler",
      businessType: "restaurant",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["tourist trap"]
  },
  {
    id: "en-02",
    group: "en_trap",
    input: {
      reviewText: "Not worth it. The room was tiny and the photos made it look much better than it was.",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Not worth it"]
  },
  {
    id: "en-03",
    group: "en_trap",
    input: {
      reviewText: "Never again. The bathroom smelled bad and the hallway felt sketchy at night.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Never again"]
  },
  {
    id: "en-04",
    group: "en_trap",
    input: {
      reviewText: "The place was sketchy and overpriced. Staff were nice but I would not recommend it.",
      mode: "business",
      businessType: "guesthouse",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["sketchy"]
  },
  {
    id: "en-05",
    group: "en_trap",
    input: {
      reviewText: "Overpriced for what you get. Breakfast was basic and the room was noisy.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Overpriced"]
  },
  {
    id: "en-06",
    group: "en_trap",
    input: {
      reviewText: "Tourist trap vibes. Good location, but the food quality did not match the price.",
      mode: "business",
      businessType: "restaurant",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Tourist trap"]
  },
  {
    id: "en-07",
    group: "en_trap",
    input: {
      reviewText: "Not worth it at all. The photos hide how old the rooms are.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Not worth it"]
  },
  {
    id: "en-08",
    group: "en_trap",
    input: {
      reviewText: "Never again, the table was sticky and the service was slow even though it was empty.",
      mode: "business",
      businessType: "restaurant",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Never again"]
  },
  {
    id: "en-09",
    group: "en_trap",
    input: {
      reviewText: "Sketchy entrance, noisy room, and no clear instructions after check-in.",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Sketchy"]
  },
  {
    id: "en-10",
    group: "en_trap",
    input: {
      reviewText: "Overpriced and not worth it. You can find a cleaner room nearby.",
      mode: "business",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 4,
    expectedEvidence: ["Overpriced", "not worth it"]
  },
  {
    id: "neutral-01",
    group: "neutral",
    input: {
      reviewText: "The room was clean, check-in was smooth, and the staff helped us find a taxi.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-02",
    group: "neutral",
    input: {
      reviewText: "조식은 간단했지만 괜찮았고 직원이 친절했습니다. 위치도 편리했습니다.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-03",
    group: "neutral",
    input: {
      reviewText: "駅から近く、スタッフも親切でした。部屋は小さいですが清潔でした。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-04",
    group: "neutral",
    input: {
      reviewText: "房间干净，前台很友好，位置方便。早餐选择不多但可以接受。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-05",
    group: "neutral",
    input: {
      reviewText: "Coffee was good, staff were friendly, and there were enough seats in the morning.",
      mode: "business",
      businessType: "cafe",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-06",
    group: "neutral",
    input: {
      reviewText: "방이 넓지는 않았지만 깨끗했고 체크인이 빠르게 진행됐습니다.",
      mode: "traveler",
      businessType: "guesthouse",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-07",
    group: "neutral",
    input: {
      reviewText: "The restaurant was busy, but the food came out warm and the staff checked on us.",
      mode: "business",
      businessType: "restaurant",
      outputLanguage: "en"
    },
    expectedLanguage: "en",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-08",
    group: "neutral",
    input: {
      reviewText: "立地が便利で、部屋も静かでした。また機会があれば利用したいです。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ja",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-09",
    group: "neutral",
    input: {
      reviewText: "位置很好，房间也比较安静。工作人员帮我们叫车，非常感谢。",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "en"
    },
    expectedLanguage: "zh",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  },
  {
    id: "neutral-10",
    group: "neutral",
    input: {
      reviewText: "가격은 보통이고 위치가 좋았습니다. 다음에도 근처에 오면 고려할 것 같아요.",
      mode: "traveler",
      businessType: "hotel",
      outputLanguage: "ko"
    },
    expectedLanguage: "ko",
    expectedMinSeverity: 1,
    expectedMaxSeverity: 1,
    expectedObfuscation: false
  }
];
