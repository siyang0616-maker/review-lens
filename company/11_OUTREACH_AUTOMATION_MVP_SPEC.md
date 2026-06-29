# Outreach Automation MVP Spec

## Purpose

This is an execution spec for an internal Prospect Research + Outreach CRM tool.

It is not a public product feature.
It is not part of the main product app.
It must not become a spam tool.

The tool exists to help Chris find, qualify, contact, and track Korean Founder-led Franchise / Business Consulting prospects during customer validation.

The first version should run on Google Sheets, Gmail manual sending, and optional Apps Script helpers.

Core rule:

> Automate organization, reminders, and draft preparation. Do not automate trust.

---

## 1. MVP Product Definition

The MVP is an internal workspace that helps Chris:

1. Add a prospect source keyword.
2. Collect public company/contact page candidates manually or semi-automatically.
3. Store prospect info in one structured database.
4. Score prospect quality for the first validation market.
5. Generate a personalized outreach draft from public context.
6. Require manual approval before any message is sent.
7. Track outreach progress from sent message to payment.
8. Show an evidence dashboard for validation decisions.

The MVP is not:

- A mass email sender.
- A private data scraper.
- A lead-enrichment black box.
- A full CRM replacement.
- A customer support inbox.
- A replacement for Chris reading the prospect's business.
- A product feature for customers.

Primary user:

> Chris.

First market:

> Founder-led Franchise / Business Consulting operators in Korea.

Primary job:

> Help Chris contact the right prospects with a relevant, human, evidence-seeking message.

Success condition:

> Chris can build a first 50-prospect list, score fit, draft personalized outreach, send manually, and track validation evidence without losing context.

---

## 2. User Workflow

### Step 1: Add Prospect Source Keyword

Chris enters a keyword into the `Sources` tab.

Examples:

- 프랜차이즈 창업 상담
- 가맹 창업 컨설팅
- 창업 비용 상담
- 프랜차이즈 브랜드 비교
- 양도양수 창업 상담
- 소자본 창업 컨설팅
- 상권 분석 창업 상담

Each keyword stores:

- keyword,
- source type,
- search URL,
- date added,
- target segment,
- research owner,
- status,
- notes.

### Step 2: Collect Public Candidates

Chris manually reviews search results from Naver Blog, YouTube, company websites, and public contact pages.

Optional helper:

- Apps Script can create search URL links from keywords.
- Apps Script can check for duplicate URLs after Chris pastes candidates.
- Apps Script must not scrape private profiles or auto-collect personal contact data.

Candidate collection input:

- company name,
- public URL,
- source type,
- visible operator name if public,
- public business email or contact path if visible,
- reason this prospect might fit.

### Step 3: Store Prospect Info

Chris adds qualified candidates to the `Prospects` tab.

One row equals one prospect/company.

No customer data from prospects goes here.
Only public business contact info and validation workflow info go here.

### Step 4: Score Prospect Quality

The sheet calculates a `Lead Score` from the scoring fields.

Chris reviews the score and can override it with a short reason.

Only Score 75+ prospects should enter first outreach unless the list is too small.

### Step 5: Generate Personalized Outreach Draft

The tool generates a draft using:

- prospect name,
- business type,
- public content hook,
- likely hesitation,
- source URL,
- chosen message variant,
- Free Revenue Leak Diagnostic offer.

The draft must include a visible personalization field.

If no personalization hook exists, the draft should not be approved.

### Step 6: Manual Approval Before Sending

Chris reviews each draft.

Required checks:

- Is this actually Founder-led Franchise / Business Consulting?
- Is there a real public reason for contacting them?
- Is the contact info public business contact info?
- Does the message ask for 10-20 anonymized notes?
- Does it avoid hype and software-pitch language?
- Is the first sentence specific?

Only after approval can Chris manually send from Gmail, contact form, Naver Talk, Kakao channel, LinkedIn, or another public business channel.

### Step 7: Track Pipeline

After sending, Chris updates the status manually or through simple reminders.

Track:

- reply,
- sample request,
- data request,
- data submitted,
- diagnostic delivered,
- review call,
- paid offer,
- payment,
- outcome.

### Step 8: Show Evidence Dashboard

The dashboard shows only evidence metrics:

- prospects researched,
- qualified prospects,
- outreach sent,
- replies,
- sample requests,
- data submitted,
- diagnostics delivered,
- paid offers,
- payments,
- revenue,
- actions executed,
- outcomes recorded.

No vanity metrics.

---

## 3. Database Schema

Use Google Sheets tabs first.

Recommended tabs:

1. `Sources`
2. `Candidates`
3. `Prospects`
4. `Outreach Drafts`
5. `Interactions`
6. `Diagnostics`
7. `Payments`
8. `Evidence Dashboard`
9. `Lists`

### Tab: Sources

| Column | Type | Purpose |
| --- | --- | --- |
| Source ID | Text | Unique source keyword ID. |
| Keyword | Text | Search phrase Chris is testing. |
| Source Type | Select | Naver Blog, YouTube, company website, contact page, public business email, referral, other. |
| Search URL | URL | Manual search link. |
| Target Segment | Select | Franchise consulting, business consulting, acquisition consulting, startup advisory, other. |
| Date Added | Date | When the source was added. |
| Status | Select | New, Researching, Exhausted, Paused. |
| Candidates Found | Number | Count linked from this source. |
| Qualified Count | Number | Count promoted to prospects. |
| Notes | Text | Search observations. |

### Tab: Candidates

| Column | Type | Purpose |
| --- | --- | --- |
| Candidate ID | Text | Unique candidate ID. |
| Source ID | Text | Links to `Sources`. |
| Company / Brand | Text | Public business name. |
| Public URL | URL | Blog, video, website, contact page, or profile URL. |
| Source Type | Select | Naver Blog, YouTube, company website, contact page, public business email. |
| Visible Contact Path | Text | Email, contact form, Naver Talk, Kakao, DM, website inquiry. |
| Public Business Email | Email | Only if publicly listed for business contact. |
| Public Operator Name | Text | Only if publicly shown. |
| Public Role | Text | Founder, consultant, advisor, representative, unknown. |
| Public Content Hook | Text | Specific post/video/page to reference. |
| Likely Pain | Select | Cost, payback, risk, family approval, brand comparison, location, no-response leads, unknown. |
| Candidate Notes | Text | Why this candidate might fit. |
| Duplicate Check | Formula | Flags same URL/email/company. |
| Promote To Prospect | Checkbox | Chris manually checks when ready. |

### Tab: Prospects

| Column | Type | Purpose |
| --- | --- | --- |
| Prospect ID | Text | Unique prospect ID. |
| Candidate ID | Text | Source candidate reference. |
| Company / Brand | Text | Business name. |
| Contact Name | Text | Publicly visible decision maker or contact person. |
| Role | Select | Founder, representative, consultant, advisor, agency owner, sales lead, unknown. |
| Segment | Select | Franchise consulting, business consulting, acquisition consulting, startup advisory, adjacent. |
| Website URL | URL | Main website. |
| Source URL | URL | Page that justified outreach. |
| Contact Page URL | URL | Public contact page. |
| Public Business Email | Email | Public business email only. |
| Contact Channel | Select | Gmail, contact form, Naver Talk, Kakao, LinkedIn, Instagram, YouTube email, phone only, unknown. |
| Source Type | Select | Naver Blog, YouTube, company website, contact page, public business email, referral. |
| Personalization Hook | Text | Specific public reason for message. |
| Likely Hesitation | Select | Cost, payback, risk, family approval, brand comparison, location, timing, no-response leads. |
| Market Fit Score | Number | 0-25. |
| Founder Reach Score | Number | 0-15. |
| Lead Flow Signal Score | Number | 0-15. |
| Objection Signal Score | Number | 0-15. |
| Public Contact Confidence Score | Number | 0-10. |
| Personalization Score | Number | 0-10. |
| Data Likelihood Score | Number | 0-10. |
| Risk Penalty | Number | Negative score if unsafe/low-fit. |
| Lead Score | Formula | Final 0-100 score. |
| Score Tier | Formula | A, B, C, Hold, Skip. |
| Status | Select | Uses status pipeline below. |
| Message Variant | Select | Korean A, Korean B, Korean DM, custom. |
| Draft Status | Select | Not generated, draft ready, needs edit, approved, sent. |
| First Contact Date | Date | Manual send date. |
| Follow-Up 1 Due | Date | Auto-calculated. |
| Follow-Up 2 Due | Date | Auto-calculated. |
| Last Touch Date | Date | Latest interaction date. |
| Next Step | Text | Next action Chris must take. |
| Next Step Date | Date | Due date. |
| Evidence Notes | Text | What was learned. |
| Owner | Text | Usually Chris. |

### Tab: Outreach Drafts

| Column | Type | Purpose |
| --- | --- | --- |
| Draft ID | Text | Unique draft ID. |
| Prospect ID | Text | Links to prospect. |
| Message Variant | Select | Korean A, Korean B, Korean DM, follow-up 1, follow-up 2, data request. |
| Channel | Select | Email, DM, contact form, Kakao, Naver Talk. |
| Subject | Text | Email subject if needed. |
| Draft Body | Long text | Generated outreach draft. |
| Personalization Hook Used | Text | Must not be blank. |
| Offer Included | Checkbox | Free Revenue Leak Diagnostic included. |
| Data Ask Included | Checkbox | 10-20 anonymized notes included. |
| Privacy Line Included | Checkbox | No private data needed. |
| Manual Approval | Checkbox | Chris approves before send. |
| Approved By | Text | Chris. |
| Approved At | DateTime | Approval timestamp. |
| Sent Manually | Checkbox | Chris marks after sending. |
| Sent At | DateTime | Manual send timestamp. |
| Revision Notes | Text | Why draft was edited. |

### Tab: Interactions

| Column | Type | Purpose |
| --- | --- | --- |
| Interaction ID | Text | Unique interaction ID. |
| Prospect ID | Text | Links to prospect. |
| Date | Date | Interaction date. |
| Type | Select | Outreach sent, follow-up sent, reply, sample request, data request, data submitted, call booked, diagnostic delivered, paid offer, payment, no fit, nurture. |
| Channel | Select | Gmail, contact form, Naver Talk, Kakao, LinkedIn, Instagram, phone, other. |
| Summary | Text | What happened. |
| Exact Customer Language | Text | Relevant quote if available. |
| Evidence Quality | Select | Low, medium, high. |
| Next Step | Text | Next action. |
| Next Step Date | Date | Due date. |

### Tab: Diagnostics

| Column | Type | Purpose |
| --- | --- | --- |
| Diagnostic ID | Text | Unique diagnostic ID. |
| Prospect ID | Text | Links to prospect. |
| Data Submitted Date | Date | When anonymized notes arrived. |
| Snippet Count | Number | Number of notes submitted. |
| Data Quality | Select | Strong, usable, weak, unusable. |
| Diagnostic Status | Select | Not started, in progress, delivered, reviewed. |
| Diagnostic Delivered Date | Date | Delivery date. |
| Review Call Date | Date | Review call date. |
| Strongest Leak | Text | Main finding. |
| Action Chosen | Text | Action prospect said they would test. |
| Outcome Follow-Up Date | Date | Date to ask what happened. |
| Outcome Recorded | Select | None, replied, booked, won, lost, ignored, qualitative. |

### Tab: Payments

| Column | Type | Purpose |
| --- | --- | --- |
| Payment ID | Text | Unique payment ID. |
| Prospect ID | Text | Links to prospect. |
| Offer Type | Select | Paid Revenue Action Report, setup, monthly refresh, other. |
| Offer Date | Date | When offer was made. |
| Price Offered | Number | KRW amount. |
| Payment Status | Select | Not offered, considering, paid, lost, deferred. |
| Paid Date | Date | When paid. |
| Amount Paid | Number | Actual amount. |
| Loss Reason | Text | If lost. |
| Next Commercial Step | Text | Next action. |

### Tab: Evidence Dashboard

This tab should be formulas and charts from the other tabs.

Metrics are defined in section 11.

---

## 4. Lead Scoring Formula

Use a 100-point scoring model.

Formula:

```text
Lead Score =
Market Fit Score
+ Founder Reach Score
+ Lead Flow Signal Score
+ Objection Signal Score
+ Public Contact Confidence Score
+ Personalization Score
+ Data Likelihood Score
+ Risk Penalty
```

### Score Components

| Component | Max | How To Score |
| --- | --- | --- |
| Market Fit Score | 25 | 25 = clear Franchise / Business Consulting. 15 = adjacent startup/business consulting. 5 = broad marketing or unclear. |
| Founder Reach Score | 15 | 15 = named founder/operator publicly reachable. 10 = named consultant/team lead. 5 = only company contact. 0 = no reachable person. |
| Lead Flow Signal Score | 15 | 15 = visible consultation CTA and inbound funnel. 10 = contact form and educational content. 5 = content but no CTA. 0 = no lead flow. |
| Objection Signal Score | 15 | 15 = public content mentions cost/payback/risk/comparison/family/location. 10 = some startup concern content. 5 = generic business content. |
| Public Contact Confidence Score | 10 | 10 = public business email or contact form. 7 = Naver Talk/Kakao/public DM. 3 = weak contact path. 0 = no public contact path. |
| Personalization Score | 10 | 10 = specific post/video/page to mention. 5 = general business hook. 0 = no specific hook. |
| Data Likelihood Score | 10 | 10 = likely has customer inquiries/consult notes. 5 = likely has comments/DMs only. 0 = no written customer language. |
| Risk Penalty | 0 to -40 | Apply penalties below. |

### Risk Penalties

| Risk | Penalty |
| --- | --- |
| Only private personal contact info found | -40 |
| No public business contact path | -20 |
| Large corporate franchise HQ with no operator access | -20 |
| Pure directory or listing site | -20 |
| No evidence of consulting or inbound inquiries | -15 |
| Generic agency with no franchise/business consulting angle | -15 |
| No personalization hook | -10 |
| Outreach would feel irrelevant | -25 |

### Score Tiers

| Lead Score | Tier | Action |
| --- | --- | --- |
| 85-100 | A | Draft outreach now. |
| 75-84 | B | Draft outreach after Chris reviews hook. |
| 60-74 | C | Hold unless list is thin. |
| 40-59 | Hold | Research more or skip. |
| 0-39 | Skip | Do not contact. |

### Manual Override

Chris can override the score only with a reason.

Required override fields:

- override score,
- override reason,
- date,
- owner.

Example:

> Score is 68, but Chris knows the founder personally and expects data access. Override to 80.

---

## 5. Status Pipeline

Use one current status per prospect.

| Status | Meaning | Next Allowed Status |
| --- | --- | --- |
| Sourced | Candidate found from keyword/source. | Researching, Skip |
| Researching | Chris is checking fit and public contact info. | Qualified, Hold, Skip |
| Qualified | Prospect meets score and safety rules. | Draft Ready |
| Draft Ready | Outreach draft generated. | Needs Approval |
| Needs Approval | Chris must review and edit. | Approved To Send, Needs Edit, Hold |
| Needs Edit | Draft is not human/specific enough. | Needs Approval |
| Approved To Send | Chris approved the draft. | Sent Manually |
| Sent Manually | Chris sent through Gmail/contact channel. | Follow-Up 1 Due, Replied, Closed No Fit |
| Follow-Up 1 Due | First follow-up is due. | Follow-Up 1 Sent, Replied, Closed No Fit |
| Follow-Up 1 Sent | First follow-up sent manually. | Follow-Up 2 Due, Replied, Closed No Fit |
| Follow-Up 2 Due | Second follow-up is due. | Follow-Up 2 Sent, Replied, Closed No Fit |
| Follow-Up 2 Sent | Final follow-up sent manually. | Replied, Nurture, Closed No Reply |
| Replied | Prospect gave substantive response. | Sample Requested, Data Requested, Interview Booked, Closed No Fit |
| Sample Requested | Prospect asked what diagnostic looks like. | Sample Sent |
| Sample Sent | Free diagnostic sample sent. | Data Requested, Closed No Fit |
| Data Requested | Chris asked for anonymized notes. | Data Promised, Data Submitted, Closed No Fit |
| Data Promised | Prospect said they would send data. | Data Submitted, Nurture, Closed No Data |
| Data Submitted | Prospect sent usable notes. | Diagnostic In Progress |
| Diagnostic In Progress | Chris is preparing diagnostic. | Diagnostic Delivered |
| Diagnostic Delivered | Free Revenue Leak Diagnostic sent. | Review Call Scheduled, Paid Offer Made, Closed No Action |
| Review Call Scheduled | Review call is booked. | Review Call Done |
| Review Call Done | Diagnostic reviewed. | Paid Offer Made, Action Chosen, Closed No Fit |
| Paid Offer Made | Paid Revenue Action Report offered. | Payment Pending, Paid Won, Paid Lost |
| Payment Pending | Prospect considering payment. | Paid Won, Paid Lost, Deferred |
| Paid Won | Prospect paid. | Paid Delivery In Progress |
| Paid Delivery In Progress | Paid report delivery underway. | Paid Delivered |
| Paid Delivered | Paid report delivered. | Outcome Follow-Up Due |
| Outcome Follow-Up Due | Chris must ask what happened. | Outcome Recorded, Closed No Outcome |
| Outcome Recorded | Evidence captured. | Referral Requested, Nurture |
| Referral Requested | Referral ask made. | Referral Received, Nurture |
| Referral Received | New referral captured. | Sourced |
| Deferred | Prospect may revisit later. | Nurture |
| Nurture | Not now, but not dead. | Researching, Qualified, Closed |
| Closed No Reply | No reply after final follow-up. | Nurture |
| Closed No Data | Prospect would not send data. | Nurture |
| Closed No Action | Prospect liked report but did not act. | Nurture |
| Closed No Fit | Wrong fit, no pain, no access, or unsafe. | End |
| Skip | Not eligible. | End |

---

## 6. Prospect Source Types

### Naver Blog

Use for:

- founder-led consulting content,
- franchise startup guides,
- business acquisition posts,
- cost/payback/risk articles,
- posts with consultation CTAs.

Capture:

- blog URL,
- author/business name,
- public contact path,
- specific post title,
- likely objection,
- reason for fit.

Do not collect:

- private commenter info,
- private IDs,
- customer comments as contact targets,
- hidden profile data.

### YouTube

Use for:

- franchise education creators,
- consultants with visible consultation offer,
- videos about cost/payback/risk/brand comparison,
- channels with public business email.

Capture:

- channel URL,
- video URL,
- public business email if listed,
- contact form if linked,
- specific video hook,
- consultation CTA.

Do not collect:

- private viewer/commenter contacts,
- scraped comment identities,
- personal emails not publicly provided for business.

### Company Websites

Use for:

- consulting firms,
- founder-led advisory businesses,
- franchise matching services,
- business acquisition advisors,
- startup advisory firms.

Capture:

- homepage,
- about page,
- service page,
- representative name if public,
- contact page,
- public business email,
- consultation CTA.

### Contact Pages

Use for:

- official inquiry forms,
- public business email,
- Kakao channel,
- Naver Talk,
- official phone only when appropriate.

Rule:

> Contact pages are preferred because they show the business wants inquiries.

### Public Business Emails

Use only when:

- the email is clearly listed for business contact,
- the email belongs to the business or representative role,
- the page context supports outreach relevance.

Do not use:

- private personal emails from unrelated sources,
- leaked data,
- purchased lists,
- scraped personal profiles,
- guessed emails.

---

## 7. Email / Contact Finding Rules

### Allowed

- Public business email on company website.
- Public contact form on company website.
- Public Naver Talk or Kakao business channel.
- Public email on YouTube business/contact section.
- Public LinkedIn company/founder profile when the profile is used for business.
- Public Instagram DM for a business account.
- Public phone number only for a respectful inquiry, not bulk calling.

### Not Allowed

- Private personal scraping.
- Purchased email lists.
- Guessing private emails.
- Collecting personal social profiles unrelated to business.
- Scraping commenters or followers.
- Using customer names, phone numbers, or private data.
- Auto-submitting website forms.
- Mass auto-send.
- Hidden browser automation that simulates a human.
- Sending without Chris reading the prospect first.

### Required Before Contact

Every outreach row must have:

- source URL,
- public contact path,
- personalization hook,
- lead score,
- manual approval,
- channel,
- message variant.

If any of these are missing, do not send.

### Daily Sending Boundary

Recommended limit for first version:

- 10 high-quality outbound messages per day.
- 20 maximum on a research-heavy day only if every message is manually approved.
- No batch send button.
- No scheduled auto-send.

---

## 8. Outreach Template Generator

The generator creates drafts, not sent messages.

Inputs:

- contact name,
- company/brand,
- source URL,
- public content hook,
- likely hesitation,
- source type,
- message variant,
- contact channel,
- Free Revenue Leak Diagnostic offer,
- data ask.

Output:

- subject line if email,
- short personalized opening,
- reason for reaching out,
- diagnostic offer,
- data request,
- privacy reassurance,
- low-friction ask.

### Draft Rules

Every draft must include:

- a specific public hook,
- Founder-led Franchise / Business Consulting relevance,
- Free Revenue Leak Diagnostic,
- 10-20 anonymized notes,
- "5 notes first is okay" fallback,
- no private data request,
- no guaranteed revenue claim,
- no software-pitch language.

Every draft must avoid:

- "automated growth",
- "lead generation machine",
- "guaranteed sales",
- "bulk outreach",
- generic praise,
- fake familiarity,
- pressure language.

### Draft Template Logic

Use this structure:

```text
Hi [Name],

I saw [specific public content hook].

I am looking at where franchise/business consulting leads go quiet after questions about [likely hesitation].

I am offering a Free Revenue Leak Diagnostic for a small number of operators.

If you send 10-20 anonymized inquiry messages, consultation notes, or follow-up notes, I will return a short diagnostic showing repeated objections, revenue leak points, and follow-up actions to test.

No names, phone numbers, private customer details, or sensitive records are needed.

If 10-20 notes is too much, 5 notes is enough for me to check whether there is signal.

Would you be open to trying it?
```

### Korean Draft Generator Output

The first generated draft should use the Korean messages from `company/09_FIRST_10_OUTREACH_PACK.md`, with only these fields filled:

- `[Name]`
- `[specific content]`
- `[likely hesitation]`
- `[Chris]`

Do not generate a message if the personalization hook is blank.

---

## 9. Manual Approval Flow

Manual approval is mandatory.

### Approval States

| State | Meaning |
| --- | --- |
| Draft Ready | Generated but not reviewed. |
| Needs Edit | Not specific, too salesy, unsafe, or missing data ask. |
| Approved To Send | Chris reviewed and approved. |
| Sent Manually | Chris sent it manually outside the sheet. |
| Rejected | Prospect should not be contacted. |

### Approval Checklist

Chris must confirm:

- Prospect fits Founder-led Franchise / Business Consulting.
- Public source URL is valid.
- Contact path is public business contact info.
- Message has a specific first line.
- Message asks for anonymized customer conversations.
- Message does not request private data.
- Message does not sound like a mass pitch.
- Message does not mention broad product claims.
- Message has a clear next step.

### Approval Gate

The sheet should block or warn if:

- `Personalization Hook` is blank.
- `Public Contact Confidence Score` is 0.
- `Lead Score` is below 75.
- `Manual Approval` is unchecked.
- `Contact Channel` is unknown.
- `Public Business Email` and `Contact Page URL` are both blank.

---

## 10. Follow-Up Reminder System

The reminder system should help Chris remember, not send for him.

### Reminder Rules

After `Sent Manually`:

- Follow-Up 1 Due = first contact date + 2 business days.
- Follow-Up 2 Due = first contact date + 6 business days.
- Final close review = first contact date + 10 business days.

After `Data Promised`:

- Data reminder due = promise date + 1 business day.
- Data close review = promise date + 7 days.

After `Diagnostic Delivered`:

- Review call reminder = delivered date + 1 business day.
- Paid offer review = delivered date + 4 business days.

After `Action Chosen`:

- Outcome follow-up = action chosen date + 7 days.

### Reminder Views

Create filtered views:

- Due Today
- Overdue
- Follow-Up 1 Due
- Follow-Up 2 Due
- Data Promised
- Diagnostic Due
- Paid Offer Pending
- Outcome Follow-Up Due

### Optional Apps Script

Allowed:

- Daily email to Chris listing due follow-ups.
- Add calendar reminder for review calls.
- Create draft text in a sheet cell.
- Flag missing approval fields.
- Flag duplicate prospects.

Not allowed:

- Auto-send emails.
- Auto-submit contact forms.
- Auto-DM prospects.
- Scrape private contact info.

---

## 11. Evidence Dashboard Metrics

Track only validation evidence.

### Acquisition / Research

| Metric | Definition |
| --- | --- |
| Keywords Tested | Count of source keywords added. |
| Candidates Collected | Public candidates added. |
| Qualified Prospects | Prospects with score 75+. |
| Approved Drafts | Drafts manually approved. |
| Outreach Sent | Messages Chris manually sent. |

### Response

| Metric | Definition |
| --- | --- |
| Replies | Substantive replies. |
| Reply Rate | Replies / Outreach Sent. |
| Sample Requests | Prospects asking what the diagnostic looks like. |
| Data Requests Made | Prospects asked for anonymized notes. |
| Data Submitted | Prospects who sent usable notes. |
| Data Submission Rate | Data Submitted / Data Requests Made. |

### Delivery

| Metric | Definition |
| --- | --- |
| Diagnostics Delivered | Free Revenue Leak Diagnostics sent. |
| Review Calls Booked | Calls scheduled after diagnostic. |
| Review Calls Done | Calls completed. |
| Action Chosen | Prospects who chose one recommendation to test. |
| Outcomes Recorded | Follow-up result captured. |

### Revenue

| Metric | Definition |
| --- | --- |
| Paid Offers Made | Paid Revenue Action Report offers. |
| Payments | Paid reports or setup/refresh tests. |
| Revenue | Cash collected. |
| Paid Conversion Rate | Payments / Paid Offers Made. |

### Quality

| Metric | Definition |
| --- | --- |
| Average Lead Score Sent | Average score of contacted prospects. |
| Reply Rate By Source Type | Replies grouped by Naver Blog, YouTube, company website, etc. |
| Data Submitted By Source Type | Data submissions grouped by source type. |
| Best Keyword | Keyword producing highest data submission rate. |
| Bad Keyword | Keyword producing no qualified prospects or no replies. |

### Dashboard Rules

Do not show:

- open rates,
- click rates,
- vanity traffic,
- social likes,
- number of scraped contacts,
- total email volume as success.

The dashboard should answer:

> Which source produces real conversations, data submissions, diagnostics, paid offers, and payments?

---

## 12. Recommended Stack

### First Version

Use:

- Google Sheets as database and dashboard.
- Gmail for manual email sending.
- Contact forms / Naver Talk / Kakao / LinkedIn manually.
- Google Drive folder for diagnostic files.
- Optional Apps Script for reminders, duplicate checks, score formulas, and draft generation.

Why:

- Fastest to build.
- Easy to inspect.
- No product engineering needed.
- Keeps Chris close to every prospect.
- Prevents accidental mass outreach.
- Easy to change fields during validation.

### Optional Apps Script

Allowed helpers:

- Generate search URLs from keywords.
- Generate draft text from row fields.
- Calculate lead score.
- Highlight missing required fields.
- Detect duplicate URLs/emails.
- Send Chris a daily reminder email.
- Create Google Calendar events for review calls.

Do not use Apps Script to send prospect outreach.

### Later Next.js Dashboard

Build later only if:

- Google Sheets becomes too slow.
- Chris has 200+ researched prospects.
- There are multiple people doing research.
- The status workflow is proven.
- The fields stop changing every week.
- Manual evidence collection is working.

Later dashboard can include:

- prospect database,
- source tracking,
- draft preview,
- approval queue,
- reminder queue,
- evidence dashboard.

It should still require manual send approval.

---

## 13. MVP Build Phases

### Phase 1: Google Sheets CRM

Build:

- tabs listed in database schema,
- dropdown lists,
- score formula,
- status pipeline,
- dashboard formulas,
- due-date formulas,
- duplicate checks.

Do not build:

- email sending,
- scraping,
- browser automation,
- dashboard app.

Completion criteria:

- Chris can enter 50 prospects and see score, status, next step, and evidence metrics.

### Phase 2: Draft Generator In Sheets

Build:

- template dropdown,
- Korean draft body formula or Apps Script,
- personalization hook requirement,
- approval checkbox,
- draft quality checklist.

Do not build:

- auto-send,
- contact form submission,
- private data enrichment.

Completion criteria:

- Chris can generate 10 draft messages and manually approve/edit each one.

### Phase 3: Reminder System

Build:

- follow-up due formulas,
- overdue views,
- daily reminder email to Chris,
- calendar helper for calls.

Do not build:

- prospect-facing automation,
- auto follow-up send.

Completion criteria:

- Chris does not miss follow-ups, promised data, diagnostic delivery, or outcome checks.

### Phase 4: Evidence Dashboard

Build:

- weekly evidence dashboard,
- source performance table,
- pipeline counts,
- conversion rates,
- payment/revenue summary.

Do not build:

- marketing analytics,
- open tracking,
- vanity charts.

Completion criteria:

- Friday review can answer which keyword/source/message is producing data submissions and payments.

### Phase 5: Later Internal Dashboard

Build only after validation workflow is stable.

Possible stack:

- Next.js internal dashboard,
- Google Sheets or SQLite/Postgres migration,
- Gmail draft creation only,
- manual approval queue,
- audit log.

Do not start this before the sheet version proves the workflow.

---

## 14. What Not To Build Yet

Do not build:

- main product app changes,
- public prospecting app,
- full CRM,
- email sending automation,
- bulk sender,
- cold email sequence engine,
- private contact scraper,
- social profile scraper,
- commenter/follower scraper,
- purchased-list importer,
- deliverability tooling,
- inbox sync,
- auto-reply classifier,
- browser automation for Naver/Kakao/LinkedIn,
- paid enrichment integrations,
- complex permissions,
- multi-user workflows,
- campaign analytics,
- open/click tracking,
- AI agent that researches and sends on its own,
- automatic diagnostic generation from prospect data,
- any feature that lets Chris contact people without reading the prospect first.

Build only what helps:

- find public candidates,
- score fit,
- draft a human message,
- require approval,
- remind Chris,
- track evidence.

---

## Final Operating Rule

The safest version of this tool is not the one that sends the most messages.

The safest version is the one that helps Chris contact fewer, better prospects with more specific messages and cleaner evidence tracking.

If automation increases volume before evidence quality improves, remove the automation.
