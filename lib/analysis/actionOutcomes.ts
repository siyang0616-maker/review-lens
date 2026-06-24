import type { ActionOutcome, OutcomeSummary, RevenueAction } from "../../types/revenue";
import { parseMoney } from "./money";

export const actionOutcomesStorageKey = "reviewToRevenue.actionOutcomes";

export function mergeActionOutcome(
  outcomes: ActionOutcome[],
  nextOutcome: ActionOutcome
): ActionOutcome[] {
  return [...outcomes, nextOutcome].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function latestStatusForAction(actionId: string, outcomes: ActionOutcome[]) {
  return outcomes
    .filter((outcome) => outcome.actionId === actionId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.status;
}

export function applyOutcomesToActions(
  actions: RevenueAction[],
  outcomes: ActionOutcome[]
): RevenueAction[] {
  return actions.map((action) => ({
    ...action,
    status: latestStatusForAction(action.id, outcomes) ?? action.status,
    updatedAt: outcomes
      .filter((outcome) => outcome.actionId === action.id)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.timestamp
  }));
}

export function summarizeActionOutcomes(
  actions: RevenueAction[],
  outcomes: ActionOutcome[]
): OutcomeSummary {
  const latestByAction = new Map<string, ActionOutcome>();

  for (const outcome of outcomes) {
    const current = latestByAction.get(outcome.actionId);

    if (!current || current.timestamp < outcome.timestamp) {
      latestByAction.set(outcome.actionId, outcome);
    }
  }

  const wonActionIds = new Set(
    Array.from(latestByAction.values())
      .filter((outcome) => outcome.status === "won")
      .map((outcome) => outcome.actionId)
  );

  return {
    bookingsRecovered: countLatestStatus(latestByAction, "booked"),
    estimatedRecoveredRevenue: actions
      .filter((action) => wonActionIds.has(action.id))
      .reduce((total, action) => total + parseMoney(action.potentialValue), 0),
    followupsCopied: countAnyStatus(outcomes, "copied"),
    followupsSent: countAnyStatus(outcomes, "sent"),
    repliesRecovered: countLatestStatus(latestByAction, "replied"),
    wonDeals: countLatestStatus(latestByAction, "won")
  };
}

function countAnyStatus(outcomes: ActionOutcome[], status: ActionOutcome["status"]) {
  return new Set(
    outcomes.filter((outcome) => outcome.status === status).map((outcome) => outcome.actionId)
  ).size;
}

function countLatestStatus(
  latestByAction: Map<string, ActionOutcome>,
  status: ActionOutcome["status"]
) {
  return Array.from(latestByAction.values()).filter((outcome) => outcome.status === status).length;
}
