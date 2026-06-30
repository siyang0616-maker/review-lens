"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LeakDiagnosticSample } from "@/shared/leakDiagnosticSample";

type LandingPageClientProps = {
  sample: LeakDiagnosticSample;
};

const emailHref =
  "mailto:hello@example.com?subject=%EB%AC%B4%EB%A3%8C%20Revenue%20Leak%20%EC%A7%84%EB%8B%A8%20%EC%8B%A0%EC%B2%AD";
const smsHref =
  "sms:?&body=%EB%AC%B4%EB%A3%8C%20Revenue%20Leak%20%EC%A7%84%EB%8B%A8%EC%9D%84%20%EB%AC%B8%EC%9D%98%ED%95%A9%EB%8B%88%EB%8B%A4.";

export default function LandingPageClient({ sample }: LandingPageClientProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const [displayScore, setDisplayScore] = useState(0);
  const circumference = 2 * Math.PI * 80;
  const scorePercent = (displayScore / sample.snapshot.scoreMax) * 100;
  const dashOffset = circumference - (circumference * scorePercent) / 100;

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;

    function animateGauge() {
      if (hasAnimatedRef.current) {
        return;
      }

      hasAnimatedRef.current = true;

      if (prefersReducedMotion) {
        setDisplayScore(sample.snapshot.score);
        return;
      }

      const duration = 1300;
      const start = performance.now();

      function tick(now: number) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(sample.snapshot.score * eased));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(tick);
        }
      }

      frameId = window.requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      animateGauge();
      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateGauge();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(panel);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [sample.snapshot.score, sample.snapshot.scoreMax]);

  const metrics = [
    {
      label: sample.snapshot.leadsToRescueLabel,
      note: sample.snapshot.leadsToRescueNote,
      value: `${sample.snapshot.leadsToRescue}명`
    },
    {
      label: "Recommended Actions",
      note: sample.snapshot.recommendedActionNote,
      value: `${sample.snapshot.recommendedActionCount}개`
    },
    {
      label: "Fastest Win",
      note: "가장 빠르게 회복 가능한 리드 유형",
      value: sample.snapshot.fastestWin
    }
  ];

  return (
    <main className="landing-shell">
      <nav className="landing-topbar" aria-label="Revenue Leak Diagnostic">
        <a className="landing-mark" href="#top" aria-label="매출 누수 진단 랜딩 상단으로 이동">
          <strong>매출 누수</strong> 진단 노트
        </a>
      </nav>

      <header className="landing-hero" id="top">
        <div className="landing-hero-grain" aria-hidden="true" />
        <div className="landing-wrap landing-hero-inner">
          <p className="landing-eyebrow">{sample.marketing.eyebrow}</p>
          <h1>
            {sample.marketing.headlineBefore}
            <br />
            <em>{sample.marketing.headlineEmphasis}</em> {sample.marketing.headlineAfter}
          </h1>
          <p className="landing-subcopy">{sample.marketing.subcopy}</p>
          <div className="landing-hero-actions">
            <a className="landing-button landing-button-primary" href={emailHref}>
              무료 진단 신청하기
            </a>
            <a className="landing-button landing-button-ghost" href="/sample-report">
              실제 샘플 먼저 보기
            </a>
          </div>
          <p className="landing-hero-note">{sample.marketing.heroNote}</p>
        </div>
        <div className="landing-scroll-cue" aria-hidden="true">
          <span>SCROLL</span>
          <span className="landing-scroll-line" />
        </div>
      </header>

      <section className="landing-clarify">
        <div className="landing-wrap">
          <SectionLabel number="00">먼저 분명히 할 것</SectionLabel>
          <h2 className="landing-section-title">
            이건 또 하나의 분석 툴이 아닙니다. 진단에 가깝습니다.
          </h2>
          <div className="landing-clarify-grid">
            <div className="landing-clarify-col landing-clarify-no">
              <h3>이런 게 아닙니다</h3>
              <ul>
                {sample.marketing.clarifyNo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="landing-clarify-col landing-clarify-yes">
              <h3>이렇게 작동합니다</h3>
              <ul>
                {sample.marketing.clarifyYes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-diagnostic" id="sample">
        <div className="landing-wrap">
          <div className="landing-diag-intro">
            <div>
              <SectionLabel number="01">진단 결과 예시</SectionLabel>
              <h2 className="landing-section-title">
                상담 메모를 넣으면 이런 결과가 나옵니다.
              </h2>
            </div>
            <p>
              {sample.sampleTarget}의 상담 메모를 익명 처리해 분석한 샘플입니다. 받게 되는
              진단도 같은 구조로 정리됩니다.
            </p>
          </div>

          <div className="landing-diag-panel" ref={panelRef}>
            <div className="landing-diag-panel-head">
              <span>Sample · Revenue Leak Diagnostic</span>
              <div aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="landing-diag-grid">
              <div className="landing-gauge-wrap">
                <div className="landing-gauge" aria-label={`${sample.snapshot.scoreLabel} ${sample.snapshot.score}`}>
                  <svg height="200" viewBox="0 0 200 200" width="200" aria-hidden="true">
                    <circle className="landing-gauge-bg" cx="100" cy="100" r="80" />
                    <circle
                      className="landing-gauge-fill"
                      cx="100"
                      cy="100"
                      r="80"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: dashOffset
                      }}
                    />
                  </svg>
                  <div className="landing-gauge-num">
                    <span>{displayScore}</span>
                    <small>
                      REVENUE LEAK
                      <br />
                      SCORE / {sample.snapshot.scoreMax}
                    </small>
                  </div>
                </div>
              </div>
              <div className="landing-diag-metrics">
                {metrics.map((metric) => (
                  <article className="landing-metric-card" key={metric.label}>
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <p>{metric.note}</p>
                  </article>
                ))}
              </div>
              <div className="landing-objection">
                <span aria-hidden="true">"</span>
                <div>
                  <blockquote>{sample.snapshot.topObjection}</blockquote>
                  <p>TOP OBJECTION · 반복 구매 반박</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-leaks">
        <div className="landing-wrap">
          <SectionLabel number="02">발견한 누수 지점</SectionLabel>
          <h2 className="landing-section-title">점수보다 중요한 건 어디서 새는지입니다.</h2>

          <div className="landing-leak-list">
            {sample.leaks.map((leak, index) => (
              <article className="landing-leak-item" key={leak.title}>
                <span className="landing-leak-num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{leak.title}</h3>
                  <p className="landing-leak-evidence">"{leak.evidence[1] ?? leak.evidence[0]}"</p>
                  <p className="landing-leak-action">
                    <span aria-hidden="true">→</span>
                    {leak.actionSummary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-how" id="how">
        <div className="landing-wrap">
          <SectionLabel number="03">받는 방법</SectionLabel>
          <h2 className="landing-section-title">3단계, 아무 설치 없이 끝납니다.</h2>

          <div className="landing-how-steps">
            {sample.marketing.howSteps.map((step, index) => (
              <article className="landing-step" key={step.title}>
                <span className="landing-step-line" aria-hidden="true" />
                <span className="landing-step-no">STEP {String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

          <div className="landing-privacy-strip" aria-label="개인정보 불필요 안내">
            {sample.marketing.privacyPills.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-final">
        <div className="landing-wrap landing-final-inner">
          <SectionLabel number="04">지금 시작</SectionLabel>
          <h2>{sample.marketing.finalTitle}</h2>
          <p>{sample.marketing.finalBody}</p>
          <div className="landing-final-actions">
            <a className="landing-button landing-button-primary" href={emailHref}>
              이메일로 보내기
            </a>
            <a className="landing-button landing-button-ghost" href={smsHref}>
              문자로 문의하기
            </a>
          </div>
          <p className="landing-final-note">
            받은 메모는 진단 후 즉시 폐기합니다. 별도 저장이나 재사용은 하지 않습니다.
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-wrap">
          <span>
            <strong>매출 누수</strong> 진단 노트 · Revenue Leak Diagnostic
          </span>
          <span>{sample.samplePurpose}</span>
        </div>
      </footer>
    </main>
  );
}

function SectionLabel({ children, number }: { children: ReactNode; number: string }) {
  return (
    <p className="landing-section-label">
      <span>{number}</span> {children}
    </p>
  );
}
