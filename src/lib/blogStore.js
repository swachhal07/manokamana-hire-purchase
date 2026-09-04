/**
 * Blog source: merges posts published via the /admin dashboard (backend API)
 * with the built-in starter articles in src/data/posts.js.
 *
 * API posts appear first (they're newer). If an API post is marked featured,
 * it takes over the featured slot; otherwise the built-in featured stays.
 *
 * A starter article can be adopted into the API (dashboard → Blog → "Make the
 * starter articles editable"), after which the same slug exists in both
 * places. The API copy always wins, and lends the bundled artwork to the
 * adopted post until an admin uploads a real cover — the bundled files are
 * served from build-hashed paths the backend can't store.
 */
import { featured as staticFeatured, posts as staticPosts } from '../data/posts'
import { api } from './api'

const staticAll = [staticFeatured, ...staticPosts]

/** slug -> bundled cover image, for posts adopted into the API without one. */
const staticImages = new Map(staticAll.map((p) => [p.slug, p.image]))

const withImage = (post) =>
  post.image ? post : { ...post, image: staticImages.get(post.slug) || '' }

export async function getBlog() {
  let apiPosts = []
  try {
    apiPosts = (await api.getPosts()).map(withImage)
  } catch {
    // Backend unreachable — fall back to the built-in articles only.
  }

  const apiSlugs = new Set(apiPosts.map((p) => p.slug))
  // Anything adopted into the API is served from there, not from the bundle.
  const bundled = staticAll.filter((p) => !apiSlugs.has(p.slug))

  const featured =
    apiPosts.find((p) => p.featured) ||
    bundled.find((p) => p.slug === staticFeatured.slug) ||
    apiPosts[0] ||
    staticFeatured

  const rest = [
    ...apiPosts.filter((p) => p.slug !== featured.slug),
    ...bundled.filter((p) => p.slug !== featured.slug),
  ]
  return { featured, posts: rest }
}

export async function getPost(slug) {
  // API first: an adopted article's edits must win over the bundled copy.
  try {
    const post = await api.getPost(slug)
    if (post) return withImage(post)
  } catch {
    // Not published through the dashboard, or the backend is unreachable.
  }
  return staticAll.find((p) => p.slug === slug) || null
}
