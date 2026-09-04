import { Router } from 'express'
import { load, save } from '../lib/store.js'
import { requireAdmin } from '../middleware/auth.js'
import { uploadImage } from '../middleware/upload.js'
import { uploadBuffer, deleteAsset } from '../config/cloudinary.js'

const router = Router()
const COLLECTION = 'notice'

/**
 * The site-wide popup notice — one record, not a list. Admin uploads a notice
 * image (the same artwork that would go in a newspaper), flips it on, and it
 * greets every visitor until it's switched off or its end date passes.
 */
const DEFAULT_NOTICE = {
  active: false,
  image: '',
  imagePublicId: '',
  linkUrl: '',
  startsAt: '',
  endsAt: '',
  updatedAt: '',
}

/** Is the notice publishable right now — on, has artwork, inside its window? */
function isLive(n) {
  if (!n.active || !n.image) return false
  const today = new Date().toISOString().slice(0, 10)
  if (n.startsAt && today < n.startsAt) return false
  if (n.endsAt && today > n.endsAt) return false
  return true
}

/**
 * GET /api/notice — public.
 * Always returns the record so the admin panel can read back what it saved;
 * `live` is the only flag the public site acts on.
 */
router.get('/', async (_req, res, next) => {
  try {
    const notice = await load(COLLECTION, DEFAULT_NOTICE)
    res.json({ ...notice, live: isLive(notice) })
  } catch (err) {
    next(err)
  }
})

/**
 * PUT /api/notice — admin. Multipart so the artwork can ride along.
 * Fields: active ('true'/'false'), linkUrl, startsAt, endsAt, image.
 */
router.put('/', requireAdmin, uploadImage.single('image'), async (req, res, next) => {
  try {
    const notice = await load(COLLECTION, DEFAULT_NOTICE)
    const { active, linkUrl, startsAt, endsAt } = req.body

    if (active !== undefined) notice.active = active === 'true' || active === true
    if (linkUrl !== undefined) notice.linkUrl = linkUrl.trim()
    if (startsAt !== undefined) notice.startsAt = startsAt.trim()
    if (endsAt !== undefined) notice.endsAt = endsAt.trim()

    if (req.file) {
      await deleteAsset(notice.imagePublicId)
      const up = await uploadBuffer(req.file.buffer, { folder: 'notice' })
      notice.image = up.url
      notice.imagePublicId = up.publicId
    }

    if (notice.active && !notice.image) {
      return res.status(400).json({ error: 'Upload a notice image before switching it on' })
    }

    // Visitors who dismissed the previous notice see this one again, because
    // the frontend keys its "already seen" flag off updatedAt.
    notice.updatedAt = new Date().toISOString()

    await save(COLLECTION, notice)
    res.json({ ...notice, live: isLive(notice) })
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/notice — admin. Removes the artwork and switches the popup off. */
router.delete('/', requireAdmin, async (_req, res, next) => {
  try {
    const notice = await load(COLLECTION, DEFAULT_NOTICE)
    await deleteAsset(notice.imagePublicId)
    const cleared = { ...DEFAULT_NOTICE, updatedAt: new Date().toISOString() }
    await save(COLLECTION, cleared)
    res.json({ ...cleared, live: false })
  } catch (err) {
    next(err)
  }
})

export default router
