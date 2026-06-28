import { languageSignals } from "./languageSignals";

export type LanguageSignalMatch = {
  label: string;
  phrase: string;
  meaning: string;
  categories: string[];
  severityHint: number;
};

export function extractLanguageSignals(text: string): LanguageSignalMatch[] {
  return languageSignals.flatMap((signal) => {
    const flags = signal.pattern.flags.includes("g")
      ? signal.pattern.flags
      : `${signal.pattern.flags}g`;
    const pattern = new RegExp(signal.pattern.source, flags);
    const matches: LanguageSignalMatch[] = [];

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
