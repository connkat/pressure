"use client";

import { useState } from "react";
import type { HourlyPoint } from "./windows";

interface Props {
  points: HourlyPoint[];
}

const WIDTH = 400;
const HEIGHT = 160;
const PAD = { top: 12, right: 8, bottom: 20, left: 40 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

// Open-Meteo times are already local, so format the string as-is (no timezone shift)
function formatTime(time: string): string {
  const d = new Date(time + "Z");
  return d.toLocaleString("en-CA", {
    weekday: "short",
    hour: "numeric",
    timeZone: "UTC",
  });
}

export default function PressureChart({ points }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const values = points.map((p) => p.pressure).filter((v): v is number => v !== null);
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * 0.15, 1);
  const lo = min - pad;
  const hi = max + pad;

  const x = (i: number) => PAD.left + (i / (points.length - 1)) * PLOT_W;
  const y = (v: number) => PAD.top + (1 - (v - lo) / (hi - lo)) * PLOT_H;

  // Break the line at missing readings instead of drawing through them
  let path = "";
  let penDown = false;
  points.forEach((p, i) => {
    if (p.pressure === null) {
      penDown = false;
      return;
    }
    path += `${penDown ? "L" : "M"}${x(i).toFixed(1)},${y(p.pressure).toFixed(1)}`;
    penDown = true;
  });

  const handleMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setHover(Math.round(ratio * (points.length - 1)));
  };

  const hovered = hover !== null ? points[hover] : null;
  const ticks = [max, min];

  return (
    <figure className="px-5">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label={`Hourly pressure, ranging from ${min.toFixed(1)} to ${max.toFixed(1)} hPa`}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-zinc-200 dark:stroke-zinc-800"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-zinc-400 dark:fill-zinc-500 text-[10px] tabular-nums"
            >
              {t.toFixed(0)}
            </text>
          </g>
        ))}

        <text
          x={PAD.left}
          y={HEIGHT - 4}
          className="fill-zinc-400 dark:fill-zinc-500 text-[10px]"
        >
          {points.length - 1}h ago
        </text>
        <text
          x={WIDTH - PAD.right}
          y={HEIGHT - 4}
          textAnchor="end"
          className="fill-zinc-400 dark:fill-zinc-500 text-[10px]"
        >
          now
        </text>

        <path
          d={path}
          fill="none"
          className="stroke-zinc-700 dark:stroke-zinc-300"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {hovered && hover !== null && (
          <g pointerEvents="none">
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
              className="stroke-zinc-300 dark:stroke-zinc-700"
              strokeWidth={1}
            />
            {hovered.pressure !== null && (
              <circle
                cx={x(hover)}
                cy={y(hovered.pressure)}
                r={4}
                strokeWidth={2}
                className="fill-zinc-700 dark:fill-zinc-300 stroke-white dark:stroke-zinc-900"
              />
            )}
          </g>
        )}

        {/* Hit area larger than the line so hover/touch is easy */}
        <rect
          x={PAD.left}
          y={0}
          width={PLOT_W}
          height={HEIGHT}
          fill="transparent"
          onPointerMove={handleMove}
          onPointerDown={handleMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      <figcaption className="h-4 text-center text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
        {hovered
          ? `${formatTime(hovered.time)} · ${
              hovered.pressure === null ? "no data" : `${hovered.pressure.toFixed(1)} hPa`
            }`
          : "Hourly pressure"}
      </figcaption>
    </figure>
  );
}
