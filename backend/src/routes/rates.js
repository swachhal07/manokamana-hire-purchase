import { Router } from 'express'
import { load, save } from '../lib/store.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const COLLECTION = 'rates'

/**
 * The monthly base rates shown at /interest-rates.
 *
 * One record holding the whole list: the admin edits the table and saves it
 * in one go, newest month first.
 *
 * These defaults mirror src/data/rates.js on the frontend, which is what the
 * public page falls back to when the API is unreachable. Keep the two in step.
 */
const BS_MONTHS = [
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

const DEFAULT_RATES = {
  baseRates: [{ year: 2083, month: 'Bhadra', day: 22, adDate: '2026-09-07', rate: 11 }],
  updatedAt: '',
}

const MAX_ROWS = 240

function bad(message) {
  return Object.assign(new Error(message), { status: 400 })
}

/** Newest date first: by BS year, then month, then day. */
function sortRates(rows) {
  const order = (r) => r.year * 400 + BS_MONTHS.indexOf(r.month) * 32 + r.day
  return [...rows].sort((a, b) => order(b) - order(a))
}

/** ISO date, or '' when no AD date is published for the row. */
function parseAdDate(input, i) {
  const s = String(input ?? '').trim()
  if (!s) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) {
    throw bad(`Row ${i + 1}: AD date must be a date (YYYY-MM-DD)`)
  }
  return s
}

/**
 * Every row needs a BS date (year, month, day) and a rate; the AD date is
 * optional. A date may only appear once — two rates taking effect on the
 * same day would contradict each other.
 */
function parseBaseRates(input) {
  if (!Array.isArray(input)) throw bad('baseRates must be an array of rows')
  if (input.length === 0) throw bad('Add at least one rate to the table')
  if (input.length > MAX_ROWS) throw bad(`The table cannot exceed ${MAX_ROWS} rows`)

  const seen = new Set()
  const rows = input.map((row, i) => {
    const year = Number(row?.year)
    if (!Number.isInteger(year) || year < 2000 || year > 2200) {
      throw bad(`Row ${i + 1}: year must be a BS year such as 2083`)
    }
    const month = String(row?.month ?? '').trim()
    if (!BS_MONTHS.includes(month)) {
      throw bad(`Row ${i + 1}: month must be one of ${BS_MONTHS.join(', ')}`)
    }
    // BS months run to 32 days at most.
    const day = Number(row?.day)
    if (!Number.isInteger(day) || day < 1 || day > 32) {
      throw bad(`Row ${i + 1}: day must be between 1 and 32`)
    }
    const adDate = parseAdDate(row?.adDate, i)
    const rate = Number(row?.rate)
    if (row?.rate === '' || !Number.isFinite(rate) || rate < 0 || rate > 100) {
      throw bad(`Row ${i + 1}: rate must be a number between 0 and 100`)
    }
    const key = `${year}-${month}-${day}`
    if (seen.has(key)) throw bad(`${month} ${day}, ${year} is listed more than once`)
    seen.add(key)
    return { year, month, day, adDate, rate: Math.round(rate * 100) / 100 }
  })

  return sortRates(rows)
}

/**
 * Only the fields the table publishes, so keys left behind by an earlier
 * version of the record (the old charges sheet) never leak back out.
 */
function shape(record) {
  const r = { ...DEFAULT_RATES, ...record }
  return {
    baseRates: Array.isArray(r.baseRates) ? r.baseRates : DEFAULT_RATES.baseRates,
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

/** PUT /api/rates — admin. JSON body: { baseRates: [{ year, month, day, adDate, rate }] }. */
router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const next_ = shape(await load(COLLECTION, DEFAULT_RATES))
    const b = req.body || {}

    if (b.baseRates !== undefined) next_.baseRates = parseBaseRates(b.baseRates)

    next_.updatedAt = new Date().toISOString()

    await save(COLLECTION, next_)
    res.json(next_)
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ error: err.message })
    next(err)
  }
})

/** DELETE /api/rates — admin. Restores the built-in list. */
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
