# Review-to-Revenue AI Quality Review

작성일: 2026-06-15

## 왜 이 파일이 필요한가

Review-to-Revenue AI의 핵심 리스크는 "그럴듯하지만 근거가 약한 해석"이다. 사용자가 신뢰하려면 결과가 항상 아래 원칙을 지켜야 한다.

## 품질 원칙

1. Evidence phrases는 반드시 입력 리뷰 원문에서 온 짧은 표현이어야 한다.
2. 단순 긍정/중립 리뷰에 숨은 경고를 억지로 만들지 않는다.
3. 단일 리뷰는 참고 신호로 다루고, 반복 패턴이 있을 때만 강하게 말한다.
4. 국가/민족 일반화가 아니라 언어권 표현 패턴으로 설명한다.
5. 사업자 액션은 방어적 답글보다 실제 운영 개선을 먼저 제안한다.

## 현재 반영된 개선

- `evidencePhrases`를 라벨이 아니라 실제 원문 매칭 표현으로 변경
- risk category evidence도 실제 원문 표현으로 변경
- 한국어 난독화 정상화 강화
  - `쨕쪙` -> `작성`
  - `숙쏘` -> `숙소`
  - `깨꼬생` -> `개고생`
  - `빠퀴` -> `바퀴`
  - `뜨럽` -> `더럽`
  - `쩔때 오찌마세요` -> `절대 오지 마세요`
- 중립/긍정 리뷰에서 과해석하지 않는 테스트 추가
- 50개 품질 샘플뱅크 추가
  - 한국어 난독화 10개
  - 일본어 완곡 부정 10개
  - 중국어 회피 경고 10개
  - 영어 관광객 함정/가격 불만 10개
  - 긍정/중립 리뷰 10개
- `npm run test:quality` 품질 게이트 추가
- 로컬 analyzer 기준 품질 게이트 통과
- `npm run test:quality`: 51 passed
- `npm run check`: 58 passed
- 결과 화면에 품질 피드백 버튼 추가
  - 맞음
  - 과해석
  - 신호 놓침
  - 액션 약함
  - 현재는 브라우저 localStorage에만 저장
- `/feedback` 페이지 추가
  - 로컬 피드백 건수 집계
  - 저장된 리뷰/판정/근거 표현 확인
  - CSV/JSON export
  - 배포 전 임시 검증용이며 서버 저장은 아직 없음
- evidence provenance gate 추가
  - 모든 `evidencePhrases`는 원문 리뷰에 포함되어야 함
  - 모든 `riskCategories[].evidence`도 원문 리뷰에 포함되어야 함
  - 중립 리뷰는 시스템 설명 문구를 evidence로 넣지 않고 빈 evidence를 허용
- AI quality status marker 추가
  - `AI_QUALITY_RUNS.md`의 `Current status`를 기준으로 loop가 live AI blocked/resolved를 판단

## Live AI 실행 방법

기본 테스트는 API 비용이 나가지 않도록 live AI 검증을 건너뛴다. 실제 API를 호출하려면 명시적으로 환경변수를 켠다.

macOS/Linux:

```bash
RUN_AI_QUALITY=1 AI_QUALITY_LIMIT=3 npm run test:ai-quality
```

Windows PowerShell:

```powershell
$env:RUN_AI_QUALITY='1'
$env:AI_QUALITY_LIMIT='3'
npm.cmd run test:ai-quality
```

처음에는 `AI_QUALITY_LIMIT=3`으로 인증/모델만 확인하고, 통과하면 10, 50 순서로 늘린다.

## Live AI 실행 상태

2026-06-15에 `AI_QUALITY_LIMIT=3`으로 스모크 테스트를 실행했다.

결과:

```text
429 insufficient_quota
```

현재 판단:

- 앱 코드/스키마 문제가 아니라 OpenAI 프로젝트 quota 또는 billing 문제다.
- billing/quota 확인 전에는 추가 API 호출을 반복하지 않는다.
- 자세한 기록은 `AI_QUALITY_RUNS.md`에 남긴다.

## Live AI 품질 검증 체크리스트

실제 `OPENAI_API_KEY`를 넣은 뒤 아래 샘플군으로 확인한다.

| 샘플군 | 최소 개수 | 확인할 것 |
|---|---:|---|
| 한국어 난독화 숙소 리뷰 | 10 | 발음 기반 오탈자 복원, 강한 경고 감지 |
| 일본어 완곡 부정 리뷰 | 10 | 과장 없이 재방문 의사/청결 뉘앙스 해석 |
| 중국어 회피 경고 리뷰 | 10 | `避雷`, `踩雷`, `照骗` 의미 구분 |
| 영어 관광객 함정 리뷰 | 10 | `tourist trap`, `overpriced`, `sketchy` 해석 |
| 긍정/중립 리뷰 | 10 | 위험을 억지로 만들지 않는지 |

## 판정 기준

각 결과를 아래 중 하나로 표시한다.

- `pass`: 원문 근거와 해석이 모두 타당하다.
- `overinterpreted`: 근거보다 강하게 말했다.
- `missed_signal`: 숨은 신호를 놓쳤다.
- `weak_action`: 사업자 액션이 뻔하거나 실행하기 어렵다.
- `bad_evidence`: evidence phrase가 원문 근거로 부적절하다.

## 다음 개선 우선순위

1. OpenAI billing/quota 확인
2. `AI_QUALITY_LIMIT=3`으로 live smoke 재실행
3. 실제 OpenAI API 결과 50개를 위 기준으로 분류
4. 실패 패턴을 `lib/hidden-signals.ts`와 AI 프롬프트에 반영
5. localStorage 피드백을 실제 수집 가능한 폼/저장소로 전환
