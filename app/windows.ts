export const WINDOWS = [24, 36, 48] as const;
export type ChangeWindow = (typeof WINDOWS)[number];

export interface HourlyPoint {
  time: string; // local time from Open-Meteo, e.g. "2026-09-29T10:00"
  pressure: number | null;
}
