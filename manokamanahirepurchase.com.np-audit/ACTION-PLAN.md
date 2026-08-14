# Action Plan — manokamanahirepurchase.com.np

Ordered by impact-per-hour. Every item is scoped to this codebase (React 19 + Vite SPA, Cloudflare-served).

## Status — updated 2026-08-14

**Phase 1 is implemented and verified locally. Nothing is live until the next deploy.**

| Item | Status |
|---|---|
| 1.1 Per-route titles, descriptions, canonicals, OG/Twitter | ✅ Done |
| 1.2 sitemap.xml + robots.txt | ✅ Done — 18 URLs, build-generated |
| 1.3 Soft 404s | ⚠️ **Partial** — `noindex` shipped; the HTTP 200 status code is unfixed |
| 1.4 Security headers | ✅ Done — `public/_headers`, **needs deploy to verify** |
| 1.5 Lock down `/admin` | ⚠️ **Partial** — robots disallow + `noindex` only; server-side auth outstanding |

Two items are deliberately partial. Both remaining halves are server-side, not client-side:

- **1.3** — returning a real 404 status needs a Cloudflare Pages Function; the SPA fallback rewrite currently answers every path with 200. `noindex` keeps junk URLs out of the index in the meantime, which addresses the SEO impact but not the underlying wrongness.
- **1.5** — `noindex` and `Disallow: /admin` stop indexing, not access. The actual fix is authentication on the backend API in `backend/`. Tracked separately.

Files added: `src/lib/seo.js`, `src/components/Seo.jsx`, `public/robots.txt`, `public/_headers`.
Files modified: `vite.config.js` (sitemap plugin), `index.html`, `src/main.jsx`, all 14 page components.

**Post-deploy checklist:**
1. `curl -sSI https://manokamanahirepurchase.com.np/` — confirm the six security headers appear
2. `curl -sS https://manokamanahirepurchase.com.np/sitemap.xml` — confirm XML, not the SPA shell
3. Set up Google Search Console and submit the sitemap
4. Re-check a social share preview on WhatsApp — requires the `og-default.jpg` asset below

**Outstanding dependency:** `public/og-default.jpg` does not exist yet. Every page currently points `og:image` at a 404. A 1200×630 branded image is needed before social previews work.

---

## Phase 1 — Critical (Week 1)

### 1.1 Per-page titles and meta descriptions
**Severity: Critical · Effort: 3-4 h · Blocks all ranking**

React 19 hoists `<title>`, `<meta>`, and `<link rel="canonical">` to `<head>` natively when rendered anywhere in the component tree — **no `react-helmet` needed**. Build one small `<Seo>` component and drop it at the top of each page.

```jsx
// src/components/Seo.jsx
export default function Seo({ title, description, path, image }) {
  const url = `https://manokamanahirepurchase.com.np${path}`
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image ?? 'https://manokamanahirepurchase.com.np/og-default.jpg'} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
```

Recommended values (titles ≤60 chars, descriptions 140–160):

| Route | Title | Description |
|---|---|---|
| `/` | Vehicle Hire Purchase Financing in Nepal \| Manokamana | NRB-licensed hire purchase financing for two-wheelers, cars, commercial vehicles and heavy equipment across Nepal. Approvals in 24 hours. |
| `/services` | Vehicle & Equipment Financing Services \| Manokamana | Finance motorcycles, cars, commercial vehicles, tractors and excavators with flexible EMIs and transparent terms. See all five categories. |
| `/emi-calculator` | Vehicle Loan EMI Calculator Nepal \| Manokamana | Calculate your monthly instalment for a bike, car, or equipment loan in Nepal. Enter amount, rate and tenure for an instant EMI estimate. |
| `/about` | About Manokamana Hire Purchase \| NRB-Licensed Lender | An NRB-licensed hire purchase company and part of MV Dugar Group, financing vehicles and equipment for buyers across Nepal. |
| `/contact` | Contact Manokamana Hire Purchase, Kathmandu | Call 01-4163533 or visit our Kathmandu office to discuss vehicle and equipment financing. Free consultation, no obligation. |
| `/leadership` | Our Leadership Team \| Manokamana Hire Purchase | Meet the executives leading Nepal's vehicle and equipment hire purchase financing at Manokamana. |
| `/blog` | Hire Purchase & Vehicle Loan Guides \| Manokamana | Plain-language guides to hire purchase in Nepal: sizing your EMI, required documents, and choosing between new, used and electric. |
| `/reports` | Financial Reports & Disclosures \| Manokamana | Published financial reports and regulatory disclosures for Manokamana Hire Purchase Pvt. Ltd. |
| `/careers` | Careers at Manokamana Hire Purchase | Open roles at an NRB-licensed hire purchase company in Kathmandu. |
| `/privacy` | Privacy Policy \| Manokamana Hire Purchase | How Manokamana Hire Purchase collects, uses and protects your personal information. |
| `/terms` | Terms of Service \| Manokamana Hire Purchase | Terms governing use of the Manokamana Hire Purchase website and services. |

Blog posts: `{post.title} | Manokamana Hire Purchase`, description from the existing `excerpt` field.

### 1.2 Add sitemap.xml and a site-owned robots.txt
**Severity: Critical · Effort: 1 h**

Create `public/sitemap.xml` covering the 12 public routes (exclude `/admin`) plus the 7 blog slugs from `src/data/posts.js`. Best done as a small Vite build-time generator so it stays in sync with `posts.js`.

Create `public/robots.txt` — this replaces Cloudflare's managed default, so **carry forward any AI-crawler decision deliberately** (see 2.5):

```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://manokamanahirepurchase.com.np/sitemap.xml
```

Then submit the sitemap in Google Search Console. If GSC is not yet set up, that is step zero — you currently have no visibility into how Google sees this site.

### 1.3 Fix soft 404s
**Severity: Critical · Effort: 1-2 h**

Every unknown URL returns HTTP 200. On Cloudflare Pages, add a `public/_routes.json` / `404.html` fallback, or a Pages Function that returns a real 404 status for unmatched paths. As an interim mitigation, render `<meta name="robots" content="noindex">` from the `NotFound` component — this keeps junk URLs out of the index even while the status code is still wrong. The status-code fix is the real one; do both.

### 1.4 Restore the security headers
**Severity: Critical · Effort: 1 h**

`vercel.json` is not being read — the site is served by Cloudflare. Port all six headers to a Cloudflare **Transform Rule** (Response Header Modification) or a `public/_headers` file if you are on Cloudflare Pages:

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: <copy from vercel.json>
```

Then either delete `vercel.json` or add a comment noting it is inactive, so the next developer doesn't trust it.

### 1.5 Lock down `/admin`
**Severity: Critical (security, not SEO) · Effort: varies**

`/admin` is publicly reachable, unauthenticated at the route level, and indexable. Add `Disallow: /admin` to robots.txt and `noindex` to the page — but treat that as damage limitation, not a fix. The real fix is server-side authentication on the backend endpoints the dashboard calls. Worth a separate scoped task.

---

## Phase 2 — High Impact (Weeks 2-3)

### 2.1 Structured data (JSON-LD)
**Severity: High · Effort: 4-5 h**

Site-wide, in `MainLayout`:

```jsx
<script type="application/ld+json">{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Manokamana Hire Purchase Pvt. Ltd.",
  "url": "https://manokamanahirepurchase.com.np",
  "logo": "https://manokamanahirepurchase.com.np/logo.png",
  "telephone": "+977-1-4163533",
  "email": "info@manokamanahirepurchase.com.np",
  "address": { "@type": "PostalAddress", "addressLocality": "Kathmandu", "addressCountry": "NP" },
  "geo": { "@type": "GeoCoordinates", "latitude": 27.7108334, "longitude": 85.31344 },
  "areaServed": { "@type": "Country", "name": "Nepal" },
  "parentOrganization": { "@type": "Organization", "name": "MV Dugar Group" },
  "serviceType": ["Two-wheeler financing","Car financing","Commercial vehicle financing","Agricultural equipment financing","Construction equipment financing"]
})}</script>
```

Fill in `streetAddress` and `openingHoursSpecification` once you have them — both are currently missing from the site entirely and both matter for the local pack.

Then: `FAQPage` on the homepage (content already written), `Article` + `Person` author on blog posts, `BreadcrumbList` on inner pages, `JobPosting` on `/careers`.

**Hold off on `Review`/`AggregateRating` schema** until the testimonial provenance question in 3.3 is settled. Marking up reviews that aren't verifiably real is a Google policy violation.

### 2.2 Fix image delivery
**Severity: High · Effort: 3-4 h**

The homepage ships 2.1 MB of images, including a 3000×1975 photo rendered at 95×600 px.

- Generate responsive variants with `sharp` (already a devDependency) at ~400/800/1600 px; emit `srcset` + `sizes`.
- Add `alt` to the 6 images missing it (`wp9212100`, `rv-4006491267651bec`, `photo-1612057473166`, `70_kmph_top_speed`, `photo-1594771804886`, `sinharai power`).
- Add explicit `width`/`height` to every `<img>` — this is your CLS fix.
- Add `loading="lazy"` + `decoding="async"` to everything below the fold; keep the hero eager with `fetchpriority="high"`.
- Rename files descriptively: `photo-1612057473166-af2affdb92ad.avif` → `passenger-car-financing-nepal.avif`.
- Remove `ZAXIS 140H Ultra.JPG` (13 MB) and the untracked `ChatGPT Image Aug 10, 2026....png` (1.7 MB) from `src/assets/images/`.

Realistic target: **2.1 MB → under 400 KB**.

### 2.3 Route-level code splitting
**Severity: High · Effort: 2 h**

One bundle currently ships `Admin.jsx` (the largest file in the project), `leaflet`, and `gsap` to every homepage visitor. Convert routes to `React.lazy()` + `<Suspense>`, starting with `/admin`, `/emi-calculator`, and the Leaflet map component.

### 2.4 Self-host fonts, lengthen asset cache
**Severity: High · Effort: 2 h**

Move Inter and Sora into `public/fonts/` with `font-display: swap` and a `<link rel="preload">` for the two weights used above the fold. Drop unused weights — 11 weights are declared. Removes a render-blocking third-party request and the `fonts.googleapis.com` round trip.

Separately, raise hashed-asset `Cache-Control` from `max-age=14400` to `max-age=31536000, immutable`.

### 2.5 Decide the AI-crawler policy — deliberately
**Severity: High · Effort: 30 min decision + 15 min implementation**

Cloudflare's default `robots.txt` currently blocks GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, Applebot-Extended, and meta-externalagent. Manokamana is invisible to ChatGPT, Claude, and Perplexity as a result.

Your three options:

| Option | Effect |
|---|---|
| **Keep blocking** | Content protected from AI training; zero AI-mediated discovery |
| **Allow citation crawlers, block training** (recommended) | Allow GPTBot, ClaudeBot, PerplexityBot; keep `Content-Signal: ai-train=no`. Brand becomes citable in AI answers. |
| **Allow all** | Maximum reach, no training protection |

This is a business call — make it explicitly rather than inheriting Cloudflare's default. Note that writing your own `robots.txt` (1.2) overrides the managed one, so the decision gets made either way at that point.

---

## Phase 3 — Content & Authority (Month 2)

### 3.1 Deepen the blog
**Severity: Medium · Effort: ongoing**

7 posts averaging ~200 words won't rank for competitive terms. Expand the highest-intent posts to 1,200–1,800 words:
- "The complete guide to hire purchase in Nepal" — the natural pillar page
- "How to size an EMI you can actually keep" — pairs directly with `/emi-calculator`
- "Every document you need for a vehicle loan, listed" — strong featured-snippet candidate

Add worked examples with real Nepali price points, comparison tables, and internal links to `/services` and `/emi-calculator`.

### 3.2 Author attribution and machine-readable dates
**Severity: Medium · Effort: 2-3 h**

Add `author` to each post in `posts.js`, linked to a bio on `/leadership`. Add an ISO `datePublished` alongside the Bikram Sambat display date — keep showing BS to readers, give Google ISO in the schema.

### 3.3 Verify testimonial provenance
**Severity: Medium · Effort: 1 h**

Five testimonials are labelled "GOOGLE REVIEW" but are hardcoded in the source. Confirm each corresponds to a real Google Business Profile review. If yes, ideally pull them from the GBP API so they stay current. If any are illustrative rather than real, the "GOOGLE REVIEW" label must be removed. Only after this is settled should `Review` schema be added.

### 3.4 Publish the NRB license number, address, and hours
**Severity: Medium · Effort: 1 h**

Three concrete trust signals currently missing:
- The NRB license number, next to the existing "Licensed by Nepal Rastra Bank" claim
- A full street address (ward, tole, landmark) — "Kathmandu" alone won't rank in the local pack
- Business hours, published on `/contact` and in `LocalBusiness` schema

### 3.5 Link `/reports` from the main navigation
**Severity: Medium · Effort: 15 min**

`/reports` is orphaned — reachable only by direct URL. For a regulated lender, published financial disclosures are a strong E-E-A-T asset. Add it to the nav or the footer.

### 3.6 Add `llms.txt`
**Severity: Low · Effort: 30 min**

Only meaningful if 2.5 opens AI crawler access. Note that Google Search ignores `llms.txt`; it is a bet on emerging AI-crawler conventions, not an SEO ranking factor.

---

## Phase 4 — Monitoring (Ongoing)

1. **Set up Google Search Console** and submit the sitemap. Without it you are flying blind — nothing else on this list can be measured.
2. **Set up Bing Webmaster Tools** — Bing renders JS far less reliably than Google, so the CSR issue will surface there first.
3. **Claim and complete the Google Business Profile** — for a single-location Kathmandu lender, GBP will likely outperform the website for local queries. Categories, hours, photos, and a steady review cadence.
4. **Add CrUX/PageSpeed monitoring** for real-world Core Web Vitals, especially on Nepali mobile networks. This audit's performance figures are lab-inferred; the field data will be worse.
5. **Re-audit after Phase 2** to confirm the health score moves.

---

## Longer-term: consider SSR or prerendering
**Severity: High · Effort: 1-2 weeks**

Every fix above works around client-side rendering rather than solving it. Raw HTML is 942 bytes; all content depends on JS execution. Google copes, Bing copes poorly, and non-rendering AI crawlers see nothing.

For a 13-route mostly-static marketing site, the cheapest solution is **build-time prerendering** — `vite-plugin-prerender` or similar — which emits real static HTML per route while keeping the existing React code. This is a far smaller change than migrating to Next.js or Remix, and it makes the title/meta/schema work from Phase 1 visible in the raw HTML rather than only after JS runs.

Do this after Phase 1-2 have landed and been measured.

---

## Expected Impact

| Phase | Health score |
|---|---|
| Current | **30** |
| After Phase 1 | ~52 |
| After Phase 2 | ~72 |
| After Phase 3 | ~82 |
| After prerendering | ~90 |
