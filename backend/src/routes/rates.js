import { Router } from 'express'
import { load, save } from '../lib/store.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const COLLECTION = 'rates'

/**
 * The published interest rate and charges schedule shown at /interest-rates.
 *
 * One record, not a list: rates are a regulated disclosure that the company
 * republishes in full whenever the board revises them, so the admin edits the
 * whole sheet and saves it in one go.
 *
 * These defaults mirror src/data/rates.js on the frontend, which is what the
 * public page falls back to when the API is unreachable. Keep the two in step.
 */
const DEFAULT_RATES = {
  publishRate: 9.99,
  maxPremium: 2,
  // ⚠️ PLACEHOLDER dates — the admin panel is where these get corrected.
  effectiveFrom: '2026-07-17', // ISO 'YYYY-MM-DD' — feeds <time dateTime>
  effectiveFromBs: 'Shrawan 1, 2083', // what the page actually prints
  schedule: [
    { particular: 'Publish Rate', value: '9.99%', tier: 'rate' },
    { particular: 'Interest rate (Maximum)', value: 'Publish rate + 2%', tier: 'rate' },
    { particular: 'Service Charges', value: '1% of loan amount', tier: 'charge' },
    { particular: 'CICL Charges', value: 'Actual basis', tier: 'charge' },
    { particular: 'Insurance', value: 'As mentioned in policy, actual basis', tier: 'charge' },
  ],
  updatedAt: '',
}

const MAX_ROWS = 24
const TIERS = ['rate', 'charge']

/** A percentage the page can print: finite, 0-100, at most two decimals. */
function parseRate(input, field) {
  const n = Number(input)
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    throw Object.assign(new Error(`${field} must be a number between 0 and 100`), {
      status: 400,
    })
  }
  return Math.round(n * 100) / 100
}

function str(input, max) {
  return String(input ?? '')
    .trim()
    .slice(0, max)
}

/** ISO date, or '' to mean "no date published yet". */
function parseIsoDate(input) {
  const s = str(input, 10)
  if (!s) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) {
    throw Object.assign(new Error('effectiveFrom must be a date (YYYY-MM-DD)'), {
      status: 400,
    })
  }
  return s
}

/**
 * The rows of the sheet. Every row needs both a particular and a value —
 * a half-filled row would publish a blank line on a regulated disclosure.
 */
function parseSchedule(input) {
  if (!Array.isArray(input)) {
    throw Object.assign(new Error('schedule must be an array of rows'), { status: 400 })
  }
  if (input.length === 0) {
    throw Object.assign(new Error('Add at least one row to the schedule'), { status: 400 })
  }
  if (input.length > MAX_ROWS) {
    throw Object.assign(new Error(`schedule cannot exceed ${MAX_ROWS} rows`), { status: 400 })
  }

  return input.map((row, i) => {
    const particular = str(row?.particular, 120)
    const value = str(row?.value, 160)
    if (!particular || !value) {
      throw Object.assign(
        new Error(`Row ${i + 1}: both the particular and its rate/charge are required`),
        { status: 400 },
      )
    }
    const tier = TIERS.includes(row?.tier) ? row.tier : 'charge'
    return { particular, value, tier }
  })
}

/**
 * Only the fields the sheet actually publishes, so keys left behind by an
 * earlier version of the record never leak back out through the API.
 */
function shape(record) {
  const r = { ...DEFAULT_RATES, ...record }
  return {
    publishRate: r.publishRate,
    maxPremium: r.maxPremium,
    effectiveFrom: r.effectiveFrom,
    effectiveFromBs: r.effectiveFromBs,
    schedule: r.schedule,
    updatedAt: r.updatedAt,
  }
}

/** GET /api/rates — public. */
router.get('/', async (_req, res, next) => {
  try {
    res.json(shape(await load(COLLECTION, DEFAULT_RATES)))
  } catch (err) {
    next(err)
  }
})

/**
 * PUT /api/rates — admin. JSON body; every field is optional, so the panel
 * can save a single correction without resending the whole sheet.
 */
router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const next_ = shape(await load(COLLECTION, DEFAULT_RATES))
    const b = req.body || {}

    if (b.publishRate !== undefined) next_.publishRate = parseRate(b.publishRate, 'publishRate')
    if (b.maxPremium !== undefined) next_.maxPremium = parseRate(b.maxPremium, 'maxPremium')
    if (b.effectiveFrom !== undefined) next_.effectiveFrom = parseIsoDate(b.effectiveFrom)
    if (b.effectiveFromBs !== undefined) next_.effectiveFromBs = str(b.effectiveFromBs, 60)
    if (b.schedule !== undefined) next_.schedule = parseSchedule(b.schedule)

    next_.updatedAt = new Date().toISOString()

    await save(COLLECTION, next_)
    res.json(next_)
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message })
    next(err)
  }
})

/** DELETE /api/rates — admin. Restores the built-in schedule. */
router.delete('/', requireAdmin, async (_req, res, next) => {
  try {
    const reset = shape({ updatedAt: new Date().toISOString() })
    await save(COLLECTION, reset)
    res.json(reset)
  } catch (err) {
    next(err)
  }
})

export default router
