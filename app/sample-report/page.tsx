const languageSignals = [
  {
    language: "Korean",
    signal: "한국분들은 굳이",
    meaning: "가격 대비 만족도와 실제 객실 상태에 대한 완곡하지만 강한 비추천",
    risk: "High",
    action: "실제 객실 사진, 엘리베이터 유무, 욕실 상태를 예약 전 안내에 명확히 표시"
  },
  {
    language: "Japanese",
    signal: "次はないかな",
    meaning: "정중하지만 재방문 의사가 낮다는 표현",
    risk: "Medium",
    action: "청결, 소음, 체크인 설명 부족을 조용히 개선할 수 있는 체크리스트 운영"
  },
  {
    language: "Chinese",
    signal: "避雷 / 踩雷",
    meaning: "다른 여행자에게 피하라고 알리는 강한 회피 경고",
    risk: "High",
    action: "사진과 실제 시설 차이, 냄새, 가격 포함 사항을 우선 점검"
  },
  {
    language: "English",
    signal: "tourist trap",
    meaning: "관광객 대상 가격/가치 불만과 신뢰 저하 신호",
    risk: "Medium",
    action: "가격 투명성, 포함 사항, 주변 교통/위치 설명을 더 구체화"
  }
];

const quickFixes = [
  "예약 페이지에 엘리베이터 없음, 도로변 소음 가능성, 욕실 크기를 숨기지 말고 선명하게 안내",
  "체크인 메시지에 조용한 객실 요청 가능 여부와 조식 혼잡 시간 안내 추가",
  "하우스키핑 체크리스트에 욕실 냄새, 침구 얼룩, 바닥 먼지 항목을 별도 분리"
];

const staffChecklist = [
  "체크인 시 소음에 민감한 고객에게 안쪽 객실 가능 여부를 먼저 안내",
  "오후 3시 이전 욕실 냄새와 배수구 상태 재점검",
  "외국어 리뷰에서 반복되는 표현을 주간 회의에서 5분만 공유",
  "사진과 실제 시설 차이를 줄이기 위해 낡은 객실 사진을 최신 이미지로 교체 요청",
  "부정 리뷰 답글은 방어보다 인정, 확인 중인 조치, 재발 방지 순서로 작성"
];

const sevenDayPlan = [
  { day: "Day 1", task: "최근 90일 1~3점 리뷰에서 청결, 소음, 가격 표현만 분리" },
  { day: "Day 2", task: "예약 페이지와 Google Business Profile의 시설 설명 업데이트" },
  { day: "Day 3", task: "하우스키핑 점검표에 욕실 냄새와 침구 상태 항목 추가" },
  { day: "Day 4", task: "체크인 안내 메시지를 한국어/영어/일본어로 간단히 정리" },
  { day: "Day 5", task: "낮은 평점 리뷰 5개에 정책 안전 답글 작성" },
  { day: "Day 6", task: "직원에게 반복 표현과 개선 액션 공유" },
  { day: "Day 7", task: "새 리뷰에서 같은 표현이 줄었는지 확인" }
];

export default function SampleReportPage() {
  return (
    <main className="report-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand brand-link" href="/">
            <span className="brand-mark">L</span>
            <span>Review Lens</span>
          </a>
          <a className="top-link" href="/">
            Analyzer
          </a>
          <a className="top-link" href="/feedback">
            Feedback
          </a>
        </div>
      </header>

      <section className="report-hero">
        <div>
          <p className="eyebrow">Sample B2B report</p>
          <h1>외국어 리뷰 속 숨은 불만 리포트</h1>
          <p>
            부티크 호텔과 게스트하우스 운영자를 위한 주간 리뷰 리스크 샘플입니다.
            번역만으로 놓치기 쉬운 언어권별 경고 표현을 운영 액션으로 바꿉니다.
          </p>
        </div>
        <div className="report-summary">
          <div>
            <span>Review window</span>
            <strong>Last 90 days</strong>
          </div>
          <div>
            <span>Hidden risk</span>
            <strong>High</strong>
          </div>
          <div>
            <span>Priority</span>
            <strong>Cleanliness, noise, value</strong>
          </div>
        </div>
      </section>

      <section className="report-band">
        <div className="metric-grid">
          <Metric label="Severity" value="5/5" note="강한 회피 경고 포함" />
          <Metric label="Confidence" value="82" note="여러 언어권에서 반복" />
          <Metric label="Revenue risk" value="High" note="예약 전환 저해 가능" />
          <Metric label="Owner action" value="3 fixes" note="오늘 바로 실행" />
        </div>
      </section>

      <section className="offer-strip">
        <div>
          <p className="eyebrow">Pilot offer</p>
          <h2>1회 외국어 리뷰 리스크 리포트</h2>
          <p>
            리뷰 30~100개를 붙여넣어 보내주면 숨은 경고, 반복 불만, 우선 개선 3가지,
            답글 초안, 직원 체크리스트를 정리합니다.
          </p>
        </div>
        <div className="offer-price">
          <span>Test price</span>
          <strong>$49</strong>
          <p>초기 검증용 1회 리포트</p>
        </div>
      </section>

      <section className="report-layout">
        <div className="report-main">
          <ReportSection title="Executive Diagnosis">
            <p>
              위치와 가격 접근성은 장점으로 보이지만, 외국어 리뷰에서는 객실 청결,
              사진과 실제 시설 차이, 소음, 엘리베이터 없음에 대한 숨은 경고가 반복됩니다.
              특히 한국어와 중국어 리뷰에서는 같은 언어권 여행자에게 예약 전 주의를 주는
              표현이 감지됩니다.
            </p>
          </ReportSection>

          <ReportSection title="Language Signal Breakdown">
            <div className="signal-table">
              {languageSignals.map((item) => (
                <div className="signal-row" key={item.language}>
                  <div>
                    <span className="signal-language">{item.language}</span>
                    <strong>{item.signal}</strong>
                  </div>
                  <p>{item.meaning}</p>
                  <span className={`risk-badge ${item.risk.toLowerCase()}`}>{item.risk}</span>
                  <p>{item.action}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="Today’s 3 Fixes">
            <ol className="action-list">
              {quickFixes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </ReportSection>

          <ReportSection title="Suggested Reply Draft">
            <div className="reply-draft">
              소중한 의견을 남겨주셔서 감사합니다. 말씀해주신 객실 상태와 안내 내용의
              차이를 가볍게 보지 않고 있습니다. 현재 객실 사진, 시설 안내, 하우스키핑
              점검표를 다시 확인하고 있으며, 예약 전 고객이 실제 상태를 더 명확히 알 수
              있도록 안내를 보완하겠습니다.
            </div>
          </ReportSection>
        </div>

        <aside className="report-side">
          <div className="side-panel">
            <h2>Staff Checklist</h2>
            <ul>
              {staffChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="side-panel">
            <h2>Next 7 Days</h2>
            <div className="timeline">
              {sevenDayPlan.map((item) => (
                <div className="timeline-item" key={item.day}>
                  <span>{item.day}</span>
                  <p>{item.task}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </div>
  );
}

function ReportSection({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="report-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
