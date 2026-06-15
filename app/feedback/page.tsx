"use client";

import { useEffect, useMemo, useState } from "react";

type FeedbackVote = "accurate" | "overinterpreted" | "missed_signal" | "weak_action";

type FeedbackEntry = {
  createdAt: string;
  vote: FeedbackVote;
  mode: string;
  businessType: string;
  outputLanguage: string;
  reviewText: string;
  reportSummary: {
    analysisSource: string;
    detectedLanguage: string;
    severityScore: number;
    confidenceScore: number;
    evidencePhrases: string[];
    hiddenWarningSummary: string;
  };
};

const storageKey = "reviewLensFeedback.v1";

const voteLabels: Record<FeedbackVote, string> = {
  accurate: "맞음",
  missed_signal: "신호 놓침",
  overinterpreted: "과해석",
  weak_action: "액션 약함"
};

export default function FeedbackPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    setEntries(readFeedback());
  }, []);

  const summary = useMemo(() => {
    return entries.reduce(
      (counts, entry) => {
        counts[entry.vote] += 1;
        return counts;
      },
      {
        accurate: 0,
        missed_signal: 0,
        overinterpreted: 0,
        weak_action: 0
      } satisfies Record<FeedbackVote, number>
    );
  }, [entries]);

  function exportJson() {
    downloadFile(
      "review-lens-feedback.json",
      JSON.stringify(entries, null, 2),
      "application/json;charset=utf-8"
    );
  }

  function exportCsv() {
    const header = [
      "createdAt",
      "vote",
      "mode",
      "businessType",
      "outputLanguage",
      "analysisSource",
      "detectedLanguage",
      "severityScore",
      "confidenceScore",
      "evidencePhrases",
      "hiddenWarningSummary",
      "reviewText"
    ];
    const rows = entries.map((entry) =>
      [
        entry.createdAt,
        voteLabels[entry.vote],
        entry.mode,
        entry.businessType,
        entry.outputLanguage,
        entry.reportSummary.analysisSource,
        entry.reportSummary.detectedLanguage,
        String(entry.reportSummary.severityScore),
        String(entry.reportSummary.confidenceScore),
        entry.reportSummary.evidencePhrases.join(" | "),
        entry.reportSummary.hiddenWarningSummary,
        entry.reviewText
      ].map(csvCell)
    );

    downloadFile(
      "review-lens-feedback.csv",
      [header.map(csvCell), ...rows].map((row) => row.join(",")).join("\n"),
      "text/csv;charset=utf-8"
    );
  }

  function clearFeedback() {
    localStorage.removeItem(storageKey);
    setEntries([]);
  }

  return (
    <main className="report-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand brand-link" href="/">
            <span className="brand-mark">L</span>
            <span>Review Lens</span>
          </a>
          <div className="topbar-actions">
            <a className="top-link" href="/">
              Analyzer
            </a>
            <a className="top-link" href="/sample-report">
              Sample report
            </a>
          </div>
        </div>
      </header>

      <section className="feedback-shell">
        <div className="feedback-hero">
          <div>
            <p className="eyebrow">Validation inbox</p>
            <h1>품질 피드백</h1>
            <p>
              분석 결과에서 누른 피드백을 이 브라우저에서 확인합니다. 배포 전 검증용
              임시 수집함이며, CSV나 JSON으로 내려받아 품질 리뷰에 반영할 수 있습니다.
            </p>
          </div>
          <div className="feedback-toolbar">
            <button className="secondary" disabled={entries.length === 0} onClick={exportCsv} type="button">
              Export CSV
            </button>
            <button className="secondary" disabled={entries.length === 0} onClick={exportJson} type="button">
              Export JSON
            </button>
            <button className="secondary danger" disabled={entries.length === 0} onClick={clearFeedback} type="button">
              Clear
            </button>
          </div>
        </div>

        <div className="feedback-metrics">
          <Metric label="Total" value={String(entries.length)} />
          <Metric label="맞음" value={String(summary.accurate)} />
          <Metric label="과해석" value={String(summary.overinterpreted)} />
          <Metric label="신호 놓침" value={String(summary.missed_signal)} />
          <Metric label="액션 약함" value={String(summary.weak_action)} />
        </div>

        {entries.length === 0 ? (
          <div className="feedback-empty">
            아직 저장된 피드백이 없습니다. Analyzer에서 리뷰를 분석한 뒤 결과 하단의
            품질 피드백 버튼을 눌러보세요.
          </div>
        ) : (
          <div className="feedback-list">
            {entries.map((entry) => (
              <article className="feedback-entry" key={`${entry.createdAt}-${entry.vote}`}>
                <div className="feedback-entry-head">
                  <div>
                    <span className={`feedback-vote ${entry.vote}`}>{voteLabels[entry.vote]}</span>
                    <strong>{entry.reportSummary.hiddenWarningSummary}</strong>
                  </div>
                  <time>{new Date(entry.createdAt).toLocaleString()}</time>
                </div>
                <div className="feedback-entry-meta">
                  <span>{entry.mode}</span>
                  <span>{entry.businessType}</span>
                  <span>{entry.reportSummary.analysisSource}</span>
                  <span>severity {entry.reportSummary.severityScore}/5</span>
                  <span>confidence {entry.reportSummary.confidenceScore}</span>
                </div>
                <div className="feedback-evidence">
                  {entry.reportSummary.evidencePhrases.map((phrase) => (
                    <span key={phrase}>{phrase}</span>
                  ))}
                </div>
                <p>{entry.reviewText}</p>
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

function readFeedback() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]") as FeedbackEntry[];
  } catch {
    return [];
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
