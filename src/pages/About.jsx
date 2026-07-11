import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import dugarLogo from '../assets/images/dugar-logo.png'
import teamImage from '../assets/images/vitaly-gariev-LS5dCL0NkhE-unsplash.jpg'
import meetingImage from '../assets/images/vitaly-gariev-M5k978V3qBc-unsplash.jpg'

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
      { threshold: 0.15 },
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

/* ── Data ──────────────────────────────────────────────────────── */

const stats = [
  { value: 'Est. 2081', unit: 'BS', label: 'A young company, an old promise' },
  { value: '5', unit: 'sectors', label: 'From two-wheelers to heavy equipment' },
  { value: '1', unit: 'day', label: 'Typical reply time on every enquiry' },
  { value: '100%', unit: 'Nepali', label: 'Owned, staffed, and rooted in Kathmandu' },
]

const values = [
  {
    n: '01',
    title: 'Trust before terms',
    text: 'We explain every rupee of a loan before you sign it. No fine-print surprises, no hidden fees — the estimate you see is the deal you get.',
  },
  {
    n: '02',
    title: 'Speed that respects you',
    text: 'A vehicle standing idle is money standing still. We keep approvals lean so you can move from decision to keys in days, not months.',
  },
  {
    n: '03',
    title: 'Financing that reaches',
    text: 'Hire purchase should not stop at the Ring Road. We build products for farmers, builders, and riders across Nepal — not just the city.',
  },
  {
    n: '04',
    title: 'People over paperwork',
    text: 'Every application is read by a human advisor who knows the local market. You talk to a person, not a portal.',
  },
]

/* ── Page ──────────────────────────────────────────────────────── */

export default function About() {
  return (
    <>
      {/* ══ Hero ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 pb-20 pt-36 sm:px-10 lg:pb-28 lg:pt-44">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — words */}
          <div>
            <div className="animate-fade-up flex items-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-brand-500">
              <span className="h-px w-10 bg-brand-500/60" />
              About us
            </div>

            <h1
              className="animate-fade-up mt-7 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-navy-900 sm:text-6xl lg:text-[4.4rem]"
              style={{ animationDelay: '70ms' }}
            >
              We put Nepal&apos;s
              <br />
              ambitions
              <br />
              <span className="text-brand-500">on wheels.</span>
            </h1>

            <p
              className="animate-fade-up mt-7 max-w-lg text-lg leading-relaxed text-navy-900/65"
              style={{ animationDelay: '140ms' }}
            >
              Manokamana Hire Purchase is a Kathmandu-based financing company
              backed by the MV Dugar Group. We help individuals, families, and
              businesses across Nepal own the vehicles and machines that earn
              their living, from a first two-wheeler to a full commercial
              fleet, paid for in instalments that actually make sense for the
              way real income arrives. No lump sums, no gatekeeping, just a
              clear path from wanting something to owning it.
            </p>

            {/* Dictionary entry card */}
            <div
              className="animate-fade-up mt-9 max-w-md border-l-4 border-brand-500 bg-white py-5 pl-6 pr-6 shadow-[0_16px_40px_-16px_rgba(10,28,52,0.18)]"
              style={{ animationDelay: '210ms' }}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
                  ma·no·kā·ma·nā
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-900/40">
                  noun · Nepali
                </p>
              </div>
              <p className="mt-2.5 leading-relaxed text-navy-900/60">
                <span className="font-semibold text-brand-600">A heartfelt wish.</span>{' '}
                Ours: that the distance between wanting a vehicle and owning one
                should never come down to a lump sum.
              </p>
            </div>
          </div>

          {/* Right — overlapping photo pair */}
          <div
            className="animate-fade-up relative pb-14 pl-0 sm:pb-16"
            style={{ animationDelay: '170ms' }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={teamImage}
                alt="The Manokamana team working with customers"
                className="h-[380px] w-full object-cover sm:h-[500px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/45 via-transparent to-transparent" />
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-navy-700 shadow-sm backdrop-blur">
                <MapPin className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
                Kamaladi, Kathmandu
              </div>
            </div>
            {/* Overlap photo */}
            <div className="absolute -bottom-0 -left-4 hidden w-52 overflow-hidden rounded-xl border-[5px] border-[#fdfdfb] shadow-[0_24px_50px_-16px_rgba(10,28,52,0.35)] sm:block lg:-left-10 lg:w-64">
              <img
                src={meetingImage}
                alt="An advisor meeting a customer"
                className="h-40 w-full object-cover lg:h-48"
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mx-auto mt-16 max-w-6xl lg:mt-24">
          <div className="grid border-t border-navy-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 80}
                className="border-b border-navy-900/10 py-7 pr-6 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              >
                <p className="font-display text-4xl font-extrabold tracking-tight text-navy-900">
                  {s.value}
                  <span className="ml-1.5 text-sm font-bold uppercase tracking-wide text-brand-500">
                    {s.unit}
                  </span>
                </p>
                <p className="mt-2.5 max-w-[24ch] text-sm leading-relaxed text-navy-900/50">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Navy ledger — stats + Dugar backing ═════════════════ */}
      <section className="relative overflow-hidden bg-navy-900 px-6 py-20 sm:px-10 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Backing */}
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-brand-500">
                <span className="h-px w-10 bg-brand-500/60" />
                Our backing
              </div>
              <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-5xl">
                The house
                <br />
                behind the <span className="text-brand-500">wish.</span>
              </h2>
              <div className="mt-8 flex items-center gap-4 border-t border-white/15 pt-8">
                <img
                  src={dugarLogo}
                  alt="MV Dugar Group"
                  className="h-16 w-auto object-contain"
                />
                <span className="text-sm leading-relaxed text-white/50">
                  A proud member of the
                  <br />
                  <span className="font-semibold text-white">MV Dugar Group</span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <p className="border-l-2 border-brand-500 pl-6 font-display text-2xl font-bold leading-snug tracking-tight text-white sm:text-[1.65rem]">
                The patience of an old house, applied to a new promise.
              </p>
              <p className="mt-6 leading-relaxed text-white/60">
                The Dugar name has stood behind Nepali commerce for generations —
                trading, distribution, industry. As part of the MV Dugar Group,
                our funds are stable, our processes are audited, and every
                agreement is honoured for its full term, whether the market is
                kind that year or not.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {['Trading heritage', 'Group-stable funding', 'Kathmandu headquartered'].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white/70"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ Values rail ════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 py-20 sm:px-10 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.28em] text-brand-500">
              <span className="h-px w-10 bg-brand-500/60" />
              How we work
              <span className="h-px w-10 bg-brand-500/60" />
            </div>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl">
              Four things we
              <br />
              refuse to <span className="text-brand-500">compromise.</span>
            </h2>
          </Reveal>

          <div className="mt-14 lg:mt-16">
            {values.map((v, i) => (
              <Reveal
                key={v.n}
                delay={i * 60}
                className="group grid gap-4 border-t border-navy-900/10 py-8 transition-colors last:border-b hover:bg-navy-900/[0.02] sm:grid-cols-[80px_1fr_1.4fr] sm:items-baseline sm:gap-8 lg:py-10"
              >
                <span className="font-display text-4xl font-extrabold leading-none tracking-tight text-navy-900/20 transition-colors duration-300 group-hover:text-brand-500 sm:text-5xl">
                  {v.n}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-navy-900">
                  {v.title}
                </h3>
                <p className="max-w-xl leading-relaxed text-navy-900/60">{v.text}</p>
              </Reveal>
            ))}
          </div>

          {/* Secondary CTA */}
          <Reveal delay={120} className="mt-14 text-center lg:mt-16">
            <p className="text-sm text-navy-900/50">
              Prefer to talk it through?{' '}
              <Link
                to="/contact"
                className="font-semibold text-brand-600 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
              >
                Book a free consultation →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
