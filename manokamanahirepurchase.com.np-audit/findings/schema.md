# Schema & Structured Data — Evidence Log

**Score: 0/100** · Audited 2026-08-14

## Detection result

```js
document.querySelectorAll('script[type="application/ld+json"]').length  // → 0
```

Zero structured data on the homepage. Confirmed absent across all 13 routes — every route serves the byte-identical HTML shell, and no JSON-LD is injected at runtime.

No microdata, no RDFa either.

## Confirmed business data available for markup

All of this already exists in the codebase and needs no research:

| Field | Value | Source |
|---|---|---|
| Legal name | Manokamana Hire Purchase Pvt. Ltd. | `src/pages/Contact.jsx:58` |
| Telephone | `+977-1-4163533` | `Contact.jsx:48`, `Footer.jsx:91` |
| Email | `info@manokamanahirepurchase.com.np` | `Contact.jsx:52`, `Footer.jsx:98` |
| Locality | Kathmandu, Nepal | `Footer.jsx:88` |
| Latitude | `27.7108334` | `src/components/OfficeMap.jsx:6` |
| Longitude | `85.31344` | `OfficeMap.jsx:6` |
| Google place_id | `0x39eb1936cb09b9c9:0xe2e7a0fb45896ea4` | `Contact.jsx:69` |
| Parent org | MV Dugar Group | logo asset + About page |
| Regulator | Nepal Rastra Bank | `Hero.jsx:91`, `About.jsx:109` |
| Service types | 5 categories | `src/data/services.js` |

NAP is **consistent** between `Contact.jsx` and `Footer.jsx` — no discrepancies found. Good foundation.

Still missing and needed for a complete `LocalBusiness`: `streetAddress`, `openingHoursSpecification`, NRB license number.

## Opportunity matrix

| Schema type | Target page | Content already exists? | Priority |
|---|---|---|---|
| `FinancialService` (+`LocalBusiness`) | site-wide | Yes — table above | **Critical** |
| `FAQPage` | `/` | **Yes — 5 Q&As already rendered** | **Critical** |
| `Organization` | site-wide | Yes | High |
| `Article` + `Person` author | 7 blog posts | Partly — author missing | High |
| `BreadcrumbList` | all inner pages | Yes — route hierarchy | Medium |
| `Service` | `/services` | **Yes — `src/data/services.js`** | Medium |
| `JobPosting` | `/careers` | Yes — `src/data/openings.js` | Medium |
| `WebApplication` / `HowTo` | `/emi-calculator` | Yes | Low |
| `Review` / `AggregateRating` | `/` | ⚠ **blocked** — see `content.md` | On hold |

The two marked "content already exists" are near-free wins: the homepage FAQ and the services list are already structured data in the source, rendered as HTML, just never emitted as JSON-LD.

## Recommended site-wide block

Place in `MainLayout` so it appears on every public route:

```json
{
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Manokamana Hire Purchase Pvt. Ltd.",
  "url": "https://manokamanahirepurchase.com.np",
  "logo": "https://manokamanahirepurchase.com.np/logo.png",
  "telephone": "+977-1-4163533",
  "email": "info@manokamanahirepurchase.com.np",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "TODO — needed for local pack",
    "addressLocality": "Kathmandu",
    "addressCountry": "NP"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 27.7108334, "longitude": 85.31344 },
  "areaServed": { "@type": "Country", "name": "Nepal" },
  "parentOrganization": { "@type": "Organization", "name": "MV Dugar Group" },
  "serviceType": [
    "Two-wheeler financing",
    "Car financing",
    "Commercial vehicle financing",
    "Agricultural equipment financing",
    "Construction equipment financing"
  ]
}
```

Add `openingHoursSpecification` and the NRB license number (as an `identifier` or in `description`) once available.

## Validation note

Because the site is client-rendered, JSON-LD injected via React will only be visible to crawlers that execute JavaScript. Google's Rich Results Test renders JS and will see it; Bing and most AI crawlers will not. This is another argument for build-time prerendering — it makes the schema work pay off across all crawlers rather than Google alone.
