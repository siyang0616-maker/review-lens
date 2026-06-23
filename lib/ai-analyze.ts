import type { AnalysisReport } from "@/types/analysis";
import {
  analysisReportJsonSchema,
  analysisReportSchema,
  type AnalyzeRequest
} from "./analysis-schema";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.5";

type ResponsesApiResult = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

export async function analyzeReviewWithAi(
  input: AnalyzeRequest,
  localReport: AnalysisReport
): Promise<AnalysisReport | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: buildSystemPrompt(input.outputLanguage)
        },
        {
          role: "user",
          content: buildUserPrompt(input, localReport)
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "review_to_revenue_analysis",
          strict: true,
          schema: analysisReportJsonSchema
        }
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`OpenAI API request failed: ${response.status} ${errorBody.slice(0, 280)}`);
  }

  const result = (await response.json()) as ResponsesApiResult;
  const rawText = extractOutputText(result);

  if (!rawText) {
    throw new Error("OpenAI API response did not include output text.");
  }

  const parsedJson = JSON.parse(rawText) as unknown;
  const parsedReport = analysisReportSchema.parse(parsedJson);

  return parsedReport;
}

function buildSystemPrompt(outputLanguage: AnalyzeRequest["outputLanguage"]) {
  const languageInstruction =
    outputLanguage === "ko"
      ? "Write all user-facing fields in natural Korean."
      : "Write all user-facing fields in natural English.";

  return [
    "You are Review-to-Revenue AI, an expert customer-text analyst for B2B teams.",
    languageInstruction,
    "Your job is to interpret only the supplied customer text.",
    "Detect pain points, buying triggers, objections, trust barriers, competitor weaknesses, follow-up opportunities, content ideas, and sales script gaps.",
    "When reviews contain language nuance, intentional obfuscation, slang, sarcasm, or euphemism, explain the revenue implication rather than stopping at translation.",
    "Do not invent facts, locations, competitors, policies, or business details that are not present in the review.",
    "Evidence phrases must be short excerpts from the supplied review text only.",
    "Avoid nationality or ethnicity stereotypes. Describe text-pattern signals and buyer behavior, not what a nationality supposedly likes or dislikes.",
    "Suggested follow-ups and replies must be policy-safe: no incentives, no review manipulation, no promises of compensation, and no automated posting language.",
    "Return only JSON matching the schema."
  ].join("\n");
}

function buildUserPrompt(input: AnalyzeRequest, localReport: AnalysisReport) {
  return JSON.stringify(
    {
      task: "Analyze this pasted customer text for Review-to-Revenue AI.",
      mode: input.mode,
      businessType: input.businessType,
      outputLanguage: input.outputLanguage,
      reviewText: input.reviewText,
      localDictionaryPrecheck: {
        detectedLanguage: localReport.detectedLanguage,
        obfuscationDetected: localReport.obfuscationDetected,
        obfuscationType: localReport.obfuscationType,
        evidencePhrases: localReport.evidencePhrases,
        riskCategories: localReport.riskCategories,
        hiddenWarningSummary: localReport.hiddenWarningSummary
      },
      scoringRules: {
        severityScore: "1 means weak/no risk, 5 means urgent hidden warning or serious booking/visit risk.",
        confidenceScore:
          "Use lower confidence when there is only one weak phrase, unclear context, or likely over-interpretation."
      }
    },
    null,
    2
  );
}

function extractOutputText(result: ResponsesApiResult) {
  if (result.output_text) {
    return result.output_text;
  }

  return result.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .find((text): text is string => Boolean(text));
}
