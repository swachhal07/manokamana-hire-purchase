import { Link } from 'react-router-dom'
import Container from '../components/Container'

export default function NotFound() {
  return (
    <section className="py-32">
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
