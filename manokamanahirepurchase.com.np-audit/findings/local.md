# Local SEO — Evidence Log

Audited 2026-08-14 · Rolled into Technical/Schema/Content scores; not separately weighted

## Business classification

- **Type:** Brick-and-mortar with a service area — a physical Kathmandu office, financing customers "across Nepal"
- **Industry:** Regulated financial services (vehicle hire purchase / asset finance)
- **Locations:** 1
- **Regulator:** Nepal Rastra Bank (licence claimed, number not published)
- **Parent:** MV Dugar Group

## NAP consistency

Checked across every occurrence in the codebase:

| Field | `Contact.jsx` | `Footer.jsx` | Consistent? |
|---|---|---|---|
| Name | Manokamana Hire Purchase Pvt. Ltd. | Manokamana Hire Purchase | ✓ (footer is the short form) |
| Phone | `01-4163533` → `tel:+977014163533` | `tel:+977014163533` | ✓ |
| Email | `info@manokamanahirepurchase.com.np` | same | ✓ |
| Address | "Kathmandu" | "Kathmandu, Nepal" | ✓ |

**No inconsistencies found.** This is a clean base — most sites fail here and this one doesn't.

## Location signals present

- Leaflet office map centred on `27.7108334, 85.31344` (`src/components/OfficeMap.jsx:6`)
- Google Maps directions link using the official `?api=1` format with `destination_place_id=0x39eb1936cb09b9c9:0xe2e7a0fb45896ea4` — correctly built, launches the Maps app on mobile
- A dedicated `/contact` page with a form (Web3Forms) and multiple contact channels
- `areaServed` messaging is clear throughout ("across Nepal")

## Gaps

| Gap | Impact |
|---|---|
| **No street address anywhere** — city only | The single biggest local-pack blocker. "Kathmandu" is not an address. |
| **No business hours published** | Users and Google both look for this; it is also a `LocalBusiness` schema field |
| **No `LocalBusiness`/`FinancialService` schema** | See `schema.md` — geo, NAP and `areaServed` are all available and unmarked |
| **No NRB license number** | High-value trust signal for a regulated lender, cheap to add |
| **No embedded GBP reviews** | Testimonials are hardcoded rather than pulled from the profile — see `content.md` |
| **No location-specific landing content** | No page targets "vehicle loan Kathmandu" or similar geo-modified queries |

## Google Business Profile

**Could not be audited** — no DataForSEO or Google API credentials configured. Geo-grid rank tracking, review velocity, competitor radius mapping, and profile completeness are all unmeasured.

This matters more than it might appear. For a single-location Kathmandu lender, the GBP will very likely drive more local visibility than the website itself. Someone searching "hire purchase near me" or "vehicle loan Kathmandu" on a phone sees the map pack first, and the website second — if at all.

**Recommended before anything else in this file:** claim and fully complete the GBP — correct primary category (Loan Agency / Financial Institution), hours, service areas, photos of the office and financed assets, and a steady cadence of genuine review requests. Then reconcile the profile's NAP against the site's, which is already internally consistent and gives you a clean reference.

## Priority order for local

1. Claim/complete the Google Business Profile *(highest impact, zero code)*
2. Publish full street address — ward, tole, landmark
3. Publish business hours
4. Add `FinancialService` + `LocalBusiness` schema with address, geo, hours and `areaServed`
5. Add the NRB license number
6. Establish a genuine review-request process
7. Consider geo-targeted content once the above are in place
