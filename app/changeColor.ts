// Text colour for a pressure change: red at 10+ hPa, orange at 5+ hPa
export function changeColor(diff: number | undefined): string {
  const size = diff === undefined ? 0 : Math.abs(diff);
  if (size >= 10) return "text-rose-600/50 dark:text-rose-400/50";
  if (size >= 5) return "text-orange-600/50 dark:text-orange-400/50";
  return "text-zinc-900 dark:text-zinc-400";
}
