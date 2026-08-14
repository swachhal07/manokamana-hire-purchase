import { ROUTES, SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../lib/seo'

/**
 * Per-page SEO tags.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree up
 * into <head>, so this needs no helmet library and no portal. Render it once
 * near the top of each page component.
 *
 * Usage:
 *   <Seo path="/services" />                       // looks up src/lib/seo.js
 *   <Seo path={`/blog/${slug}`} title="..." ... />  // explicit, for blog posts
 */
export default function Seo({
  path,
  title,
  description,
  image,
  type = 'website',
  noindex = false,
}) {
  const preset = ROUTES[path] ?? {}
  const finalTitle = title ?? preset.title ?? SITE_NAME
  const finalDescription = description ?? preset.description
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`

  // og:image must be absolute. Bundled assets resolve to paths like
  // /assets/hero-a1b2c3.webp; API-supplied images may already be absolute.
  const rawImage = image ?? DEFAULT_OG_IMAGE
  const finalImage = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage}`

  return (
    <>
      <title>{finalTitle}</title>
      {finalDescription && <meta name="description" content={finalDescription} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <link rel="canonical" href={canonical} />
      )}

      {/* Open Graph — without these, every WhatsApp/Facebook/LinkedIn share
          of the site renders as a blank card. */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NP" />
      <meta property="og:title" content={finalTitle} />
      {finalDescription && <meta property="og:description" content={finalDescription} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={finalImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      {finalDescription && <meta name="twitter:description" content={finalDescription} />}
      <meta name="twitter:image" content={finalImage} />
    </>
  )
}
