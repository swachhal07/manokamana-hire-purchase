import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { featured, posts } from '../data/posts'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/* ── Scroll reveal ─────────────────────────────────────────────── */

function useReveal() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, inView] = useReveal()
  return (
    <div
      ref={ref}
      className={`${className} ${inView ? 'animate-fade-up' : 'opacity-0'}`}
      style={inView ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* ── Meta line ─────────────────────────────────────────────────── */

function Meta({ category, date, readTime, light = false }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.22em] ${
        light ? 'text-white/70' : 'text-navy-900/45'
      }`}
    >
      <span className="text-brand-500">{category}</span>
      <span aria-hidden="true">·</span>
      <span>{date}</span>
      <span aria-hidden="true">·</span>
      <span>{readTime}</span>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function Blog() {
  return (
    <>
      {/* ══ Masthead ═════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 pb-10 pt-28 sm:px-10 lg:pb-12 lg:pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="animate-fade-up flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-brand-500">
            <span className="h-px w-10 bg-brand-500/60" />
            Our blog
            <span className="h-px w-10 bg-brand-500/60" />
          </div>

          <h1
            className="animate-fade-up mt-7 font-display font-extrabold leading-[0.95] tracking-tight text-navy-900"
            style={{ animationDelay: '80ms', fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            Notes on owning
            <br />
            what <span className="text-brand-500">moves you.</span>
          </h1>

          <p
            className="animate-fade-up mx-auto mt-8 max-w-xl text-lg leading-relaxed text-navy-900/65"
            style={{ animationDelay: '160ms' }}
          >
            Plain-language guides on financing, EMIs, and getting the most out
            of the vehicles and machines that earn your living.
          </p>
        </div>
      </section>

      {/* ══ Featured story ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 sm:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[28px] bg-navy-900 shadow-[0_18px_50px_-28px_rgba(10,28,52,0.3)] transition-shadow duration-500 hover:shadow-[0_26px_60px_-30px_rgba(10,28,52,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
              {/* Image */}
              <div className="relative min-h-[280px] overflow-hidden lg:min-h-[440px]">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                {/* Sheen sweep */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                />
                <span className="absolute left-5 top-5 rounded-full bg-brand-500 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Featured
                </span>
              </div>

              {/* Words */}
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                <Meta
                  category={featured.category}
                  date={featured.date}
                  readTime={featured.readTime}
                  light
                />
                <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.02] tracking-tight text-white transition-colors duration-300 group-hover:text-brand-400 sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-5 max-w-md leading-relaxed text-white/60">
                  {featured.excerpt}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  Read article
                  <ArrowUpRight
                    className="h-4 w-4 text-brand-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    strokeWidth={2.5}
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══ Latest articles ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 py-16 sm:px-10 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Section rule */}
          <Reveal className="flex items-baseline justify-between gap-6 border-t border-navy-900/40 pt-6">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
              Latest articles
            </h2>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy-900/40">
              {String(posts.length).padStart(2, '0')} stories
            </span>
          </Reveal>

          {/* Grid */}
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <Link to={`/blog/${p.slug}`} className="group block">
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl shadow-[0_16px_36px_-22px_rgba(10,28,52,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_32px_60px_-26px_rgba(10,28,52,0.5)]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  {/* Sheen sweep */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                  />
                </div>

                {/* Words */}
                <div className="mt-6">
                  <Meta category={p.category} date={p.date} readTime={p.readTime} />
                  <h3 className="mt-3 font-display text-xl font-extrabold leading-snug tracking-tight text-navy-900 transition-colors duration-300 group-hover:text-brand-600 sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-900/60">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                    Read article
                    <ArrowUpRight
                      className="h-4 w-4 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2.5}
                    />
                  </span>
                </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Foot rule */}
          <div className="mt-20 flex items-center justify-between border-t border-navy-900/15 pt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-navy-900/40">
            <span>The Manokamana journal</span>
            <span className="hidden sm:inline">More stories coming soon</span>
          </div>
        </div>
      </section>
    </>
  )
}
