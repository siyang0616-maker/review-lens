# Validation Plan

## Goal

Validate whether Review-to-Revenue AI produces actions a sales or growth team would actually use this week.

## Low-Credit Validation Rule

Do not start with external AI calls. Use the local engine first, then compare against real user judgment.

## Test Dataset

Ask each tester to provide one of the following:

- 20 to 50 customer reviews
- 10 to 30 inquiry messages
- 10 to 30 sales call notes
- 10 competitor review snippets
- A small CSV of stalled leads

## Validation Questions

After generating a report, ask:

1. Which signal would you act on first?
2. Which follow-up message would you actually send?
3. Which content idea feels publishable this week?
4. Which script improvement is closest to a real sales problem?
5. Which card feels generic or wrong?
6. What text evidence should have been used but was missed?

## Pass Criteria

The MVP passes a validation round if:

- The user can identify at least 1 lead to follow up.
- The user finds at least 1 content idea usable.
- The user finds at least 1 script suggestion usable.
- The user says the dashboard is more useful than a plain summary.

## Failure Signals

The MVP needs revision if:

- Outputs feel like generic marketing advice.
- Evidence snippets do not support the recommendation.
- The dashboard cannot prioritize.
- Lead rescue scoring does not match sales intuition.
- Follow-up messages sound spammy or too pushy.

## Next Iteration Loop

1. Collect a real dataset.
2. Run local analysis.
3. Mark accurate, weak, missed, and overinterpreted outputs.
4. Update keyword definitions and templates.
5. Run tests.
6. Repeat with a different vertical.
