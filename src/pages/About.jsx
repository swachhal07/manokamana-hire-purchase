import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Eyebrow from '../components/Eyebrow'
import dugarLogo from '../assets/images/dugar-logo.png'

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
  { value: 'Est. 2076', unit: 'BS', label: 'A young company, an old promise' },
  { value: 'Multi', unit: 'sectors', label: 'Two-wheelers, cars, commercial and heavy equipment' },
  { value: 'Within a', unit: 'day', label: 'Typical reply time on every enquiry' },
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
    text: 'Access to a vehicle should not depend on where you live. We reach beyond Kathmandu to finance farmers, builders, and riders in every corner of Nepal.',
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

        <div className="relative mx-auto max-w-6xl">
          <Eyebrow className="animate-fade-up">About us</Eyebrow>

          {/* Full-bleed headline */}
          <h1
            className="animate-fade-up mt-8 text-center font-display font-extrabold leading-[0.95] tracking-tight text-navy-900"
            style={{ animationDelay: '70ms', fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            We put Nepal&apos;s ambitions
            <br />
            <span className="text-brand-500">on wheels.</span>
          </h1>

          {/* Document meta rule */}
          <div
            className="animate-fade-up mt-14 flex flex-wrap items-center justify-between gap-x-10 gap-y-3 border-y border-dashed border-navy-900/20 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-navy-900/45"
            style={{ animationDelay: '140ms' }}
          >
            <span className="inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Licensed by Nepal Rastra Bank
            </span>
            <span>Est. January 2020</span>
            <span>Backed by MV Dugar Group</span>
          </div>

          {/* Intro + dictionary entry */}
          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <p
              className="animate-fade-up text-justify text-lg leading-relaxed text-navy-900/65 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.2rem] first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-brand-500"
              style={{ animationDelay: '200ms' }}
            >
              Manokamana Hire Purchase Pvt. Ltd. is a financial institution
              licensed by Nepal Rastra Bank, Central Bank of Nepal to conduct
              hire purchase loan business, in accordance with the policy and
              procedural arrangements for granting approval to companies
              providing Hire Purchase Loans. This company was established in
              January 2020 with the aim of providing financial services to its
              automotive customers. Over the years, it has been providing
              multi-brand finance to thousands of low-income customers, financing
              the purchase of vehicles for self-employment purposes among
              underprivileged groups to uplift their livelihood, farmers, contractors, transporters and
              businessmen who are unable to easily obtain loans from banks and
              financial institutions.
            </p>

            {/* Dictionary entry card */}
            <div
              className="animate-fade-up relative border-l-4 border-brand-500 bg-white py-10 pl-10 pr-10 shadow-[0_20px_50px_-18px_rgba(10,28,52,0.2)] lg:-translate-y-8"
              style={{ animationDelay: '260ms' }}
            >
              <span className="pointer-events-none absolute -top-7 right-6 select-none font-display text-[7rem] font-extrabold leading-none text-navy-900/[0.06]">
                &rdquo;
              </span>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-display text-4xl font-extrabold tracking-tight text-navy-900">
                  ma·no·kā·ma·nā
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-navy-900/40">
                  noun · Nepali
                </p>
              </div>
              <p className="mt-3.5 text-lg leading-relaxed text-navy-900/60">
                <span className="font-semibold text-brand-600">A heartfelt wish.</span>{' '}
                Ours: that the distance between wanting a vehicle and owning one
                should never come down to a lump sum.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ══ Stats ledger — bridges hero into the navy section ═══ */}
      <section className="relative bg-[#fdfdfb] px-6 sm:px-10">
        {/* Bottom half navy, so the card straddles the seam */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-navy-900">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: grain }}
          />
        </div>

        <Reveal className="relative mx-auto max-w-6xl">
          <div className="relative rounded-2xl border border-navy-900/10 bg-white shadow-[0_36px_90px_-28px_rgba(10,28,52,0.45)]">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.04]"
              style={{ backgroundImage: grain }}
            />

            {/* File-tab label */}
            <span className="absolute -top-3.5 left-7 inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white sm:left-9">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              At a glance
            </span>

            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={100 + i * 70}
                  className={`group border-dashed border-navy-900/15 px-7 py-8 sm:px-9 lg:px-8 xl:px-9 ${
                    i < 3 ? 'border-b' : ''
                  } ${i === 2 ? 'sm:border-b-0' : ''} ${
                    i < 2 ? 'lg:border-b-0' : ''
                  } ${i % 2 === 1 ? 'sm:border-l' : ''} ${
                    i > 0 ? 'lg:border-l' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-navy-900/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="h-px w-6 bg-brand-500/50 transition-all duration-300 group-hover:w-10 group-hover:bg-brand-500" />
                  </div>
                  <p className="mt-5 font-display text-[2.15rem] font-extrabold leading-none tracking-tight text-navy-900">
                    {s.value}
                  </p>
                  <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-brand-600">
                    {s.unit}
                  </p>
                  <p className="mt-3.5 max-w-[24ch] text-sm leading-relaxed text-navy-900/55">
                    {s.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
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
              <Eyebrow align="left">Our backing</Eyebrow>
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
            <Eyebrow>How we work</Eyebrow>
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
