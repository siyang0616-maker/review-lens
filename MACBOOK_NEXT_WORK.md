# MacBook Next Work Memo

작성일: 2026-06-12

## 맥북에서 바로 이어갈 때 첫 행동

1. GitHub에서 최신 코드 pull
2. 프로젝트 루트로 이동
3. Node 22 사용
4. 의존성 설치
5. 전체 검증
6. 개발 서버 실행

```bash
nvm install 22
nvm use 22
npm ci
npm run check
npm run dev
```

로컬 주소:

```text
http://127.0.0.1:3000
```

## 현재까지 온 지점

Review Lens는 현재 paste-first MVP까지 만들어졌다.

완료된 것:

- Next.js 앱 골격
- 리뷰 붙여넣기 UI
- Traveler / Business 모드
- Hotel / Restaurant / Cafe / Guesthouse / Other 선택
- 로컬 rule-based analyzer
- Hidden signal dictionary
- OpenAI API 기반 AI analyzer 연결 코드
- API key 없을 때 local fallback
- `AnalysisReport` Zod schema
- 한국어/일본어/중국어/영어 fixture
- Vitest 테스트
- Windows/macOS 호환 설정
- `npm run check` 검증 루틴

아직 안 된 것:

- 실제 OpenAI API key로 live 분석 품질 확인
- UI 예시 탭
- confidence 낮을 때 경고 UI
- Markdown 파일 다운로드
- B2B 샘플 리포트 페이지
- 여행자용 무료 도구 랜딩/공유 흐름

## 맥북에서 다음으로 할 일

### 1순위: 실제 AI 분석 품질 확인

`.env.local` 생성:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.5
```

확인할 것:

- 한국어 난독화 리뷰가 정상 문장으로 잘 복원되는가
- 원어민 뉘앙스 해석이 과장되지 않는가
- evidence phrase가 실제 입력 리뷰에서만 나오나
- 사업자 액션이 구체적인가
- 답글 초안이 방어적이거나 과장되지 않는가

### 2순위: UI를 제품처럼 만들기

다음 UI 개선을 먼저 한다:

- 예시 리뷰 탭: Korean, Japanese, Chinese, English
- 결과 상단에 `Local analyzer` / `AI analyzer` 표시
- confidence가 55 미만이면 "참고 수준" 경고
- severity가 5면 "강한 경고 신호" 배지
- Markdown 다운로드 버튼

### 3순위: B2B 샘플 리포트 만들기

호텔/게스트하우스 사업자에게 보여줄 샘플 페이지를 만든다.

페이지 후보:

```text
/sample-report
```

포함할 섹션:

- 이번 주 외국어 리뷰 위험 요약
- 언어권별 반복 신호
- 매출/예약 전환 리스크
- 먼저 고칠 3가지
- 직원 공유 체크리스트
- 답글 초안
- 다음 7일 액션

## 다음 Codex에게 줄 프롬프트

```text
MACBOOK_NEXT_WORK.md와 ROADMAP.md를 기준으로 Review Lens를 이어서 진행해줘.
먼저 repo 상태와 NEXT_STEPS.md를 확인하고, 현재 가장 중요한 다음 작업을 네가 골라 구현해.
우선순위는 실제 AI 분석 품질 확인, UI 예시 탭/신뢰도 경고, Markdown 다운로드, B2B 샘플 리포트 순서야.
paste-first MVP 원칙을 지키고 scraping, Google OAuth, 자동 답글 게시, DB는 아직 넣지 마.
끝나기 전에 npm run check를 실행하고 ROADMAP.md의 진행 상태를 업데이트해줘.
```

## 지켜야 할 제품 원칙

- 리뷰를 수집하지 않는다. 사용자가 붙여넣은 텍스트만 분석한다.
- 리뷰 조작, 좋은 리뷰 유도, 인센티브 문구 생성은 하지 않는다.
- 국가/민족 고정관념처럼 보이면 안 된다. 언어권 표현 패턴으로만 설명한다.
- 단일 리뷰로 강한 결론을 내리지 않는다. confidence와 limitation을 항상 보여준다.
- B2C는 유입, B2B는 수익화라는 방향을 유지한다.

