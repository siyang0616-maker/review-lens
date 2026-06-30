import type { ReactNode } from "react";

const snapshotMetrics = [
  {
    label: "Revenue Leak Score",
    note: "후속 설계가 약해 매출 기회가 새는 상태",
    value: "74 / 100"
  },
  {
    label: "Leads to Rescue",
    note: "최근 상담에서 조용해진 고관심 리드",
    value: "7명"
  },
  {
    label: "Recommended Action Count",
    note: "이번 주 바로 실행할 follow-up, content, script 액션",
    value: "9개"
  },
  {
    label: "Top Objection",
    note: "가장 반복된 구매 반박",
    value: "총 투자금 대비 회수 기간이 불확실합니다"
  }
];

const revenueLeaks = [
  {
    action:
      "초기 투자금 중 자기자본 비율, 월 고정비를 버틸 수 있는 기간, 운영자가 직접 투입 가능한 시간을 기준으로 다시 상담 일정을 잡습니다.",
    evidence: [
      "총 투자금은 알겠는데, 회수까지 얼마나 걸리는지가 제일 걱정입니다.",
      "평균 매출 말고 안 됐을 때 어느 정도 버틸 수 있어야 하나요?",
      "대출을 일부 받아야 해서 회수 기간이 길면 부담됩니다."
    ],
    title: "회수 기간 질문에 평균값만 답하고 대화가 끊김",
    why:
      "회수 기간 질문은 가격 반박처럼 보이지만 실제로는 리스크 판단 질문입니다. 평균 수익만 말하면 고객은 자기 상황에 적용하지 못합니다."
  },
  {
    action:
      "총 투자금, 월 고정비, 회수 기간 조건, 실패 리스크 확인 절차, 다음 상담 질문을 담은 가족용 5문장 요약을 보냅니다.",
    evidence: [
      "남편이 안정적인지 많이 볼 것 같아요.",
      "아내가 프랜차이즈 창업을 좀 불안해합니다.",
      "가족과 얘기해보고 괜찮으면 다시 연락드릴게요."
    ],
    title: "가족 상의 단계에서 고객이 혼자 설득하게 됨",
    why:
      "가족 상의는 거절이 아니라 내부 의사결정 단계입니다. 고객이 집에서 설명할 자료가 없으면 관심이 걱정 앞에서 사라집니다."
  },
  {
    action:
      "초기 투자금, 예상 고정비, 운영 난이도, 상권 의존도 4칸 표로 비교 기준을 잡아주고 다음 상담을 제안합니다.",
    evidence: [
      "A 브랜드는 창업비가 낮고 B 브랜드는 매출이 높다고 하던데요.",
      "본사마다 말이 다 달라서 기준을 모르겠습니다.",
      "블로그마다 추천하는 브랜드가 달라서 헷갈립니다."
    ],
    title: "브랜드 비교 질문이 검색 경쟁으로 빠짐",
    why:
      "브랜드 비교 질문은 구매 의지가 있다는 신호입니다. 비교 기준을 잡아주지 않으면 고객은 더 많은 정보를 찾다가 결정을 미룹니다."
  }
];

const followupMessages = [
  {
    body:
      "창업비는 금액 자체보다 내가 몇 개월을 버틸 수 있는 구조인지가 더 중요합니다. 자기자본, 월 고정비, 직접 운영 시간을 기준으로 지금 보시는 브랜드가 무리한 선택인지 먼저 봐드리겠습니다.",
    title: "가격 고민 리드"
  },
  {
    body:
      "가족분들과 상의하실 때 도움이 되도록 총 투자금, 회수 기간, 운영 리스크를 짧게 정리해드릴게요. 필요하시면 그대로 보여주실 수 있는 1장 요약으로 보내드리겠습니다.",
    title: "가족과 상의 리드"
  },
  {
    body:
      "A 브랜드와 B 브랜드는 창업비만 보면 판단이 어렵습니다. 초기 투자금, 월 고정비, 운영 난이도, 상권 영향을 기준으로 고객님 상황에 어떤 리스크가 더 큰지 같이 비교해드리겠습니다.",
    title: "다른 브랜드 비교 리드"
  }
];

const contentIdeas = [
  {
    objection: "총 투자금이 생각보다 큰데 괜찮을까요?",
    purpose: "가격 질문을 리스크 판단으로 전환",
    title: "프랜차이즈 창업비보다 먼저 봐야 할 3가지"
  },
  {
    objection: "가족과 상의해보고 연락드릴게요.",
    purpose: "가족 의사결정 단계에서 이탈 방지",
    title: "배우자 설득 전에 준비해야 할 창업 체크리스트"
  },
  {
    objection: "브랜드마다 말이 달라서 헷갈립니다.",
    purpose: "브랜드 비교 리드를 상담으로 유도",
    title: "A 브랜드 vs B 브랜드, 창업비 말고 비교할 기준"
  },
  {
    objection: "몇 개월이면 투자금 회수되나요?",
    purpose: "평균 수익 중심 상담의 한계 보완",
    title: "회수 기간 질문할 때 꼭 같이 물어봐야 하는 것"
  },
  {
    objection: "입지가 안 좋으면 손해가 클까요?",
    purpose: "상권 불안을 사전 해소",
    title: "상권이 안 좋으면 프랜차이즈도 실패할까?"
  }
];

const scriptImprovements = [
  {
    after:
      "금액만 먼저 보시면 부담스럽게 느껴질 수 있습니다. 투자금보다 먼저 자기자본, 월 고정비를 버틸 수 있는 기간, 직접 운영 시간을 같이 확인해야 감당 가능한 숫자인지 판단할 수 있습니다.",
    before:
      "창업비는 보통 8천만 원에서 1억 2천만 원 정도 보시면 됩니다. 자세한 금액은 브랜드와 평수에 따라 달라집니다.",
    title: "투자금 질문 대응"
  },
  {
    after:
      "가족분들과 꼭 상의해보셔야 합니다. 다만 투자금, 회수 기간, 리스크를 한 번에 설명하기 어려우실 수 있어요. 가족분들께 보여주실 핵심 질문 5개를 정리해드릴까요?",
    before: "네, 가족분들과 상의해보시고 연락 주세요.",
    title: "가족과 상의 응대"
  },
  {
    after:
      "두 브랜드가 모두 괜찮아 보여도 고객님 상황에서는 리스크가 다를 수 있습니다. 창업비, 고정비, 운영 난이도, 상권 의존도 네 가지로 비교해보면 더 무리 없는 선택을 판단하기 쉽습니다.",
    before: "A 브랜드도 좋고 B 브랜드도 괜찮습니다. 예산과 지역에 따라 달라요.",
    title: "브랜드 비교 응대"
  }
];

const sevenDayPlan = [
  "최근 30일 안에 멈춘 상담 리드 7명을 고릅니다.",
  "가격 고민 리드 3명에게 회수 기간 기준 메시지를 보냅니다.",
  "가족과 상의 리드 2명에게 가족용 요약 메시지를 보냅니다.",
  "브랜드 비교 리드 2명에게 비교 기준표 메시지를 보냅니다.",
  "가장 많이 반복된 반박 1개로 블로그 글 또는 짧은 영상 주제를 만듭니다.",
  "상담 스크립트에서 '네, 연락 주세요'로 끝나는 문장을 바꿉니다.",
  "답장, 재상담, 거절, 무응답을 기록하고 다음 주에 반복할 액션 1개를 고릅니다."
];

export default function SampleReportPage() {
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
            <a className="top-link" href="/outcomes">
              Outcomes
            </a>
            <a className="top-link" href="/validation-kit">
              Validation
            </a>
          </div>
        </div>
      </header>

      <section className="report-hero">
        <div>
          <p className="eyebrow">Sample Revenue Leak Diagnostic</p>
          <h1>프랜차이즈 상담 메모에서 찾은 매출 누수 진단</h1>
          <p>
            Customer Voice → Revenue Action → Outcome Data 흐름에 맞춰, 상담 중단
            이유를 요약이 아니라 이번 주 follow-up, content, script 액션으로 바꾼
            샘플 리포트입니다.
          </p>
        </div>
        <div className="report-summary">
          <div>
            <span>Sample target</span>
            <strong>프랜차이즈 / 창업 상담 운영사</strong>
          </div>
          <div>
            <span>Source</span>
            <strong>익명 상담 메모 18개</strong>
          </div>
          <div>
            <span>Fastest win</span>
            <strong>가족 상의 리드 follow-up</strong>
          </div>
        </div>
      </section>

      <section className="report-band">
        <div className="metric-grid">
          {snapshotMetrics.map((metric) => (
            <Metric key={metric.label} label={metric.label} note={metric.note} value={metric.value} />
          ))}
        </div>
      </section>

      <section className="offer-strip">
        <div>
          <p className="eyebrow">Free validation offer</p>
          <h2>Free Revenue Leak Diagnostic</h2>
          <p>
            개인정보를 제거한 상담 메모 10~20개를 보내면, 어떤 고객 말이 매출
            누수로 이어지는지와 이번 주 실행할 다음 액션을 같은 형식으로 정리합니다.
          </p>
        </div>
        <div className="offer-price">
          <span>Paid next step</span>
          <strong>Revenue Action Report</strong>
          <p>더 많은 데이터, 메시지 라이브러리, 콘텐츠 계획, 7일 실행 계획</p>
          <a
            className="primary-link"
            href="mailto:hello@example.com?subject=Free%20Revenue%20Leak%20Diagnostic"
          >
            무료 진단 문의
          </a>
        </div>
      </section>

      <section className="report-layout">
        <div className="report-main">
          <ReportSection title="Executive Diagnosis">
            <p>
              상담이 끊기는 가장 큰 이유는 비싸다는 반응 자체가 아니라, 고객이
              투자금과 회수 기간을 자기 상황에 적용하지 못한 채 가족 설득 단계로
              넘어가기 때문입니다.
            </p>
            <p>
              18개 상담 메모 중 11개는 첫 문의 당시 관심도가 높았습니다. 하지만
              비용, 회수 기간, 가족 상의, 브랜드 비교 질문 이후 7개가 조용해졌고,
              자료 발송 이후의 다음 연락 이유가 약했습니다.
            </p>
          </ReportSection>

          <ReportSection title="Top 3 Revenue Leaks">
            <div className="evidence-table">
              {revenueLeaks.map((leak) => (
                <article className="evidence-row" key={leak.title}>
                  <strong>{leak.title}</strong>
                  <p>{leak.why}</p>
                  <ul>
                    {leak.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p>{leak.action}</p>
                </article>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Follow-up Message Examples">
            <div className="scope-grid">
              {followupMessages.map((message) => (
                <div className="scope-row" key={message.title}>
                  <span>{message.title}</span>
                  <p>{message.body}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Content Ideas">
            <div className="signal-table">
              {contentIdeas.map((idea) => (
                <div className="signal-row" key={idea.title}>
                  <div>
                    <span className="signal-language">{idea.purpose}</span>
                    <strong>{idea.title}</strong>
                  </div>
                  <p>{idea.objection}</p>
                  <span className="risk-badge medium">Content</span>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Sales Script Before / After">
            <div className="handoff-table">
              {scriptImprovements.map((script) => (
                <div className="handoff-row" key={script.title}>
                  <strong>{script.title}</strong>
                  <p>Before: {script.before}</p>
                  <p>After: {script.after}</p>
                </div>
              ))}
            </div>
          </ReportSection>
        </div>

        <aside className="report-side">
          <div className="side-panel">
            <h2>Leads to Rescue</h2>
            <ol className="action-list">
              <li>투자금은 확인했지만 회수 기간을 물어본 리드</li>
              <li>배우자 또는 가족과 상의한다고 한 리드</li>
              <li>A 브랜드와 B 브랜드를 비교하던 리드</li>
              <li>상권 리스크를 걱정했지만 상담 태도가 적극적이었던 리드</li>
            </ol>
          </div>

          <div className="side-panel">
            <h2>Next 7 Days</h2>
            <div className="timeline">
              {sevenDayPlan.map((task, index) => (
                <div className="timeline-item" key={task}>
                  <span>Day {index + 1}</span>
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, note, value }: { label: string; note: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  );
}

function ReportSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="report-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
