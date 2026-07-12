import { Router } from 'express'
import { load, save } from '../lib/store.js'
import { requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { uploadBuffer, deleteAsset } from '../config/cloudinary.js'

const router = Router()
const COLLECTION = 'team'

/**
 * Seeded with the roster currently hard-coded in the frontend.
 * `image: ''` means "no photo uploaded yet" — the frontend falls back to
 * its bundled local image in that case.
 */
const DEFAULT_TEAM = {
  board: [
    { name: 'Vivek Dugar', role: 'Director', bio: '', image: '', imagePublicId: '' },
    { name: 'Saroj Bhattarai', role: 'Director', bio: '', image: '', imagePublicId: '' },
    { name: 'Rajeshwar Neupane', role: 'Director', bio: '', image: '', imagePublicId: '' },
  ],
  management: [
    { name: 'Full Name', role: 'Chief Executive Officer', bio: '', image: '', imagePublicId: '' },
    { name: 'Full Name', role: 'General Manager', bio: '', image: '', imagePublicId: '' },
    { name: 'Full Name', role: 'Head of Finance', bio: '', image: '', imagePublicId: '' },
    { name: 'Full Name', role: 'Head of Operations', bio: '', image: '', imagePublicId: '' },
  ],
}

const SECTIONS = ['board', 'management']

/** GET /api/team — public */
router.get('/', async (_req, res, next) => {
  try {
    res.json(await load(COLLECTION, DEFAULT_TEAM))
  } catch (err) {
    next(err)
  }
})

/**
 * PUT /api/team/:section/:index — admin.
 * :section is `board` or `management`; multipart: name, role, bio, optional `image`.
 */
router.put('/:section/:index', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    const { section, index } = req.params
    if (!SECTIONS.includes(section)) {
      return res.status(400).json({ error: `Section must be one of: ${SECTIONS.join(', ')}` })
    }

    const team = await load(COLLECTION, DEFAULT_TEAM)
    const member = team[section][Number(index)]
    if (!member) return res.status(404).json({ error: 'Member not found' })

    const { name, role, bio } = req.body
    if (name) member.name = name.trim()
    if (role) member.role = role.trim()
    if (bio !== undefined) member.bio = bio.trim()

    if (req.file) {
      await deleteAsset(member.imagePublicId)
      const up = await uploadBuffer(req.file.buffer, { folder: 'team' })
      member.image = up.url
      member.imagePublicId = up.publicId
    }

    await save(COLLECTION, team)
    res.json(member)
  } catch (err) {
    next(err)
  }
})

/** POST /api/team/:section — admin. Add a member. */
router.post('/:section', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    const { section } = req.params
    if (!SECTIONS.includes(section)) {
      return res.status(400).json({ error: `Section must be one of: ${SECTIONS.join(', ')}` })
    }
    const { name, role = '', bio = '' } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })

    let image = { image: '', imagePublicId: '' }
    if (req.file) {
      const up = await uploadBuffer(req.file.buffer, { folder: 'team' })
      image = { image: up.url, imagePublicId: up.publicId }
    }

    const team = await load(COLLECTION, DEFAULT_TEAM)
    const member = { name: name.trim(), role: role.trim(), bio: bio.trim(), ...image }
    team[section].push(member)
    await save(COLLECTION, team)
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/team/:section/:index — admin */
router.delete('/:section/:index', requireAdmin, async (req, res, next) => {
  try {
    const { section, index } = req.params
    if (!SECTIONS.includes(section)) {
      return res.status(400).json({ error: `Section must be one of: ${SECTIONS.join(', ')}` })
    }
    const team = await load(COLLECTION, DEFAULT_TEAM)
    const member = team[section][Number(index)]
    if (!member) return res.status(404).json({ error: 'Member not found' })

    await deleteAsset(member.imagePublicId)
    team[section].splice(Number(index), 1)
    await save(COLLECTION, team)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
