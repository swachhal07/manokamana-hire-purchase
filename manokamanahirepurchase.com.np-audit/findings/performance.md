# Performance — Evidence Log

**Score: 40/100** · Audited 2026-08-14 · Desktop, live site, `cf-cache-status: HIT` on assets

## Navigation timing

| Metric | Value |
|---|---|
| TTFB | 607 ms |
| DOMContentLoaded | 865 ms |
| Load event | 866 ms |
| Requests | 18 |
| **Total transfer** | **3,792 KB** |

`server-timing: cfEdge;dur=4, cfOrigin;dur=578` — the edge is fast; the 578 ms origin fetch dominates TTFB. HTML is `cf-cache-status: DYNAMIC`, so it is not edge-cached.

## Transfer by resource type

| Type | Requests | Bytes | Share |
|---|---|---|---|
| **img** | 8 | **2,113,307** | 56% |
| **css** (incl. font files) | 4 | **1,531,928** | 40% |
| script | 2 | 215,396 | 6% |
| link | 2 | 21,569 | <1% |
| fetch/xhr | 2 | 693 | ~0% |

Images and fonts are 96% of the payload. JavaScript is not the problem here — the assets are.

## Image over-delivery

Measured `naturalWidth × naturalHeight` against `clientWidth × clientHeight`:

| File | Natural | Displayed | Waste |
|---|---|---|---|
| `photo-1612057473166-af2affdb92ad.avif` | 3000×2004 | **95×600** | ~31× linear |
| `photo-1594771804886-a933bb2d609b.avif` | 3000×1975 | **95×600** | ~31× linear |
| `70_kmph_top_speed.webp` | 1600×910 | 95×600 | ~17× |
| `sinharai power.jpg` | 998×663 | 95×600 | ~10× |
| `wp9212100.webp` | 1400×788 | 385×256 | ~3.6× |
| `john-deere-tractor-and-harvesters.webp` | 1600×1000 | 385×488 | ~4× |
| `manokamana-logo.png` | 598×212 | 158×56 | ~3.8× |

**No image on the page declares `srcset`.** Four images fill a 95 px-wide vertical strip using 3000 px-wide source files.

## JavaScript bundle

| Measure | Value |
|---|---|
| Raw | 663 KB (`index-B9MW-LAQ.js` in local `dist/`) |
| Brotli over the wire | 209 KB |
| Chunks | **1** — no route splitting |

Everything ships to every visitor, including:
- `Admin.jsx` — 4,868 words, the largest file in the project, used by no public visitor
- `leaflet` — the office map, used only on `/contact`
- `gsap` — animation library

`React.lazy()` on `/admin`, `/emi-calculator` and the Leaflet map would cut the first-load bundle substantially.

## Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
```

`preconnect` is correctly present, and `display=swap` is set. But this is still a render-blocking stylesheet on a third-party origin, declaring **11 weights across two families**. Self-hosting and subsetting to the 3–4 weights actually used would remove a round trip and a large share of that 1.53 MB.

## Caching

| Asset | Cache-Control |
|---|---|
| HTML | *(none)* |
| `/assets/index-*.js` | `max-age=14400` (4 h) |

Content-hashed filenames can safely take `max-age=31536000, immutable`.

## Core Web Vitals

**Not measured.** `performance.getEntriesByType('largest-contentful-paint')` returned empty and `paint` entries were unavailable — the browser pane was not compositing frames, so LCP/CLS could not be captured. No CrUX field data either (no Google API credentials configured).

Lab inference from the payload: a 3.79 MB homepage with a 2.1 MB image load and no `width`/`height` on any image will very likely fail **both** LCP and CLS on a Nepali mobile connection. Treat this as the highest-uncertainty section of the audit — set up CrUX or PageSpeed monitoring to get real numbers.
