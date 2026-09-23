/**
 * Monthly base rate source: the list published through the /admin dashboard
 * (backend API), falling back to the built-in copy in src/data/rates.js.
 *
 * The API response is authoritative when it arrives. The only guard is an
 * empty list, which must never render as an empty table.
 */
import { BS_MONTHS, baseRates } from '../data/rates'
import { api } from './api'

/** Newest date first: by BS year, then month, then day. */
export function sortRates(rows) {
  const order = (r) =>
    Number(r.year) * 400 + BS_MONTHS.indexOf(r.month) * 32 + (Number(r.day) || 0)
  return [...rows].sort((a, b) => order(b) - order(a))
}

/** "4.58%" — always two decimals, the way the rate is published. */
export const formatRate = (n) => `${(Number(n) || 0).toFixed(2)}%`

/** "Bhadra 22, 2083" — or "Bhadra 2083" for a row saved without a day. */
export const formatBsDate = ({ year, month, day }) =>
  day ? `${month} ${day}, ${year}` : `${month} ${year}`

/** "7 Sept 2026", or '' when no AD date was published. */
export const formatAdDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''

/** What the page paints before the API answers, and if it never does. */
export const FALLBACK_RATES = { baseRates: sortRates(baseRates) }

export async function getRates() {
  try {
    const r = await api.getRates()
    return {
      baseRates:
        Array.isArray(r.baseRates) && r.baseRates.length
          ? sortRates(r.baseRates)
          : FALLBACK_RATES.baseRates,
    }
  } catch {
    // Backend unreachable — the bundled list stands in.
    return FALLBACK_RATES
  }
}
