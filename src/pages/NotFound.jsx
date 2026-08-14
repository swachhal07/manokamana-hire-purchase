import { Link, useLocation } from 'react-router-dom'
import Container from '../components/Container'
import Seo from '../components/Seo'

export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <section className="py-32">
      {/* The host still returns HTTP 200 for unmatched paths (SPA fallback),
          so noindex is what actually keeps junk URLs out of the index.
          See manokamanahirepurchase.com.np-audit/ACTION-PLAN.md section 1.3. */}
      <Seo path={pathname} title="Page not found | Manokamana Hire Purchase" noindex />
      <Container className="text-center">
        <p className="text-5xl font-bold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Go home
        </Link>
      </Container>
    </section>
  )
}
