"use client";

import { useState } from "react";
import { WINDOWS, type ChangeWindow, type HourlyPoint } from "./windows";
import PressureChart from "./PressureChart";
import { changeColor } from "./changeColor";

interface Props {
  onClose: () => void;
  todayMean: number;
  yesterdayMean: number;
  latest: number | null;
  changes: Partial<Record<ChangeWindow, number>>;
  history: HourlyPoint[];
  dateLabel: string;
  locationName: string;
}

export default function PressureModal({
  onClose,
  todayMean,
  yesterdayMean,
  latest,
  changes,
  history,
  dateLabel,
  locationName,
}: Props) {
  const [hours, setHours] = useState<ChangeWindow>(48);
  const diff = changes[hours];
  const rising = diff !== undefined && diff > 0.5;
  const falling = diff !== undefined && diff < -0.5;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

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

        <div className="text-center py-4">
          <div className="inline-flex mb-4 rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5">
            {WINDOWS.map((h) => (
              <button
                key={h}
                onClick={() => setHours(h)}
                aria-pressed={hours === h}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  hours === h
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
          <div>
            <span className={`text-6xl font-bold tabular-nums ${changeColor(diff)}`}>
              {diff === undefined ? "—" : `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}`}
            </span>
            <span className="ml-2 text-xl text-zinc-500 dark:text-zinc-400">
              hPa
            </span>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            {diff === undefined
              ? "no data"
              : `${rising ? "rising" : falling ? "falling" : "steady"} over the last ${hours} hours`}
          </p>
          <div className="mt-4">
            <PressureChart key={hours} points={history.slice(-(hours + 1))} />
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3 px-4">
            Pressure changes greater than 10hPa in a short period of time can
            cause migraines. If you are sensitive to pressure changes, then even
            5hPa might be enough to trigger symptoms.
          </p>
        </div>

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
          {latest !== null && (
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Current
              </span>
              <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {latest.toFixed(0)} hPa
              </span>
            </div>
          )}
        </div>
        <div className="px-5 py-3 text-center">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Data from Open-Meteo
          </a>
        </div>
      </div>
    </>
  );
}
