import { connection } from "next/server";
import PressureDisplay from "./PressureDisplay";
import { MAX_HOURS, PAST_DAYS, changeOver, type HourlyPoint } from "./windows";

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

const MAYBE_MESSAGES = [
  "There's a small pressure change. Maybe it's the weather, maybe not.",
  "Slight pressure change detected. Could be the weather, could be your posture.",
  "A little pressure shift. Maybe it's the Chinook, maybe it's just you.",
  "Minor pressure change. Could be the weather, could be stress.",
];

function pickRandom(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

const DEFAULT_LAT = 51.0447;
const DEFAULT_LON = -114.0719;
const DEFAULT_LOCATION_NAME = "Calgary, AB";

type SearchParams = { [key: string]: string | string[] | undefined };

// Reads ?lat=&lon=&name= from the URL, falling back to Calgary
function resolveLocation(params: SearchParams) {
  const lat = Number(params.lat);
  const lon = Number(params.lon);
  const valid =
    typeof params.lat === "string" &&
    typeof params.lon === "string" &&
    Number.isFinite(lat) && Math.abs(lat) <= 90 &&
    Number.isFinite(lon) && Math.abs(lon) <= 180;
  if (!valid) {
    return { lat: DEFAULT_LAT, lon: DEFAULT_LON, name: DEFAULT_LOCATION_NAME, isDefault: true };
  }
  const name = typeof params.name === "string" && params.name ? params.name : `${lat}, ${lon}`;
  return { lat, lon, name, isDefault: false };
}

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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();
  const location = resolveLocation(await searchParams);
  const today = new Date();

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${location.lat}&longitude=${location.lon}` +
    `&hourly=surface_pressure&current=surface_pressure` +
    `&past_days=${PAST_DAYS}&forecast_days=1` +
    `&timezone=auto`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status}`);
  }
  const data: OpenMeteoResponse = await res.json();

  const allPressure = data.hourly.surface_pressure;
  const todayStart = PAST_DAYS * 24;
  const yesterdayValues = allPressure.slice(todayStart - 24, todayStart);
  const todayValues = allPressure.slice(todayStart).filter((v) => v !== null);

  const yesterdayMean = mean(yesterdayValues);
  const todayMean = mean(todayValues);

  // Hourly readings for the longest selectable window, oldest first, ending at the current hour
  const currentHour = data.current.time.slice(0, 13) + ":00";
  const currentIndex = data.hourly.time.indexOf(currentHour);
  const history: HourlyPoint[] = [];
  for (let i = Math.max(0, currentIndex - MAX_HOURS); i <= currentIndex; i++) {
    history.push({ time: data.hourly.time[i], pressure: allPressure[i] });
  }

  const diff = changeOver(history, 48);
  const size = diff === undefined ? 0 : Math.abs(diff);

  const blameMessage =
    size >= 10
      ? "It's not your fault, there's a pressure change."
      : pickRandom(size >= 5 ? MAYBE_MESSAGES : BLAME_MESSAGES);

  const latest = data.current.surface_pressure ?? null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center pt-[25vh] px-4 font-sans">
      <PressureDisplay
        message={blameMessage}
        todayMean={todayMean}
        yesterdayMean={yesterdayMean}
        diff={diff}
        latest={latest}
        history={history}
        dateLabel={formatDate(today)}
        locationName={location.name}
        isDefaultLocation={location.isDefault}
      />
    </main>
  );
}
