# Images — Evidence Log

**Score: 35/100** · Audited 2026-08-14 · 12 images on the rendered homepage

## Full homepage image inventory

| # | File | Alt | Natural | Displayed | `width`/`height` | `loading` | `srcset` |
|---|---|---|---|---|---|---|---|
| 1 | `dugar-logo.png` | "MV Dugar Group" ✓ | 118×119 | 56×56 | ✗ | ✗ | ✗ |
| 2 | `manokamana-logo.png` | "Manokamana Hire Purchase" ✓ | 598×212 | 158×56 | ✗ | ✗ | ✗ |
| 3 | `john-deere-tractor-and-harvesters.webp` | "John Deere tractor and harvesters we finance" ✓ | 1600×1000 | 385×488 | ✗ | ✗ | ✗ |
| 4 | `650h zaxis.webp` | "ZAXIS excavator we finance" ✓ | 1000×1000 | 385×480 | ✗ | ✗ | ✗ |
| 5 | `wp9212100.webp` | **empty** ✗ | 1400×788 | 385×256 | ✗ | ✗ | ✗ |
| 6 | `rv-4006491267651bec.avif` | **empty** ✗ | 880×495 | 763×600 | ✗ | ✗ | ✗ |
| 7 | `photo-1612057473166-af2affdb92ad.avif` | **empty** ✗ | **3000×2004** | **95×600** | ✗ | ✗ | ✗ |
| 8 | `70_kmph_top_speed.webp` | **empty** ✗ | 1600×910 | 95×600 | ✗ | ✗ | ✗ |
| 9 | `photo-1594771804886-a933bb2d609b.avif` | **empty** ✗ | **3000×1975** | **95×600** | ✗ | ✗ | ✗ |
| 10 | `sinharai power.jpg` | **empty** ✗ | 998×663 | 95×600 | ✗ | ✗ | ✗ |
| 11 | `dugar-logo.png` (footer) | "MV Dugar Group" ✓ | 118×119 | 40×40 | ✗ | ✗ | ✗ |
| 12 | `manokamana-logo.png` (footer) | "Manokamana Hire Purchase" ✓ | 598×212 | 102×36 | ✗ | ✗ | ✗ |

**Totals: 6/12 missing alt · 12/12 missing `width`/`height` · 12/12 missing `loading` · 12/12 missing `srcset`.**

## Alt text

The six images that *do* have alt text are genuinely well written — "John Deere tractor and harvesters we finance" describes both subject and business relevance. Whoever wrote those knew what they were doing; the other six were simply skipped.

Images 7–10 form a decorative vertical strip. If they are purely decorative, `alt=""` is technically correct and they should also carry `aria-hidden="true"`. If they depict financed asset categories — which the filenames suggest — they deserve real alt text. Worth a deliberate decision rather than the current default.

## File weight

Delivered on the homepage: **2,113 KB across 8 image requests** — 56% of total page weight.

Largest assets in `src/assets/images/`:

| Size | File | Note |
|---|---|---|
| **13 MB** | `ZAXIS 140H Ultra.JPG` | Read-only source file; a 359 KB WebP version already exists alongside it |
| **1.7 MB** | `ChatGPT Image Aug 10, 2026, 11_22_57 AM.png` | **Untracked in git** — currently the only uncommitted file in the repo |
| 844 KB | `photo-1594771804886-a933bb2d609b.avif` | Served at 95×600 |
| 646 KB | `photo-1612057473166-af2affdb92ad.avif` | Served at 95×600 |
| 472 KB | `john-deere-tractor-and-harvesters...webp` | |
| 434 KB | `70_kmph_top_speed.webp` | Served at 95×600 |

The two AVIFs alone are 1.49 MB to fill two 95 px-wide strips.

## Format

WebP and AVIF are already the dominant formats — the right instinct, undermined by never resizing the source. A 3000 px AVIF is still a 3000 px image; the modern codec only softens the cost.

## Filenames

Several carry no semantic value:
- `photo-1612057473166-af2affdb92ad.avif` → `passenger-car-financing-nepal.avif`
- `rv-4006491267651bec.avif` → `two-wheeler-financing-nepal.avif`
- `wp9212100.webp` → `commercial-vehicle-financing.webp`
- `70_kmph_top_speed.webp` → `electric-scooter-finance-nepal.webp`

These read as stock-library download names. Renaming is a small, safe win for image search.

## Fix sequence

1. Add alt text (or `alt="" aria-hidden="true"`) to images 5–10 — 20 minutes
2. Add explicit `width`/`height` to all 12 — the CLS fix
3. Generate 400/800/1600 px variants with `sharp` (already a devDependency) and emit `srcset` + `sizes`
4. `loading="lazy"` + `decoding="async"` below the fold; `fetchpriority="high"` on the hero
5. Delete `ZAXIS 140H Ultra.JPG` and the untracked ChatGPT PNG from the bundle path
6. Rename assets descriptively

Realistic outcome: **2,113 KB → under 400 KB**, plus the CLS fix.
