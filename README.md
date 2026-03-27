# Pressure

Is your migraine from a Chinook or something else?

Pressure compares today's mean atmospheric surface pressure against yesterday's in Calgary, AB. If the change is significant (≥ 10 hPa), it lets you know the weather might be to blame.

## What it does

- Fetches hourly surface pressure data from [Open-Meteo](https://open-meteo.com/)
- Computes yesterday's and today's mean pressure
- Displays a randomized blame message on click — or flags a real pressure change if one exists
- Shows a detail modal with current pressure, daily means, and the pressure delta

## Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
