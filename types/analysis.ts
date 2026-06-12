export type AnalysisMode = "traveler" | "business";

export type BusinessType =
  | "hotel"
  | "restaurant"
  | "cafe"
  | "guesthouse"
  | "other";

export type OutputLanguage = "ko" | "en";

export type RiskCategory = {
  category: string;
  severity: number;
  evidence: string[];
};

export type AnalysisReport = {
  detectedLanguage: string;
  obfuscationDetected: boolean;
  obfuscationType: string[];
  normalizedReview: string;
  naturalTranslation: string;
  nativeSpeakerMeaning: string;
  hiddenWarningSummary: string;
  riskCategories: RiskCategory[];
  severityScore: number;
  confidenceScore: number;
  evidencePhrases: string[];
  travelerAdvice: string;
  businessOwnerActions: string[];
  suggestedReplyDraft: string;
  limitations: string[];
};
