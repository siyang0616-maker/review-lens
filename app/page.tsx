"use client";

import { useEffect, useMemo, useState } from "react";
import {
  actionOutcomesStorageKey,
  applyOutcomesToActions,
  mergeActionOutcome,
  summarizeActionOutcomes
} from "@/lib/analysis/actionOutcomes";
import { parseMoney } from "@/lib/analysis/money";
import { buildRevenueMarkdownReport } from "@/lib/analysis/reportBuilder";
import { analyzeRevenueSignals } from "@/lib/analysis/revenueSignalEngine";
import {
  demoDatasets,
  hotelDemoInput,
  inputForDemoDataset
} from "@/src/lib/sampleData";
import type {
  ActionOutcome,
  ActionStatus,
  AnalysisResult,
  ContentIdea,
  CustomerVoiceInput,
  FollowupMessage,
  ImpactLevel,
  RevenueAction,
  RevenueSignal,
  SalesScriptSuggestion,
  SupportedLanguage,
  UrgencyLevel
} from "@/types/revenue";

const storageKey = "reviewToRevenueWorkspace.v1";

const emptyInput: CustomerVoiceInput = {
  competitorReviewsText: "",
  leadCsv: "",
  outputLanguage: "en",
  reviewsText: "",
  salesNotesText: ""
};

type SavedWorkspace = {
  input: CustomerVoiceInput;
  result: AnalysisResult | null;
  selectedDatasetId?: string;
  outputLanguage?: SupportedLanguage;
};

const signalLabels = [
  "Top Customer Objection",
  "Top Buying Trigger",
  "Leads to Rescue",
  "Content to Publish",
  "Script to Improve",
  "Competitor Weakness"
];

export default function Home() {
  const [input, setInput] = useState<CustomerVoiceInput>(emptyInput);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState(demoDatasets[0].id);
  const [outputLanguage, setOutputLanguage] = useState<SupportedLanguage>("en");
  const [actionOutcomes, setActionOutcomes] = useState<ActionOutcome[]>([]);

  const canAnalyze = [
    input.competitorReviewsText,
    input.leadCsv,
    input.reviewsText,
    input.salesNotesText
  ].some((value) => value.trim().length > 0);
  const revenueActions = useMemo(
    () => applyOutcomesToActions(result?.revenueActions ?? [], actionOutcomes),
    [actionOutcomes, result]
  );
  const outcomeSummary = useMemo(
    () => summarizeActionOutcomes(revenueActions, actionOutcomes),
    [actionOutcomes, revenueActions]
  );
  const markdown = useMemo(
    () => (result ? buildRevenueMarkdownReport(result, { outcomeSummary }) : ""),
    [outcomeSummary, result]
  );
  const activeSignal =
    result?.revenueSignals.find((signal) => signal.id === activeSignalId) ??
    result?.revenueSignals[0] ??
    null;
  const priorityActions = revenueActions.slice(0, 3);
  const selectedDataset =
    demoDatasets.find((dataset) => dataset.id === selectedDatasetId) ?? demoDatasets[0];
  const revenueAtRisk = useMemo(
    () =>
      result?.leadRescueOpportunities.reduce(
        (total, lead) => total + parseMoney(lead.potentialValue ?? lead.expectedValue),
        0
      ) ?? 0,
    [result]
  );

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const savedOutcomes = window.localStorage.getItem(actionOutcomesStorageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedWorkspace;
        const savedResult = isCompatibleAnalysisResult(parsed.result) ? parsed.result : null;
        setInput(parsed.input ?? emptyInput);
        setResult(savedResult);
        setSelectedDatasetId(parsed.selectedDatasetId ?? demoDatasets[0].id);
        setOutputLanguage(parsed.outputLanguage ?? parsed.input?.outputLanguage ?? "en");
        setActiveSignalId(savedResult?.revenueSignals[0]?.id ?? null);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    if (savedOutcomes) {
      try {
        setActionOutcomes(JSON.parse(savedOutcomes) as ActionOutcome[]);
      } catch {
        window.localStorage.removeItem(actionOutcomesStorageKey);
      }
    }

    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ input, outputLanguage, result, selectedDatasetId })
    );
  }, [hasLoadedStorage, input, outputLanguage, result, selectedDatasetId]);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    window.localStorage.setItem(actionOutcomesStorageKey, JSON.stringify(actionOutcomes));
  }, [actionOutcomes, hasLoadedStorage]);

  function updateInput(field: keyof CustomerVoiceInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
  }

  function runAnalysis(nextInput = input) {
    const nextResult = analyzeRevenueSignals({ ...nextInput, outputLanguage });
    setInput({ ...nextInput, outputLanguage });
    setResult(nextResult);
    setActiveSignalId(nextResult.revenueSignals[0]?.id ?? null);
  }

  function loadSelectedDemoDataset() {
    const nextInput = {
      ...inputForDemoDataset(selectedDatasetId),
      outputLanguage
    };
    setInput(nextInput);
    runAnalysis(nextInput);
  }

  function loadHotelDemoData() {
    setSelectedDatasetId("korean-summer-hotel");
    const nextInput = { ...hotelDemoInput, outputLanguage };
    setInput(nextInput);
    runAnalysis(nextInput);
  }

  function clearWorkspace() {
    setInput({ ...emptyInput, outputLanguage });
    setResult(null);
    setActiveSignalId(null);
    setCopiedId(null);
    setActionOutcomes([]);
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(actionOutcomesStorageKey);
  }

  async function copyText(value: string, id: string) {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1600);
  }

  async function copyActionMessage(action: RevenueAction) {
    await copyText(action.suggestedMessage ?? action.recommendedAction, action.id);
    recordOutcome(action.id, "copied");
  }

  function recordOutcome(actionId: string, status: Exclude<ActionStatus, "ready">) {
    setActionOutcomes((current) =>
      mergeActionOutcome(current, {
        actionId,
        status,
        timestamp: new Date().toISOString()
      })
    );
  }

  function changeOutputLanguage(value: SupportedLanguage) {
    setOutputLanguage(value);

    if (result) {
      runAnalysis({ ...input, outputLanguage: value });
    } else {
      setInput((current) => ({ ...current, outputLanguage: value }));
    }
  }

  function downloadMarkdown() {
    if (!result) {
      return;
    }

    downloadFile(
      `review-to-revenue-action-report-${new Date().toISOString().slice(0, 10)}.md`,
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
        <a className="revenue-brand" href="#actions" aria-label="Review-to-Revenue AI home">
          <span className="revenue-brand-mark">R</span>
          <span>Review-to-Revenue AI</span>
        </a>
        <nav className="revenue-nav" aria-label="Product sections">
          <a href="#actions">Actions</a>
          <a href="#signals">Signals</a>
          <a href="#input">Input</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#export">Export</a>
        </nav>
        <label className="language-control">
          <span>Output Language</span>
          <select
            onChange={(event) => changeOutputLanguage(event.target.value as SupportedLanguage)}
            value={outputLanguage}
          >
            <option value="en">English</option>
            <option value="ko">Korean</option>
          </select>
        </label>
      </header>

      <section className="revenue-hero action-hero" id="actions">
        <div className="hero-copy">
          <p className="revenue-eyebrow">Customer Voice → Revenue Action → Outcome Data</p>
          <h1>{outputLanguage === "ko" ? "이번 주 매출 액션" : "This Week’s Revenue Actions"}</h1>
          <p>
            Turn reviews, sales notes, and inquiries into follow-up messages, content ideas,
            and script improvements you can execute this week.
          </p>
          <p className="korean-helper">
            리뷰와 상담 메모에서 이번 주 바로 실행할 follow-up, 콘텐츠, 상담 스크립트 개선
            액션을 뽑아드립니다.
          </p>
          <div className="hero-actions">
            <button className="primary-action" disabled={!canAnalyze} onClick={() => runAnalysis()} type="button">
              Generate Revenue Actions
            </button>
            <button className="secondary-action" onClick={loadSelectedDemoDataset} type="button">
              Load Demo Dataset
            </button>
            <button className="ghost-action" onClick={clearWorkspace} type="button">
              Clear
            </button>
          </div>
        </div>

        <div className="hero-side-panel">
          {result?.demoLabel ? <span className="demo-badge">{result.demoLabel}</span> : null}
          <div className="metric-card-grid">
            <MetricCard label="Leads to Rescue" value={`${result?.leadRescueOpportunities.length ?? 0}`} />
            <MetricCard label="Actions Ready" value={`${revenueActions.filter((action) => action.status === "ready").length}`} />
            <MetricCard label="Revenue at Risk" value={formatCurrency(revenueAtRisk)} />
          </div>
          <p className="metric-note">
            Estimated from lead CSV potentialValue. Not guaranteed revenue.
          </p>
        </div>
      </section>

      {!result ? (
        <section className="section-band empty-revenue-state">
          <h2>No customer voice data yet</h2>
          <p>
            Paste reviews, competitor reviews, sales notes, or lead CSV to generate revenue
            actions. You can also load synthetic demo data to test the product experience.
          </p>
          <div className="signal-placeholder-grid" aria-label="Revenue action slots">
            {signalLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="workspace-actions">
            <button className="primary-action" onClick={loadSelectedDemoDataset} type="button">
              Load Demo Dataset
            </button>
            <a className="secondary-action" href="#input">
              Go to Input Workspace
            </a>
          </div>
        </section>
      ) : null}

      {result ? (
        <>
          <section className="section-band action-board" aria-label="Today's Priority Actions">
            <SectionHeader
              eyebrow="Today’s Priority Actions"
              title="Start with the actions most likely to recover revenue"
              text="Each card is a recommended sales, content, script, or competitor-positioning action with outcome tracking."
            />
            <div className="priority-action-grid">
              {priorityActions.map((action) => (
                <RevenueActionCard
                  action={action}
                  copiedId={copiedId}
                  key={action.id}
                  onCopy={copyActionMessage}
                  onStatus={recordOutcome}
                />
              ))}
            </div>
          </section>

          <section className="section-band outcome-band" id="outcomes">
            <SectionHeader
              eyebrow="Outcome Tracking"
              title="Track what happened after each revenue action"
              text="Track what happened after you used each revenue action. This helps identify which customer language patterns actually convert."
            />
            <div className="outcome-grid">
              <MetricCard label="Follow-ups copied" value={`${outcomeSummary.followupsCopied}`} />
              <MetricCard label="Follow-ups sent" value={`${outcomeSummary.followupsSent}`} />
              <MetricCard label="Replies recovered" value={`${outcomeSummary.repliesRecovered}`} />
              <MetricCard label="Bookings recovered" value={`${outcomeSummary.bookingsRecovered}`} />
              <MetricCard label="Won deals" value={`${outcomeSummary.wonDeals}`} />
              <MetricCard
                label="Estimated recovered revenue"
                value={formatCurrency(outcomeSummary.estimatedRecoveredRevenue)}
              />
            </div>
          </section>
        </>
      ) : null}

      <section className="section-band" id="input">
        <SectionHeader
          eyebrow="Input Workspace"
          title="Paste customer voice or load a synthetic demo dataset"
          text="All demo datasets are synthetic sample data. They are for workflow testing, not scraped real reviews."
        />
        <div className="dataset-panel">
          <label className="dataset-selector">
            <span>Select demo dataset</span>
            <select
              onChange={(event) => setSelectedDatasetId(event.target.value)}
              value={selectedDatasetId}
            >
              {demoDatasets.map((dataset) => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-action" onClick={loadSelectedDemoDataset} type="button">
            Load Demo Dataset
          </button>
          <button className="secondary-action" onClick={loadHotelDemoData} type="button">
            Load Hotel Demo Data
          </button>
          <span className="demo-badge">{selectedDataset.demoLabel}</span>
        </div>
        <div className="input-grid">
          <TextAreaField
            label="reviewsText"
            onChange={(value) => updateInput("reviewsText", value)}
            placeholder="Paste customer reviews, inquiries, DMs, or chat notes."
            value={input.reviewsText}
          />
          <TextAreaField
            label="competitorReviewsText"
            onChange={(value) => updateInput("competitorReviewsText", value)}
            placeholder="Paste competitor reviews or complaints."
            value={input.competitorReviewsText}
          />
          <TextAreaField
            label="salesNotesText"
            onChange={(value) => updateInput("salesNotesText", value)}
            placeholder="Paste sales notes line by line."
            value={input.salesNotesText}
          />
          <TextAreaField
            label="leadCsv"
            onChange={(value) => updateInput("leadCsv", value)}
            placeholder="name,channel,industry,interest,budget,lastContactDate,lastMessage,status,objection,urgency,potentialValue,notes"
            value={input.leadCsv}
          />
        </div>
        <div className="workspace-actions">
          <button className="primary-action" disabled={!canAnalyze} onClick={() => runAnalysis()} type="button">
            Analyze customer voice
          </button>
          <button className="ghost-action" onClick={clearWorkspace} type="button">
            Reset workspace
          </button>
        </div>
      </section>

      {result ? (
        <>
          <section className="section-band signal-band" id="signals" aria-label="Revenue signals">
            <SectionHeader
              eyebrow="Revenue Signal Cards"
              title="Signals explain why each action matters"
              text={result.summary}
            />
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
          </section>

          <section className="section-band" id="followups">
            <SectionHeader
              eyebrow="Follow-up Message Library"
              title="Messages with a reason to re-open the conversation"
              text="Each message ties back to a specific customer objection and includes a reason it should work."
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
              title="Publish assets that remove repeated buying friction"
              text="Each idea includes a hook, outline, target objection, and CTA."
            />
            <div className="content-grid">
              {result.contentIdeas.map((idea) => (
                <ContentCard copiedId={copiedId} idea={idea} key={idea.id} onCopy={copyText} />
              ))}
            </div>
          </section>

          <section className="section-band" id="scripts">
            <SectionHeader
              eyebrow="Sales Script Suggestions"
              title="Improve the line that leaks trust"
              text="Move from generic persuasion to objection-specific decision support."
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
              title="Revenue Action Report"
              text="Export the action board, message library, content ideas, script improvements, and outcome tracking summary."
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

function RevenueActionCard({
  action,
  copiedId,
  onCopy,
  onStatus
}: {
  action: RevenueAction;
  copiedId: string | null;
  onCopy: (action: RevenueAction) => Promise<void>;
  onStatus: (actionId: string, status: Exclude<ActionStatus, "ready">) => void;
}) {
  return (
    <article className={`revenue-action-card ${action.priority}`}>
      <div className="action-card-topline">
        <span>{action.type.replace("_", " ")}</span>
        <strong>{action.status}</strong>
      </div>
      <h3>{action.title}</h3>
      <p>{action.targetSegment}</p>
      <dl>
        <div>
          <dt>Why now</dt>
          <dd>{action.whyNow}</dd>
        </div>
        <div>
          <dt>Evidence</dt>
          <dd>{action.evidence[0]}</dd>
        </div>
        <div>
          <dt>Recommended action</dt>
          <dd>{action.recommendedAction}</dd>
        </div>
      </dl>
      <div className="action-button-row">
        <button className="secondary-action compact" onClick={() => onCopy(action)} type="button">
          {copiedId === action.id ? "Copied" : "Copy message"}
        </button>
        <button className="ghost-action compact" onClick={() => onStatus(action.id, "sent")} type="button">
          Mark as sent
        </button>
        <button className="ghost-action compact" onClick={() => onStatus(action.id, "replied")} type="button">
          Mark as replied
        </button>
        <button className="ghost-action compact" onClick={() => onStatus(action.id, "booked")} type="button">
          Mark as booked
        </button>
        <button className="ghost-action compact" onClick={() => onStatus(action.id, "won")} type="button">
          Mark as won
        </button>
        <button className="ghost-action compact" onClick={() => onStatus(action.id, "lost")} type="button">
          Mark as lost
        </button>
      </div>
    </article>
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
      <span className="turn-action">Turn into Action</span>
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
      <small>{message.whyThisWorks}</small>
      <small>{message.recommendedTiming}</small>
      <button className="secondary-action compact" onClick={() => onCopy(message.message, message.id)} type="button">
        {copiedId === message.id ? "Copied" : "Copy message"}
      </button>
    </article>
  );
}

function ContentCard({
  copiedId,
  idea,
  onCopy
}: {
  copiedId: string | null;
  idea: ContentIdea;
  onCopy: (value: string, id: string) => Promise<void>;
}) {
  return (
    <article className="content-card">
      <span>
        P{idea.priority} · {idea.format}
      </span>
      <h3>{idea.title}</h3>
      <p>{idea.hook}</p>
      <ul>
        {(idea.outline ?? ["No outline available"]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <small>{idea.whyItWillWork}</small>
      <strong>{idea.callToAction}</strong>
      <div className="action-button-row">
        <button className="secondary-action compact" onClick={() => onCopy(idea.hook, idea.id)} type="button">
          {copiedId === idea.id ? "Copied" : "Copy hook"}
        </button>
        <button className="ghost-action compact" type="button">
          Mark as planned
        </button>
        <button className="ghost-action compact" type="button">
          Mark as published
        </button>
      </div>
    </article>
  );
}

function ScriptSuggestionCard({ suggestion }: { suggestion: SalesScriptSuggestion }) {
  return (
    <article className="script-card">
      <span>{suggestion.situation}</span>
      <div className="script-lines">
        <p>
          <small>Problem</small>
          {suggestion.currentProblem}
        </p>
        <p>
          <small>Improve</small>
          {suggestion.improvedLine}
        </p>
      </div>
      <strong>{suggestion.whyItWorks}</strong>
      <small>{suggestion.exampleUseCase}</small>
    </article>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
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

function formatCurrency(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function isCompatibleAnalysisResult(value: AnalysisResult | null | undefined): value is AnalysisResult {
  return Boolean(
    value &&
      Array.isArray(value.revenueSignals) &&
      Array.isArray(value.revenueActions) &&
      Array.isArray(value.leadRescueOpportunities) &&
      Array.isArray(value.contentIdeas) &&
      value.contentIdeas.every((idea) => Array.isArray(idea.outline)) &&
      Array.isArray(value.followupMessages) &&
      Array.isArray(value.salesScriptSuggestions) &&
      Array.isArray(value.weeklyActionPlan)
  );
}
