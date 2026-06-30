import type { ReactNode } from "react";
import { leakDiagnosticSample as sample } from "@/shared/leakDiagnosticSample";

const snapshotMetrics = [
  {
    label: sample.snapshot.scoreLabel,
    note: sample.snapshot.scoreNote,
    value: `${sample.snapshot.score} / ${sample.snapshot.scoreMax}`
  },
  {
    label: sample.snapshot.leadsToRescueLabel,
    note: sample.snapshot.leadsToRescueNote,
    value: `${sample.snapshot.leadsToRescue}명`
  },
  {
    label: sample.snapshot.recommendedActionLabel,
    note: sample.snapshot.recommendedActionNote,
    value: `${sample.snapshot.recommendedActionCount}개`
  },
  {
    label: sample.snapshot.topObjectionLabel,
    note: sample.snapshot.topObjectionNote,
    value: sample.snapshot.topObjection
  }
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
            <a className="top-link" href="/landing">
              Free Diagnostic
            </a>
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
            <strong>{sample.sampleTarget}</strong>
          </div>
          <div>
            <span>Source</span>
            <strong>{sample.sourceSummary}</strong>
          </div>
          <div>
            <span>Fastest win</span>
            <strong>{sample.snapshot.fastestWin}</strong>
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
            개인정보를 제거한 상담 메모를 보내면, 어떤 고객 말이 매출 누수로
            이어지는지와 이번 주 실행할 다음 액션을 같은 형식으로 정리합니다.
          </p>
        </div>
        <div className="offer-price">
          <span>Start here</span>
          <strong>Free Diagnostic</strong>
          <p>외부 공유용 랜딩페이지에서 무료 진단 신청 흐름을 확인할 수 있습니다.</p>
          <a className="primary-link" href="/landing">
            진단 신청으로 돌아가기
          </a>
        </div>
      </section>

      <section className="report-layout">
        <div className="report-main">
          <ReportSection title="Executive Diagnosis">
            <p>{sample.oneLineSummary}</p>
            <p>{sample.counselingFlow}</p>
          </ReportSection>

          <ReportSection title="Structural Problems">
            <div className="handoff-table">
              {sample.structuralProblems.map((problem) => (
                <div className="handoff-row" key={problem.observation}>
                  <strong>{problem.observation}</strong>
                  <p>{problem.meaning}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Top 3 Revenue Leaks">
            <div className="evidence-table">
              {sample.leaks.map((leak) => (
                <article className="evidence-row" key={leak.title}>
                  <strong>{leak.title}</strong>
                  <p>{leak.why}</p>
                  <ul>
                    {leak.evidence.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p>{leak.recommendedAction}</p>
                </article>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Follow-up Message Examples">
            <div className="scope-grid">
              {sample.followupMessages.map((message) => (
                <div className="scope-row" key={message.title}>
                  <span>{message.title}</span>
                  <p>{message.body}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Content Ideas">
            <div className="signal-table">
              {sample.contentIdeas.map((idea) => (
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
              {sample.scriptImprovements.map((script) => (
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
              {sample.rescueLeadTypes.map((lead) => (
                <li key={lead}>{lead}</li>
              ))}
            </ol>
          </div>

          <div className="side-panel">
            <h2>Next 7 Days</h2>
            <div className="timeline">
              {sample.sevenDayPlan.map((task) => (
                <div className="timeline-item" key={task.day}>
                  <span>{task.day}</span>
                  <p>{task.action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="side-panel">
            <h2>Recommended Order</h2>
            <ol className="action-list">
              {sample.recommendedOrder.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
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
