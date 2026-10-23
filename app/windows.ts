export const WINDOWS = [24, 36, 48] as const;

// How far back a custom window can go; the page fetches this much history
export const PAST_DAYS = 7;
export const MAX_HOURS = PAST_DAYS * 24;

export interface HourlyPoint {
  time: string; // local time from Open-Meteo, e.g. "2026-09-29T10:00"
  pressure: number | null;
}

// Change from `hours` ago to the latest point; history is oldest first, ending now
export function changeOver(history: HourlyPoint[], hours: number): number | undefined {
  const now = history[history.length - 1]?.pressure;
  const then = history[history.length - 1 - hours]?.pressure;
  if (now == null || then == null) return undefined;
  return now - then;
}
