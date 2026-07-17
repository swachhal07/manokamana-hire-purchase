import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Manages scroll position on navigation.
 *
 * - On a plain route change, resets to the top. Without this, navigating to a
 *   new page keeps the previous page's scroll offset, so pages appear to
 *   "open from the middle".
 * - When the URL carries a hash (e.g. "/#why-us"), scrolls that element into
 *   view instead. The target may not be mounted on the first frame, so we retry
 *   briefly before giving up.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      let frame = 0
      let attempts = 0
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        if (attempts++ < 20) frame = requestAnimationFrame(tryScroll)
      }
      tryScroll()
      return () => cancelAnimationFrame(frame)
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
