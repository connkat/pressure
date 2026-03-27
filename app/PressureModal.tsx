"use client";

interface Props {
  onClose: () => void;
  todayMean: number;
  yesterdayMean: number;
  diff: number;
  rising: boolean;
  falling: boolean;
  latest: number | null;
  dateLabel: string;
  locationName: string;
}

export default function PressureModal({
  onClose,
  todayMean,
  yesterdayMean,
  diff,
  rising,
  falling,
  latest,
  dateLabel,
  locationName,
}: Props) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      <div className="glitch-modal fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {locationName} &middot; {dateLabel}
          </p>
          <button
            onClick={onClose}
            className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-lg leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {latest !== null && (
          <div className="text-center py-4">
            <span className="text-6xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
              {latest.toFixed(0)}
            </span>
            <span className="ml-2 text-xl text-zinc-500 dark:text-zinc-400">
              hPa
            </span>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              current
            </p>
          </div>
        )}

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Today (mean)
            </span>
            <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {todayMean.toFixed(1)} hPa
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Yesterday (mean)
            </span>
            <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {yesterdayMean.toFixed(1)} hPa
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Change
            </span>
            <span
              className={`text-sm font-semibold tabular-nums ${
                rising
                  ? "text-emerald-600 dark:text-emerald-400"
                  : falling
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {diff >= 0 ? "+" : ""}
              {diff.toFixed(1)} hPa{" "}
              {rising ? "rising" : falling ? "falling" : "steady"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
