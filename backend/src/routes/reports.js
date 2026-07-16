import { Router } from 'express'
import { load, save, newId } from '../lib/store.js'
import { requireAdmin } from '../middleware/auth.js'
import { uploadPdf } from '../middleware/upload.js'
import { uploadBuffer, deleteAsset } from '../config/cloudinary.js'

const router = Router()
const COLLECTION = 'reports'
const PERIODS = ['Q1', 'Q2', 'Q3', 'Q4', 'Annual']

const periodOrder = { Annual: 5, Q4: 4, Q3: 3, Q2: 2, Q1: 1 }
const sortReports = (list) =>
  [...list].sort((a, b) =>
    b.year !== a.year ? b.year - a.year : (periodOrder[b.period] || 0) - (periodOrder[a.period] || 0),
  )

/** GET /api/reports — public */
router.get('/', async (_req, res, next) => {
  try {
    res.json(sortReports(await load(COLLECTION, [])))
  } catch (err) {
    next(err)
  }
})

/** POST /api/reports — admin. multipart: fields + optional `file` (PDF). */
router.post('/', requireAdmin, uploadPdf.single('file'), async (req, res, next) => {
  try {
    const { title, year, period, notes = '', publishedAt } = req.body
    if (!title || !year || !PERIODS.includes(period)) {
      return res.status(400).json({ error: 'title, year and a valid period are required' })
    }

    let file = { fileUrl: '', filePublicId: '' }
    if (req.file) {
      const up = await uploadBuffer(req.file.buffer, {
        folder: 'reports',
        resourceType: 'raw',
        filename: `${year}-${period}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      })
      file = { fileUrl: up.url, filePublicId: up.publicId }
    }

    const report = {
      id: newId(),
      title: title.trim(),
      year: Number(year),
      period,
      notes: notes.trim(),
      publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
      ...file,
    }

    const reports = await load(COLLECTION, [])
    reports.push(report)
    await save(COLLECTION, reports)
    res.status(201).json(report)
  } catch (err) {
    next(err)
  }
})

/** PUT /api/reports/:id — admin. Same fields; new `file` replaces the old one. */
router.put('/:id', requireAdmin, uploadPdf.single('file'), async (req, res, next) => {
  try {
    const reports = await load(COLLECTION, [])
    const report = reports.find((r) => r.id === req.params.id)
    if (!report) return res.status(404).json({ error: 'Report not found' })

    const { title, year, period, notes, publishedAt } = req.body
    if (title) report.title = title.trim()
    if (year) report.year = Number(year)
    if (period && PERIODS.includes(period)) report.period = period
    if (notes !== undefined) report.notes = notes.trim()
    if (publishedAt) report.publishedAt = publishedAt

    if (req.file) {
      await deleteAsset(report.filePublicId, 'raw')
      const up = await uploadBuffer(req.file.buffer, {
        folder: 'reports',
        resourceType: 'raw',
        filename: `${report.year}-${report.period}-${report.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      })
      report.fileUrl = up.url
      report.filePublicId = up.publicId
    }

    await save(COLLECTION, reports)
    res.json(report)
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/reports/:id — admin */
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const reports = await load(COLLECTION, [])
    const report = reports.find((r) => r.id === req.params.id)
    if (!report) return res.status(404).json({ error: 'Report not found' })

    await deleteAsset(report.filePublicId, 'raw')
    await save(COLLECTION, reports.filter((r) => r.id !== req.params.id))
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
