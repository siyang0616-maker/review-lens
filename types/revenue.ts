export type CustomerVoiceInput = {
  reviewsText: string;
  competitorReviewsText: string;
  salesNotesText: string;
  leadCsv: string;
};

export type RevenueSignalType =
  | "top_customer_objection"
  | "top_buying_trigger"
  | "leads_to_rescue"
  | "content_to_publish"
  | "script_to_improve"
  | "competitor_weakness";

export type UrgencyLevel = "low" | "medium" | "high";
export type ImpactLevel = "low" | "medium" | "high";

export type RevenueSignal = {
  id: string;
  type: RevenueSignalType;
  label: string;
  title: string;
  whyItMatters: string;
  evidenceSnippet: string;
  recommendedAction: string;
  confidenceScore: number;
  urgencyLevel: UrgencyLevel;
  impactLevel: ImpactLevel;
};

export type InsightCategory =
  | "pain_point"
  | "buying_trigger"
  | "objection"
  | "trust_barrier"
  | "competitor_weakness";

export type InsightItem = {
  id: string;
  category: InsightCategory;
  title: string;
  evidence: string[];
  explanation: string;
  recommendedAction: string;
  confidenceScore: number;
};

export type LeadRescueOpportunity = {
  id: string;
  leadName: string;
  context: string;
  rescueReason: string;
  recommendedMessage: string;
  score: number;
  urgencyLevel: UrgencyLevel;
  expectedValue: string;
  daysSinceLastContact?: number;
  tags: string[];
};

export type ContentIdea = {
  id: string;
  title: string;
  format: "blog" | "short_video" | "email" | "faq" | "sales_asset";
  hook: string;
  whyNow: string;
  sourceSignal: string;
  callToAction: string;
  priority: number;
};

export type FollowupScenario =
  | "family_discussion"
  | "price_pressure"
  | "brand_comparison"
  | "profit_clarity"
  | "proof_gap"
  | "slow_reply_recovery";

export type FollowupMessage = {
  id: string;
  scenario: FollowupScenario;
  title: string;
  targetLead: string;
  message: string;
  evidence: string;
  nextStep: string;
};

export type SalesScriptSuggestion = {
  id: string;
  situation: string;
  weakLine: string;
  improvedLine: string;
  whyItWorks: string;
  evidence: string;
};

export type WeeklyAction = {
  id: string;
  priority: number;
  action: string;
  owner: string;
  due: string;
  expectedOutcome: string;
  sourceSignalType: RevenueSignalType;
};

export type AnalysisResult = {
  generatedAt: string;
  summary: string;
  inputSummary: {
    reviewLines: number;
    competitorReviewLines: number;
    salesNoteLines: number;
    leadRows: number;
  };
  revenueSignals: RevenueSignal[];
  painPoints: InsightItem[];
  buyingTriggers: InsightItem[];
  objections: InsightItem[];
  trustBarriers: InsightItem[];
  competitorWeaknesses: InsightItem[];
  leadRescueOpportunities: LeadRescueOpportunity[];
  contentIdeas: ContentIdea[];
  followupMessages: FollowupMessage[];
  salesScriptSuggestions: SalesScriptSuggestion[];
  weeklyActionPlan: WeeklyAction[];
};
