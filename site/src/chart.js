// Layout for a stacked bar chart of monthly rides, in plot coordinates
// (origin top-left, y increasing downwards, as in SVG).
// Takes the output of monthlyRidesByCity; knows nothing about the DOM or colour.
const BAR_FRACTION = 0.6; // share of each month's slot taken by its bar

const TARGET_GRIDLINES = 6; // roughly how many gridline steps to aim for

// The smallest of 1, 2 or 5 times a power of ten that splits max into about
// TARGET_GRIDLINES steps; never below 1, since rides are whole numbers.
function roundStep(max) {
  const rough = max / TARGET_GRIDLINES;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough);
  return Math.max(1, step);
}

export function layoutStackedBars(months, { width, height }) {
  const largest = Math.max(0, ...months.map((m) => m.total));
  const step = roundStep(largest);
  const yMax = Math.ceil(largest / step) * step;
  const scale = (rides) => (yMax === 0 ? 0 : (rides / yMax) * height);

  const gridlines = [];
  for (let value = 0; value <= yMax; value += step) {
    gridlines.push({ value, y: height - scale(value) });
  }

  const slot = width / months.length;
  const barWidth = slot * BAR_FRACTION;

  const bars = months.map(({ month, cities }, i) => {
    const x = i * slot + (slot - barWidth) / 2;
    let top = height;
    const segments = cities.map(({ city, rides }) => {
      const segmentHeight = scale(rides);
      top -= segmentHeight;
      return { city, rides, x, y: top, width: barWidth, height: segmentHeight };
    });
    return { month, x, width: barWidth, segments };
  });

  return { yMax, gridlines, bars };
}
