/**
 * Built-in copy of the published interest rate and charges schedule.
 *
 * The live schedule is edited in the /admin dashboard and served by the
 * backend (GET /api/rates). This file is the fallback the /interest-rates page
 * renders from: instantly on first paint, and permanently if the API is
 * unreachable. Read through src/lib/rateStore.js, never imported directly by
 * the page.
 *
 * Keep these values identical to DEFAULT_RATES in
 * backend/src/routes/rates.js, so a visitor sees the same sheet either way.
 */

/**
 * ⚠️  PLACEHOLDER dates — not a published Manokamana figure. Set the real
 * effective date in the admin dashboard (Rates → Effective from); this copy
 * only shows when the backend can't be reached.
 */
export const EFFECTIVE_FROM = '2026-07-17'
export const EFFECTIVE_FROM_BS = 'Shrawan 1, 2083'

/** Published (base) rate, quoted on its own in the masthead. */
export const PUBLISH_RATE = 9.99

/** Maximum premium added over the publish rate, in percentage points. */
export const MAX_PREMIUM = 2

/**
 * The rows of the sheet, in the order they are published.
 *
 * `tier` drives the typographic hierarchy on the page: 'rate' rows are set as
 * large display figures, 'charge' rows as compact monospace. It does not
 * change the published order or wording.
 */
export const schedule = [
  { particular: 'Publish Rate', value: '9.99%', tier: 'rate' },
  { particular: 'Interest rate (Maximum)', value: 'Publish rate + 2%', tier: 'rate' },
  { particular: 'Service Charges', value: '1% of loan amount', tier: 'charge' },
  { particular: 'CICL Charges', value: 'Actual basis', tier: 'charge' },
  {
    particular: 'Insurance',
    value: 'As mentioned in policy, actual basis',
    tier: 'charge',
  },
]
