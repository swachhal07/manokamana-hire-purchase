import { useEffect, useRef, useState } from 'react'

/**
 * Returns [ref, paused]. `paused` is true whenever the referenced element is
 * NOT intersecting the viewport, so callers can halt perpetual work (e.g. an
 * infinite CSS marquee) while it is scrolled out of view. Off-screen CSS
 * animations otherwise keep the compositor busy every frame and cause visible
 * jank in interactions elsewhere on the page.
 */
export default function useOffscreenPaused(rootMargin = '200px') {
  const ref = useRef(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return [ref, paused]
}
