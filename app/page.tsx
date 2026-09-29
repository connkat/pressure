import { connection } from "next/server";
import PressureDisplay from "./PressureDisplay";
import { WINDOWS, type ChangeWindow } from "./windows";

const BLAME_MESSAGES = [
  "Nope, not the weather. Go drink some water.",
  "Not the weather today my friend.",
  "No big pressure change right now, maybe get some sleep.",
  "Pressure's steady. Have you tried eating something?",
  "Can't blame the Chinook today. Maybe it's just a Monday.",
  "Skies are stable. Could be stress, could be posture.",
  "No pressure drama today. When did you last go outside?",
  "Atmosphere is chill. Your neck muscles might not be.",
  "Not the barometer's fault this time.",
  "Pressure looks fine. Hydration check?",
];

const DEFAULT_LAT = 51.0447;
const DEFAULT_LON = -114.0719;
const LOCATION_NAME = "Calgary, AB";

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function mean(values: (number | null)[]): number {
  const valid = values.filter((v): v is number => v !== null);
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

interface OpenMeteoResponse {
  current: {
    time: string;
    surface_pressure: number;
  };
  hourly: {
    time: string[];
    surface_pressure: (number | null)[];
  };
}

export default async function Home() {
  await connection();
  const today = new Date();

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}` +
    `&hourly=surface_pressure&current=surface_pressure` +
    `&past_days=2&forecast_days=1` +
    `&timezone=auto`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status}`);
  }
  const data: OpenMeteoResponse = await res.json();

  const allPressure = data.hourly.surface_pressure;
  const yesterdayValues = allPressure.slice(24, 48);
  const todayValues = allPressure.slice(48).filter((v) => v !== null);

  const yesterdayMean = mean(yesterdayValues);
  const todayMean = mean(todayValues);

  // Change from N hours ago to the current hour
  const currentHour = data.current.time.slice(0, 13) + ":00";
  const currentIndex = data.hourly.time.indexOf(currentHour);
  const changes: Partial<Record<ChangeWindow, number>> = {};
  for (const hours of WINDOWS) {
    const now = allPressure[currentIndex];
    const then = allPressure[currentIndex - hours];
    if (currentIndex >= hours && now != null && then != null) {
      changes[hours] = now - then;
    }
  }

  const diff = changes[48];
  const bigChange = diff !== undefined && Math.abs(diff) >= 10;

  const blameMessage = bigChange
    ? "It's not your fault, there's a pressure change."
    // eslint-disable-next-line react-hooks/purity
    : BLAME_MESSAGES[Math.floor(Math.random() * BLAME_MESSAGES.length)];

  const latest = data.current.surface_pressure ?? null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center pt-[25vh] px-4 font-sans">
      <PressureDisplay
        message={blameMessage}
        todayMean={todayMean}
        yesterdayMean={yesterdayMean}
        diff={diff}
        latest={latest}
        changes={changes}
        dateLabel={formatDate(today)}
        locationName={LOCATION_NAME}
      />
    </main>
  );
}
