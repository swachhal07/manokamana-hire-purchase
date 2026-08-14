import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { ROUTES, SITE_URL } from './src/lib/seo.js'

/**
 * Emits dist/sitemap.xml at build time from src/lib/seo.js (static routes) plus
 * the blog slugs in src/data/posts.js.
 *
 * Slugs are read with a regex rather than an import because posts.js imports
 * image assets, which Node cannot resolve outside the Vite pipeline.
 *
 * Known gap: posts published through the /admin dashboard live in the backend
 * API, not in posts.js, so they are absent here. Once the backend is the
 * primary blog source, replace this with a server-rendered /sitemap.xml.
 */
function sitemapPlugin() {
  return {
    name: 'mhp-sitemap',
    apply: 'build',
    closeBundle() {
      const postsSrc = fs.readFileSync(
        path.resolve(__dirname, 'src/data/posts.js'),
        'utf8',
      )
      const slugs = [...postsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])

      const today = new Date().toISOString().slice(0, 10)

      const entries = [
        ...Object.entries(ROUTES).map(([route, meta]) => ({
          loc: `${SITE_URL}${route === '/' ? '' : route}`,
          changefreq: meta.changefreq,
          priority: meta.priority,
        })),
        ...slugs.map((slug) => ({
          loc: `${SITE_URL}/blog/${slug}`,
          changefreq: 'yearly',
          priority: 0.5,
        })),
      ]

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

      const outDir = path.resolve(__dirname, 'dist')
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml)
      console.log(`\n  sitemap.xml — ${entries.length} URLs written to dist/`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemapPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // In dev, /api requests go to the Express backend (backend/ — port 5000).
    // In production set VITE_API_URL instead (see src/lib/api.js).
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
