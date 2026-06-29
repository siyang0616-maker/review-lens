# Founder OS Automation Roadmap

## Purpose

The current founder outreach workflow still depends too much on Chris.

This roadmap redesigns the system around one principle:

> Chris should only approve, send, and reply.

Everything else should be assisted or automated without violating privacy, legal requirements, or the rule against unsolicited automated sending.

This is an internal validation operations roadmap.

It is not a public product spec.
It is not a spam system.
It does not authorize auto-send.
It does not modify the main product app.

---

## 1. Current Workflow

Current workflow from the outreach docs:

```text
1. Chris chooses prospect source keywords.
2. Chris searches Naver Blog, YouTube, company sites, and contact pages.
3. Chris opens pages one by one.
4. Chris decides whether the prospect fits Founder-led Franchise / Business Consulting.
5. Chris finds public business contact info.
6. Chris writes a personalization note.
7. Chris scores the prospect.
8. Chris chooses an email version.
9. Chris writes or edits the email draft.
10. Chris sends manually.
11. Chris updates the sheet.
12. Chris tracks follow-up dates.
13. Chris handles replies.
14. Chris sends the sample format.
15. Chris requests anonymized data.
16. Chris tracks whether data was submitted.
17. Chris delivers the diagnostic.
18. Chris makes paid offers.
19. Chris tracks payment and evidence.
```

Current problem:

> The system asks Chris to do research operations, data entry, scoring, writing, coordination, follow-up tracking, and founder judgment at the same time.

Chris should not be doing all of that.

---

## 2. Future Workflow

Future workflow:

```text
1. System collects public candidate pages from approved source queries.
2. Research agent extracts public business fields.
3. Fit agent classifies market relevance.
4. Contact-safety agent checks whether contact info is public business contact only.
5. Scoring agent calculates priority.
6. Personalization agent extracts a specific public hook.
7. Draft agent creates outreach draft.
8. Compliance agent checks message quality and safety.
9. Chris approves or rejects the draft.
10. Chris sends manually.
11. Reply agent labels replies and suggests response drafts.
12. Chris replies manually.
13. Workflow agent updates statuses, reminders, and dashboard.
14. Evidence agent summarizes learning.
```

Chris's future role:

1. Approve.
2. Send.
3. Reply.

Everything else:

- fully automatable,
- AI-assisted,
- or prepared for human approval.

Hard boundary:

> No system sends outreach, submits forms, scrapes private data, or impersonates Chris.

---

## 3. Manual Step Classification

### Classification Legend

| Classification | Meaning |
| --- | --- |
| Fully automatable | The system can do it deterministically or through safe scripted workflow. |
| AI-assisted | AI can prepare, classify, extract, summarize, or draft, but output should be checked. |
| Human approval required | System can prepare the item, but Chris must approve before the next external action. |
| Always manual | Chris must do this because it involves judgment, trust, or external communication. |

### Task Review

| Current Manual Task | Classification | Founder Effort Reduction |
| --- | --- | --- |
| Choose initial source categories | AI-assisted | System suggests source categories and query batches from the target market. Chris approves source list once. |
| Create keyword searches | Fully automatable | Generate Naver/YouTube/Google search URLs from approved keyword templates. |
| Open and scan search results | AI-assisted | Browser/research agent can collect public candidate URLs and page titles. |
| Decide if candidate is relevant | AI-assisted | Fit agent classifies segment, confidence, and reason. Chris only reviews borderline or top candidates. |
| Find public contact info | AI-assisted | Contact agent extracts visible public business email/contact form/channel from page text. |
| Check contact safety | Human approval required | System flags whether contact is public business info. Chris approves before use. |
| Enter prospect row | Fully automatable | Candidate extraction writes structured rows into Google Sheets or database. |
| Write personalization note | AI-assisted | Personalization agent quotes or paraphrases a public content hook. Chris approves. |
| Score lead | Fully automatable | Score formula computes 1-30 or 1-100 from extracted fields. |
| Choose priority tier | Fully automatable | Formula assigns A/B/C/Skip. |
| Pick first 5-10 prospects | AI-assisted | System recommends queue sorted by score, contact safety, and personalization quality. Chris approves final send list. |
| Choose email version | AI-assisted | Draft agent selects version based on source type and hook. |
| Draft email | AI-assisted | Draft agent writes message using approved templates. |
| Check for spammy language | Fully automatable | Compliance checker flags hype, software pitch, missing personalization, and missing privacy line. |
| Approve draft | Human approval required | Chris approves, rejects, or edits. |
| Send email/DM/form | Always manual | Chris sends manually from Gmail/contact channel. No auto-send. |
| Update status after send | Fully automatable with manual trigger | Chris clicks `Sent`; system stamps date and follow-up due. |
| Track follow-up date | Fully automatable | System calculates due dates and daily reminder queue. |
| Generate follow-up draft | AI-assisted | Draft agent prepares follow-up when due. Chris approves and sends manually. |
| Read replies | Always manual for meaning, AI-assisted for triage | Reply agent labels likely intent and suggests response. Chris reads and replies. |
| Reply to prospect | Always manual | Chris must preserve trust and context. |
| Send sample format | Human approval required | System prepares sample response. Chris approves and sends manually. |
| Ask for data | Human approval required | System prepares privacy-safe data request. Chris approves and sends manually. |
| Check submitted data for privacy | AI-assisted + human approval | System flags names, phones, emails, brands, sensitive info. Chris confirms before analysis. |
| Mark data submitted | Fully automatable after trigger | Gmail label/form/sheet update can mark status; Chris confirms if needed. |
| Create diagnostic | AI-assisted | Diagnostic agent drafts from anonymized snippets. Chris reviews before delivery. |
| Deliver diagnostic | Always manual | Chris sends and frames the diagnostic. |
| Make paid offer | Always manual | Chris makes commercial offer based on conversation quality. |
| Record payment status | Fully automatable with manual trigger | Chris marks paid/lost; system updates dashboard. |
| Summarize evidence | AI-assisted | Evidence agent summarizes repeated objections, reply reasons, data friction, and payment signals. |
| Friday review dashboard | Fully automatable | Dashboard calculates counts and conversion rates. Evidence summary remains AI-assisted. |

---

## 4. Automation Opportunities

### Fully Automatable

These should be automated first because they do not require founder judgment.

- Build search URLs from keyword list.
- Create prospect IDs.
- Detect duplicate URLs, company names, and emails.
- Populate sheet/database rows from approved candidate extraction.
- Calculate score fields and total score.
- Assign priority tier.
- Generate follow-up due dates.
- Generate daily "needs approval / needs send / needs reply" queue.
- Stamp sent date after Chris marks sent.
- Move status after checkbox updates.
- Track counts for evidence dashboard.
- Flag missing required fields.
- Flag disallowed contact sources.
- Flag missing personalization hook.
- Flag message missing privacy reassurance.

### AI-Assisted

These should be AI-assisted because they need interpretation.

- Identify whether a page is founder-led.
- Classify prospect segment.
- Extract public business contact paths.
- Summarize the prospect's public content.
- Identify likely objection type: cost, payback, risk, family approval, brand comparison, location, timing.
- Write personalization notes.
- Recommend email version.
- Draft outreach message.
- Draft follow-up message.
- Classify replies.
- Suggest reply templates.
- Detect privacy-sensitive data in submitted notes.
- Draft Free Revenue Leak Diagnostic from anonymized data.
- Summarize weekly evidence.

### Human Approval Required

These are approval gates. The system can prepare the work, but Chris must approve before external action.

- Approve source categories.
- Approve contact safety.
- Approve first 5-10 prospect send queue.
- Approve personalization note.
- Approve outreach draft.
- Approve follow-up draft.
- Approve sample-format response.
- Approve data request message.
- Approve anonymized data readiness.
- Approve diagnostic before delivery.
- Approve paid offer timing.

### Always Manual

These should remain manual.

- Send first outreach.
- Send follow-up.
- Reply to prospects.
- Make judgment calls in live conversations.
- Deliver diagnostic with context.
- Ask for payment.
- Negotiate scope or price.
- Decide whether to continue, pause, or stop a prospect relationship.

Reason:

> These moments create trust. Automating them would increase risk faster than it increases learning.

---

## 5. AI Agents Required

The system does not need one giant agent.

It needs small agents with narrow jobs and clear outputs.

### 1. Source Agent

Job:

- Generate Korean prospect source queries.
- Build search URLs.
- Keep source categories focused on Founder-led Franchise / Business Consulting.

Inputs:

- target market,
- source type,
- approved keywords.

Outputs:

- keyword,
- source type,
- search URL,
- reason for source.

Automation level:

- Fully automatable after Chris approves source categories.

### 2. Research Agent

Job:

- Read public pages.
- Extract company/channel, URL, public contact path, visible operator, and content hook.

Inputs:

- candidate URL.

Outputs:

- structured candidate row,
- extraction confidence,
- missing fields.

Automation level:

- AI-assisted.

Rules:

- Public pages only.
- No private profiles.
- No commenters/followers.
- No guessed emails.

### 3. Fit Scoring Agent

Job:

- Score prospect fit using the 30-point or 100-point scoring model.

Inputs:

- candidate row,
- public content summary.

Outputs:

- score by field,
- total score,
- priority tier,
- reason.

Automation level:

- Fully automatable for scoring.
- AI-assisted for field classification.

### 4. Contact Safety Agent

Job:

- Decide whether the contact path is safe to use.

Inputs:

- contact info,
- source URL,
- page context.

Outputs:

- allowed / not allowed / needs review,
- reason,
- contact type.

Automation level:

- AI-assisted with human approval required.

Hard rule:

> Only public business contact info can enter the send queue.

### 5. Personalization Agent

Job:

- Produce one specific, honest opening line based on public content.

Inputs:

- public content hook,
- source type,
- likely objection.

Outputs:

- personalization note,
- first sentence,
- confidence.

Automation level:

- AI-assisted with human approval required.

### 6. Draft Agent

Job:

- Generate Korean email/DM drafts from approved templates.

Inputs:

- prospect row,
- approved personalization note,
- email version,
- CTA.

Outputs:

- subject,
- draft body,
- checklist result.

Automation level:

- AI-assisted with human approval required.

### 7. Compliance Agent

Job:

- Check the draft before Chris sees it.

Inputs:

- draft body,
- prospect row.

Outputs:

- pass/fail,
- flags,
- suggested edits.

Checks:

- no auto-send,
- no private data request,
- no hype,
- no guaranteed revenue,
- no generic "spray" message,
- personalization exists,
- privacy reassurance exists,
- low-friction CTA exists.

Automation level:

- Fully automatable checks plus AI-assisted language review.

### 8. Reply Triage Agent

Job:

- Classify inbound replies and suggest response drafts.

Inputs:

- reply text.

Outputs:

- reply category,
- suggested next status,
- suggested response,
- urgency.

Categories:

- sample requested,
- asks what data is needed,
- privacy concern,
- ChatGPT objection,
- interested,
- not interested,
- follow up later,
- no fit.

Automation level:

- AI-assisted.
- Chris replies manually.

### 9. Data Safety Agent

Job:

- Check submitted snippets for private data before analysis.

Inputs:

- submitted notes.

Outputs:

- privacy flags,
- redaction suggestions,
- safe-to-analyze status.

Automation level:

- AI-assisted with human approval required.

### 10. Diagnostic Draft Agent

Job:

- Draft the Free Revenue Leak Diagnostic from anonymized data.

Inputs:

- anonymized snippets,
- target segment,
- diagnostic template.

Outputs:

- top leaks,
- repeated objections,
- suggested follow-up,
- confidence notes.

Automation level:

- AI-assisted with human approval required.

### 11. Evidence Agent

Job:

- Summarize validation learning.

Inputs:

- statuses,
- replies,
- notes,
- diagnostic outcomes,
- payments.

Outputs:

- weekly learning,
- repeated objections,
- source performance,
- message performance,
- blockers.

Automation level:

- AI-assisted.

---

## 6. Human Approval Points

Chris should approve only the decisions that create external consequences or require founder judgment.

### Approval Point 1: Source Set

Chris approves:

- target market remains Founder-led Franchise / Business Consulting,
- source categories,
- keywords.

Frequency:

- weekly.

### Approval Point 2: Prospect Send Queue

System recommends:

- top 5-10 prospects,
- score,
- source URL,
- contact path,
- personalization note.

Chris approves:

- send,
- hold,
- reject.

Frequency:

- daily during outreach.

### Approval Point 3: Contact Safety

System flags:

- public business contact,
- contact form,
- business email,
- risky/private/unknown.

Chris approves:

- safe to use or reject.

Frequency:

- before draft approval.

### Approval Point 4: Outreach Draft

System prepares:

- subject,
- email body,
- CTA,
- privacy line.

Chris approves:

- send as-is,
- edit,
- reject.

Frequency:

- before every send.

### Approval Point 5: Reply Response

System suggests:

- reply category,
- response draft,
- next status.

Chris approves:

- final reply.

Frequency:

- every meaningful reply.

### Approval Point 6: Data Safety

System checks:

- private info,
- sensitive details,
- unsafe content.

Chris approves:

- safe for diagnostic or request redaction.

Frequency:

- every data submission.

### Approval Point 7: Diagnostic Delivery

System drafts:

- diagnostic,
- sample result,
- next ask.

Chris approves:

- delivery.

Frequency:

- every diagnostic.

### Approval Point 8: Paid Offer

System suggests:

- fit for paid offer,
- likely objection,
- paid report framing.

Chris approves:

- whether to offer and how.

Frequency:

- after review calls or strong diagnostic engagement.

---

## 7. MVP Implementation Order

### MVP 0: Better Google Sheet

Goal:

> Remove founder effort from tracking and scoring.

Build:

- source tab,
- prospect tab,
- score formulas,
- status dropdowns,
- follow-up date formulas,
- missing-field warnings,
- dashboard counts.

Chris still:

- researches,
- writes drafts,
- sends,
- replies.

### MVP 1: Research Queue Assistant

Goal:

> Reduce prospect discovery and data entry.

Build:

- keyword-to-search-URL generator,
- candidate URL intake,
- duplicate detection,
- public field extraction into rows,
- fit classification,
- public contact path extraction.

Chris still:

- approves candidate,
- approves contact safety,
- sends,
- replies.

### MVP 2: Draft Assistant

Goal:

> Reduce writing effort without auto-sending.

Build:

- personalization note generator,
- email version recommender,
- Korean outreach draft generator,
- compliance checker,
- approval queue.

Chris still:

- approves,
- edits if needed,
- sends manually.

### MVP 3: Reply Assistant

Goal:

> Reduce reply handling and status update effort.

Build:

- reply classifier,
- suggested response,
- next status recommendation,
- sample/data request response drafts,
- reminder updates.

Chris still:

- replies manually.

### MVP 4: Diagnostic Assistant

Goal:

> Reduce diagnostic drafting effort.

Build:

- data safety checker,
- redaction suggestions,
- diagnostic draft generator,
- evidence extraction,
- confidence notes.

Chris still:

- approves diagnostic,
- delivers,
- makes paid offer.

### MVP 5: Evidence OS

Goal:

> Reduce founder effort in weekly learning.

Build:

- evidence dashboard,
- weekly insight summary,
- source performance,
- message performance,
- blocker summary,
- go/pivot/stop warning.

Chris still:

- makes founder decision.

---

## 8. Technical Architecture

### Phase 1 Architecture: Google Sheets + Apps Script

Best for:

- first 50-200 prospects,
- fast iteration,
- no main app changes.

Components:

```text
Google Sheet
-> Sources tab
-> Candidates tab
-> Prospects tab
-> Drafts tab
-> Interactions tab
-> Evidence dashboard

Apps Script
-> scoring formulas
-> duplicate checks
-> due-date reminders
-> draft generation button
-> missing-field warnings
-> daily Chris task email
```

Allowed:

- create draft text,
- calculate score,
- flag unsafe fields,
- send internal reminders to Chris.

Not allowed:

- send outreach emails,
- submit forms,
- scrape private pages,
- message prospects automatically.

### Phase 2 Architecture: Google Sheet + AI Worker

Best for:

- assisted extraction,
- draft generation,
- reply triage.

Components:

```text
Google Sheet
-> row changes trigger worker

AI Worker
-> Research Agent
-> Fit Scoring Agent
-> Personalization Agent
-> Draft Agent
-> Compliance Agent

Output
-> structured fields
-> draft
-> approval flags
```

Data boundary:

- public page content,
- public business contact info,
- Chris-owned notes,
- anonymized prospect-submitted data only.

### Phase 3 Architecture: Internal Dashboard

Best for:

- when Sheets becomes too fragile,
- when approval queue matters,
- when multiple agents run.

Possible stack:

- Next.js internal dashboard,
- Postgres or SQLite,
- background job queue,
- browser/manual URL intake,
- AI extraction workers,
- Gmail draft creation only,
- human approval audit log.

Core modules:

- Source Manager,
- Candidate Research Queue,
- Prospect Database,
- Contact Safety Gate,
- Draft Approval Queue,
- Reply Triage Queue,
- Diagnostic Workbench,
- Evidence Dashboard.

Hard boundary:

> The internal dashboard can create Gmail drafts later, but it must not send them.

### Event Model

Use event logging from the beginning.

Events:

- source_added,
- candidate_found,
- candidate_scored,
- contact_safety_checked,
- draft_generated,
- draft_approved,
- sent_marked,
- reply_received,
- sample_requested,
- data_requested,
- data_received,
- diagnostic_generated,
- diagnostic_approved,
- diagnostic_delivered,
- paid_offer_made,
- payment_recorded,
- outcome_recorded.

Why:

- evidence dashboard becomes easier,
- auditability improves,
- automation boundaries are visible.

---

## 9. Build Phases

### Phase 1: Remove Tracking Work

Build now:

- Google Sheet formulas,
- priority tier,
- status dropdowns,
- follow-up dates,
- dashboard counts.

Automation level:

- fully automatable.

Founder effort removed:

- score math,
- follow-up date calculation,
- dashboard counting.

Chris still:

- finds prospects,
- writes drafts,
- sends,
- replies.

### Phase 2: Remove Research Data Entry

Build next:

- source keyword generator,
- candidate URL collector,
- public field extractor,
- duplicate detector,
- contact path checker.

Automation level:

- AI-assisted with approval.

Founder effort removed:

- copying basic fields,
- checking duplicates,
- classifying obvious non-fits.

Chris still:

- approves candidate and contact safety.

### Phase 3: Remove Drafting Work

Build next:

- personalization generator,
- message version selector,
- outreach draft generator,
- compliance checker.

Automation level:

- AI-assisted with human approval.

Founder effort removed:

- first draft writing,
- checklist review,
- template adaptation.

Chris still:

- approves and sends.

### Phase 4: Remove Reply Sorting Work

Build next:

- reply classifier,
- suggested response drafts,
- next status recommendations,
- reminder updates.

Automation level:

- AI-assisted.

Founder effort removed:

- deciding which template to use,
- updating status manually after each reply,
- remembering next step.

Chris still:

- replies.

### Phase 5: Remove Diagnostic Drafting Work

Build after data submissions exist:

- privacy redaction checker,
- diagnostic draft generator,
- objection extraction,
- follow-up message suggestion,
- data quality note.

Automation level:

- AI-assisted with approval.

Founder effort removed:

- first diagnostic draft,
- repetitive structure,
- evidence extraction.

Chris still:

- approves and delivers.

### Phase 6: Evidence Review Automation

Build after 30-50 prospects:

- weekly evidence summary,
- source conversion report,
- message version comparison,
- blocker summary,
- continue/pivot/stop signal.

Automation level:

- fully automatable for metrics,
- AI-assisted for interpretation.

Founder effort removed:

- manual weekly summary writing,
- manual pattern counting.

Chris still:

- makes the decision.

---

## 10. Privacy, Legal, And Outreach Boundaries

The automation roadmap must obey these rules.

### Allowed

- Public company pages.
- Public contact pages.
- Public business emails.
- Public YouTube business emails.
- Public Naver/Kakao business contact paths.
- Public content used for personalization.
- Chris-owned outreach notes.
- Prospect-submitted anonymized data.

### Not Allowed

- Private personal scraping.
- Guessing emails.
- Purchased lists.
- Scraping commenters, followers, or private profiles.
- Auto-submitting contact forms.
- Auto-sending email or DMs.
- Collecting customer personal data.
- Analyzing unredacted sensitive data without review.
- Pretending automation is a human relationship.

### Safe Automation Boundary

Safe:

- find public pages,
- extract public business fields,
- score fit,
- draft,
- flag,
- remind,
- summarize.

Not safe:

- send,
- reply,
- submit,
- scrape private data,
- decide commercial trust moments alone.

---

## 11. Final System Principle

The system should make Chris faster without making him less responsible.

Future state:

```text
System finds.
System extracts.
System scores.
System drafts.
System checks.
Chris approves.
Chris sends.
System tracks.
System suggests replies.
Chris replies.
System summarizes evidence.
Chris decides.
```

If a feature makes it easier to contact more people without better fit, remove it.

If a feature reduces repetitive work while preserving human approval, build it.
