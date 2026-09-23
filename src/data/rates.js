/**
 * Built-in copy of the published monthly base rates.
 *
 * The live list is edited in the /admin dashboard and served by the backend
 * (GET /api/rates). This file is the fallback the /interest-rates page renders
 * from: instantly on first paint, and permanently if the API is unreachable.
 * Read through src/lib/rateStore.js, never imported directly by the page.
 *
 * Keep these values identical to DEFAULT_RATES in
 * backend/src/routes/rates.js, so a visitor sees the same table either way.
 */

/** Nepali (Bikram Sambat) months, in calendar order. */
export const BS_MONTHS = [
  'Baisakh',
  'Jestha',
  'Asadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
]

/**
 * One row per published rate: the BS date it was published (year, month name,
 * day), the same date in AD ('YYYY-MM-DD', optional) and the rate in percent.
 */
export const baseRates = [
  { year: 2083, month: 'Bhadra', day: 22, adDate: '2026-09-07', rate: 11 },
]
