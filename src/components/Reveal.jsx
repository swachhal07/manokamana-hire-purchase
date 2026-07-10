import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-reveal wrapper powered by GSAP ScrollTrigger.
 * Fades and lifts its children into view once, then clears its
 * inline transform so it never interferes with sticky/fixed descendants.
 * Respects prefers-reduced-motion by rendering statically.
 */
export default function Reveal({
  children,
  y = 48,
  duration = 0.9,
  start = 'top 82%',
  className,
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Transform-only (no opacity) — fading a large subtree forces an
      // expensive layer rasterization; a GPU slide stays smooth.
      gsap.set(el, { willChange: 'transform' })
      gsap.from(el, {
        y,
        duration,
        ease: 'power3.out',
        force3D: true,
        scrollTrigger: { trigger: el, start, once: true },
        onComplete: () => gsap.set(el, { clearProps: 'transform,willChange' }),
      })
    }, el)

    return () => ctx.revert()
  }, [y, duration, start])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
