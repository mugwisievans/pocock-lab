// Summaries of ride rows: [{ date, city, rides }, ...] with rides as strings or numbers.

export function totalRides(rows) {
  return rows.reduce((sum, row) => sum + Number(row.rides), 0);
}

// Total rides per city, sorted by city name.
export function ridesByCity(rows) {
  const totals = new Map();
  for (const row of rows) {
    totals.set(row.city, (totals.get(row.city) ?? 0) + Number(row.rides));
  }
  return [...totals.entries()]
    .map(([city, rides]) => ({ city, rides }))
    .sort((a, b) => a.city.localeCompare(b.city));
}

// Monthly rides per city, one entry per calendar month (YYYY-MM) in date order.
// Every city appears in every month, alphabetically; a city with no rows in a month gets 0.
export function monthlyRidesByCity(rows) {
  const months = new Map();
  const allCities = new Set();
  for (const row of rows) {
    const month = row.date.slice(0, 7);
    if (!months.has(month)) months.set(month, new Map());
    const cities = months.get(month);
    cities.set(row.city, (cities.get(row.city) ?? 0) + Number(row.rides));
    allCities.add(row.city);
  }
  const cityNames = [...allCities].sort((a, b) => a.localeCompare(b));
  return [...months.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, totals]) => {
      const cities = cityNames.map((city) => ({ city, rides: totals.get(city) ?? 0 }));
      const total = cities.reduce((sum, c) => sum + c.rides, 0);
      return { month, cities, total };
    });
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Display name for a calendar month in YYYY-MM form, e.g. "2026-07" -> "Jul 2026".
export function monthLabel(month) {
  const [year, number] = month.split("-");
  return `${MONTH_NAMES[Number(number) - 1]} ${year}`;
}
