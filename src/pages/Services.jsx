import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import Eyebrow from '../components/Eyebrow'
import imgPassenger from '../assets/images/photo-1612057473166-af2affdb92ad.avif'
import imgTwoWheeler from '../assets/images/wp4366488.jpg'
import imgCommercial from '../assets/images/70_kmph_top_speed.jpg'
import imgAgriculture from '../assets/images/photo-1594771804886-a933bb2d609b.avif'
import imgConstruction from '../assets/images/sinharai power.jpg'
import imgBusiness from '../assets/images/premium_photo-1681487178876-a1156952ec60.avif'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/* ── Data ──────────────────────────────────────────────────────── */

const services = [
  {
    slug: 'passenger-vehicles',
    name: 'Passenger Vehicles',
    tagline: 'Drive home your dream car',
    desc: 'Own a new or used car, SUV, or electric vehicle with quick approvals and flexible terms.',
    covers: ['New cars', 'Used cars', 'SUVs', 'Electric vehicles'],
    image: imgPassenger,
  },
  {
    slug: 'two-wheelers',
    name: 'Two-Wheelers',
    tagline: 'Ride now, pay with ease',
    desc: 'Finance motorcycles, scooters, and electric two-wheelers with affordable installments.',
    covers: ['Motorcycles', 'Scooters', 'Electric bikes'],
    image: imgTwoWheeler,
  },
  {
    slug: 'commercial-vehicles',
    name: 'Commercial Vehicles',
    tagline: 'From roads to revenues',
    desc: 'Accelerate your business with financing for pickup trucks, vans, mini trucks and buses.',
    covers: ['Pickup trucks', 'Vans', 'Mini trucks', 'Buses'],
    image: imgCommercial,
  },
  {
    slug: 'agricultural-equipment',
    name: 'Agricultural Equipment',
    tagline: 'Grow more, harvest better',
    desc: 'Finance tractors and farming equipment to boost your agricultural productivity.',
    covers: ['Tractors', 'Tillers', 'Harvesters'],
    image: imgAgriculture,
  },
  {
    slug: 'construction-equipment',
    name: 'Construction Equipment',
    tagline: 'Build bigger, reach higher',
    desc: 'Fund excavators, heavy machinery, and construction equipment to power your projects.',
    covers: ['Excavators', 'Loaders', 'Heavy machinery'],
    image: imgConstruction,
  },
  {
    slug: 'business-equipment',
    name: 'Business Equipment',
    tagline: 'Equip your enterprise',
    desc: 'Fund the tools, systems, and equipment your growing business needs to keep moving.',
    covers: ['Office equipment', 'IT systems', 'Fit-out & tools'],
    image: imgBusiness,
  },
]

const steps = [
  { n: '01', title: 'Enquire', text: 'Tell us what you want to own — online, by phone, or at our Kamaladi office.' },
  { n: '02', title: 'Assess', text: 'An advisor sizes the loan around your income and picks terms you can keep.' },
  { n: '03', title: 'Approve', text: 'Lean paperwork, quick verification, and a clear agreement with no surprises.' },
  { n: '04', title: 'Own', text: 'Take delivery and start earning with it. We stay reachable for the full term.' },
]

const eligibility = [
  'Must be a Nepali citizen',
  'Financially disciplined',
  'Aged minimum 18 years, maximum 65 years at the time of loan maturity',
]

const documents = [
  'Citizenship, NID card copy, PAN copy & photographs — 2/2 copies (applicant & guarantor)',
  'Valid driving license — own / own family member',
  'Income source documents (own / own family member) — minimum 2 times the EMI amount',
  'Residency proof of applicant / guarantor — within the Manokamana Hire Purchase scope area',
  'Bank statement',
]

const companyDocuments = [
  'PAN / VAT, registration, audit report, tax clearance',
  'MOA, AOA & share lagat — in case of a company',
  'Board minute — in case of a partnership firm / company',
  'Partnership deed — in case of a partnership firm',
  'Quotation of vehicle',
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

/* ── Eligibility & documents disclosure ────────────────────────── */

function DocList({ title, items }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-navy-900/45">
        {title}
      </p>
      <ul className="mt-3 space-y-2.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-navy-900/65">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={2.5} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EligibilityDetails() {
  return (
    <div className="border-t border-navy-900/15 pt-8">
      <p className="font-display text-xl font-bold tracking-tight text-navy-900">
        Eligibility &amp; required documents
      </p>
      <div className="mt-7 grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        <DocList title="Eligibility" items={eligibility} />
        <DocList title="Required documents" items={documents} />
        <DocList title="Additional — for a company / firm" items={companyDocuments} />
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function Services() {
  return (
    <>
      {/* ══ Opening — catalogue title page ═══════════════════════ */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#fdfdfb] pt-28 lg:pt-36">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto w-full max-w-4xl px-6 text-center sm:px-10">
          {/* Eyebrow */}
          <Eyebrow className="animate-fade-up">Our services</Eyebrow>

          {/* Title */}
          <h1
            className="animate-fade-up mt-6 font-display font-extrabold leading-[0.95] tracking-tight text-navy-900"
            style={{ animationDelay: '80ms', fontSize: 'clamp(3.2rem, 8vw, 6.5rem)' }}
          >
            Financing for everything that keeps you{' '}
            <span className="text-brand-500">moving.</span>
          </h1>

          {/* Standfirst */}
          <p
            className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-navy-900/60 sm:text-lg"
            style={{ animationDelay: '160ms' }}
          >
            Seven categories of vehicles, machinery, and equipment — each with
            quick approvals and installments shaped around your income.
          </p>

          {/* Actions */}
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-6"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-brand-500 py-3.5 pl-7 pr-3.5 text-base font-semibold text-white transition-colors duration-300 hover:bg-brand-600"
            >
              Apply Now
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Link>
            <Link
              to="/emi-calculator"
              className="text-base font-semibold text-navy-900 transition-colors hover:text-brand-600"
            >
              Estimate your EMI →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Chapters — catalogue spreads ═════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative">
          {services.map((s, i) => {
            const num = String(i + 1).padStart(2, '0')
            const flipped = i % 2 === 1
            return (
              <article key={s.slug} id={s.slug} className="scroll-mt-24 border-t border-navy-900/40">
                <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 lg:py-20">
                  {/* Running header */}
                  <Reveal className="flex items-baseline justify-between gap-6 text-[11px] font-bold uppercase tracking-[0.22em] text-navy-900/50">
                    <span>
                      Chapter {num} <span className="text-brand-600">/</span> 07
                    </span>
                    <span className="hidden sm:inline">{s.tagline}</span>
                  </Reveal>

                  <div className="mt-10 grid items-center gap-12 lg:mt-12 lg:grid-cols-2 lg:gap-16">
                    {/* Text column */}
                    <Reveal className={flipped ? 'lg:order-2' : ''}>
                      <h2 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
                        {s.name}
                      </h2>
                      <p className="mt-5 max-w-lg text-base leading-relaxed text-navy-900/65 lg:text-lg">
                        {s.desc}
                      </p>

                      {/* Covers — editorial list */}
                      <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.22em] text-navy-900/45">
                        Covers
                      </p>
                      <p className="mt-2 max-w-lg font-display text-lg font-bold leading-snug text-navy-900">
                        {s.covers.map((c, j) => (
                          <span key={c}>
                            {c}
                            {j < s.covers.length - 1 && (
                              <span aria-hidden="true" className="mx-2.5 text-brand-500">
                                /
                              </span>
                            )}
                          </span>
                        ))}
                      </p>

                      <div className="mt-9 flex flex-wrap items-center gap-6">
                        <Link
                          to="/contact"
                          className="group inline-flex items-center gap-3 bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                        >
                          Apply Now
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            strokeWidth={2.5}
                          />
                        </Link>
                        <Link
                          to="/emi-calculator"
                          className="text-sm font-semibold text-navy-900 underline decoration-brand-500 decoration-2 underline-offset-4 transition-colors hover:text-brand-600"
                        >
                          Estimate EMI
                        </Link>
                      </div>
                    </Reveal>

                    {/* Image column — offset print frame */}
                    <Reveal delay={90} className={flipped ? 'lg:order-1' : ''}>
                      <div className={`relative ${flipped ? 'lg:mr-5' : 'lg:ml-5'} mt-6 lg:mt-0`}>
                        {/* Offset frame */}
                        <div
                          aria-hidden="true"
                          className={`absolute h-full w-full border-2 border-navy-900 ${
                            flipped ? '-bottom-4 -left-4' : '-bottom-4 -right-4'
                          }`}
                        />
                        <img
                          src={s.image}
                          alt={s.name}
                          className="relative aspect-[4/3] w-full object-cover"
                        />
                      </div>
                    </Reveal>
                  </div>

                  <Reveal className="mt-14">
                    <EligibilityDetails />
                  </Reveal>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ══ How it works ═════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-navy-900/40 bg-[#fdfdfb] px-6 py-16 sm:px-10 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />
        <div className="relative mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-6 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-navy-900 sm:text-4xl">
              Four steps from enquiry to ownership.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <Reveal key={st.n} delay={i * 70}>
                <div className="h-full rounded-3xl border border-black/5 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(10,28,52,0.25)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-white">
                    {st.n}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-navy-900">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{st.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Financial disclosures — quiet strip, links to the unlisted Reports page */}
          <Reveal className="mt-12 text-center">
            <p className="text-base text-navy-900/55">
              Want to see how we&apos;re doing?{' '}
              <Link
                to="/reports"
                className="group inline-flex items-center gap-1.5 font-bold text-brand-500 transition-colors hover:text-brand-600"
              >
                View our financial reports
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

    </>
  )
}
