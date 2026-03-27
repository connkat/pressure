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

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
          Surface Pressure
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {locationName} &middot; {dateLabel}
        </p>
      </div>

      <p
        className={`text-center text-base font-medium ${
          bigChange
            ? "text-rose-600 dark:text-rose-400"
            : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        {message}
      </p>

      <div className="text-center">
        <button
          onClick={() => setShowMore(true)}
          className="text-sm font-medium text-zinc-400 dark:text-zinc-500 underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          more
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
