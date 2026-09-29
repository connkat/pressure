"use client";

import { useState } from "react";
import PressureModal from "./PressureModal";
import { changeColor } from "./changeColor";
import type { ChangeWindow } from "./windows";

interface Props {
  message: string;
  todayMean: number;
  yesterdayMean: number;
  diff: number | undefined;
  latest: number | null;
  changes: Partial<Record<ChangeWindow, number>>;
  dateLabel: string;
  locationName: string;
}

export default function PressureDisplay({
  message,
  todayMean,
  yesterdayMean,
  diff,
  latest,
  changes,
  dateLabel,
  locationName,
}: Props) {
  const [showMore, setShowMore] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="w-screen space-y-6">
      {!showMessage && (
        <div
          className="fixed inset-0 z-10 md:hidden"
          onClick={() => setShowMessage(true)}
        />
      )}
      <div className="text-center pb-8">
        <h2 className="glitch-text text-5xl text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
          Pressure
        </h2>
      </div>

      <div className="text-center cursor-pointer" onClick={() => setShowMessage((v) => !v)}>
        {showMessage ? (
          <>
            <p className={`mt-6 text-4xl font-semibold tabular-nums ${changeColor(diff)}`}>
              {diff === undefined ? "—" : `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}`}
              <span className="text-base font-normal text-zinc-400 dark:text-zinc-500 ml-1">hPa</span>
            </p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
              change in the last 48 hours
            </p>
            <p className="mt-24 text-base font-medium text-zinc-500 dark:text-zinc-400">
              {message}
            </p>
          </>
        ) : (
          <>
            <h4 className="text-2xl text-zinc-500 dark:text-zinc-400 font-['Pencerio'] w-full transition-colors hover:text-zinc-800 dark:hover:text-zinc-200">
              <span className="hidden md:inline">Is your migraine from a Chinook or something else?</span>
              <span className="md:hidden">Tap to find out if your migraine from a Chinook or something else?</span>
            </h4>
            <p className="hidden md:block text-xs text-zinc-400 dark:text-zinc-500 mt-1">(click to find out)</p>
          </>
        )}
      </div>

      {showMessage && (
        <div className="flex justify-end max-w-lg mx-auto w-full mt-16">
          <button
            onClick={() => setShowMore(true)}
            className="hover-glitch px-4 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="glitch-label">Why?</span>
          </button>
        </div>
      )}

      {showMore && (
        <PressureModal
          onClose={() => setShowMore(false)}
          todayMean={todayMean}
          yesterdayMean={yesterdayMean}
          latest={latest}
          changes={changes}
          dateLabel={dateLabel}
          locationName={locationName}
        />
      )}
    </div>
  );
}
