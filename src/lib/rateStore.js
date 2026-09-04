/**
 * Interest rate source: the schedule published through the /admin dashboard
 * (backend API), falling back to the built-in copy in src/data/rates.js.
 *
 * The API response is authoritative when it arrives — including empty values,
 * so an admin can genuinely clear the dateline or the notes. The only guard is
 * `schedule`, which must never render as an empty sheet.
 */
import {
  EFFECTIVE_FROM,
  EFFECTIVE_FROM_BS,
  MAX_PREMIUM,
  PUBLISH_RATE,
  schedule,
} from '../data/rates'
import { api } from './api'

/** What the page paints before the API answers, and if it never does. */
export const FALLBACK_RATES = {
  publishRate: PUBLISH_RATE,
  maxPremium: MAX_PREMIUM,
  effectiveFrom: EFFECTIVE_FROM,
  effectiveFromBs: EFFECTIVE_FROM_BS,
  schedule,
}

export async function getRates() {
  try {
    const r = await api.getRates()
    return {
      ...FALLBACK_RATES,
      ...r,
      schedule: Array.isArray(r.schedule) && r.schedule.length
        ? r.schedule
        : FALLBACK_RATES.schedule,
    }
  } catch {
    // Backend unreachable — the bundled schedule stands in.
    return FALLBACK_RATES
  }
}
