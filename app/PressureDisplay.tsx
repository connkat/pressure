"use client";

import { useState } from "react";
import PressureModal from "./PressureModal";

interface Props {
  message: string;
  bigChange: boolean;
  todayMean: number;
  yesterdayMean: number;
  diff: number;
  rising: boolean;
  falling: boolean;
  latest: number | null;
  dateLabel: string;
  locationName: string;
}

export default function PressureDisplay({
  message,
  bigChange,
  todayMean,
  yesterdayMean,
  diff,
  rising,
  falling,
  latest,
  dateLabel,
  locationName,
}: Props) {
  const [showMore, setShowMore] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="w-screen space-y-6">
      <div className="text-center pb-8">
        <h2 className="glitch-text text-5xl text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
          Pressure
        </h2>
      </div>

      <div className="text-center cursor-pointer" onClick={() => setShowMessage((v) => !v)}>
        {showMessage ? (
          <p
            className={`text-base font-medium ${
              bigChange
                ? "text-rose-600 dark:text-rose-400"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {message}
          </p>
        ) : (
          <h4 className="text-2xl text-zinc-500 dark:text-zinc-400 font-[family-name:'Pencerio'] w-full transition-colors hover:text-zinc-800 dark:hover:text-zinc-200">
            Is your migraine from a Chinook or something else?
          </h4>
        )}
      </div>

      <div className="flex justify-end max-w-lg mx-auto w-full mt-16">
        <button
          onClick={() => setShowMore(true)}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          More
        </button>
      </div>

      {showMore && (
        <PressureModal
          onClose={() => setShowMore(false)}
          todayMean={todayMean}
          yesterdayMean={yesterdayMean}
          diff={diff}
          rising={rising}
          falling={falling}
          latest={latest}
          dateLabel={dateLabel}
          locationName={locationName}
        />
      )}
    </div>
  );
}
