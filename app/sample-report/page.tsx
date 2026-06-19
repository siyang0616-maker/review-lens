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

const proofPoints = [
  {
    metric: "47 reviews",
    label: "sample range",
    note: "최근 90일 외국어/저평점 리뷰를 묶어 반복 신호만 추립니다."
  },
  {
    metric: "9 repeats",
    label: "hidden signals",
    note: "예약 회피, 사진 차이, 냄새, 소음 표현이 반복된 샘플입니다."
  },
  {
    metric: "3 fixes",
    label: "owner action",
    note: "리포트는 설명에서 끝나지 않고 오늘 고칠 항목으로 마무리합니다."
  }
];

const purchaseReasons = [
  "$49는 광고비가 아니라 예약 전 이탈을 부르는 문장 3개를 이번 주에 고치는 비용입니다. 객실 1박만 지켜도 회수됩니다.",
  "외국어 리뷰의 완곡한 불만은 평점보다 늦게 보입니다. 늦게 알아차리면 다음 예약 전환에서 손해가 납니다.",
  "직원에게 바로 공유할 체크리스트와 답글 초안까지 포함해 사장이 다시 정리할 시간을 줄입니다."
];

const evidenceRows = [
  {
    quote: "사진 보고 기대하면 실망할 수 있습니다",
    meaning: "사진과 실제 객실 차이를 예약 전 경고",
    action: "낡은 객실 사진 교체, 객실 크기와 창문 상태 명시"
  },
  {
    quote: "清潔感に欠ける",
    meaning: "정중하지만 청결 신뢰가 낮다는 표현",
    action: "욕실 냄새, 침구 얼룩, 바닥 먼지 점검 항목 분리"
  },
  {
    quote: "避雷 / 别来",
    meaning: "같은 언어권 여행자에게 피하라는 강한 신호",
    action: "사진 차이, 냄새, 가격 포함 사항을 예약 페이지 상단에 보완"
  }
];

const scopeRows = [
  {
    label: "Included",
    items: "리뷰 30~100개, 언어권별 위험표현, 우선수정 3개, OTA 문구 수정안, 답글 3개, 직원 체크리스트"
  },
  {
    label: "Not included",
    items: "리뷰 삭제, 별점 보장, 허위 리뷰 작성, 플랫폼 정책을 우회하는 자동 답글 게시"
  },
  {
    label: "Delivery",
    items: "48시간 내 2~3페이지 PDF/Markdown 리포트. 모든 판단에는 원문 근거와 confidence를 표시"
  }
];

const staffHandoffRows = [
  {
    problem: "사진보다 낡음",
    frontDesk: "예약 전 객실 타입별 실제 사진을 안내",
    housekeeping: "벽지, 침구, 욕실 노후 흔적 재점검",
    reply: "사진과 실제 안내를 보완하겠습니다"
  },
  {
    problem: "욕실 냄새",
    frontDesk: "입실 전 객실 변경 가능 여부 확인",
    housekeeping: "배수구, 환풍기, 수건 냄새 체크",
    reply: "욕실 상태를 다시 점검하고 조치하겠습니다"
  },
  {
    problem: "도로변 소음",
    frontDesk: "소음 민감 고객에게 안쪽 객실 우선 안내",
    housekeeping: "창문 잠금, 틈새, 귀마개 비치 확인",
    reply: "객실 위치 안내를 더 명확히 하겠습니다"
  }
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
          <a className="top-link" href="/validation-kit">
            Validation
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
            답글 초안, 직원 체크리스트를 정리합니다. 객실 1박보다 작은 비용으로
            예약 전 이탈을 부르는 문장부터 확인합니다.
          </p>
        </div>
        <div className="offer-price">
          <span>Pilot price</span>
          <strong>$49</strong>
          <p>48시간 내 2~3페이지 리포트</p>
          <a
            className="primary-link"
            href="mailto:hello@example.com?subject=Review%20Lens%20Pilot%20Report"
          >
            파일럿 문의
          </a>
        </div>
      </section>

      <section className="report-band">
        <div className="proof-grid">
          {proofPoints.map((point) => (
            <div className="proof-card" key={point.metric}>
              <span>{point.label}</span>
              <strong>{point.metric}</strong>
              <p>{point.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="report-layout">
        <div className="report-main">
          <ReportSection title="Why Owners Pay">
            <ul className="action-list">
              {purchaseReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </ReportSection>

          <ReportSection title="Evidence Behind This Sample">
            <div className="evidence-table">
              {evidenceRows.map((item) => (
                <div className="evidence-row" key={item.quote}>
                  <strong>{item.quote}</strong>
                  <p>{item.meaning}</p>
                  <p>{item.action}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          <ReportSection title="What The $49 Pilot Includes">
            <div className="scope-grid">
              {scopeRows.map((row) => (
                <div className="scope-row" key={row.label}>
                  <span>{row.label}</span>
                  <p>{row.items}</p>
                </div>
              ))}
            </div>
          </ReportSection>

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

          <ReportSection title="Staff Handoff Table">
            <div className="handoff-table">
              {staffHandoffRows.map((row) => (
                <div className="handoff-row" key={row.problem}>
                  <strong>{row.problem}</strong>
                  <p>{row.frontDesk}</p>
                  <p>{row.housekeeping}</p>
                  <p>{row.reply}</p>
                </div>
              ))}
            </div>
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
