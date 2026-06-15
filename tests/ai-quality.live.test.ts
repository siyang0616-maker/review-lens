import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { analyzeReview } from "../lib/analyze";
import { analyzeReviewWithAi } from "../lib/ai-analyze";
import { analysisReportSchema } from "../lib/analysis-schema";
import { qualitySamples } from "./quality-samples";

loadEnvLocal();

const runLive = process.env.RUN_AI_QUALITY === "1";
const describeLive = runLive ? describe : describe.skip;
const sampleLimit = Number(process.env.AI_QUALITY_LIMIT ?? "10");

describeLive("live AI quality smoke test", () => {
  it(
    `returns valid AI reports for ${sampleLimit} samples`,
    async () => {
      const samples = qualitySamples.slice(0, sampleLimit);
      const results = [];

      for (const sample of samples) {
        const localReport = analyzeReview(sample.input);
        const aiReport = await analyzeReviewWithAi(sample.input, localReport);

        expect(aiReport).not.toBeNull();

        const parsed = analysisReportSchema.safeParse(aiReport);
        expect(parsed.success).toBe(true);

        results.push({
          id: sample.id,
          language: aiReport?.detectedLanguage,
          severity: aiReport?.severityScore,
          confidence: aiReport?.confidenceScore,
          evidenceCount: aiReport?.evidencePhrases.length
        });
      }

      console.table(results);
    },
    120000
  );
});

function loadEnvLocal() {
  if (!existsSync(".env.local")) {
    return;
  }

  const lines = readFileSync(".env.local", "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    if (!key || valueParts.length === 0) {
      continue;
    }

    process.env[key] = valueParts.join("=");
  }
}
