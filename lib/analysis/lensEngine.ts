import { hiddenSignals } from "../hidden-signals";

export type LensSignal = {
  label: string;
  phrase: string;
  meaning: string;
  categories: string[];
  severityHint: number;
};

export function extractInterpretationSignals(text: string): LensSignal[] {
  return hiddenSignals.flatMap((signal) => {
    const flags = signal.pattern.flags.includes("g")
      ? signal.pattern.flags
      : `${signal.pattern.flags}g`;
    const pattern = new RegExp(signal.pattern.source, flags);
    const matches: LensSignal[] = [];

    for (const match of text.matchAll(pattern)) {
      if (!match[0]) {
        continue;
      }

      matches.push({
        categories: signal.categories,
        label: signal.label,
        meaning: signal.meaning,
        phrase: match[0],
        severityHint: signal.severityHint
      });
    }

    return matches;
  });
}
