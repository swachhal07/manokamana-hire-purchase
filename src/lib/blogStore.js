/**
 * Blog source: merges posts published via the /admin dashboard (backend API)
 * with the built-in starter articles in src/data/posts.js.
 *
 * API posts appear first (they're newer). If an API post is marked featured,
 * it takes over the featured slot; otherwise the built-in featured stays.
 */
import { featured as staticFeatured, posts as staticPosts } from '../data/posts'
import { api } from './api'

export async function getBlog() {
  let apiPosts = []
  try {
    apiPosts = await api.getPosts()
  } catch {
    // Backend unreachable — fall back to the built-in articles only.
  }

  const featured = apiPosts.find((p) => p.featured) || staticFeatured
  const rest = [
    ...apiPosts.filter((p) => p.slug !== featured.slug),
    ...staticPosts.filter((p) => p.slug !== featured.slug),
  ]
  return { featured, posts: rest }
}

export async function getPost(slug) {
  const local = [staticFeatured, ...staticPosts].find((p) => p.slug === slug)
  if (local) return local
  try {
    return await api.getPost(slug)
  } catch {
    return null
  }
}
