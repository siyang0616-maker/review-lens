"use client";

import { useEffect, useMemo, useState } from "react";
import { actionOutcomesStorageKey } from "@/core/outcomes/actionOutcomes";
import type { ActionOutcome, ActionStatus, AnalysisResult } from "@/types/revenue";

type SavedWorkspace = {
  result?: AnalysisResult | null;
};

const workspaceStorageKey = "reviewToRevenueWorkspace.v1";
const trackedStatuses: Array<Exclude<ActionStatus, "ready">> = [
  "copied",
  "sent",
  "replied",
  "booked",
  "won",
  "lost",
  "ignored"
];

export default function OutcomesPage() {
  const [outcomes, setOutcomes] = useState<ActionOutcome[]>([]);
  const [actionTitles, setActionTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    setOutcomes(readActionOutcomes());
    setActionTitles(readActionTitles());
  }, []);

  const summary = useMemo(() => {
    return outcomes.reduce(
      (counts, outcome) => {
        counts[outcome.status] += 1;
        return counts;
      },
      Object.fromEntries(trackedStatuses.map((status) => [status, 0])) as Record<
        Exclude<ActionStatus, "ready">,
        number
      >
    );
  }, [outcomes]);

  function exportJson() {
    downloadFile(
      "review-to-revenue-action-outcomes.json",
      JSON.stringify(outcomes, null, 2),
      "application/json;charset=utf-8"
    );
  }

  function exportCsv() {
    const header = ["timestamp", "actionId", "actionTitle", "status", "note"];
    const rows = outcomes.map((outcome) =>
      [
        outcome.timestamp,
        outcome.actionId,
        actionTitles[outcome.actionId] ?? "",
        outcome.status,
        outcome.note ?? ""
      ].map(csvCell)
    );

    downloadFile(
      "review-to-revenue-action-outcomes.csv",
      [header.map(csvCell), ...rows].map((row) => row.join(",")).join("\n"),
      "text/csv;charset=utf-8"
    );
  }

  function clearOutcomes() {
    localStorage.removeItem(actionOutcomesStorageKey);
    setOutcomes([]);
  }

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
            <a className="top-link" href="/validation-kit">
              Validation
            </a>
          </div>
        </div>
      </header>

      <section className="feedback-shell">
        <div className="feedback-hero">
          <div>
            <p className="eyebrow">Outcome history</p>
            <h1>Revenue Action Outcomes</h1>
            <p>
              Local outcome events from the action board. Use this page to review which
              revenue actions were copied, sent, replied to, booked, won, or lost.
            </p>
          </div>
          <div className="feedback-toolbar">
            <button className="secondary" disabled={outcomes.length === 0} onClick={exportCsv} type="button">
              Export CSV
            </button>
            <button className="secondary" disabled={outcomes.length === 0} onClick={exportJson} type="button">
              Export JSON
            </button>
            <button className="secondary danger" disabled={outcomes.length === 0} onClick={clearOutcomes} type="button">
              Clear
            </button>
          </div>
        </div>

        <div className="feedback-metrics">
          <Metric label="Total" value={String(outcomes.length)} />
          <Metric label="Copied" value={String(summary.copied)} />
          <Metric label="Sent" value={String(summary.sent)} />
          <Metric label="Replies" value={String(summary.replied)} />
          <Metric label="Won" value={String(summary.won)} />
        </div>

        {outcomes.length === 0 ? (
          <div className="feedback-empty">
            No outcome events yet. Use the action board to copy a message or mark a
            revenue action as sent, replied, booked, won, or lost.
          </div>
        ) : (
          <div className="feedback-list">
            {outcomes.map((outcome) => (
              <article className="feedback-entry" key={`${outcome.actionId}-${outcome.timestamp}-${outcome.status}`}>
                <div className="feedback-entry-head">
                  <div>
                    <span className={`feedback-vote ${outcome.status}`}>{outcome.status}</span>
                    <strong>{actionTitles[outcome.actionId] ?? outcome.actionId}</strong>
                  </div>
                  <time>{new Date(outcome.timestamp).toLocaleString()}</time>
                </div>
                <div className="feedback-entry-meta">
                  <span>{outcome.actionId}</span>
                  <span>{outcome.status}</span>
                </div>
                {outcome.note ? <p>{outcome.note}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="feedback-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function readActionOutcomes() {
  try {
    return JSON.parse(localStorage.getItem(actionOutcomesStorageKey) ?? "[]") as ActionOutcome[];
  } catch {
    return [];
  }
}

function readActionTitles() {
  try {
    const saved = JSON.parse(localStorage.getItem(workspaceStorageKey) ?? "{}") as SavedWorkspace;
    const actions = saved.result?.revenueActions ?? [];

    return Object.fromEntries(actions.map((action) => [action.id, action.title]));
  } catch {
    return {};
  }
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

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
