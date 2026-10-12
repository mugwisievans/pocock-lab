# Rides dashboard

A small dashboard summarising how many rides were taken in each city over time.

## Language

**Ride**:
A single trip taken in a city; the data records rides as a daily count per city.
_Avoid_: Trip, booking

**City**:
A place where rides are counted, such as Boston, Denver or Miami.
_Avoid_: Market, region, location

**Month**:
A calendar month (e.g. Jul 2026); a month with only some days of data is still a month.
_Avoid_: Period, 30 days

**Monthly rides**:
The total rides in one city during one month; a city with no rides recorded in a month has zero monthly rides.
_Avoid_: Monthly volume, monthly count
