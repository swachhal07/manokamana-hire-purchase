import { useState, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ChevronUp } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import img1 from '../assets/images/vitaly-gariev-0kWem6X0Mc8-unsplash.jpg'
import img2 from '../assets/images/vitaly-gariev-LS5dCL0NkhE-unsplash.jpg'
import img3 from '../assets/images/vitaly-gariev-M5k978V3qBc-unsplash.jpg'
import img4 from '../assets/images/photo-1628348068343-c6a848d2b6dd.avif'

const offers = [
  {
    name: 'Vehicle Finance',
    heading: 'Drive home your dream car',
    desc: 'Own a new or used car, SUV, or electric vehicle with quick approvals and flexible terms.',
    items: ['New cars', 'Used cars', 'SUVs', 'Electric vehicles'],
    image: img1,
  },
  {
    name: 'Two-Wheeler Finance',
    heading: 'Ride now, pay with ease',
    desc: 'Finance motorcycles, scooters, and electric two-wheelers with affordable installments.',
    items: ['Motorcycles', 'Scooters', 'Electric bikes'],
    image: img2,
  },
  {
    name: 'Commercial Vehicle Finance',
    heading: 'From roads to revenues',
    desc: 'Accelerate your business with financing for pickup trucks, vans, mini trucks and buses.',
    items: ['Pickup trucks', 'Vans', 'Mini trucks', 'Buses', 'Heavy commercial'],
    image: img3,
  },
  {
    name: 'Agricultural Equipment',
    heading: 'Grow more, harvest better',
    desc: 'Finance tractors and farming equipment to boost your agricultural productivity.',
    items: ['Tractors', 'Farming equipment'],
    image: img4,
  },
  {
    name: 'Construction Equipment',
    heading: 'Build bigger, reach higher',
    desc: 'Fund excavators, heavy machinery, and construction equipment to power your projects.',
    items: ['Excavators', 'Heavy machinery', 'Construction equipment'],
    image: img1,
  },
]

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const pad = (n) => String(n + 1).padStart(2, '0')

export default function Services() {
  const [active, setActive] = useState(2)
  const current = offers[active]
  const contentRef = useRef(null)

  // Reveal only the content (not the grain/blend layers) to keep it smooth
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Transform-only (no opacity) so the large image + grain never repaint
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
      {/* Faint column guides */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '25% 100%',
        }}
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
          <span className="hidden font-display text-sm tracking-widest text-white/40 md:block">
            {pad(offers.length - 1)} — SERVICES
          </span>
        </div>

        {/* Split */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
          {/* Index rail */}
          <div>
            <ul>
              {offers.map((offer, i) => {
                const isActive = i === active
                return (
                  <li key={offer.name}>
                    <button
                      onClick={() => setActive(i)}
                      className={`group flex w-full items-center gap-5 border-t border-white/10 py-5 text-left transition-all ${
                        isActive ? 'pl-4' : 'pl-0 hover:pl-2'
                      }`}
                    >
                      <span
                        className={`font-display text-sm tabular-nums transition-colors ${
                          isActive ? 'text-brand-500' : 'text-white/40'
                        }`}
                      >
                        {pad(i)}
                      </span>
                      <span
                        className={`font-display text-2xl font-bold tracking-tight transition-colors ${
                          isActive ? 'text-white' : 'text-white/45 group-hover:text-white/80'
                        }`}
                      >
                        {offer.name}
                      </span>
                      <ArrowUpRight
                        className={`ml-auto h-5 w-5 shrink-0 transition-all ${
                          isActive
                            ? 'text-brand-500 opacity-100'
                            : 'text-white/40 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
              <li className="border-t border-white/10" />
            </ul>

            {/* Active detail */}
            <div key={`detail-${active}`} className="animate-fade-up mt-8">
              <p className="max-w-md leading-relaxed text-white/60">{current.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {current.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand-500 py-3.5 pl-7 pr-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Apply Now
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>

          {/* Image panel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
              <img
                key={`img-${active}`}
                src={current.image}
                alt={current.name}
                className="animate-fade-up h-[420px] w-full object-cover lg:h-[560px]"
              />
              {/* Gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
              {/* Caption */}
              <div key={`cap-${active}`} className="animate-fade-up absolute inset-x-0 bottom-0 p-8 lg:p-10">
                <div className="h-1 w-12 bg-brand-500" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                  {current.name}
                </p>
                <h3 className="mt-2 max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                  {current.heading}
                </h3>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 flex gap-2">
              {offers.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show ${offers[i].name}`}
                  onClick={() => setActive(i)}
                  className="group h-1 flex-1 overflow-hidden rounded-full bg-white/15"
                >
                  <span
                    className={`block h-full rounded-full bg-brand-500 transition-all duration-500 ${
                      i === active ? 'w-full' : 'w-0 group-hover:w-1/3'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
