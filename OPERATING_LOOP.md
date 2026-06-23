# Review-to-Revenue AI Operating Loop

이 파일은 Codex가 사용자의 추가 지시가 적어도 다음 단계로 움직이기 위한 운영 규칙이다.

## 목적

Review-to-Revenue AI는 아직 구조 완성보다 시장 검증이 더 중요하다. 따라서 Codex는 매번 "무엇을 만들까"부터 다시 묻지 않고, 아래 루프를 따라 가장 높은 가치의 다음 작업을 고른다.

## 기본 루프

1. 현재 상태 읽기
   - `NEXT_STEPS.md`
   - `ROADMAP.md`
   - `QUALITY_REVIEW.md`
   - `BUSINESS_ANALYSIS.md`
   - `MACBOOK_NEXT_WORK.md`

2. 막힌 일과 가능한 일 분리
   - OpenAI quota, 결제, 계정 권한, 외부 배포 결정처럼 사용자가 해야 하는 일은 blocked로 둔다.
   - 코드, 문서, 테스트, 샘플, 검증 흐름처럼 repo 안에서 끝낼 수 있는 일은 Codex가 진행한다.

3. 다음 작업 선택
   - 제품 검증에 가장 가까운 일을 먼저 한다.
   - 사용자가 바로 볼 수 있거나 테스트할 수 있는 결과물을 우선한다.
   - scraping, Google OAuth, DB, 결제, 자동 답글은 검증 전까지 미룬다.

4. 구현
   - 작게 만들고 기존 구조를 따른다.
   - Windows/macOS 둘 다 돌아가게 한다.
   - `.env.local` 같은 비밀값은 절대 커밋하지 않는다.

5. 검증
   - 기본은 `npm run check`
   - API 비용이 드는 live AI 테스트는 `RUN_AI_QUALITY=1`이 있을 때만 실행한다.

6. 문서 업데이트
   - 완료/보류/다음 작업을 `NEXT_STEPS.md`와 `ROADMAP.md`에 반영한다.
   - 맥/윈도우 인수인계가 바뀌면 `MACBOOK_NEXT_WORK.md`도 갱신한다.

7. 다음 루프 준비
   - 마지막에 "다음에 Codex가 바로 할 일"을 남긴다.

## 현재 자동 판단 규칙

### OpenAI quota가 막혀 있으면

하지 않는다:

- live AI 품질 테스트 반복 실행
- API 호출을 전제로 한 기능 확장

대신 한다:

- local analyzer 품질 개선
- `/feedback` 결과 분류 흐름 개선
- 외부 검증 질문지 작성
- B2B 리포트 샘플과 CTA 개선
- lead capture 설계

### OpenAI quota가 해결되면

먼저 한다:

```bash
RUN_AI_QUALITY=1 AI_QUALITY_LIMIT=3 npm run test:ai-quality
```

통과하면 다음으로 한다:

```bash
RUN_AI_QUALITY=1 npm run test:ai-quality
```

그 결과를 `AI_QUALITY_RUNS.md`와 `QUALITY_REVIEW.md`에 기록한다.

### 피드백 데이터가 쌓이면

먼저 한다:

- `/feedback`에서 CSV export
- 과해석, 신호 누락, 액션 약함을 분류
- 반복 실패 표현을 `lib/hidden-signals.ts` 또는 AI prompt 개선으로 반영

### 외부 사용자에게 보여줄 준비가 되면

먼저 한다:

- 여행자용 3문항 검증 질문
- 숙박업/B2B용 5문항 검증 질문
- 1회 리포트 가격/범위 제안

## Codex 자율성 단계

### Level 1: Repo loop

사용자가 "다음으로 진행해줘"라고만 말해도 Codex가 이 파일을 기준으로 다음 작업을 고른다.

### Level 2: Thread heartbeat

Codex 앱의 heartbeat automation을 켜면, 정해진 시간마다 이 스레드가 깨어나 다음 진행 상황을 제안할 수 있다.

권장 예시:

- 매일 오전 10시: 로드맵 기준 오늘의 다음 행동 제안
- 2시간 뒤 1회: 현재 미완료 작업 이어서 점검

### Level 3: Detached work automation

나중에 배포/품질 모니터링이 생기면 cron automation으로 별도 worktree에서 반복 점검한다.

아직은 이 단계가 필요 없다.

## 중단 조건

Codex는 아래 상황에서 멈추고 사용자 결정을 기다린다.

- 유료 API 비용이 발생할 수 있음
- 결제, OAuth, 배포 계정 연결이 필요함
- 민감한 정보 또는 실제 고객 데이터 전송이 필요함
- 제품 방향이 바뀔 수 있는 사업적 선택이 필요함
- destructive git/file 작업이 필요함

## 다음 작업 선택 문장

새 Codex 세션에서는 이렇게 시작하면 된다.

```text
OPERATING_LOOP.md를 기준으로 Review-to-Revenue AI를 이어서 진행해줘.
막힌 일은 blocked로 두고, repo 안에서 할 수 있는 가장 높은 가치의 다음 작업을 골라 구현해.
끝나기 전에 npm run check를 실행하고 NEXT_STEPS.md와 ROADMAP.md를 업데이트해.
```
