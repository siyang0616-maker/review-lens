import { existsSync, readFileSync } from "node:fs";

const files = {
  roadmap: "ROADMAP.md",
  nextSteps: "NEXT_STEPS.md",
  qualityRuns: "AI_QUALITY_RUNS.md",
  qualityReview: "QUALITY_REVIEW.md",
  business: "BUSINESS_ANALYSIS.md",
  validationKit: "VALIDATION_KIT.md",
  expertPositioning: "EXPERT_POSITIONING.md"
};

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const context = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, read(path)])
);

const combined = Object.values(context).join("\n");
const aiQualityStatus =
  context.qualityRuns.match(/Current status:\s*(blocked|resolved)/i)?.[1]?.toLowerCase() ??
  "";
const quotaBlocked = aiQualityStatus
  ? aiQualityStatus === "blocked"
  : /insufficient_quota|quota blocked/i.test(context.qualityRuns);
const feedbackReady = /\/feedback|feedback capture|피드백 검토/i.test(combined);
const b2bDirection = /B2B|1회 리포트|one-time report|숙박업/i.test(combined);
const validationKitReady =
  existsSync("VALIDATION_KIT.md") && existsSync("app/validation-kit/page.tsx");

const blocked = [];
const next = [];

if (quotaBlocked) {
  blocked.push("Live AI quality review is blocked by OpenAI quota/billing.");
  next.push("Do not retry paid/live AI tests until quota is fixed.");
}

if (feedbackReady) {
  next.push("Use /feedback export flow to classify overinterpretation, missed signals, and weak actions.");
} else {
  next.push("Add a minimal feedback capture/review flow before broader user testing.");
}

if (b2bDirection) {
  if (validationKitReady) {
    next.push("Run the external validation kit with 3 travelers and 2 B2B candidates, then record exact reactions.");
  } else {
    next.push("Prepare an external validation kit: traveler questions, B2B questions, and one-time report offer.");
  }
}

if (!quotaBlocked) {
  next.unshift("Run RUN_AI_QUALITY=1 AI_QUALITY_LIMIT=3 npm run test:ai-quality.");
}

const output = [
  "Review Lens Operating Loop",
  "",
  "Blocked:",
  ...(blocked.length ? blocked.map((item) => `- ${item}`) : ["- None detected from docs."]),
  "",
  "Next unblocked actions:",
  ...next.map((item, index) => `${index + 1}. ${item}`),
  "",
  "Recommended Codex prompt:",
  "OPERATING_LOOP.md를 기준으로 Review Lens를 이어서 진행해줘. 막힌 일은 blocked로 두고, repo 안에서 할 수 있는 가장 높은 가치의 다음 작업을 골라 구현해. 끝나기 전에 npm run check를 실행하고 NEXT_STEPS.md와 ROADMAP.md를 업데이트해."
];

console.log(output.join("\n"));
