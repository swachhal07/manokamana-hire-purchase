import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets the window scroll position to the top on every route change.
 * Without this, navigating to a new page keeps the previous page's scroll
 * offset, so pages appear to "open from the middle".
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
