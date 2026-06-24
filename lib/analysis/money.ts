export function parseMoney(value?: string) {
  if (!value) {
    return 0;
  }

  const text = value.replace(/,/g, "").trim();
  const eokMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*억/);

  if (eokMatch) {
    return Math.round(Number.parseFloat(eokMatch[1]) * 100_000_000);
  }

  const manWonMatch = text.match(/([0-9]+(?:\.[0-9]+)?)\s*만원/);

  if (manWonMatch) {
    return Math.round(Number.parseFloat(manWonMatch[1]) * 10_000);
  }

  const numeric = Number.parseFloat(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? Math.round(numeric) : 0;
}
