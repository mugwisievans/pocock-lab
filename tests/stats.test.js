import { test } from "node:test";
import assert from "node:assert/strict";
import { totalRides, ridesByCity, monthlyRidesByCity, monthLabel } from "../site/src/stats.js";

const rows = [
  { date: "2026-07-01", city: "Miami", rides: "10" },
  { date: "2026-07-01", city: "Boston", rides: "20" },
  { date: "2026-07-02", city: "Boston", rides: 30 },
];

test("totalRides sums the rides column", () => {
  assert.equal(totalRides(rows), 60);
});

test("ridesByCity totals per city in alphabetical order", () => {
  assert.deepEqual(ridesByCity(rows), [
    { city: "Boston", rides: 50 },
    { city: "Miami", rides: 10 },
  ]);
});

test("monthlyRidesByCity sums each city's rides per calendar month", () => {
  const rows = [
    { date: "2026-07-01", city: "Boston", rides: "10" },
    { date: "2026-07-31", city: "Boston", rides: "5" },
    { date: "2026-08-01", city: "Boston", rides: "7" },
  ];
  assert.deepEqual(monthlyRidesByCity(rows), [
    { month: "2026-07", cities: [{ city: "Boston", rides: 15 }], total: 15 },
    { month: "2026-08", cities: [{ city: "Boston", rides: 7 }], total: 7 },
  ]);
});

test("monthlyRidesByCity orders months by date and cities alphabetically", () => {
  const rows = [
    { date: "2026-09-01", city: "Miami", rides: "1" },
    { date: "2026-09-01", city: "Boston", rides: "2" },
    { date: "2026-07-01", city: "Miami", rides: "3" },
    { date: "2026-07-01", city: "Boston", rides: "4" },
  ];
  assert.deepEqual(monthlyRidesByCity(rows), [
    {
      month: "2026-07",
      cities: [{ city: "Boston", rides: 4 }, { city: "Miami", rides: 3 }],
      total: 7,
    },
    {
      month: "2026-09",
      cities: [{ city: "Boston", rides: 2 }, { city: "Miami", rides: 1 }],
      total: 3,
    },
  ]);
});

test("monthlyRidesByCity gives a city with no rides in a month zero monthly rides", () => {
  const rows = [
    { date: "2026-07-01", city: "Boston", rides: 4 },
    { date: "2026-07-01", city: "Denver", rides: "6" },
    { date: "2026-08-01", city: "Boston", rides: 5 },
  ];
  assert.deepEqual(monthlyRidesByCity(rows), [
    {
      month: "2026-07",
      cities: [{ city: "Boston", rides: 4 }, { city: "Denver", rides: 6 }],
      total: 10,
    },
    {
      month: "2026-08",
      cities: [{ city: "Boston", rides: 5 }, { city: "Denver", rides: 0 }],
      total: 5,
    },
  ]);
});

test("monthlyRidesByCity returns no months for no rows", () => {
  assert.deepEqual(monthlyRidesByCity([]), []);
});

test("monthLabel names a month like Jul 2026", () => {
  assert.equal(monthLabel("2026-07"), "Jul 2026");
  assert.equal(monthLabel("2026-12"), "Dec 2026");
  assert.equal(monthLabel("2027-01"), "Jan 2027");
});
