import { Router } from 'express'
import { load, save } from '../lib/store.js'
import { requireAdmin } from '../middleware/auth.js'
import { uploadImage } from '../middleware/upload.js'
import { uploadBuffer, deleteAsset } from '../config/cloudinary.js'

const router = Router()
const COLLECTION = 'posts'

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/**
 * Body blocks arrive as a JSON string: [{type:'p'|'h2', text:'…'}, …]
 * (same shape the frontend already renders in BlogPost.jsx).
 */
function parseBody(raw) {
  if (!raw) return []
  try {
    const blocks = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!Array.isArray(blocks)) return []
    return blocks
      .filter((b) => b && typeof b.text === 'string' && b.text.trim())
      .map((b) => ({ type: b.type === 'h2' ? 'h2' : 'p', text: b.text.trim() }))
  } catch {
    return []
  }
}

const estimateReadTime = (body) => {
  const words = body.reduce((n, b) => n + b.text.split(/\s+/).length, 0)
  return `${Math.max(1, Math.round(words / 200))} min read`
}

/** GET /api/posts — public, newest first */
router.get('/', async (_req, res, next) => {
  try {
    const posts = await load(COLLECTION, [])
    res.json([...posts].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')))
  } catch (err) {
    next(err)
  }
})

/** GET /api/posts/:slug — public */
router.get('/:slug', async (req, res, next) => {
  try {
    const posts = await load(COLLECTION, [])
    const post = posts.find((p) => p.slug === req.params.slug)
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    next(err)
  }
})

/** POST /api/posts — admin. multipart: title, category, date, excerpt, body (JSON), optional `image`. */
router.post('/', requireAdmin, uploadImage.single('image'), async (req, res, next) => {
  try {
    const { title, category = 'Guides', date = '', excerpt = '', featured } = req.body
    const body = parseBody(req.body.body)
    if (!title || !excerpt || body.length === 0) {
      return res.status(400).json({ error: 'title, excerpt and at least one body block are required' })
    }

    const posts = await load(COLLECTION, [])
    let slug = slugify(title)
    while (posts.some((p) => p.slug === slug)) slug += '-2'

    let image = { image: '', imagePublicId: '' }
    if (req.file) {
      const up = await uploadBuffer(req.file.buffer, { folder: 'blog' })
      image = { image: up.url, imagePublicId: up.publicId }
    }

    const post = {
      slug,
      title: title.trim(),
      category: category.trim(),
      date: date.trim() || new Date().toISOString().slice(0, 10),
      excerpt: excerpt.trim(),
      readTime: estimateReadTime(body),
      body,
      featured: featured === 'true',
      createdAt: new Date().toISOString(),
      ...image,
    }

    // Only one featured post at a time.
    if (post.featured) posts.forEach((p) => (p.featured = false))

    posts.push(post)
    await save(COLLECTION, posts)
    res.status(201).json(post)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/posts/import — admin. JSON: { posts: [{ slug, title, category,
 * date, excerpt, body, featured }] }
 *
 * Adopts the starter articles that ship bundled in the frontend
 * (src/data/posts.js) into this collection, so they become editable from the
 * dashboard like any published post. Slugs already here are skipped, which
 * makes the call safe to repeat.
 *
 * Cover images are deliberately NOT taken from the payload: bundled artwork
 * is served from build-hashed asset paths that change on the next deploy. The
 * frontend keeps showing the bundled image for these slugs until an admin
 * uploads a real one.
 */
router.post('/import', requireAdmin, async (req, res, next) => {
  try {
    const incoming = Array.isArray(req.body?.posts) ? req.body.posts : null
    if (!incoming) return res.status(400).json({ error: 'posts array is required' })
    if (incoming.length > 50) {
      return res.status(400).json({ error: 'Too many posts in one import' })
    }

    const posts = await load(COLLECTION, [])
    const someoneFeatured = posts.some((p) => p.featured)

    // Imported posts are older than anything published from the dashboard, so
    // they sort below it while keeping their own source order.
    const BASE = Date.parse('2000-01-01T00:00:00.000Z')

    let imported = 0
    let skipped = 0

    incoming.forEach((raw, i) => {
      const slug = slugify(String(raw?.slug || raw?.title || ''))
      const title = String(raw?.title || '').trim()
      const excerpt = String(raw?.excerpt || '').trim()
      const body = parseBody(raw?.body)

      if (!slug || !title || !excerpt || body.length === 0) return void skipped++
      if (posts.some((p) => p.slug === slug)) return void skipped++

      posts.push({
        slug,
        title,
        category: String(raw?.category || 'Guides').trim(),
        date: String(raw?.date || '').trim(),
        excerpt,
        readTime: estimateReadTime(body),
        body,
        featured: Boolean(raw?.featured) && !someoneFeatured && imported === 0,
        createdAt: new Date(BASE - i * 60000).toISOString(),
        image: '',
        imagePublicId: '',
      })
      imported++
    })

    if (imported > 0) await save(COLLECTION, posts)
    res.json({ imported, skipped })
  } catch (err) {
    next(err)
  }
})

/** PUT /api/posts/:slug — admin */
router.put('/:slug', requireAdmin, uploadImage.single('image'), async (req, res, next) => {
  try {
    const posts = await load(COLLECTION, [])
    const post = posts.find((p) => p.slug === req.params.slug)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const { title, category, date, excerpt, featured } = req.body
    if (title) post.title = title.trim()
    if (category) post.category = category.trim()
    if (date !== undefined) post.date = date.trim()
    if (excerpt) post.excerpt = excerpt.trim()
    if (req.body.body) {
      const body = parseBody(req.body.body)
      if (body.length) {
        post.body = body
        post.readTime = estimateReadTime(body)
      }
    }
    if (featured !== undefined) {
      post.featured = featured === 'true'
      if (post.featured) posts.forEach((p) => p !== post && (p.featured = false))
    }

    if (req.file) {
      await deleteAsset(post.imagePublicId)
      const up = await uploadBuffer(req.file.buffer, { folder: 'blog' })
      post.image = up.url
      post.imagePublicId = up.publicId
    }

    await save(COLLECTION, posts)
    res.json(post)
  } catch (err) {
    next(err)
  }
})

/** DELETE /api/posts/:slug — admin */
router.delete('/:slug', requireAdmin, async (req, res, next) => {
  try {
    const posts = await load(COLLECTION, [])
    const post = posts.find((p) => p.slug === req.params.slug)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    await deleteAsset(post.imagePublicId)
    await save(COLLECTION, posts.filter((p) => p.slug !== req.params.slug))
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
