"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country_code?: string;
}

interface Props {
  locationName: string;
  isDefault: boolean;
}

function labelFor(r: GeocodingResult): string {
  return [r.name, r.admin1, r.country_code].filter(Boolean).join(", ");
}

export default function LocationPicker({ locationName, isDefault }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fetched, setFetched] = useState<GeocodingResult[]>([]);
  const searchable = query.trim().length >= 2;
  const results = searchable ? fetched : [];

  // Debounced city search against Open-Meteo's geocoding API
  useEffect(() => {
    if (!searchable) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?count=5&name=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );
        const data: { results?: GeocodingResult[] } = await res.json();
        setFetched(data.results ?? []);
      } catch {
        // Aborted or network error; keep previous results
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchable]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function select(r: GeocodingResult) {
    const params = new URLSearchParams({
      lat: r.latitude.toFixed(4),
      lon: r.longitude.toFixed(4),
      name: labelFor(r),
    });
    close();
    router.push(`/?${params}`);
  }

  function reset() {
    close();
    router.push("/");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
      >
        📍 {locationName}
      </button>
    );
  }

  return (
    <div className="relative w-64">
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
          if (e.key === "Enter" && results[0]) select(results[0]);
        }}
        placeholder="Search for a city…"
        className="w-full px-4 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 outline-none focus:border-zinc-500"
      />
      <ul className="absolute left-0 right-0 mt-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden text-sm">
        {results.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => select(r)}
              className="w-full text-left px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {labelFor(r)}
            </button>
          </li>
        ))}
        {!isDefault && (
          <li>
            <button
              onClick={reset}
              className="w-full text-left px-4 py-2 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Back to Calgary
            </button>
          </li>
        )}
        <li>
          <button
            onClick={close}
            className="w-full text-left px-4 py-2 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </li>
      </ul>
    </div>
  );
}
