import { useState, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronUp, Plus } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { services as offers } from '../data/services'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const pad = (n) => String(n + 1).padStart(2, '0')

export default function Services() {
  const [active, setActive] = useState(0)
  const contentRef = useRef(null)
  // Hover-to-expand only on devices that actually hover (desktop)
  const canHover = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  // Reveal only the content (not the grain layer) to keep scrolling smooth
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Transform-only (no opacity) so the large images + grain never repaint
      gsap.set(el, { willChange: 'transform' })
      gsap.from(el, {
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        force3D: true,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        onComplete: () => gsap.set(el, { clearProps: 'transform,willChange' }),
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 lg:py-32">
      {/* Grain (no blend mode — blend modes force expensive per-frame repaints on scroll) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{ backgroundImage: grain }}
      />

      <div ref={contentRef} className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-brand-500">
              <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
              What We Offer
            </div>
            <h2 className="mt-6 max-w-2xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl">
              Financing,
              <br />
              by category.
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <span className="font-display text-sm tracking-widest text-white/40">
              {pad(offers.length - 1)} — SERVICES
            </span>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/30">
              Hover a panel to explore
            </p>
          </div>
        </div>

        {/* Expanding panels */}
        <div className="mt-12 flex flex-col gap-2.5 lg:h-[600px] lg:flex-row">
          {offers.map((offer, i) => {
            const isActive = i === active
            return (
              <article
                key={offer.name}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={offer.name}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                onMouseEnter={() => canHover.current && setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(i)
                  }
                }}
                style={{ flexGrow: isActive ? 8 : 1 }}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl outline-none ring-brand-500/70 transition-all duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 lg:basis-0 ${
                  isActive ? 'h-[30rem] sm:h-[32rem]' : 'h-[4.25rem]'
                } lg:h-auto lg:min-w-[4.5rem]`}
              >
                {/* Image */}
                <img
                  src={offer.image}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                    isActive
                      ? 'scale-100 opacity-100 grayscale-0'
                      : 'scale-105 opacity-30 grayscale group-hover:opacity-45'
                  }`}
                />
                {/* Wash: readable navy gradient when active, flat tint when collapsed */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    isActive
                      ? 'bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-100'
                      : 'bg-navy-900/55 opacity-100'
                  }`}
                />
                {/* Red spine on the active panel */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 bg-brand-500 transition-transform duration-500 ${
                    isActive ? 'scale-y-100' : 'scale-y-0'
                  }`}
                  style={{ transformOrigin: 'top' }}
                />

                {/* Collapsed label — horizontal on mobile, vertical on desktop */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive ? 'pointer-events-none opacity-0' : 'opacity-100 delay-200'
                  }`}
                >
                  {/* Mobile row */}
                  <div className="flex h-full items-center gap-4 px-5 lg:hidden">
                    <span className="font-display text-sm tabular-nums text-brand-500">
                      {pad(i)}
                    </span>
                    <span className="font-display text-lg font-bold tracking-tight text-white/85">
                      {offer.name}
                    </span>
                    <Plus className="ml-auto h-4 w-4 text-white/50" />
                  </div>
                  {/* Desktop vertical slat */}
                  <div className="hidden h-full flex-col items-center justify-between py-6 lg:flex">
                    <span className="font-display text-sm tabular-nums text-brand-500">
                      {pad(i)}
                    </span>
                    <span
                      className="whitespace-nowrap font-display text-xl font-bold tracking-tight text-white/80 transition-colors group-hover:text-white [writing-mode:vertical-rl] rotate-180"
                    >
                      {offer.name}
                    </span>
                    <Plus className="h-4 w-4 text-white/40 transition-colors group-hover:text-brand-500" />
                  </div>
                </div>

                {/* Active content — fixed width so text never squishes mid-transition */}
                <div
                  className={`absolute bottom-0 left-0 w-[34rem] max-w-[calc(100vw-4rem)] p-7 transition-all duration-500 sm:p-9 ${
                    isActive
                      ? 'translate-y-0 opacity-100 delay-300'
                      : 'pointer-events-none translate-y-4 opacity-0'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
                    {offer.name}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-4xl">
                    {offer.tagline}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-white/70">{offer.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {offer.covers.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/25 bg-navy-900/40 px-3 py-1 text-xs font-medium text-white/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/contact"
                    onClick={(e) => e.stopPropagation()}
                    className="group/cta mt-7 inline-flex items-center gap-3 rounded-full bg-brand-500 py-3 pl-6 pr-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                  >
                    Apply Now
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-500 transition-transform duration-300 group-hover/cta:translate-x-1">
                      <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {/* Footer line */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-sm text-white/40">
            Not sure which category fits? We&apos;ll figure it out together.
          </p>
          <Link
            to="/services"
            className="text-sm font-semibold text-white underline-offset-4 transition-colors hover:text-brand-400 hover:underline"
          >
            Explore all services →
          </Link>
        </div>
      </div>
    </section>
  )
}
