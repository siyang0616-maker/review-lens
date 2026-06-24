import type { CustomerVoiceInput, DemoDataset } from "../../../types/revenue";

export const clinicDemoData: DemoDataset = {
  id: "english-clinic-med-spa",
  name: "English Clinic Consultation Leads",
  industry: "Clinic / Med Spa",
  language: "en",
  description:
    "Synthetic sample data for testing Review-to-Revenue AI with English clinic and med spa consultations.",
  reviewsText: [
    "The consultation was kind, but I wanted clearer before-and-after expectations.",
    "Pricing was confusing because the package, follow-up visit, and maintenance plan were separate.",
    "I trusted the provider after they explained downtime, side effects, and realistic outcomes.",
    "The clinic was clean and professional, but I wanted more proof for my skin type.",
    "I paused before booking because I needed to ask my spouse and compare another clinic."
  ].join("\n"),
  competitorReviewsText: [
    "Another clinic rushed the consultation and did not explain recovery time.",
    "The photos looked impressive, but the expected outcome was not realistic.",
    "They quoted a low price first and added maintenance costs later.",
    "Follow-up after the consultation was slow, so I booked somewhere else."
  ].join("\n"),
  salesNotesText: [
    "Sophia / phone / skin tightening / budget 1200 / spouse discussion / No Response 6 days",
    "Mason / web form / laser package / budget 900 / worried about downtime / Waiting 4 days",
    "Olivia / Instagram / med spa membership / budget 1500 / comparing clinics / Comparing",
    "Ethan / referral / acne treatment / budget 700 / wants proof for skin type / Needs Follow-up"
  ].join("\n"),
  leadCsv: [
    "name,channel,industry,interest,budget,lastContactDate,lastMessage,status,objection,urgency,potentialValue,notes",
    "Sophia,Phone,Clinic,Skin tightening,1200,2026-06-18,Need to ask my spouse,No Response,Family/Partner,High,1200,Needs realistic outcome proof",
    "Mason,Web,Clinic,Laser package,900,2026-06-20,How much downtime should I expect,Waiting,Outcome Uncertainty,Medium,900,Downtime concern",
    "Olivia,Instagram,Med Spa,Membership,1500,2026-06-21,Comparing another clinic,Comparing,Comparison Shopping,Medium,1500,Comparison asset",
    "Ethan,Referral,Clinic,Acne treatment,700,2026-06-22,Do you have proof for my skin type,Needs Follow-up,Trust Barrier,High,700,Proof asset needed"
  ].join("\n"),
  demoLabel: "Demo Data · English Clinic Consultation Leads"
};

export const clinicDemoInput: CustomerVoiceInput = {
  reviewsText: clinicDemoData.reviewsText,
  competitorReviewsText: clinicDemoData.competitorReviewsText,
  salesNotesText: clinicDemoData.salesNotesText,
  leadCsv: clinicDemoData.leadCsv,
  demoLabel: clinicDemoData.demoLabel,
  outputLanguage: "en"
};
