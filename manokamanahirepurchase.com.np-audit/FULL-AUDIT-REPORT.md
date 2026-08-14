# Full SEO Audit — manokamanahirepurchase.com.np

**Audited:** 2026-08-14
**Business type:** Local financial services (vehicle hire purchase / asset finance), single location, Kathmandu, Nepal. NRB-licensed lender, part of MV Dugar Group.
**Stack:** React 19 + Vite 8 SPA, react-router-dom 7, client-side rendered. Served behind Cloudflare.

## SEO Health Score: 30 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 28 | 6.2 |
| Content Quality | 23% | 58 | 13.3 |
| On-Page SEO | 20% | 18 | 3.6 |
| Schema / Structured Data | 10% | 0 | 0.0 |
| Performance (CWV) | 10% | 40 | 4.0 |
| AI Search Readiness | 10% | 10 | 1.0 |
| Images | 5% | 35 | 1.8 |
| **Total** | | | **29.9 → 30** |

The headline is not that the site is bad. The rendered site is genuinely good — clear positioning, real service breakdowns, an FAQ block, a leadership page, plain-language blog posts. The problem is that almost none of that is legible to a search engine, and nothing on the site tells Google *which page is about what*. Every one of the 13 public routes ships the identical `<title>`, zero meta descriptions, zero canonicals, zero structured data, and no sitemap. The content exists; the SEO layer around it does not.

---

## Top 5 Critical Issues

1. **Every page shares one title tag and has no meta description.** All routes return `<title>Manokamana Hire Purchase</title>`. There is no title/meta management anywhere in the codebase (no `react-helmet`, no `document.title` writes — verified by grep across `src/`). Google has no signal to distinguish `/services` from `/contact` from `/emi-calculator`.
2. **No sitemap.xml and no site-owned robots.txt.** `/sitemap.xml` returns the SPA shell with HTTP 200, not XML. `robots.txt` is Cloudflare's managed default — it works, but it carries no `Sitemap:` directive and was not authored for this site.
3. **Soft 404s on every unknown URL.** `/this-page-does-not-exist-xyz` returns **HTTP 200** with the SPA shell. Any typo'd or stale URL is an indexable duplicate of the homepage. This is the classic SPA index-bloat trap.
4. **Zero structured data.** No JSON-LD on any page. For an NRB-licensed local lender this is the single biggest missed opportunity — `FinancialService`/`LocalBusiness`, `FAQPage` (5 FAQs already sit on the homepage), `Organization`, `Article`, and `BreadcrumbList` are all directly applicable and all absent.
5. **Security headers declared but never applied.** `vercel.json` defines CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` — but the live response carries **none** of them. `Server: cloudflare`, and no Vercel headers are present, so the site is not being served by the platform that reads `vercel.json`. The security config is dead code.

## Top 5 Quick Wins

1. Add per-route `<title>` and `<meta name="description">` — React 19 supports hoisting `<title>`/`<meta>` rendered anywhere in the tree natively, so this needs no new dependency.
2. Ship a static `public/sitemap.xml` with the 12 public routes + 7 blog posts, and a `public/robots.txt` pointing to it.
3. Add `FAQPage` JSON-LD to the homepage — the questions and answers are already written and on the page.
4. Add `alt` text to the 6 homepage images that lack it, plus `loading="lazy"` and explicit `width`/`height` on all non-hero images.
5. Add Open Graph + Twitter Card tags. Right now every WhatsApp/Facebook/LinkedIn share of this site renders as a blank grey card — for a business that runs on referral and local trust, that is a daily conversion leak.

---

## Technical SEO — 28/100

### Crawlability

| Check | Result |
|---|---|
| `robots.txt` | Cloudflare managed default, `Allow: /`. No `Sitemap:` directive. Not authored by the site. |
| `sitemap.xml` | **Missing** — returns SPA shell, HTTP 200, `Content-Type: text/html` |
| `llms.txt` | **Missing** — returns SPA shell, HTTP 200 |
| Internal linking | Main nav links 8 routes. `/reports` is **orphaned** — reachable only by direct URL |
| Redirects | No redirect chains observed |

### Indexability

- **Client-side rendering.** Raw HTML is 942 bytes: an empty `<div id="root">`. All content requires JS execution. Googlebot renders JS, but with a deferred second-pass crawl. Bingbot, and most AI crawlers, largely do not.
- **No canonical tags** on any route. Combined with soft 404s, this leaves the site defenceless against duplicate-URL indexing (`?utm_*`, trailing slashes, typo'd paths).
- **Soft 404s.** Verified: `/no-such-page-xyz` → HTTP 200. The React `NotFound` component renders, but the status code Google reads is 200.
- **`/admin` is publicly reachable and indexable.** The route is commented in `App.jsx` as a "hidden admin dashboard", but there is no `noindex`, no robots disallow, and no server-side gate on the route itself. Obscurity is not access control.

### Security

The live origin returns **no** security headers. Missing: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. All six are correctly written in [vercel.json](vercel.json) but the deployment is served by Cloudflare, which does not read that file. HTTPS itself is fine.

### Caching

HTML is served with **no `Cache-Control`** header. Hashed assets get `max-age=14400` (4 hours) — short for immutable content-hashed filenames, which can safely take `max-age=31536000, immutable`.

## Content Quality — 58/100

**What works.** The copy is a genuine strength. It is specific, plainly written, and free of finance-industry padding. Service categories break down into concrete asset types. The FAQ answers real borrower questions ("What is the minimum down payment?"). A `/leadership` page with named executives and a `/reports` page are exactly the E-E-A-T signals a regulated lender needs. The blog is written in the same honest register — "your income should be at least twice the EMI amount" is the kind of concrete guidance that earns citations.

**What holds it back.**

- **Thin blog posts.** 7 posts totalling ~1,444 words of body copy in [src/data/posts.js](src/data/posts.js) — averaging roughly 200 words each, with the featured post the longest at ~330. For competitive queries like "hire purchase Nepal" or "vehicle loan EMI Nepal" this is well below what ranks.
- **No author attribution.** Blog posts carry no byline, no author bio, no credentials. For YMYL financial content, Google weighs author expertise heavily. The `/leadership` page has the people; the posts don't connect to them.
- **Non-standard dates.** Posts use Bikram Sambat ("Asar 26, 2083"). Correct for the audience, but there is no machine-readable `datePublished` anywhere, so Google cannot determine freshness.
- **Testimonials labelled "GOOGLE REVIEW" are hardcoded in the source.** Five reviews with named attribution render from static component data, not from the Google Business Profile. If these are verbatim real reviews, fine — but they should be sourced from GBP and, if used as `Review` schema, must be genuine and verifiable. Presenting fabricated reviews as Google reviews would be both a Google policy violation and a consumer-protection problem. **Confirm provenance before adding review schema.**
- **NRB license claimed without a number.** "Licensed by Nepal Rastra Bank" appears on the hero and About page. Adding the actual license number is a cheap, high-value trust and E-E-A-T signal for a regulated lender.

## On-Page SEO — 18/100

| Element | Status |
|---|---|
| Title tags | **1 unique title across 13 routes.** "Manokamana Hire Purchase" — 23 chars, no service or location keywords |
| Meta descriptions | **0 of 13 pages** |
| Canonical tags | **0 of 13 pages** |
| Open Graph / Twitter Cards | **0 tags site-wide** — all social shares render blank |
| H1 | One per page, correctly. Homepage H1: "Powering Nepal Through Hire Purchase" — brand-led, no service/location keyword |
| Heading order | Homepage jumps H1 → H3 → H2 (the "Driven By Your Ambitions" band). Minor. |
| `lang` attribute | `en` ✓ |
| Viewport meta | Present ✓ |

The homepage H1 is a good brand line but a weak SEO line. "Vehicle Hire Purchase Financing in Nepal" is what people search. The two can coexist — brand line as the visual hero, keyword-bearing phrase in the H1 or the title tag.

Suggested title/description set is in [ACTION-PLAN.md](manokamanahirepurchase.com.np-audit/ACTION-PLAN.md).

## Schema / Structured Data — 0/100

Zero JSON-LD blocks site-wide. Every one of these is directly applicable and currently missing:

| Schema | Page | Why it matters here |
|---|---|---|
| `FinancialService` (+ `LocalBusiness`) | Site-wide | NAP, hours, geo, `areaServed`, license. Feeds the local pack. |
| `FAQPage` | Homepage | 5 Q&As already written and rendered |
| `Organization` | Site-wide | Logo, `parentOrganization: MV Dugar Group`, `sameAs` |
| `Article` + `Person` author | 7 blog posts | YMYL author signals, freshness |
| `BreadcrumbList` | All inner pages | Breadcrumb rich results |
| `Service` | `/services` | 5 financing categories are already structured data in [src/data/services.js](src/data/services.js) |
| `JobPosting` | `/careers` | Google Jobs eligibility |
| `WebApplication` / `HowTo` | `/emi-calculator` | Calculator tools attract links and citations |

NAP data confirmed consistent across [Contact.jsx](src/pages/Contact.jsx) and [Footer.jsx](src/components/Footer.jsx): phone `01-4163533` / `+977014163533`, email `info@manokamanahirepurchase.com.np`, Kathmandu, coordinates `27.7108334, 85.31344`.

## Performance — 40/100

Measured on the live site, desktop, warm cache-status HIT:

| Metric | Value | Assessment |
|---|---|---|
| TTFB | 607 ms | Fair — Cloudflare edge, `cf-cache-status: DYNAMIC` on HTML |
| DOMContentLoaded | 865 ms | Good |
| Load event | 866 ms | Good |
| **Total transfer** | **3,792 KB** | **Poor** |
| Images | 2,113 KB across 8 requests | **Poor** |
| Fonts + CSS | 1,532 KB across 4 requests | **Poor** |
| JS | 215 KB (brotli) / 663 KB raw | Fair, but see below |
| Requests | 18 | Good |

Field data (CrUX) was not retrievable — no Google API credentials configured — so LCP/INP/CLS are lab-inferred, not measured. On a Nepali mobile connection, a ~3.8 MB homepage will very likely fail the LCP threshold.

**Root causes.**

1. **Grossly oversized images.** A 3000×1975 photo is served and displayed at **95×600 px**. Another 3000×2004 image, same treatment. No `srcset`, no responsive variants — every visitor downloads full-resolution originals to fill a thin vertical strip.
2. **No route-level code splitting.** A single `index.js` bundle. That means `Admin.jsx` (4,868 words, the largest file in the project), plus `leaflet` (the office map) and `gsap`, are downloaded by every visitor who lands on the homepage and never visits those pages.
3. **Render-blocking Google Fonts.** Two families, 11 weights total, loaded via an external stylesheet in `<head>`. `preconnect` is correctly present, but the stylesheet still blocks render.
4. **Short asset cache TTL.** 4 hours on content-hashed filenames that can never change.

## Images — 35/100

- **6 of 12 homepage images have empty `alt`** — `wp9212100.webp`, `rv-4006491267651bec.avif`, `photo-1612057473166.avif`, `70_kmph_top_speed.webp`, `photo-1594771804886.avif`, `sinharai power.jpg`. The 6 that do have alt text are well written ("John Deere tractor and harvesters we finance").
- **No `width`/`height` on any image** — every one is a CLS contributor.
- **No `loading="lazy"` on any image**, including below-fold ones.
- **No `srcset`/responsive variants.**
- Modern formats *are* in use (WebP/AVIF) — good instinct, undermined by not resizing.
- Repo hygiene: `src/assets/images/ZAXIS 140H Ultra.JPG` is a **13 MB** source file, and an untracked `ChatGPT Image Aug 10, 2026, 11_22_57 AM.png` (1.7 MB) sits in the images folder. Neither belongs in the bundle path.
- Filenames like `photo-1612057473166-af2affdb92ad.avif` and `wp9212100.webp` carry no keyword value. `passenger-car-financing-nepal.avif` does.

## AI Search Readiness — 10/100

**The site actively blocks every major AI crawler.** The Cloudflare-managed `robots.txt` sets:

```
Content-Signal: search=yes,ai-train=no,use=reference
User-agent: GPTBot        → Disallow: /
User-agent: ClaudeBot     → Disallow: /
User-agent: Google-Extended → Disallow: /
User-agent: CCBot         → Disallow: /
User-agent: Bytespider    → Disallow: /
User-agent: Applebot-Extended → Disallow: /
User-agent: meta-externalagent → Disallow: /
```

This is Cloudflare's default AI-blocking posture, very likely enabled without a deliberate decision. The effect: Manokamana cannot be cited by ChatGPT, Claude, Perplexity, or Meta AI. Google AI Overviews are *partly* separate (`Google-Extended` governs Gemini training and grounding, not core Search indexing), but the overall stance is maximally restrictive.

This is a **business decision, not purely a technical one**. Blocking AI training protects content from being absorbed into models; it also removes the brand from AI-mediated discovery, which in Nepal's finance sector is a growing referral path. My recommendation is to allow the crawlers that drive *citations with attribution* (GPTBot, ClaudeBot, PerplexityBot) while keeping `ai-train=no`, but this is your call to make, not mine to assume.

Compounding it: even if crawlers were allowed, **client-side rendering means non-JS-executing AI crawlers see a blank page.** Both problems must be fixed for AI visibility.

Ironically, the *content* is well suited to citation — the FAQ block, the "income should be at least twice the EMI" rule of thumb, and the document checklists are exactly the passage-level answers AI engines quote. It is all currently unreachable.

## Local SEO

- NAP is consistent across the site ✓
- Office map with exact coordinates ✓ (Leaflet)
- Google Maps directions link with `place_id` ✓
- **No `LocalBusiness`/`FinancialService` schema** ✗
- **No business hours published anywhere on the site** ✗
- **No street address** — "Kathmandu" only. A specific address (ward, tole, landmark) is needed for local pack ranking.
- Google Business Profile could not be audited — no DataForSEO or Google API credentials configured.

---

## Audit Limitations

- The `claude-seo` Python runtime failed to install (`/seo setup` did not complete), so this audit was performed manually via direct HTTP crawling, live browser instrumentation, and source-code review of the repository at `D:\Manokamana Hire Purchase`.
- **No CrUX/GSC/GA4 field data** — no Google API credentials configured. Core Web Vitals are lab-inferred.
- **No backlink data** — no Moz/Bing/DataForSEO credentials configured.
- **No SERP position or keyword volume data** — same reason.
- **No screenshots** — the browser pane was not displayed, so frame capture was unavailable.
- Crawl covered all 13 routes declared in `App.jsx` plus 7 blog-post slugs from `src/data/posts.js` (20 URLs total), not a 500-page link crawl — the site is smaller than the crawl budget.
