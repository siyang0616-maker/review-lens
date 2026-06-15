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
- 예시 리뷰 탭
- confidence/severity 경고 UI
- Markdown 복사/다운로드
- B2B 샘플 리포트 `/sample-report`
- B2B CTA
- 결과 품질 피드백 버튼
- 피드백 검토/CSV/JSON export 페이지 `/feedback`

아직 안 된 것:

- 실제 OpenAI API key로 live 분석 품질 확인: 현재 `insufficient_quota`로 막힘
- 배포된 URL에서 외부 사용자 반응 확인
- localStorage 피드백을 서버 저장/폼 제출로 전환
- 실제 lead capture 또는 문의 폼 연결

## 맥북에서 다음으로 할 일

### 1순위: OpenAI quota 해결 후 실제 AI 분석 품질 확인

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

실행:

```bash
RUN_AI_QUALITY=1 AI_QUALITY_LIMIT=3 npm run test:ai-quality
```

### 2순위: 피드백 결과 확인

브라우저에서:

```text
http://127.0.0.1:3000/feedback
```

확인할 것:

- 과해석 피드백이 반복되는 표현
- 놓친 신호로 기록된 표현
- 사업자 액션이 약하다고 찍힌 결과
- CSV export 후 `QUALITY_REVIEW.md`에 실패 패턴 반영

### 3순위: 외부 검증 준비

준비할 것:

- 여행자에게 보여줄 3개 샘플 리뷰
- 호텔/게스트하우스 사장에게 보여줄 `/sample-report`
- "이 결과에 돈을 낼 이유가 있는가"를 확인할 질문 5개

## 다음 Codex에게 줄 프롬프트

```text
MACBOOK_NEXT_WORK.md와 ROADMAP.md를 기준으로 Review Lens를 이어서 진행해줘.
먼저 repo 상태와 NEXT_STEPS.md를 확인하고, 현재 가장 중요한 다음 작업을 네가 골라 구현해.
우선순위는 실제 AI 분석 품질 확인, UI 예시 탭/신뢰도 경고, Markdown 다운로드, B2B 샘플 리포트 순서야.
지금은 UI/B2B/피드백 페이지까지 완료됐고, OpenAI quota가 막혀 있으면 live AI 대신 `/feedback`과 외부 검증 준비를 진행해.
paste-first MVP 원칙을 지키고 scraping, Google OAuth, 자동 답글 게시, DB는 아직 넣지 마.
끝나기 전에 npm run check를 실행하고 ROADMAP.md의 진행 상태를 업데이트해줘.
```

## 지켜야 할 제품 원칙

- 리뷰를 수집하지 않는다. 사용자가 붙여넣은 텍스트만 분석한다.
- 리뷰 조작, 좋은 리뷰 유도, 인센티브 문구 생성은 하지 않는다.
- 국가/민족 고정관념처럼 보이면 안 된다. 언어권 표현 패턴으로만 설명한다.
- 단일 리뷰로 강한 결론을 내리지 않는다. confidence와 limitation을 항상 보여준다.
- B2C는 유입, B2B는 수익화라는 방향을 유지한다.
