"use client";

import { useMemo, useState } from "react";
import type {
  AnalysisMode,
  AnalysisReport,
  BusinessType,
  OutputLanguage
} from "@/types/analysis";
import { reportToMarkdown } from "@/lib/export-markdown";

const sampleReview =
  "한국분들만 알아보게 쨕쪙하겠습니다. 이 숙쏘는 위치만 보고 예약하면 깨꼬생합니다. 빠퀴벌레 봤고 화장실도 뜨럽고 쩔때 오찌마세요.";

export default function Home() {
  const [reviewText, setReviewText] = useState(sampleReview);
  const [mode, setMode] = useState<AnalysisMode>("traveler");
  const [businessType, setBusinessType] = useState<BusinessType>("hotel");
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("ko");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const markdown = useMemo(() => (report ? reportToMarkdown(report) : ""), [report]);

  async function handleAnalyze() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reviewText,
          mode,
          businessType,
          outputLanguage
        })
      });

      if (!response.ok) {
        throw new Error("분석 요청을 처리하지 못했습니다.");
      }

      const nextReport = (await response.json()) as AnalysisReport;
      setReport(nextReport);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">L</span>
            <span>Review Lens</span>
          </div>
          <div className="status">Paste-first MVP</div>
        </div>
      </header>

      <div className="workspace">
        <section>
          <div className="intro">
            <p className="eyebrow">Native-coded review decoder</p>
            <h1>번역기가 놓치는 리뷰의 진짜 뜻</h1>
            <p>
              해외 숙소와 음식점 리뷰 속 숨은 경고, 발음 기반 오탈자, 은어,
              완곡한 비추천을 복원해서 여행자 조언과 사업자 액션으로 바꿉니다.
            </p>
          </div>

          <div className="panel">
            <div className="field">
              <span className="field-label">Mode</span>
              <div className="segmented" aria-label="Analysis mode">
                <button
                  className={mode === "traveler" ? "active" : ""}
                  onClick={() => setMode("traveler")}
                  type="button"
                >
                  Traveler
                </button>
                <button
                  className={mode === "business" ? "active" : ""}
                  onClick={() => setMode("business")}
                  type="button"
                >
                  Business
                </button>
              </div>
            </div>

            <div className="control-grid">
              <div className="field">
                <label htmlFor="businessType">Business type</label>
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(event) => setBusinessType(event.target.value as BusinessType)}
                >
                  <option value="hotel">Hotel</option>
                  <option value="guesthouse">Guesthouse</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="outputLanguage">Output</label>
                <select
                  id="outputLanguage"
                  value={outputLanguage}
                  onChange={(event) => setOutputLanguage(event.target.value as OutputLanguage)}
                >
                  <option value="ko">Korean</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="reviewText">Review text</label>
              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                placeholder="Paste one or more reviews..."
              />
            </div>

            <div className="actions">
              <button
                className="primary"
                disabled={isLoading || reviewText.trim().length < 8}
                onClick={handleAnalyze}
                type="button"
              >
                {isLoading ? "Analyzing..." : "Analyze Review"}
              </button>
              <button className="secondary" onClick={() => setReviewText(sampleReview)} type="button">
                Sample
              </button>
            </div>

            {error ? <div className="error">{error}</div> : null}
            <div className="hint">
              MVP는 붙여넣기 텍스트만 분석합니다. Google 리뷰를 수집하거나 자동 답글을
              게시하지 않습니다.
            </div>
          </div>
        </section>

        <section className="result-panel">
          {!report ? (
            <div className="empty">
              리뷰를 붙여넣고 분석하면 원문, 정상화 문장, 숨은 의미, 위험 카테고리,
              여행자 조언, 사업자 액션이 여기에 표시됩니다.
            </div>
          ) : (
            <>
              <div className="result-header">
                <div>
                  <p className="result-title">Hidden Signal Report</p>
                  <div className="result-meta">
                    Language {report.detectedLanguage} · Evidence {report.evidencePhrases.length}
                  </div>
                </div>
                <button className="secondary" onClick={() => copyText(markdown)} type="button">
                  Copy Markdown
                </button>
              </div>

              <div className="score-row">
                <div className="score">
                  <div className="score-label">Severity</div>
                  <div className="score-value">{report.severityScore}/5</div>
                </div>
                <div className="score">
                  <div className="score-label">Confidence</div>
                  <div className="score-value">{report.confidenceScore}</div>
                </div>
                <div className="score">
                  <div className="score-label">Obfuscation</div>
                  <div className="score-value">{report.obfuscationDetected ? "Yes" : "No"}</div>
                </div>
              </div>

              <div className="sections">
                <ReportSection title="Hidden warning summary" value={report.hiddenWarningSummary} />
                <ReportSection title="Native-speaker meaning" value={report.nativeSpeakerMeaning} />
                <ReportSection title="Normalized review" value={report.normalizedReview} />
                <ReportSection title="Natural translation" value={report.naturalTranslation} />

                <div className="section">
                  <div className="section-head">
                    <h2>Risk categories</h2>
                    <button
                      className="copy-button"
                      onClick={() => copyText(JSON.stringify(report.riskCategories, null, 2))}
                      type="button"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="risk-list">
                    {report.riskCategories.map((risk) => (
                      <div className="risk-item" key={risk.category}>
                        <div className="risk-top">
                          <span className="risk-category">{risk.category}</span>
                          <span className="risk-severity">{risk.severity}/5</span>
                        </div>
                        <div className="quote">{risk.evidence.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section">
                  <div className="section-head">
                    <h2>Evidence phrases</h2>
                    <button
                      className="copy-button"
                      onClick={() => copyText(report.evidencePhrases.join("\n"))}
                      type="button"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="chips">
                    {report.evidencePhrases.map((phrase) => (
                      <span className="chip" key={phrase}>
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>

                <ReportSection title="Traveler advice" value={report.travelerAdvice} />

                <div className="section">
                  <div className="section-head">
                    <h2>Business owner actions</h2>
                    <button
                      className="copy-button"
                      onClick={() => copyText(report.businessOwnerActions.join("\n"))}
                      type="button"
                    >
                      Copy
                    </button>
                  </div>
                  <ul>
                    {report.businessOwnerActions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>

                <ReportSection title="Suggested reply draft" value={report.suggestedReplyDraft} />

                <div className="section">
                  <div className="section-head">
                    <h2>Limitations</h2>
                  </div>
                  <ul>
                    {report.limitations.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function ReportSection({ title, value }: { title: string; value: string }) {
  async function copy() {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <button className="copy-button" onClick={copy} type="button">
          Copy
        </button>
      </div>
      <p>{value}</p>
    </div>
  );
}
