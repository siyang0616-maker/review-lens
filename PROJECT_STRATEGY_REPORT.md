# Review Lens 프로젝트 구상안

작성일: 2026-06-12

## 1. 결론

이번 주 바로 착수할 1순위 프로젝트는 **Review Lens**다.

한 줄 정의:

> 번역기가 놓치는 해외 호텔/음식점 리뷰의 진짜 뜻, 숨은 경고, 은어, 발음 기반 오탈자, 문화적 뉘앙스를 AI가 복원하고 해석해주는 리뷰 렌즈.

기존 `ReviewOps Lite`는 음식점/호텔 사장님용 운영 개선 도구로 좋지만, 시장에는 이미 리뷰 관리, 평판 관리, 답글 자동화, 감성 분석 도구가 많다. 반면 `Review Lens`의 핵심 기능인 **Native-Coded Review Decoder / Hidden Warning Detector**는 더 선명하다.

초기 포지션은 B2C로 열고, 수익은 B2B로 확장한다.

- B2C 유입: 해외 숙소/맛집 리뷰 숨은 뜻 해석기
- B2B 수익: 호텔/음식점 사업자용 외국어 리뷰 리스크 리포트
- 장기 자산: 언어별 숨은 표현 사전과 해석 룰셋

## 2. 왜 이 아이디어가 더 좋은가

### 기존 리뷰 분석기의 약점

일반 리뷰 분석기는 보통 다음 기능에 머문다.

- 긍정/부정 감성 분석
- 키워드 추출
- 리뷰 답글 초안
- 별점 추이
- 대시보드
- 경쟁점 비교

이 기능들은 유용하지만 이미 경쟁자가 많고, 작은 사업자가 당장 돈을 낼 만큼 차별점이 약할 수 있다.

### Review Lens의 차별점

Review Lens는 단순 번역이나 요약이 아니라, 다음 문제를 푼다.

- 같은 언어권 사람끼리만 알아듣는 경고 표현
- 자동 번역기가 놓치는 비꼼, 완곡한 비추천, 은어
- 일부러 맞춤법을 꼬거나 발음대로 쓴 번역 회피형 리뷰
- 여행자 입장에서 실제로 피해야 할 리스크
- 사업자 입장에서 특정 언어권 고객이 이탈하는 이유

예:

| 원문 표현 | 표면 번역 | 실제 해석 |
|---|---|---|
| 한국분들은 굳이 안 가셔도 될 듯 | Koreans do not need to go | 강한 비추천, 기대 대비 만족도 낮음 |
| 쩔때 오찌마세요 | Do not come | 발음 기반 오탈자로 숨긴 강한 경고 |
| 微妙 | subtle / ambiguous | 완곡하지만 부정적인 평가일 가능성 |
| 避雷 | avoid landmine | 강한 회피 경고 |
| tourist trap | tourist trap | 가격 대비 가치 낮음, 현지인/경험자 비추천 |

## 3. 사업 가능성 평가

### 시장성

관광, 숙박, 음식점 시장에서는 리뷰가 곧 구매 결정 데이터다. 사용자는 예약/방문 전에 Google 리뷰, Booking, Agoda, TripAdvisor, Yelp 등의 리뷰를 보고 판단한다. 사업자는 리뷰를 읽지만, 외국어 리뷰의 뉘앙스까지 파악하기 어렵다.

Review Lens는 두 고객군을 동시에 건드릴 수 있다.

| 고객군 | 니즈 | 지불 가능성 |
|---|---|---|
| 여행자 | 예약 전 위험한 숙소/식당을 피하고 싶음 | 낮지만 대량 유입 가능 |
| 호텔/게스트하우스 | 외국인 고객이 왜 불만인지 알고 싶음 | 중간~높음 |
| 관광지 음식점/카페 | 특정 언어권 리뷰의 부정 신호를 알고 싶음 | 중간 |
| 리뷰/마케팅 대행사 | 고객 매장의 리뷰 리포트를 빠르게 만들고 싶음 | 높음 |

### 경쟁 상황

일반 리뷰 관리 시장은 경쟁이 강하다. ReviewTrackers, Birdeye, TrustYou, Revinate 같은 도구가 이미 리뷰 모니터링, 답글, 평판 분석, 호텔/레스토랑 인사이트를 제공한다.

따라서 정면승부하면 불리하다. 하지만 **숨은 경고 해석, 발음 기반 오탈자 복원, 문화권별 뉘앙스 해석**으로 좁히면 기존 도구와 다른 진입점이 생긴다.

### 규제/플랫폼 리스크

초기에는 절대 Google 리뷰를 무단 대량 수집하지 않는다.

MVP 원칙:

- 사용자가 직접 리뷰를 붙여넣는다.
- 저장하지 않는다.
- 자동 답글 게시를 하지 않는다.
- 리뷰 조작, 리뷰 생성, 인센티브 문구를 만들지 않는다.
- "좋은 리뷰를 늘려준다"가 아니라 "실제 고객 경험을 개선한다"로 포지셔닝한다.

Google Business Profile API는 검증된 사업장 리뷰 목록 조회와 답글 작성이 가능하지만 OAuth와 검증 절차가 필요하다. Places API의 공개 리뷰 데이터는 제한적이므로 경쟁점 대량 분석은 MVP에서 제외한다.

## 4. 추천 제품 후보 비교

| 후보 | 설명 | 장점 | 약점 | 이번 주 착수 적합도 |
|---|---|---|---|---|
| Review Lens | 숨은 리뷰 의미 해석기 | 차별점 강함, B2C 바이럴 가능, B2B 확장 가능 | 해석 품질 검수 필요 | 매우 높음 |
| ReviewOps Lite | 리뷰를 운영 개선 체크리스트로 변환 | B2B 가치 명확, 기존 1차 MVP와 연결 쉬움 | 경쟁 많음, 메시지 흔해질 수 있음 | 높음 |
| Guest Complaint Radar | 1~3점 리뷰만 분석 | 가치 제안 선명, 작은 MVP 쉬움 | 부정 리뷰 수가 적은 곳은 가치 제한 | 중간 |
| Menu Review Doctor | 메뉴별 리뷰 분석 | 음식점 특화 마케팅 쉬움 | 호텔/여행자 확장 약함 | 중간 |
| Hotel Review Doctor | 부서별 호텔 개선 리포트 | 객단가 높음 | 초기 고객 확보 어렵고 도메인 지식 필요 | 중간 |
| Competitor Review Gap Finder | 경쟁점 리뷰 비교 | 매력적 | 데이터 수집 제약 큼 | 낮음 |

최종 우선순위:

1. Review Lens
2. ReviewOps Lite
3. Guest Complaint Radar
4. Hotel Review Doctor 또는 Menu Review Doctor
5. Competitor Review Gap Finder

## 5. MVP 범위

이번 주 MVP는 로그인, 결제, DB, Google OAuth, 크롤링 없이 간다.

### 첫 화면

- 제품명: Review Lens
- 입력: 리뷰 텍스트 붙여넣기
- 모드 선택:
  - Traveler mode
  - Business owner mode
- 업종 선택:
  - Hotel
  - Restaurant
  - Cafe
  - Guesthouse
  - Other
- 결과 언어:
  - Korean
  - English
- 분석 버튼

### 결과 섹션

1. Detected language
2. Obfuscation detected: yes/no
3. Normalized review
4. Natural translation
5. Native-speaker meaning
6. Hidden warning summary
7. Risk categories
8. Severity score from 1 to 5
9. Confidence score from 0 to 100
10. Evidence phrases from original review
11. Traveler advice
12. Business owner action items
13. Suggested reply draft
14. Markdown export

## 6. 에이전트 구성안

초기 구현은 실제 멀티 에이전트 런타임보다, 하나의 API 안에서 단계별 JSON 파이프라인으로 시작한다. 제품과 코드 구조는 에이전트별 책임으로 나눈다.

| 에이전트 | 역할 | 입력 | 출력 |
|---|---|---|---|
| Language Detection Agent | 리뷰 언어와 혼합 언어 감지 | 원문 리뷰 | 언어, 확신도 |
| Obfuscation Detection Agent | 의도적 오탈자/발음 표기/번역 회피 감지 | 원문 리뷰 | 감지 여부, 근거 표현 |
| Phonetic Normalizer Agent | 발음 기반 오탈자를 정상 문장으로 복원 | 원문 리뷰 | 정상화 문장, 복원 근거 |
| Slang & Idiom Agent | 은어, 비속어, 완곡 표현 해석 | 원문/정상화 문장 | 표현별 의미 |
| Cultural Context Agent | 원어민이 실제로 받아들이는 뉘앙스 해석 | 원문/번역/표현 | 실제 의미, 주의점 |
| Risk Classifier Agent | 위생, 소음, 가격, 서비스 등 위험 분류 | 해석 결과 | 카테고리, 심각도 |
| Traveler Advice Agent | 여행자용 조언 생성 | 위험 분류 | 예약/방문 전 조언 |
| Business Action Agent | 사업자용 개선 액션 생성 | 위험 분류 | 개선 체크리스트 |
| Reply Draft Agent | 정책을 지키는 답글 초안 생성 | 원문/이슈 | 답글 초안 |
| Verifier Agent | 과도한 해석, 편견, 근거 부족 점검 | 전체 결과 | confidence, limitations |

## 7. 데이터 자산 전략

장기 경쟁력은 UI가 아니라 **언어별 Hidden Signal Dictionary**다.

초기에는 코드/JSON 파일로 시작한다.

예상 구조:

```json
{
  "ko": [
    {
      "pattern": "굳이",
      "type": "soft_negative",
      "meaning": "완곡하지만 비추천 또는 낮은 만족도 신호",
      "riskCategories": ["value", "expectation_gap"],
      "severityHint": 3
    },
    {
      "pattern": "쩔때|절때|오찌마세요",
      "type": "phonetic_obfuscation",
      "meaning": "절대 오지 말라는 강한 회피 경고",
      "riskCategories": ["strong_warning"],
      "severityHint": 5
    }
  ]
}
```

확장 순서:

1. 한국어
2. 일본어
3. 중국어 간체/번체
4. 영어
5. 스페인어
6. 프랑스어

## 8. 수익 모델

### B2C

| 상품 | 가격 |
|---|---:|
| 무료 해석 | 하루 3회 |
| 여행 1회 패스 | $2.99~$4.99 |
| 호텔/식당 3곳 비교 | $4.99~$9.99 |
| 월 구독 | $4.99~$9.99 |

### B2B

| 상품 | 가격 |
|---|---:|
| 1회 리뷰 리포트 | $9~$19 |
| 월간 리뷰 리스크 리포트 | $19~$49/month |
| 호텔/다점포 리포트 | $99/month~ |
| 상세 컨설팅 리포트 | $49~$199 |

추천 흐름:

1. 무료 B2C 도구로 유입
2. 결과 하단에 사업자용 CTA 노출
3. "외국어 리뷰 속 숨은 불만 리포트"로 B2B 전환

## 9. 이번 주 실행 계획

### Day 1: 제품 골격

- Next.js 앱 생성 또는 현재 폴더에 초기 구조 구성
- 첫 화면 UI 제작
- 입력 폼, 모드 선택, 업종 선택
- 결과 JSON 타입 정의
- Markdown export 버튼

### Day 2: AI 분석 API

- `/api/analyze` 구현
- JSON-only 프롬프트 작성
- Zod 스키마 검증
- hallucination 방지 규칙 추가
- 샘플 리뷰 10개로 테스트

### Day 3: Hidden Signal Dictionary

- 한국어 표현 사전 30~50개 구축
- 발음 기반 오탈자 샘플 추가
- 은어/완곡 표현 분류
- 프롬프트에 사전 컨텍스트 삽입

### Day 4: 결과 품질 개선

- Traveler mode와 Business owner mode 결과 분리
- confidence/limitations 강화
- 근거 표현 하이라이트
- 복사 버튼 추가

### Day 5: 샘플 리포트/랜딩

- 한국어 해외 숙소 리뷰 예시 5개
- 일본어/중국어/영어 예시 각 2개
- 공유 가능한 결과 화면 구성
- 무료 도구용 랜딩 문구 작성

### Weekend: 검증

- 지인/커뮤니티/여행 카페에 샘플 테스트
- "이 해석이 실제로 도움이 되는가?" 피드백 수집
- B2B 리포트 샘플 3개 제작

## 10. 개발 우선순위

1. `types/analysis.ts`
2. `lib/hidden-signals.ts`
3. `lib/prompts/review-lens.ts`
4. `app/page.tsx`
5. `app/api/analyze/route.ts`
6. `components/analysis-form.tsx`
7. `components/analysis-result.tsx`
8. `lib/export-markdown.ts`
9. `tests/analyze-schema.test.ts`

## 11. AI 출력 JSON 초안

```json
{
  "detectedLanguage": "ko",
  "obfuscationDetected": true,
  "obfuscationType": ["phonetic_misspelling", "native_only_warning"],
  "normalizedReview": "...",
  "naturalTranslation": "...",
  "nativeSpeakerMeaning": "...",
  "hiddenWarningSummary": "...",
  "riskCategories": [
    {
      "category": "cleanliness",
      "severity": 5,
      "evidence": ["..."]
    }
  ],
  "severityScore": 5,
  "confidenceScore": 82,
  "evidencePhrases": ["..."],
  "travelerAdvice": "...",
  "businessOwnerActions": ["..."],
  "suggestedReplyDraft": "...",
  "limitations": ["AI interpretation may be imperfect.", "Use multiple reviews before making business decisions."]
}
```

## 12. 리스크와 대응

| 리스크 | 대응 |
|---|---|
| 과도한 해석 | confidence와 limitations를 항상 표시 |
| 국가/민족 편견처럼 보임 | "국가"가 아니라 "언어권 리뷰 표현 패턴"으로 표현 |
| Google 정책 위반 | 리뷰 조작/인센티브/자동 게시 기능 금지 |
| 데이터 수집 문제 | MVP는 붙여넣기 전용 |
| 해석 품질 부족 | 한국어부터 시작해 직접 검수 |
| 경쟁사가 따라옴 | Hidden Signal Dictionary를 지속 축적 |

## 13. 최종 판단

바로 착수한다면 `Review Lens`가 가장 좋다.

`ReviewOps Lite`는 B2B 운영 개선 도구로 훌륭하지만, 첫 주에 시장 반응을 빠르게 보기에는 메시지가 약간 넓다. `Review Lens`는 첫 화면에서 바로 호기심과 효용이 발생한다.

첫 카피:

> 번역기가 놓치는 해외 리뷰의 진짜 뜻을 해석해드립니다.

영문 카피:

> Understand what native reviewers really mean, not just what they wrote.

이번 주 목표:

- 금요일까지 붙여넣기형 MVP 완성
- 주말까지 샘플 10개로 결과 품질 검증
- 다음 주부터 B2C 무료 도구 배포와 B2B 샘플 리포트 영업 시작

