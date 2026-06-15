import { z } from "zod";

export const analyzeRequestSchema = z.object({
  reviewText: z.string().min(8).max(12000),
  mode: z.enum(["traveler", "business"]),
  businessType: z.enum(["hotel", "restaurant", "cafe", "guesthouse", "other"]),
  outputLanguage: z.enum(["ko", "en"])
});

export const riskCategorySchema = z.object({
  category: z.string().min(1),
  severity: z.number().int().min(1).max(5),
  evidence: z.array(z.string().min(1)).max(12)
});

export const analysisReportSchema = z.object({
  analysisSource: z.enum(["local", "ai", "ai_fallback"]).optional(),
  modelName: z.string().min(1).optional(),
  detectedLanguage: z.string().min(2).max(24),
  obfuscationDetected: z.boolean(),
  obfuscationType: z.array(z.string().min(1)).max(12),
  normalizedReview: z.string().min(1),
  naturalTranslation: z.string().min(1),
  nativeSpeakerMeaning: z.string().min(1),
  hiddenWarningSummary: z.string().min(1),
  riskCategories: z.array(riskCategorySchema).min(1).max(10),
  severityScore: z.number().int().min(1).max(5),
  confidenceScore: z.number().int().min(0).max(100),
  evidencePhrases: z.array(z.string().min(1)).max(16),
  travelerAdvice: z.string().min(1),
  businessOwnerActions: z.array(z.string().min(1)).min(1).max(8),
  suggestedReplyDraft: z.string().min(1),
  limitations: z.array(z.string().min(1)).min(1).max(8)
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export const analysisReportJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectedLanguage: {
      type: "string",
      description: "Detected review language code or short language label."
    },
    obfuscationDetected: {
      type: "boolean",
      description: "Whether intentional misspelling, phonetic writing, or native-only coded language was detected."
    },
    obfuscationType: {
      type: "array",
      items: { type: "string" },
      description: "Types such as phonetic_misspelling, slang, native_only_warning, sarcasm, euphemism."
    },
    normalizedReview: {
      type: "string",
      description: "The review rewritten into normal spelling while preserving meaning."
    },
    naturalTranslation: {
      type: "string",
      description: "A natural translation into the requested output language."
    },
    nativeSpeakerMeaning: {
      type: "string",
      description: "What a native speaker would understand beyond literal translation."
    },
    hiddenWarningSummary: {
      type: "string",
      description: "Concise summary of hidden warnings or lack of them."
    },
    riskCategories: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: { type: "string" },
          severity: { type: "integer", minimum: 1, maximum: 5 },
          evidence: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["category", "severity", "evidence"]
      }
    },
    severityScore: {
      type: "integer",
      minimum: 1,
      maximum: 5
    },
    confidenceScore: {
      type: "integer",
      minimum: 0,
      maximum: 100
    },
    evidencePhrases: {
      type: "array",
      items: { type: "string" },
      description: "Short phrases copied only from the supplied review text."
    },
    travelerAdvice: {
      type: "string",
      description: "Practical traveler advice before booking or visiting."
    },
    businessOwnerActions: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: { type: "string" },
      description: "Concrete action items a hotel, restaurant, cafe, or guesthouse owner can take."
    },
    suggestedReplyDraft: {
      type: "string",
      description: "Policy-safe reply draft. Do not promise incentives or ask for review manipulation."
    },
    limitations: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: { type: "string" }
    }
  },
  required: [
    "detectedLanguage",
    "obfuscationDetected",
    "obfuscationType",
    "normalizedReview",
    "naturalTranslation",
    "nativeSpeakerMeaning",
    "hiddenWarningSummary",
    "riskCategories",
    "severityScore",
    "confidenceScore",
    "evidencePhrases",
    "travelerAdvice",
    "businessOwnerActions",
    "suggestedReplyDraft",
    "limitations"
  ]
} as const;
