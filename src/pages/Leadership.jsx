import { useEffect, useRef, useState } from 'react'
import vivekImg from '../assets/images/vivek-dugar.webp'
import sarojImg from '../assets/images/saroj-bhattarai.jpeg'
import rajeshwarImg from '../assets/images/rajeshwar-neupane.jpeg'
import mgmt1 from '../assets/images/vitaly-gariev-0kWem6X0Mc8-unsplash.jpg'
import mgmt2 from '../assets/images/vitaly-gariev-LS5dCL0NkhE-unsplash.jpg'
import mgmt3 from '../assets/images/vitaly-gariev-M5k978V3qBc-unsplash.jpg'
import mgmt4 from '../assets/images/photo-1628348068343-c6a848d2b6dd.avif'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/* ── Data ──────────────────────────────────────────────────────── */

const leaders = [
  {
    n: '01',
    name: 'Vivek Dugar',
    role: 'Director',
    image: vivekImg,
    bio: '',
  },
  {
    n: '02',
    name: 'Saroj Bhattarai',
    role: 'Director',
    image: sarojImg,
    bio: '',
  },
  {
    n: '03',
    name: 'Rajeshwar Neupane',
    role: 'Director',
    image: rajeshwarImg,
    bio: '',
  },
]

const management = [
  { name: 'Full Name', role: 'Chief Executive Officer', image: mgmt1 },
  { name: 'Full Name', role: 'General Manager', image: mgmt2 },
  { name: 'Full Name', role: 'Head of Finance', image: mgmt3 },
  { name: 'Full Name', role: 'Head of Operations', image: mgmt4 },
]

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

/* ── Page ──────────────────────────────────────────────────────── */

export default function Leadership() {
  return (
    <>
      {/* ══ Board roster ═════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 pb-20 pt-36 sm:px-10 lg:pb-28 lg:pt-44">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-7xl">
          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-brand-500">
              <span className="h-px w-10 bg-brand-500/60" />
              Leadership
              <span className="h-px w-10 bg-brand-500/60" />
            </div>

            <h1
              className="animate-fade-up mt-7 font-display font-extrabold leading-[0.95] tracking-tight text-navy-900"
              style={{ animationDelay: '80ms', fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
            >
              The people behind
              <br />
              the <span className="text-brand-500">promise.</span>
            </h1>

            <p
              className="animate-fade-up mx-auto mt-8 max-w-xl text-lg leading-relaxed text-navy-900/65"
              style={{ animationDelay: '160ms' }}
            >
              Every agreement we sign carries a name, not just a stamp. Meet
              the people who make sure Manokamana&apos;s word is worth more
              than its paperwork.
            </p>
          </div>

          {/* ── Team gallery ────────────────────────────────────── */}
          <div className="mx-auto mt-16 grid max-w-6xl gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {leaders.map((l, i) => (
              <Reveal key={l.n} delay={i * 100} className="group">
                {/* Portrait */}
                <div className="relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_rgba(10,28,52,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_36px_70px_-28px_rgba(10,28,52,0.5)]">
                  <img
                    src={l.image}
                    alt={l.name}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />

                  {/* Sheen sweep */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                  />

                </div>

                {/* Name plate */}
                <div className="mt-6">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 transition-colors duration-300 group-hover:text-brand-600">
                    {l.name}
                  </h2>
                  <div className="mt-2.5 h-0.5 w-8 bg-brand-500 transition-all duration-500 group-hover:w-14" />
                  <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.25em] text-navy-900/45">
                    {l.role}
                  </p>
                  {l.bio && (
                    <p className="mt-4 text-sm leading-relaxed text-navy-900/60">{l.bio}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* ── Management team ─────────────────────────────────── */}
          <div className="mx-auto mt-20 max-w-6xl border-t border-navy-900/40 pt-16 lg:mt-28 lg:pt-24">
            <Reveal className="text-center">
              <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-brand-500">
                <span className="h-px w-10 bg-brand-500/60" />
                Management team
                <span className="h-px w-10 bg-brand-500/60" />
              </div>
              <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
                The team that runs the <span className="text-brand-500">day-to-day.</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {management.map((m, i) => (
                <Reveal key={`${m.role}-${i}`} delay={i * 80} className="group">
                  {/* Portrait */}
                  <div className="relative overflow-hidden rounded-2xl shadow-[0_14px_32px_-20px_rgba(10,28,52,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_55px_-24px_rgba(10,28,52,0.5)]">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    {/* Sheen sweep */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                    />
                  </div>

                  {/* Name plate */}
                  <div className="mt-5">
                    <h3 className="font-display text-xl font-extrabold tracking-tight text-navy-900 transition-colors duration-300 group-hover:text-brand-600">
                      {m.name}
                    </h3>
                    <div className="mt-2 h-0.5 w-7 bg-brand-500 transition-all duration-500 group-hover:w-12" />
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-navy-900/45">
                      {m.role}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Register foot rule */}
          <div className="mt-16 flex items-center justify-between border-t border-navy-900/15 pt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-navy-900/40 lg:mt-24">
            <span>Board register — {String(leaders.length).padStart(2, '0')} members</span>
            <span className="hidden sm:inline">
              A member of the <span className="text-navy-900/70">MV Dugar Group</span>
            </span>
          </div>
        </div>
      </section>

    </>
  )
}
