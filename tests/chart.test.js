import { test } from "node:test";
import assert from "node:assert/strict";
import { layoutStackedBars } from "../site/src/chart.js";

test("layoutStackedBars stacks cities from the bottom in order, heights proportional to rides", () => {
  const months = [
    {
      month: "2026-07",
      cities: [{ city: "Boston", rides: 4 }, { city: "Miami", rides: 6 }],
      total: 10,
    },
  ];
  const [bar] = layoutStackedBars(months, { width: 100, height: 200 }).bars;
  const segments = bar.segments.map(({ city, rides, y, height }) => ({ city, rides, y, height }));
  assert.deepEqual(segments, [
    { city: "Boston", rides: 4, y: 120, height: 80 },
    { city: "Miami", rides: 6, y: 0, height: 120 },
  ]);
});

test("layoutStackedBars centres one bar per month in equal slots, segments matching their bar", () => {
  const months = [
    { month: "2026-07", cities: [{ city: "Boston", rides: 5 }], total: 5 },
    { month: "2026-08", cities: [{ city: "Boston", rides: 10 }], total: 10 },
  ];
  const { bars } = layoutStackedBars(months, { width: 200, height: 100 });
  assert.deepEqual(
    bars.map(({ month, x, width, segments }) => ({
      month,
      x,
      width,
      segment: { x: segments[0].x, width: segments[0].width },
    })),
    [
      { month: "2026-07", x: 20, width: 60, segment: { x: 20, width: 60 } },
      { month: "2026-08", x: 120, width: 60, segment: { x: 120, width: 60 } },
    ],
  );
});

test("layoutStackedBars rounds the y-axis up from the largest month and puts gridlines at round numbers", () => {
  const months = [
    { month: "2026-07", cities: [{ city: "Boston", rides: 11433 }], total: 11433 },
    { month: "2026-08", cities: [{ city: "Boston", rides: 11845 }], total: 11845 },
  ];
  const layout = layoutStackedBars(months, { width: 200, height: 120 });
  assert.equal(layout.yMax, 12000);
  assert.deepEqual(layout.gridlines, [
    { value: 0, y: 120 },
    { value: 2000, y: 100 },
    { value: 4000, y: 80 },
    { value: 6000, y: 60 },
    { value: 8000, y: 40 },
    { value: 10000, y: 20 },
    { value: 12000, y: 0 },
  ]);
  const august = layout.bars[1].segments[0];
  assert.ok(Math.abs(august.height - 118.45) < 1e-9);
});

test("layoutStackedBars gives a city with zero monthly rides a zero-height segment and no gap", () => {
  const months = [
    {
      month: "2026-07",
      cities: [
        { city: "Boston", rides: 5 },
        { city: "Denver", rides: 0 },
        { city: "Miami", rides: 5 },
      ],
      total: 10,
    },
  ];
  const [bar] = layoutStackedBars(months, { width: 100, height: 100 }).bars;
  assert.deepEqual(
    bar.segments.map(({ city, y, height }) => ({ city, y, height })),
    [
      { city: "Boston", y: 50, height: 50 },
      { city: "Denver", y: 50, height: 0 },
      { city: "Miami", y: 0, height: 50 },
    ],
  );
});

test("layoutStackedBars lays out no months as an empty chart with only a baseline", () => {
  assert.deepEqual(layoutStackedBars([], { width: 200, height: 100 }), {
    yMax: 0,
    gridlines: [{ value: 0, y: 100 }],
    bars: [],
  });
});
