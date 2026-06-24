import type { CustomerVoiceInput, DemoDataset } from "../../../types/revenue";

export const weddingDemoData: DemoDataset = {
  id: "english-wedding-vendor",
  name: "English Wedding Vendor Leads",
  industry: "Wedding Services",
  language: "en",
  description:
    "Synthetic sample data for testing Review-to-Revenue AI with English wedding vendor inquiries.",
  reviewsText: [
    "The floral consultation was beautiful, but we were unsure what was included in the premium package.",
    "We loved the photographer's style, but turnaround time and extra album fees were not clear.",
    "The planner was responsive, and the checklist helped us decide faster.",
    "Pricing felt high until they explained setup, travel, coordination, and day-of support.",
    "My partner wanted to compare two vendors because the proposal did not show enough proof."
  ].join("\n"),
  competitorReviewsText: [
    "The competitor replied slowly and did not explain overtime fees.",
    "Their photos looked great, but the contract had hidden add-ons.",
    "We could not tell which package matched a 120-person wedding.",
    "The vendor was friendly but did not send a planning timeline."
  ].join("\n"),
  salesNotesText: [
    "Emma / inquiry form / comparing planners / budget 4500 / partner wants proof / No Response 5 days",
    "Noah / Instagram / photography package / budget 3200 / worried about album fees / Waiting 3 days",
    "Ava / referral / floral design / budget 2800 / needs venue setup details / Hot",
    "Liam / email / day-of coordination / budget 1800 / wants timeline before paying / Needs Follow-up"
  ].join("\n"),
  leadCsv: [
    "name,channel,industry,interest,budget,lastContactDate,lastMessage,status,objection,urgency,potentialValue,notes",
    "Emma,Web,Wedding Services,Planner comparison,4500,2026-06-20,My partner wants to compare options,No Response,Family/Partner,High,4500,Needs proof checklist",
    "Noah,Instagram,Wedding Services,Photography package,3200,2026-06-21,Are albums and overtime included,Waiting,Price Concern,Medium,3200,Package clarity needed",
    "Ava,Referral,Wedding Services,Floral design,2800,2026-06-23,Can you confirm setup details,Hot,Information Gap,High,2800,Ready with proof",
    "Liam,Email,Wedding Services,Day-of coordination,1800,2026-06-22,Need a clear planning timeline,Needs Follow-up,Information Gap,Medium,1800,Timeline asset needed"
  ].join("\n"),
  demoLabel: "Demo Data · English Wedding Vendor Leads"
};

export const weddingDemoInput: CustomerVoiceInput = {
  reviewsText: weddingDemoData.reviewsText,
  competitorReviewsText: weddingDemoData.competitorReviewsText,
  salesNotesText: weddingDemoData.salesNotesText,
  leadCsv: weddingDemoData.leadCsv,
  demoLabel: weddingDemoData.demoLabel,
  outputLanguage: "en"
};
