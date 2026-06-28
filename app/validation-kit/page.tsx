const revenueTeamQuestions = [
  "이 결과가 일반 리뷰/상담 메모 요약보다 더 실행 가능하다고 느끼나요?",
  "원문만 봤을 때와 Review-to-Revenue AI 결과를 봤을 때 이번 주 액션 판단이 바뀌었나요?",
  "이 정보를 보면 실제 follow-up, 콘텐츠, 상담 스크립트를 바꿀 가능성이 있나요?",
  "어떤 문장이 근거로 가장 설득력 있었나요?",
  "과하게 추측한다고 느껴지는 부분이 있었나요?",
  "팀에 공유한다면 어떤 역할의 사람이 먼저 써야 하나요?"
];

const ownerQuestions = [
  "이 리포트가 직원에게 공유할 만큼 실무적으로 보이나요?",
  "본인 고객 텍스트 30개로 유료 파일럿 리포트를 받아볼 수 있나요?",
  "결제나 승인 결정자는 본인인가요, 다른 사람인가요?",
  "먼저 고칠 3가지가 실제 운영 액션으로 충분히 구체적인가요?",
  "고객의 말에서 놓치던 구매 반박이나 follow-up 기회를 발견했다는 느낌이 있나요?",
  "1회 리포트에 29~99달러를 낼 이유가 있나요?",
  "돈을 내지 않는다면 가장 큰 이유는 품질, 가격, 신뢰, 필요성 중 무엇인가요?"
];

const interviewFlow = [
  "참가자 ID를 먼저 부여하고 sales, marketing, owner 중 하나로 표시",
  "원문 고객 텍스트만 먼저 보여주고 이번 주 액션 판단을 묻기",
  "그다음 Dashboard에서 같은 텍스트를 실행하고 판단이 바뀌었는지 확인",
  "Revenue Action을 하나 복사하거나 상태를 변경하게 하기",
  "세일즈/마케팅/오너별로 실제 실행 가능성을 묻기",
  "/outcomes에서 outcome 기록을 확인하고 CSV로 저장",
  "정성 답변은 아래 기록 양식에 그대로 붙여넣기"
];

const successSignals = [
  {
    label: "Sales continue",
    items: [
      "세일즈 후보 3명 중 2명 이상이 오늘 연락할 리드를 고른다",
      "세일즈 후보 3명 중 2명 이상이 follow-up 메시지를 그대로 쓰거나 수정해 쓰겠다고 말한다",
      "상담 스크립트 개선안이 실제 대화에 적용 가능하다는 반응이 많다"
    ]
  },
  {
    label: "B2B continue",
    items: [
      "B2B 후보 2명 중 1명 이상이 실제 리뷰 제공 또는 유료 파일럿을 승인한다",
      "결제/승인 결정자가 누구인지 확인된다",
      "운영 액션을 직원에게 공유할 수 있다고 말한다"
    ]
  },
  {
    label: "Narrow or pivot",
    items: [
      "흥미는 있지만 실제 follow-up이나 콘텐츠 작업으로 이어지지 않는다",
      "B2B 지불 의향이 약하다",
      "대부분 일반 요약 도구와 차이를 못 느낀다",
      "근거 표현이나 실행 액션이 약하다는 피드백이 반복된다"
    ]
  }
];

const screeningQuestions = [
  "최근 12개월 안에 고객 리뷰, 문의, 상담 메모를 매출 개선에 활용해본 적이 있나요?",
  "고객의 반박, 구매 동기, 이탈 이유를 따로 정리해본 적이 있나요?",
  "B2B라면 세일즈, 마케팅, 운영 개선 의사결정에 관여하나요?",
  "B2B라면 본인 사업의 고객 텍스트 30개를 제공할 수 있나요?"
];

const offers = [
  {
    price: "$29",
    title: "Starter diagnosis",
    detail: "고객 텍스트 30개, 매출 신호 요약, 먼저 실행할 3가지",
    delivery: "24시간 내 1페이지 PDF/Markdown",
    buyerAction: "실제 리뷰 30개 제공 또는 선입금"
  },
  {
    price: "$49",
    title: "Pilot report",
    detail: "고객 텍스트 30~100개, 반박/트리거/follow-up, 메시지 초안, 실행 체크리스트",
    delivery: "48시간 내 2~3페이지 리포트",
    buyerAction: "유료 파일럿 승인 또는 결제 링크 요청"
  },
  {
    price: "$99",
    title: "Deep review",
    detail: "고객 텍스트 100개 이상, 반복 매출 신호 지도, 7일 개선 계획, 재검토",
    delivery: "72시간 내 리포트와 15분 설명",
    buyerAction: "운영자 미팅 예약 또는 견적 요청"
  }
];

export default function ValidationKitPage() {
  return (
    <main className="report-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand brand-link" href="/">
            <span className="brand-mark">R</span>
            <span>Review-to-Revenue AI</span>
          </a>
          <div className="topbar-actions">
            <a className="top-link" href="/">
              Dashboard
            </a>
            <a className="top-link" href="/sample-report">
              Sample report
            </a>
            <a className="top-link" href="/outcomes">
              Outcomes
            </a>
          </div>
        </div>
      </header>

      <section className="report-hero">
        <div>
          <p className="eyebrow">External validation kit</p>
          <h1>다음은 검증입니다</h1>
          <p>
            브레인스토밍과 1차 기획은 끝났습니다. 이제 확인할 것은 단순합니다.
            팀이 이 신호를 믿는지, 실제 follow-up과 콘텐츠, 상담 스크립트를 바꿀 이유를
            느끼는지 확인합니다.
          </p>
        </div>
        <div className="validation-summary">
          <div>
            <span>Target</span>
            <strong>5 interviews</strong>
          </div>
          <div>
            <span>Sales / Growth</span>
            <strong>3 people</strong>
          </div>
          <div>
            <span>B2B</span>
            <strong>2 owners</strong>
          </div>
        </div>
      </section>

      <section className="report-band">
        <div className="validation-grid">
          <ValidationCard title="Screening" items={screeningQuestions} />
          <ValidationCard title="Run order" items={interviewFlow} />
          <ValidationCard title="Revenue team questions" items={revenueTeamQuestions} />
          <ValidationCard title="Owner questions" items={ownerQuestions} />
        </div>
      </section>

      <section className="report-layout">
        <div className="report-main">
          <section className="report-section">
            <h2>Interview Script</h2>
            <div className="script-block">
              <strong>Revenue team opener</strong>
              <p>
                고객 리뷰, 문의, 상담 메모에서 이번 주 매출 액션을 뽑아주는 도구를
                만들고 있어요. 결과를 보고 follow-up, 콘텐츠, 상담 판단에 도움이 될지
                솔직하게 말해주세요.
              </p>
            </div>
            <div className="script-block">
              <strong>Owner opener</strong>
              <p>
                고객의 말 속 반박, 구매 동기, 이탈 이유를 정리해서 이번 주 실행할
                매출 액션을 뽑아주는 1회 리포트를 테스트 중입니다. 최근 고객 텍스트 30개를 맡길 만큼 믿을 수 있는지,
                승인권자가 누구인지, $49 파일럿을 진행할 행동까지 냉정하게 봐주세요.
              </p>
            </div>
          </section>

          <section className="report-section">
            <h2>Offer Test</h2>
            <div className="offer-table">
              {offers.map((offer) => (
                <div className="offer-row" key={offer.price}>
                  <span>{offer.price}</span>
                  <div>
                    <strong>{offer.title}</strong>
                    <p>{offer.detail}</p>
                  </div>
                  <div>
                    <strong>{offer.delivery}</strong>
                    <p>{offer.buyerAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section">
            <h2>Reaction Log Format</h2>
            <div className="log-template">
              <span>Date / person / type</span>
              <span>Session ID</span>
              <span>Baseline translation decision</span>
              <span>Review-to-Revenue AI action change</span>
              <span>Revenue action copied or status changed</span>
              <span>Most useful sentence</span>
              <span>Confusing or overinterpreted part</span>
              <span>Would they share or pay?</span>
              <span>Exact quote</span>
              <span>Next product change</span>
            </div>
          </section>
        </div>

        <aside className="report-side">
          <div className="side-panel">
            <h2>Decision Rules</h2>
            <div className="decision-list">
              {successSignals.map((signal) => (
                <div className="decision-card" key={signal.label}>
                  <span className="validation-badge">{signal.label}</span>
                  <ul>
                    {signal.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="side-panel">
            <h2>After 5 Interviews</h2>
            <ol className="action-list">
              <li>`/outcomes` CSV와 정성 답변을 합친다.</li>
              <li>과해석, 신호 누락, 액션 약함을 각각 3개 이하로 묶는다.</li>
              <li>가장 반복되는 실패 1개만 다음 개발 대상으로 고른다.</li>
              <li>유료 의향이 있으면 lead capture를 먼저 만든다.</li>
            </ol>
          </div>
        </aside>
      </section>
    </main>
  );
}

function ValidationCard({ items, title }: { items: string[]; title: string }) {
  return (
    <section className="validation-card">
      <h2>{title}</h2>
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
