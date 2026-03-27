import PressureDisplay from "./PressureDisplay";

const BLAME_MESSAGES = [
  "Nope, not the weather. Go drink some water.",
  "Not the weather today my friend.",
  "No pressure issues right now, maybe get some sleep.",
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
  hourly: {
    time: string[];
    surface_pressure: (number | null)[];
  };
}

export default async function Home() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}` +
    `&hourly=surface_pressure` +
    `&start_date=${formatDate(yesterday)}&end_date=${formatDate(today)}` +
    `&timezone=auto`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status}`);
  }
  const data: OpenMeteoResponse = await res.json();

  const allPressure = data.hourly.surface_pressure;
  const yesterdayValues = allPressure.slice(0, 24);
  const todayValues = allPressure.slice(24).filter((v) => v !== null);

  const yesterdayMean = mean(yesterdayValues);
  const todayMean = mean(todayValues);
  const diff = todayMean - yesterdayMean;

  const rising = diff > 0.5;
  const falling = diff < -0.5;
  const bigChange = Math.abs(diff) >= 10;

  const blameMessage = bigChange
    ? "It's not your fault, there's a pressure change."
    : BLAME_MESSAGES[today.getDate() % BLAME_MESSAGES.length];

  const latest = [...todayValues].reverse().find((v) => v !== null) ?? null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 font-sans">
      <PressureDisplay
        message={blameMessage}
        bigChange={bigChange}
        todayMean={todayMean}
        yesterdayMean={yesterdayMean}
        diff={diff}
        rising={rising}
        falling={falling}
        latest={latest}
        dateLabel={formatDate(today)}
        locationName={LOCATION_NAME}
      />
    </main>
  );
}
