"use client";

import { useMemo, useState } from "react";
import type {
  AnalysisMode,
  AnalysisReport,
  BusinessType,
  OutputLanguage
} from "@/types/analysis";
import { reportToMarkdown } from "@/lib/export-markdown";

const exampleReviews = [
  {
    label: "Korean coded",
    businessType: "hotel" as BusinessType,
    outputLanguage: "ko" as OutputLanguage,
    text: "한국분들만 알아보게 쨕쪙하겠습니다. 이 숙쏘는 위치만 보고 예약하면 깨꼬생합니다. 빠퀴벌레 봤고 화장실도 뜨럽고 쩔때 오찌마세요."
  },
  {
    label: "Japanese subtle",
    businessType: "guesthouse" as BusinessType,
    outputLanguage: "ko" as OutputLanguage,
    text: "次はないかなと思いました。写真はきれいでしたが、部屋の清潔感に欠ける感じで、夜も少しうるさかったです。"
  },
  {
    label: "Chinese warning",
    businessType: "hotel" as BusinessType,
    outputLanguage: "en" as OutputLanguage,
    text: "避雷，别来。照片很好看但实际房间很旧，卫生间味道很重，不值这个价格。"
  },
  {
    label: "English trap",
    businessType: "restaurant" as BusinessType,
    outputLanguage: "en" as OutputLanguage,
    text: "It looked cute online, but it felt like a tourist trap. Overpriced food, sticky tables, and I would not go again."
  }
];

const valueCards = [
  {
    label: "Risk, not translation",
    title: "뜻보다 중요한 건 가도 되는지",
    text: "번역문을 읽는 데서 끝나지 않고 청결, 소음, 사진 차이, 가격 불만 같은 예약 리스크로 정리합니다."
  },
  {
    label: "Native warning",
    title: "직역하면 약해지는 회피 신호",
    text: "次はない, 避雷, 일부러 비튼 한글 후기처럼 원어민끼리 돌려 말하는 경고를 잡습니다."
  },
  {
    label: "Evidence",
    title: "근거 문장과 신뢰도 확인",
    text: "왜 위험하다고 보는지 원문 표현, severity, confidence를 함께 보여줘 과해석을 줄입니다."
  }
];

const sampleReview = exampleReviews[0].text;
type FeedbackVote = "accurate" | "overinterpreted" | "missed_signal" | "weak_action";

export default function Home() {
  const [reviewText, setReviewText] = useState(sampleReview);
  const [mode, setMode] = useState<AnalysisMode>("traveler");
  const [businessType, setBusinessType] = useState<BusinessType>("hotel");
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("ko");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState<FeedbackVote | null>(null);

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
      setFeedbackSaved(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
  }

  function loadExample(example: (typeof exampleReviews)[number]) {
    setReviewText(example.text);
    setBusinessType(example.businessType);
    setOutputLanguage(example.outputLanguage);
    setReport(null);
    setError("");
    setFeedbackSaved(null);
  }

  function downloadMarkdown() {
    if (!report) {
      return;
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `review-lens-report-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function saveFeedback(vote: FeedbackVote) {
    if (!report) {
      return;
    }

    const entry = {
      createdAt: new Date().toISOString(),
      vote,
      mode,
      businessType,
      outputLanguage,
      reviewText,
      reportSummary: {
        analysisSource: report.analysisSource ?? "local",
        detectedLanguage: report.detectedLanguage,
        severityScore: report.severityScore,
        confidenceScore: report.confidenceScore,
        evidencePhrases: report.evidencePhrases,
        hiddenWarningSummary: report.hiddenWarningSummary
      }
    };
    const key = "reviewLensFeedback.v1";
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];

    localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 50)));
    setFeedbackSaved(vote);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">L</span>
            <span>Review Lens</span>
          </div>
          <div className="topbar-actions">
            <a className="top-link" href="/sample-report">
              Sample report
            </a>
            <a className="top-link" href="/feedback">
              Feedback
            </a>
            <a className="top-link" href="/validation-kit">
              Validation
            </a>
            <div className="status">Booking risk decoder</div>
          </div>
        </div>
      </header>

      <div className="workspace">
        <section>
          <div className="intro">
            <p className="eyebrow">Hidden booking risk decoder</p>
            <h1>해외 숙소 리뷰, 번역해도 찜찜할 때</h1>
            <p>
              원어민만 알아보는 숨은 예약 위험을 뽑아드립니다. 번역문이 아니라
              청결, 소음, 사진 차이, 가격 불만 같은 실제 판단 기준으로 바꿉니다.
            </p>
          </div>

          <div className="value-strip">
            {valueCards.map((card) => (
              <div className="value-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </div>
            ))}
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
              <div className="example-tabs" aria-label="Example reviews">
                {exampleReviews.map((example) => (
                  <button
                    key={example.label}
                    onClick={() => loadExample(example)}
                    type="button"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
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
                <div className="result-actions">
                  <span className={`source-pill ${report.analysisSource ?? "local"}`}>
                    {sourceLabel(report)}
                  </span>
                  <button className="secondary" onClick={() => copyText(markdown)} type="button">
                    Copy Markdown
                  </button>
                  <button className="secondary" onClick={downloadMarkdown} type="button">
                    Download .md
                  </button>
                </div>
              </div>

              {report.confidenceScore < 55 ? (
                <div className="quality-warning">
                  Confidence is low. Treat this as a weak signal and compare more reviews
                  before making a decision.
                </div>
              ) : null}

              {report.severityScore >= 5 ? (
                <div className="severity-warning">
                  Strong hidden warning detected. Check the evidence phrases before acting.
                </div>
              ) : null}

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

                <div className="feedback-panel">
                  <div>
                    <span>Quality feedback</span>
                    <h2>이 해석이 맞았나요?</h2>
                    <p>
                      지금은 브라우저에만 저장됩니다. 실제 사용자 검증 전까지 어떤 결과가
                      과해석인지, 어떤 신호를 놓쳤는지 모으기 위한 임시 장치입니다.
                    </p>
                  </div>
                  <div className="feedback-actions">
                    <button onClick={() => saveFeedback("accurate")} type="button">
                      맞음
                    </button>
                    <button onClick={() => saveFeedback("overinterpreted")} type="button">
                      과해석
                    </button>
                    <button onClick={() => saveFeedback("missed_signal")} type="button">
                      신호 놓침
                    </button>
                    <button onClick={() => saveFeedback("weak_action")} type="button">
                      액션 약함
                    </button>
                  </div>
                  {feedbackSaved ? (
                    <div className="feedback-saved">
                      Saved: {feedbackLabel(feedbackSaved)}
                    </div>
                  ) : null}
                </div>

                <div className="b2b-cta">
                  <div>
                    <span>For hotel and guesthouse owners</span>
                    <h2>리뷰 30~100개로 이번 주 먼저 고칠 3가지를 뽑아드립니다</h2>
                    <p>
                      48시간 안에 외국어 리뷰의 예약 전환 방해 신호, 우선 수정 3가지,
                      답글 초안, 직원 체크리스트를 정리합니다. 1회 $49, 구독 없음.
                    </p>
                  </div>
                  <div className="b2b-actions">
                    <a className="primary-link" href="/sample-report">
                      샘플 리포트 보기
                    </a>
                    <a
                      className="secondary-link"
                      href="mailto:hello@example.com?subject=Review%20Lens%201-time%20report"
                    >
                      1회 리포트 문의
                    </a>
                  </div>
                </div>

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

function feedbackLabel(vote: FeedbackVote) {
  const labels: Record<FeedbackVote, string> = {
    accurate: "맞음",
    missed_signal: "신호 놓침",
    overinterpreted: "과해석",
    weak_action: "액션 약함"
  };

  return labels[vote];
}

function sourceLabel(report: AnalysisReport) {
  if (report.analysisSource === "ai") {
    return report.modelName ? `AI analyzer · ${report.modelName}` : "AI analyzer";
  }

  if (report.analysisSource === "ai_fallback") {
    return "AI fallback · local result";
  }

  return "Local analyzer";
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
