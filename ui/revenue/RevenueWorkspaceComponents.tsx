"use client";

import type {
  ActionStatus,
  ContentIdea,
  FollowupMessage,
  ImpactLevel,
  RevenueAction,
  RevenueSignal,
  SalesScriptSuggestion,
  UrgencyLevel
} from "@/types/revenue";

export type ContentIdeaStatus = "planned" | "published";

export function RevenueActionCard({
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

export function SignalCard({
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

export function SectionHeader({ eyebrow, text, title }: { eyebrow: string; text: string; title: string }) {
  return (
    <div className="section-header">
      <p className="revenue-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export function TextAreaField({
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

export function FollowupCard({
  copiedId,
  isSent,
  message,
  onCopy,
  onMarkSent
}: {
  copiedId: string | null;
  isSent: boolean;
  message: FollowupMessage;
  onCopy: (value: string, id: string) => Promise<void>;
  onMarkSent: (messageId: string) => void;
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
      <button className="ghost-action compact" onClick={() => onMarkSent(message.id)} type="button">
        {isSent ? "Sent" : "Mark as sent"}
      </button>
    </article>
  );
}

export function ContentCard({
  copiedId,
  idea,
  onCopy,
  onStatus,
  status
}: {
  copiedId: string | null;
  idea: ContentIdea;
  onCopy: (value: string, id: string) => Promise<void>;
  onStatus: (contentId: string, status: ContentIdeaStatus) => void;
  status: ContentIdeaStatus | "ready";
}) {
  return (
    <article className="content-card">
      <span>
        P{idea.priority} · {idea.format} · {status}
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
        <button className="ghost-action compact" onClick={() => onStatus(idea.id, "planned")} type="button">
          Mark as planned
        </button>
        <button className="ghost-action compact" onClick={() => onStatus(idea.id, "published")} type="button">
          Mark as published
        </button>
      </div>
    </article>
  );
}

export function ScriptSuggestionCard({ suggestion }: { suggestion: SalesScriptSuggestion }) {
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

export function MetricCard({ label, value }: { label: string; value: string }) {
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

function levelLabel(level: UrgencyLevel | ImpactLevel) {
  return level[0].toUpperCase() + level.slice(1);
}

function levelTone(level: UrgencyLevel | ImpactLevel): "green" | "amber" | "red" | "gray" {
  if (level === "high") return "red";
  if (level === "medium") return "amber";
  if (level === "low") return "gray";
  return "green";
}
