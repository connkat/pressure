export const WINDOWS = [24, 36, 48] as const;
export type ChangeWindow = (typeof WINDOWS)[number];
