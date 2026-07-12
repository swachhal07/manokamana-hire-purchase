/**
 * Tiny JSON document store persisted on Cloudinary.
 *
 * Cloudinary is a media CDN, not a database — but for a small site it can
 * hold structured data too: each collection ("reports", "posts", "team") is
 * one JSON file uploaded as a `raw` asset with a fixed public_id, overwritten
 * on every write. Reads are cached in memory and refetched after writes.
 *
 * If the site ever outgrows this, replace load()/save() with a real DB and
 * nothing else in the codebase changes.
 */
import cloudinary from '../config/cloudinary.js'

const FOLDER = 'manokamana/data'
const cache = new Map() // name -> { data }

function publicId(name) {
  return `${FOLDER}/${name}.json`
}

/** Load a collection. Returns `fallback` if it doesn't exist yet. */
export async function load(name, fallback) {
  if (cache.has(name)) return cache.get(name)

  try {
    // Signed delivery URL with a cache-buster so we never read a stale CDN copy.
    const url = cloudinary.utils.private_download_url(publicId(name), null, {
      resource_type: 'raw',
      expires_at: Math.floor(Date.now() / 1000) + 60,
    })
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetch ${name}: ${res.status}`)
    const data = await res.json()
    cache.set(name, data)
    return data
  } catch {
    return structuredClone(fallback)
  }
}

/** Persist a collection (full overwrite) and update the cache. */
export async function save(name, data) {
  const payload = Buffer.from(JSON.stringify(data, null, 2))
  await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId(name),
        resource_type: 'raw',
        overwrite: true,
        invalidate: true,
        type: 'private',
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    )
    stream.end(payload)
  })
  cache.set(name, data)
  return data
}

export function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
