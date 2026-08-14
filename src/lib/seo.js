/**
 * Single source of truth for per-route SEO metadata.
 *
 * Consumed by two places:
 *   - src/components/Seo.jsx  — renders the tags at runtime
 *   - vite.config.js          — generates dist/sitemap.xml at build time
 *
 * Keep this file free of asset imports and `import.meta.env`: vite.config.js
 * imports it directly in Node, where those would fail.
 *
 * Titles: aim for <= 60 characters so Google doesn't truncate them.
 * Descriptions: 140-160 characters.
 */

export const SITE_URL = 'https://manokamanahirepurchase.com.np'

export const SITE_NAME = 'Manokamana Hire Purchase'

/** Default social preview image. Replace with a real 1200x630 asset. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

/**
 * Public routes. `priority` and `changefreq` feed the sitemap only.
 * Routes NOT listed here are excluded from the sitemap by design (/admin, 404).
 */
export const ROUTES = {
  '/': {
    title: 'Vehicle Hire Purchase Financing in Nepal | Manokamana',
    description:
      'NRB-licensed hire purchase financing for two-wheelers, cars, commercial vehicles and heavy equipment across Nepal. Approvals in 24 hours.',
    priority: 1.0,
    changefreq: 'weekly',
  },
  '/services': {
    title: 'Vehicle & Equipment Financing Services | Manokamana',
    description:
      'Finance motorcycles, cars, commercial vehicles, tractors and excavators with flexible EMIs and transparent terms. See all five categories.',
    priority: 0.9,
    changefreq: 'monthly',
  },
  '/emi-calculator': {
    title: 'Vehicle Loan EMI Calculator Nepal | Manokamana',
    description:
      'Calculate your monthly instalment for a bike, car, or equipment loan in Nepal. Enter amount, rate and tenure for an instant EMI estimate.',
    priority: 0.9,
    changefreq: 'monthly',
  },
  '/about': {
    title: 'About Manokamana Hire Purchase | NRB-Licensed Lender',
    description:
      'An NRB-licensed hire purchase company and part of MV Dugar Group, financing vehicles and equipment for buyers across Nepal.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  '/contact': {
    title: 'Contact Manokamana Hire Purchase, Kathmandu',
    description:
      'Call 01-4163533 or visit our Kathmandu office to discuss vehicle and equipment financing. Free consultation, no obligation.',
    priority: 0.8,
    changefreq: 'monthly',
  },
  '/leadership': {
    title: 'Our Leadership Team | Manokamana Hire Purchase',
    description:
      "Meet the executives leading Nepal's vehicle and equipment hire purchase financing at Manokamana Hire Purchase.",
    priority: 0.7,
    changefreq: 'monthly',
  },
  '/blog': {
    title: 'Hire Purchase & Vehicle Loan Guides | Manokamana',
    description:
      'Plain-language guides to hire purchase in Nepal: sizing your EMI, required documents, and choosing between new, used and electric.',
    priority: 0.7,
    changefreq: 'weekly',
  },
  '/reports': {
    title: 'Financial Reports & Disclosures | Manokamana',
    description:
      'Published financial reports and regulatory disclosures for Manokamana Hire Purchase Pvt. Ltd.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  '/careers': {
    title: 'Careers at Manokamana Hire Purchase',
    description:
      'Open roles at an NRB-licensed hire purchase company in Kathmandu. Join a team financing vehicles and equipment across Nepal.',
    priority: 0.6,
    changefreq: 'weekly',
  },
  '/privacy': {
    title: 'Privacy Policy | Manokamana Hire Purchase',
    description:
      'How Manokamana Hire Purchase collects, uses and protects your personal information.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  '/terms': {
    title: 'Terms of Service | Manokamana Hire Purchase',
    description:
      'Terms governing use of the Manokamana Hire Purchase website and services.',
    priority: 0.3,
    changefreq: 'yearly',
  },
}

/** Blog post titles follow one pattern; keep it here so it can't drift. */
export function blogPostTitle(postTitle) {
  return `${postTitle} | ${SITE_NAME}`
}
