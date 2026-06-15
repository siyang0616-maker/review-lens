import type { AnalyzeRequest } from "../lib/analysis-schema";

export const reviewFixtures: AnalyzeRequest[] = [
  {
    reviewText:
      "한국분들만 알아보게 쨕쪙하겠습니다. 이 숙쏘는 위치만 보고 예약하면 깨꼬생합니다. 빠퀴벌레 봤고 화장실도 뜨럽고 쩔때 오찌마세요.",
    mode: "traveler",
    businessType: "hotel",
    outputLanguage: "ko"
  },
  {
    reviewText:
      "次はないかなと思いました。写真はきれいでしたが、部屋の清潔感に欠ける感じで、夜も少しうるさかったです。",
    mode: "traveler",
    businessType: "guesthouse",
    outputLanguage: "ko"
  },
  {
    reviewText: "避雷，别来。照片很好看但实际房间很旧，卫生间味道很重，不值这个价格。",
    mode: "traveler",
    businessType: "hotel",
    outputLanguage: "en"
  },
  {
    reviewText:
      "It looked cute online, but it felt like a tourist trap. Overpriced food, sticky tables, and I would not go again.",
    mode: "business",
    businessType: "restaurant",
    outputLanguage: "en"
  },
  {
    reviewText:
      "The room was clean, check-in was smooth, and the staff helped us find a taxi. Breakfast was simple but fine.",
    mode: "traveler",
    businessType: "hotel",
    outputLanguage: "en"
  }
];
