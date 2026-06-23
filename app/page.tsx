"use client";

import { useEffect, useMemo, useState } from "react";
import { buildRevenueMarkdownReport } from "@/lib/analysis/reportBuilder";
import { analyzeRevenueSignals } from "@/lib/analysis/revenueSignalEngine";
import { sampleCustomerVoiceInput } from "@/lib/analysis/sampleData";
import type {
  AnalysisResult,
  ContentIdea,
  CustomerVoiceInput,
  FollowupMessage,
  ImpactLevel,
  InsightItem,
  LeadRescueOpportunity,
  RevenueSignal,
  SalesScriptSuggestion,
  UrgencyLevel,
  WeeklyAction
} from "@/types/revenue";

const storageKey = "reviewToRevenueWorkspace.v1";

const emptyInput: CustomerVoiceInput = {
  competitorReviewsText: "",
  leadCsv: "",
  reviewsText: "",
  salesNotesText: ""
};

const revenueSignalLabels = [
  "Top Customer Objection",
  "Top Buying Trigger",
  "Leads to Rescue",
  "Content to Publish",
  "Script to Improve",
  "Competitor Weakness"
];

type SavedWorkspace = {
  input: CustomerVoiceInput;
  result: AnalysisResult | null;
};

export default function Home() {
  const [input, setInput] = useState<CustomerVoiceInput>(emptyInput);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const canAnalyze = Object.values(input).some((value) => value.trim().length > 0);
  const markdown = useMemo(
    () => (result ? buildRevenueMarkdownReport(result) : ""),
    [result]
  );
  const hasSignals = Boolean(result && result.revenueSignals.length > 0);
  const activeSignal =
    result?.revenueSignals.find((signal) => signal.id === activeSignalId) ??
    result?.revenueSignals[0] ??
    null;

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedWorkspace;
        setInput(parsed.input ?? emptyInput);
        setResult(parsed.result ?? null);
        setActiveSignalId(parsed.result?.revenueSignals[0]?.id ?? null);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify({ input, result }));
  }, [hasLoadedStorage, input, result]);

  function updateInput(field: keyof CustomerVoiceInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
  }

  function runAnalysis(nextInput = input) {
    const nextResult = analyzeRevenueSignals(nextInput);
    setResult(nextResult);
    setActiveSignalId(nextResult.revenueSignals[0]?.id ?? null);
  }

  function loadSampleData() {
    setInput(sampleCustomerVoiceInput);
    runAnalysis(sampleCustomerVoiceInput);
  }

  function clearWorkspace() {
    setInput(emptyInput);
    setResult(null);
    setActiveSignalId(null);
    setCopiedId(null);
    window.localStorage.removeItem(storageKey);
  }

  async function copyText(value: string, id: string) {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  function downloadMarkdown() {
    if (!result) {
      return;
    }

    downloadFile(
      `review-to-revenue-report-${new Date().toISOString().slice(0, 10)}.md`,
      markdown,
      "text/markdown;charset=utf-8"
    );
  }

  function downloadLeadCsv() {
    if (!result) {
      return;
    }

    const rows = [
      ["leadName", "score", "urgency", "expectedValue", "reason", "recommendedMessage"],
      ...result.leadRescueOpportunities.map((lead) => [
        lead.leadName,
        String(lead.score),
        lead.urgencyLevel,
        lead.expectedValue,
        lead.rescueReason,
        lead.recommendedMessage
      ])
    ];

    downloadFile(
      `lead-rescue-opportunities-${new Date().toISOString().slice(0, 10)}.csv`,
      rows.map((row) => row.map(csvEscape).join(",")).join("\n"),
      "text/csv;charset=utf-8"
    );
  }

  return (
    <main className="revenue-shell">
      <header className="revenue-topbar">
        <a className="revenue-brand" href="#signals" aria-label="Review-to-Revenue AI home">
          <span className="revenue-brand-mark">R</span>
          <span>Review-to-Revenue AI</span>
        </a>
        <nav className="revenue-nav" aria-label="Product sections">
          <a href="#signals">Signals</a>
          <a href="#input">Input</a>
          <a href="#report">Report</a>
          <a href="#followups">Follow-ups</a>
          <a href="#content">Content</a>
          <a href="#scripts">Scripts</a>
          <a href="#export">Export</a>
        </nav>
      </header>

      <section className="revenue-hero" id="signals">
        <div className="hero-copy">
          <p className="revenue-eyebrow">Customer voice to revenue action</p>
          <h1>This Week’s Revenue Signals</h1>
          <p>
            고객의 말에서 이번 주 매출 액션을 찾아드립니다. 리뷰, 문의, 상담 메모,
            경쟁사 리뷰, 리드 CSV를 붙여넣으면 반박, 구매 동기, 살릴 리드, 콘텐츠,
            상담 스크립트 개선안을 한 번에 정리합니다.
          </p>
          <div className="hero-actions">
            <button className="primary-action" onClick={() => runAnalysis()} type="button">
              Generate Revenue Signals
            </button>
            <button className="secondary-action" onClick={loadSampleData} type="button">
              Load sample data
            </button>
            <button className="ghost-action" onClick={clearWorkspace} type="button">
              Clear
            </button>
          </div>
        </div>

        <div className="hero-brief">
          <span>이번 주 브리핑</span>
          <strong>{hasSignals ? result?.summary : "Load sample data or paste customer voice data to generate signals"}</strong>
          {result ? (
            <div className="brief-stats">
              <Metric label="Reviews" value={result.inputSummary.reviewLines} />
              <Metric label="Notes" value={result.inputSummary.salesNoteLines} />
              <Metric label="Leads" value={result.inputSummary.leadRows} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-band signal-band" aria-label="Revenue signals">
        {hasSignals && result ? (
          <>
            <div className="signal-grid">
              {result.revenueSignals.map((signal) => (
                <SignalCard
                  isActive={signal.id === activeSignal?.id}
                  key={signal.id}
                  onSelect={() => setActiveSignalId(signal.id)}
                  signal={signal}
                />
              ))}
            </div>

            {activeSignal ? (
              <div className="signal-detail">
                <div>
                  <p className="revenue-eyebrow">Selected signal</p>
                  <h2>{activeSignal.title}</h2>
                  <p>{activeSignal.whyItMatters}</p>
                </div>
                <div className="detail-grid">
                  <div>
                    <span>Evidence</span>
                    <strong>{activeSignal.evidenceSnippet}</strong>
                  </div>
                  <div>
                    <span>Recommended action</span>
                    <strong>{activeSignal.recommendedAction}</strong>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="empty-revenue-state">
            <h2>Load sample data or paste customer voice data to generate signals</h2>
            <p>
              지금은 외부 AI API 없이 샘플 분석 엔진으로 작동합니다. 실제 고객 텍스트를
              붙여넣어도 브라우저 안에서만 분석하고 저장합니다.
            </p>
            <div className="signal-placeholder-grid" aria-label="Revenue signal slots">
              {revenueSignalLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <button className="primary-action" onClick={loadSampleData} type="button">
              See sample revenue brief
            </button>
          </div>
        )}
      </section>

      <section className="section-band" id="input">
        <SectionHeader
          eyebrow="Input Workspace"
          title="고객의 말을 네 종류로 붙여넣기"
          text="리뷰 요약이 아니라 매출 액션을 뽑기 위해 고객 리뷰, 경쟁사 리뷰, 상담 메모, 리드 CSV를 함께 봅니다."
        />
        <div className="input-grid">
          <TextAreaField
            label="reviewsText"
            onChange={(value) => updateInput("reviewsText", value)}
            placeholder="고객 리뷰, 문의, DM, 카카오 상담 내용을 붙여넣으세요."
            value={input.reviewsText}
          />
          <TextAreaField
            label="competitorReviewsText"
            onChange={(value) => updateInput("competitorReviewsText", value)}
            placeholder="경쟁사 리뷰나 불만 문장을 붙여넣으세요."
            value={input.competitorReviewsText}
          />
          <TextAreaField
            label="salesNotesText"
            onChange={(value) => updateInput("salesNotesText", value)}
            placeholder="상담 메모를 줄 단위로 붙여넣으세요."
            value={input.salesNotesText}
          />
          <TextAreaField
            label="leadCsv"
            onChange={(value) => updateInput("leadCsv", value)}
            placeholder="name,budget,interest,status,days_since_last_contact,last_note"
            value={input.leadCsv}
          />
        </div>
        <div className="workspace-actions">
          <button className="primary-action" disabled={!canAnalyze} onClick={() => runAnalysis()} type="button">
            Analyze customer voice
          </button>
          <button className="secondary-action" onClick={loadSampleData} type="button">
            Load sample data
          </button>
          <button className="ghost-action" onClick={clearWorkspace} type="button">
            Reset workspace
          </button>
        </div>
      </section>

      {result ? (
        <>
          <section className="section-band" id="report">
            <SectionHeader
              eyebrow="Detailed Report"
              title="반복 신호를 매출 판단 기준으로 정리"
              text={result.summary}
            />
            <div className="report-grid">
              <InsightList items={result.objections} title="Customer Objections" />
              <InsightList items={result.buyingTriggers} title="Buying Triggers" />
              <InsightList items={result.painPoints} title="Pain Points" />
              <InsightList items={result.trustBarriers} title="Trust Barriers" />
              <InsightList items={result.competitorWeaknesses} title="Competitor Weaknesses" />
              <LeadList leads={result.leadRescueOpportunities} />
            </div>
            <WeeklyPlan actions={result.weeklyActionPlan} />
          </section>

          <section className="section-band" id="followups">
            <SectionHeader
              eyebrow="Follow-up Message Library"
              title="멈춘 리드를 다시 여는 메시지"
              text="가족 상의, 가격 부담, 브랜드 비교, 자료 부족처럼 실제로 대화를 멈추게 만든 이유별로 메시지를 생성합니다."
            />
            <div className="message-grid">
              {result.followupMessages.map((message) => (
                <FollowupCard
                  copiedId={copiedId}
                  key={message.id}
                  message={message}
                  onCopy={copyText}
                />
              ))}
            </div>
          </section>

          <section className="section-band" id="content">
            <SectionHeader
              eyebrow="Content Ideas"
              title="반복 질문을 콘텐츠로 먼저 처리"
              text="상담 전에 고객이 이미 궁금해하는 질문을 FAQ, 블로그, 짧은 영상, 세일즈 자료로 바꿉니다."
            />
            <div className="content-grid">
              {result.contentIdeas.map((idea) => (
                <ContentCard idea={idea} key={idea.id} />
              ))}
            </div>
          </section>

          <section className="section-band" id="scripts">
            <SectionHeader
              eyebrow="Sales Script Suggestions"
              title="설득보다 먼저 신뢰를 쌓는 상담 문장"
              text="고객이 멈춘 지점을 기준으로 약한 상담 문장을 숫자, 근거, 리스크 해소 중심 문장으로 바꿉니다."
            />
            <div className="script-list">
              {result.salesScriptSuggestions.map((suggestion) => (
                <ScriptSuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </section>

          <section className="section-band export-band" id="export">
            <SectionHeader
              eyebrow="Report Export"
              title="Markdown export와 PDF print"
              text="팀 공유는 Markdown으로 저장하고, 고객 미팅용으로는 브라우저 인쇄를 사용해 PDF로 저장할 수 있습니다."
            />
            <div className="export-actions">
              <button className="primary-action" onClick={downloadMarkdown} type="button">
                Download Markdown
              </button>
              <button className="secondary-action" onClick={downloadLeadCsv} type="button">
                Export rescue CSV
              </button>
              <button className="secondary-action" onClick={() => window.print()} type="button">
                Print PDF
              </button>
              <button
                className="ghost-action"
                onClick={() => copyText(markdown, "markdown")}
                type="button"
              >
                {copiedId === "markdown" ? "Copied" : "Copy Markdown"}
              </button>
            </div>
            <pre className="markdown-preview">{markdown}</pre>
          </section>
        </>
      ) : null}
    </main>
  );
}

function SignalCard({
  isActive,
  onSelect,
  signal
}: {
  isActive: boolean;
  onSelect: () => void;
  signal: RevenueSignal;
}) {
  return (
    <button className={`signal-card ${isActive ? "active" : ""}`} onClick={onSelect} type="button">
      <span className="signal-label">{signal.label}</span>
      <strong>{signal.title}</strong>
      <p>{signal.whyItMatters}</p>
      <div className="signal-evidence">{signal.evidenceSnippet}</div>
      <div className="signal-action">{signal.recommendedAction}</div>
      <div className="signal-metrics">
        <Pill label="Confidence" value={`${signal.confidenceScore}`} tone="green" />
        <Pill label="Urgency" value={levelLabel(signal.urgencyLevel)} tone={levelTone(signal.urgencyLevel)} />
        <Pill label="Impact" value={levelLabel(signal.impactLevel)} tone={levelTone(signal.impactLevel)} />
      </div>
    </button>
  );
}

function SectionHeader({ eyebrow, text, title }: { eyebrow: string; text: string; title: string }) {
  return (
    <div className="section-header">
      <p className="revenue-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function TextAreaField({
  label,
  onChange,
  placeholder,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="revenue-field">
      <span>{label}</span>
      <textarea
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function InsightList({ items, title }: { items: InsightItem[]; title: string }) {
  return (
    <div className="report-panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="quiet-text">No signal yet.</p>
      ) : (
        <ul className="insight-list">
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <span>{item.explanation}</span>
              <em>{item.evidence[0]}</em>
              <small>{item.recommendedAction}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LeadList({ leads }: { leads: LeadRescueOpportunity[] }) {
  return (
    <div className="report-panel">
      <h3>Lead Rescue Opportunities</h3>
      {leads.length === 0 ? (
        <p className="quiet-text">No rescue opportunity yet.</p>
      ) : (
        <ul className="lead-list">
          {leads.map((lead) => (
            <li key={lead.id}>
              <div>
                <strong>{lead.leadName}</strong>
                <span>{lead.context}</span>
              </div>
              <Pill label="Score" value={`${lead.score}`} tone={levelTone(lead.urgencyLevel)} />
              <small>{lead.rescueReason}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function WeeklyPlan({ actions }: { actions: WeeklyAction[] }) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="weekly-plan">
      <h3>Weekly Action Plan</h3>
      <div className="weekly-grid">
        {actions.map((action) => (
          <div className="weekly-action" key={action.id}>
            <span>P{action.priority}</span>
            <strong>{action.action}</strong>
            <p>{action.expectedOutcome}</p>
            <small>
              {action.owner} · {action.due}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowupCard({
  copiedId,
  message,
  onCopy
}: {
  copiedId: string | null;
  message: FollowupMessage;
  onCopy: (value: string, id: string) => Promise<void>;
}) {
  return (
    <article className="message-card">
      <span>{message.scenario}</span>
      <h3>{message.title}</h3>
      <p>{message.message}</p>
      <small>{message.evidence}</small>
      <button className="secondary-action" onClick={() => onCopy(message.message, message.id)} type="button">
        {copiedId === message.id ? "Copied" : "Copy message"}
      </button>
    </article>
  );
}

function ContentCard({ idea }: { idea: ContentIdea }) {
  return (
    <article className="content-card">
      <span>
        P{idea.priority} · {idea.format}
      </span>
      <h3>{idea.title}</h3>
      <p>{idea.hook}</p>
      <small>{idea.whyNow}</small>
      <strong>{idea.callToAction}</strong>
    </article>
  );
}

function ScriptSuggestionCard({ suggestion }: { suggestion: SalesScriptSuggestion }) {
  return (
    <article className="script-card">
      <span>{suggestion.situation}</span>
      <div className="script-lines">
        <p>
          <small>Weak</small>
          {suggestion.weakLine}
        </p>
        <p>
          <small>Improve</small>
          {suggestion.improvedLine}
        </p>
      </div>
      <strong>{suggestion.whyItWorks}</strong>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="brief-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Pill({
  label,
  tone,
  value
}: {
  label: string;
  tone: "green" | "amber" | "red" | "gray";
  value: string;
}) {
  return (
    <span className={`metric-pill ${tone}`}>
      {label}: {value}
    </span>
  );
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

function levelLabel(level: UrgencyLevel | ImpactLevel) {
  return level[0].toUpperCase() + level.slice(1);
}

function levelTone(level: UrgencyLevel | ImpactLevel): "green" | "amber" | "red" | "gray" {
  if (level === "high") return "red";
  if (level === "medium") return "amber";
  if (level === "low") return "gray";
  return "green";
}
