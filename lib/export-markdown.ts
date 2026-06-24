import type { AnalysisReport } from "@/types/analysis";

export function reportToMarkdown(report: AnalysisReport) {
  const risks = report.riskCategories
    .map(
      (risk) =>
        `- ${risk.category} (severity ${risk.severity}/5): ${risk.evidence.join(", ")}`
    )
    .join("\n");
  const actions = report.businessOwnerActions.map((action) => `- ${action}`).join("\n");
  const limitations = report.limitations.map((item) => `- ${item}`).join("\n");

  return `# Review-to-Revenue Action Report

## Executive Summary

${report.hiddenWarningSummary}

## Customer Meaning

${report.nativeSpeakerMeaning}

## Normalized Review

${report.normalizedReview}

## Natural Translation

${report.naturalTranslation}

## Revenue Risk Categories

${risks}

## Buyer-Side Advice

${report.travelerAdvice}

## This Week's Revenue Actions

${actions}

## Follow-Up Message Draft

${report.suggestedReplyDraft}

## Scores

- Severity: ${report.severityScore}/5
- Confidence: ${report.confidenceScore}/100
- Obfuscation detected: ${report.obfuscationDetected ? "yes" : "no"}

## Evidence Phrases

${report.evidencePhrases.map((phrase) => `- ${phrase}`).join("\n")}

## Limitations

${limitations}
`;
}
