# Content Quality & E-E-A-T — Evidence Log

**Score: 58/100** · Audited 2026-08-14

## What is genuinely strong

The rendered copy is the best asset this site has. It is specific, plain, and free of finance-industry filler:

- Service categories name real assets — "Motorcycles, Scooters, Electric bikes", "Pickup trucks, Vans, Mini trucks, Buses", "Excavators, Loaders, Heavy machinery"
- The homepage FAQ answers questions borrowers actually ask: minimum down payment, approval time, required documents, early repayment
- The blog gives concrete, checkable guidance: *"your income should be at least twice the EMI amount"*
- `/leadership` names executives with photos — a real E-E-A-T signal for a regulated lender
- `/reports` publishes financial disclosures — rarer still, and currently orphaned from navigation

## Experience, Expertise, Authoritativeness, Trust

| Signal | Status |
|---|---|
| Named leadership with photos | ✓ `/leadership` |
| Published financial reports | ✓ `/reports` (but unlinked) |
| Regulatory license claimed | ⚠ "Licensed by Nepal Rastra Bank" — **no license number** |
| Parent company disclosed | ✓ MV Dugar Group |
| Physical address | ⚠ "Kathmandu" only — **no street address** |
| Business hours | ✗ **published nowhere on the site** |
| Blog author bylines | ✗ **none** |
| Author bios / credentials | ✗ **none** |
| Machine-readable dates | ✗ Bikram Sambat display only |
| Customer reviews | ⚠ see provenance note below |

For YMYL financial content, the three missing items in bold — license number, author attribution, business hours — are disproportionately costly. Each is under an hour of work.

## Blog depth

`src/data/posts.js` — 7 posts, **~1,444 words of body copy in total**.

| Post | Est. words |
|---|---|
| The complete guide to hire purchase in Nepal *(featured)* | ~330 |
| How to size an EMI you can actually keep | ~200 |
| First bike on finance? Read this before the showroom | ~200 |
| From one truck to a fleet: financing that scales | ~200 |
| A tractor that pays for itself: the harvest math | ~200 |
| Every document you need for a vehicle loan, listed | ~200 |
| New, used, or electric: which car loan fits you? | ~200 |

The featured post is structured well — `p` / `h2` content blocks, a clear intro, two sub-sections, a closing line. At ~330 words it is a strong outline of a pillar page rather than the pillar page itself. Nothing here is padding; there simply isn't enough of it to compete.

The three worth expanding first, on search intent:
1. **The complete guide to hire purchase in Nepal** — the natural pillar
2. **How to size an EMI you can actually keep** — pairs directly with `/emi-calculator`
3. **Every document you need for a vehicle loan, listed** — strong featured-snippet candidate

## Date format

```js
date: 'Asar 26, 2083'   // Bikram Sambat
```

Correct for a Nepali audience and should stay visible. But there is no ISO date anywhere in the data, so Google cannot determine freshness. Add `datePublished` in ISO alongside it and expose it via `Article` schema — display BS, serve ISO.

## Testimonial provenance — needs verification before schema

Five testimonials render on the homepage, each labelled **"GOOGLE REVIEW"** with a named attributor (Manoj Gurung, Bishal Shrestha, Ramesh Patel, Sunita Rai, Dipendra Thapa). They are hardcoded in component source, not fetched from the Google Business Profile.

The reviews may well be verbatim and real — the label is only a problem if they aren't. Before adding any `Review` or `AggregateRating` schema, confirm each maps to an actual GBP review. Marking up reviews that cannot be verified is a Google structured-data policy violation, and in a regulated lending context, presenting fabricated reviews as Google reviews is a consumer-protection issue as well.

If genuine: pull them from the GBP API so they stay current, then mark them up. If any are illustrative: remove the "GOOGLE REVIEW" label.

Separately, the marquee renders all five twice, so the rendered DOM contains each testimonial's text duplicated — harmless for a carousel, but avoid marking up the duplicate copies.

## Content-to-code ratio

Raw HTML is 942 bytes with zero body content. All ~2,800 words of homepage copy exist only after JavaScript executes. Every strength listed on this page is invisible to any crawler that does not render JS.
