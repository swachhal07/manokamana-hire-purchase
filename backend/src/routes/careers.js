import { Router } from 'express'
import { load, save, newId } from '../lib/store.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const COLLECTION = 'openings'

/** GET /api/careers — public, newest first */
router.get('/', async (_req, res, next) => {
  try {
    const openings = await load(COLLECTION, [])
    res.json(
      [...openings].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    )
  } catch (err) {
    next(err)
  }
})

/** POST /api/careers — admin. JSON body: title, dept, location, type, desc. */
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { title, dept = '', location = '', type = 'Full-time', desc = '' } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const opening = {
      id: newId(),
      title: title.trim(),
      dept: dept.trim(),
      location: location.trim(),
      type: type.trim() || 'Full-time',
      desc: desc.trim(),
      createdAt: new Date().toISOString(),
    }

    const openings = await load(COLLECTION, [])
    openings.push(opening)
    await save(COLLECTION, openings)
    res.status(201).json(opening)
  } catch (err) {
    next(err)
  }
})

/** PUT /api/careers/:id — admin */
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const openings = await load(COLLECTION, [])
    const opening = openings.find((o) => o.id === req.params.id)
    if (!opening) return res.status(404).json({ error: 'Opening not found' })

    const { title, dept, location, type, desc } = req.body
    if (title) opening.title = title.trim()
    if (dept !== undefined) opening.dept = dept.trim()
    if (location !== undefined) opening.location = location.trim()
    if (type) opening.type = type.trim()
    if (desc !== undefined) opening.desc = desc.trim()

    await save(COLLECTION, openings)
    res.json(opening)
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/careers/:id — admin */
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const openings = await load(COLLECTION, [])
    const opening = openings.find((o) => o.id === req.params.id)
    if (!opening) return res.status(404).json({ error: 'Opening not found' })

    await save(COLLECTION, openings.filter((o) => o.id !== req.params.id))
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
