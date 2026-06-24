export type SupportedLanguage = "ko" | "en" | "ja" | "es";

export type EvidenceItem = {
  originalText: string;
  sourceLanguage: SupportedLanguage;
  translatedText?: string;
};

export type CustomerVoiceInput = {
  reviewsText: string;
  competitorReviewsText: string;
  salesNotesText: string;
  leadCsv: string;
  demoLabel?: string;
  outputLanguage?: SupportedLanguage;
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
  description: string;
  whyItMatters: string;
  evidence: string[];
  evidenceItems: EvidenceItem[];
  evidenceSnippet: string;
  recommendedAction: string;
  confidence: number;
  confidenceScore: number;
  urgency: UrgencyLevel;
  urgencyLevel: UrgencyLevel;
  impact: ImpactLevel;
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
  description: string;
  evidence: string[];
  explanation: string;
  recommendedAction: string;
  impact: ImpactLevel;
  confidenceScore: number;
};

export type LeadRescueOpportunity = {
  id: string;
  leadName: string;
  segment: string;
  status: string;
  context: string;
  likelyObjection: string;
  rescueReason: string;
  nextBestAction: string;
  suggestedMessage: string;
  recommendedMessage: string;
  score: number;
  urgency: UrgencyLevel;
  urgencyLevel: UrgencyLevel;
  potentialValue?: string;
  expectedValue: string;
  daysSinceLastContact?: number;
  tags: string[];
};

export type ContentIdea = {
  id: string;
  title: string;
  format:
    | "blog"
    | "shorts"
    | "instagram"
    | "email"
    | "landing"
    | "faq"
    | "short_video"
    | "sales_asset";
  angle: string;
  targetObjection: string;
  suggestedHook: string;
  hook: string;
  outline: string[];
  whyItWillWork: string;
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
  targetObjection: string;
  tone: "soft" | "professional" | "urgent" | "trust-building";
  title: string;
  targetLead: string;
  message: string;
  evidence: string;
  nextStep: string;
  whenToUse: string;
  whyThisWorks: string;
  recommendedTiming: string;
};

export type SalesScriptSuggestion = {
  id: string;
  currentProblem: string;
  situation: string;
  weakLine: string;
  improvedScript: string;
  improvedLine: string;
  reason: string;
  whyItWorks: string;
  evidence: string;
  objectionHandled: string;
  exampleUseCase: string;
};

export type WeeklyAction = {
  id: string;
  priority: number;
  day: string;
  action: string;
  owner: string;
  due: string;
  purpose: string;
  expectedOutcome: string;
  sourceSignalType: RevenueSignalType;
};

export type ActionStatus =
  | "ready"
  | "copied"
  | "sent"
  | "replied"
  | "booked"
  | "won"
  | "lost"
  | "ignored";

export type RevenueAction = {
  id: string;
  type: "follow_up" | "content" | "script" | "competitor_gap" | "trust_asset";
  title: string;
  targetSegment: string;
  whyNow: string;
  evidence: string[];
  recommendedAction: string;
  expectedOutcome: string;
  priority: "low" | "medium" | "high";
  status: ActionStatus;
  relatedSignalId?: string;
  suggestedMessage?: string;
  primaryCTA?: string;
  potentialValue?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ActionOutcome = {
  actionId: string;
  status: Exclude<ActionStatus, "ready">;
  note?: string;
  timestamp: string;
};

export type OutcomeSummary = {
  followupsCopied: number;
  followupsSent: number;
  repliesRecovered: number;
  bookingsRecovered: number;
  wonDeals: number;
  estimatedRecoveredRevenue: number;
};

export type DemoDataset = {
  id: string;
  name: string;
  industry: string;
  language: SupportedLanguage;
  description: string;
  reviewsText: string;
  competitorReviewsText: string;
  salesNotesText: string;
  leadCsv: string;
  demoLabel: string;
};

export type AnalysisResult = {
  generatedAt: string;
  summary: string;
  demoLabel?: string;
  sourceLanguages: SupportedLanguage[];
  outputLanguage: SupportedLanguage;
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
  revenueActions: RevenueAction[];
  markdownReport: string;
};
