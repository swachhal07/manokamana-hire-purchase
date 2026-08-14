# On-Page SEO — Evidence Log

**Score: 18/100** · Audited 2026-08-14

## The core finding

```
$ grep -rniE "document.title|helmet|useTitle|meta name" src --include=*.jsx
(no matches)
```

There is no title or metadata management of any kind in this codebase. `package.json` lists no `react-helmet`, no `react-helmet-async`, no metadata library. The only `<title>` in the project is the static one in `index.html`.

Consequence, measured across all 13 routes:

| Element | Coverage |
|---|---|
| Unique title tags | **1 of 13** |
| Meta descriptions | **0 of 13** |
| Canonical tags | **0 of 13** |
| Open Graph tags | **0 site-wide** |
| Twitter Card tags | **0 site-wide** |
| JSON-LD blocks | **0 site-wide** |

Verified in-browser: `document.querySelector('meta[name=description]')` → `null`; `link[rel=canonical]` → `null`; `meta[property^="og:"]` → `[]`.

## Heading structure (homepage, rendered)

```
H1: Powering Nepal Through Hire Purchase
H3: Driven By Your Ambitions          ← level skip
H2: Driving Dreams Forward With Trusted Financing
H3: Flexible Installments
H3: Fast Approvals
H2: Financing, by category.
H3: Ride now, pay with ease
H3: Drive home your dream car
H3: From roads to revenues
H3: Grow more, harvest better
H3: Build bigger, reach higher
H2: Real Reviews. Real Customers.
H2: Questions? Answered.
H2: Driving Nepal Forward.
```

`h1count: 1` ✓ — exactly one H1, correct. The only structural flaw is the H1 → H3 → H2 skip at "Driven By Your Ambitions".

H1 coverage across pages is good: `About`, `Services`, `Blog`, `BlogPost`, `Leadership`, `Contact`, `Careers`, `EmiCalculator`, `Reports`, `NotFound` all declare exactly one `<h1>`. `Home` inherits its H1 from `Hero.jsx:96`.

## Internal linking

Main nav (`header`/`nav` anchors):
```
/  /services  /about  /leadership  /blog  /careers  /contact  /emi-calculator
```

All homepage internal links:
```
/  /services  /about  /leadership  /blog  /careers  /contact  /emi-calculator  /privacy  /terms
```

**`/reports` appears in neither list.** It is a live, rendering route (544 words of source) reachable only by typing the URL. For an NRB-licensed lender, published financial disclosures are exactly the kind of page that builds trust — currently orphaned.

`/blog/:slug` posts are linked from `/blog` only, which is fine for 7 posts.

## URL structure

Clean and readable throughout — `/emi-calculator`, `/leadership`, `/blog/complete-guide-to-hire-purchase-in-nepal`. No parameters, no session IDs, no case inconsistency. This is one area that needs no work.

## Social sharing impact

With zero OG tags, every share of this site on WhatsApp, Facebook, Viber or LinkedIn renders as a blank grey card with a bare URL. For a Kathmandu lender whose customers arrive largely by referral and messaging apps, this is a daily, measurable conversion leak — and among the cheapest things on the entire audit to fix.
