import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { MapPin, Clock, ArrowUpRight } from 'lucide-react'
import Eyebrow from '../components/Eyebrow'
import { getOpenings } from '../lib/careerStore'
import heroImage from '../assets/images/70_kmph_top_speed.jpg'

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

/* ── Page ──────────────────────────────────────────────────────── */

export default function Careers() {
  const [openings, setOpenings] = useState([])

  useEffect(() => {
    let alive = true
    getOpenings().then((list) => alive && setOpenings(list))
    return () => {
      alive = false
    }
  }, [])

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
            <Eyebrow align="left" className="animate-fade-up">Careers</Eyebrow>

            <h1
              className="animate-fade-up mt-7 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-navy-900 sm:text-6xl lg:text-[4.4rem]"
              style={{ animationDelay: '70ms' }}
            >
              Build a career
              <br />
              that moves
              <br />
              <span className="text-brand-500">Nepal forward.</span>
            </h1>

            <p
              className="animate-fade-up mt-7 max-w-lg text-lg leading-relaxed text-navy-900/65"
              style={{ animationDelay: '140ms' }}
            >
              We are a young financial house with an old promise — to put the
              distance between wanting a vehicle and owning one within every
              Nepali&apos;s reach. If you want work that shows up on the road the
              next morning, there is a place for you here.
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-wrap gap-4"
              style={{ animationDelay: '210ms' }}
            >
              <a
                href="#openings"
                className="rounded-full bg-brand-500 px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
              >
                View open roles
              </a>
              <Link
                to="/contact"
                className="rounded-full border border-brand-500 px-7 py-3.5 text-[15px] font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
              >
                Get in touch
              </Link>
            </div>
          </div>

          {/* Right — photo */}
          <div
            className="animate-fade-up relative"
            style={{ animationDelay: '170ms' }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={heroImage}
                alt="Mahindra Supro — the vehicles we help finance"
                className="h-[380px] w-full object-cover sm:h-[500px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/45 via-transparent to-transparent" />
              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-navy-700 shadow-sm backdrop-blur">
                <MapPin className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
                Kamaladi, Kathmandu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-[#fdfdfb] px-6 sm:px-10">
        <hr className="border-navy-900/25" />
      </div>

      {/* ══ Open positions ══════════════════════════════════════ */}
      <section
        id="openings"
        className="relative overflow-hidden bg-[#fdfdfb] px-6 py-20 sm:px-10 lg:py-28"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>Open positions</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl">
              Find your
              <br />
              seat at the <span className="text-brand-500">table.</span>
            </h2>
          </Reveal>

          <div className="mt-14 lg:mt-16">
            {openings.map((job, i) => (
              <Reveal
                key={job.id || job.title}
                delay={i * 60}
                className="group grid gap-4 border-t border-navy-900/10 py-8 transition-colors last:border-b hover:bg-navy-900/[0.02] sm:grid-cols-[1.2fr_1.6fr_auto] sm:items-center sm:gap-8 lg:py-9"
              >
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-navy-900 transition-colors group-hover:text-brand-600">
                    {job.title}
                  </h3>
                  {job.dept && (
                    <p className="mt-1.5 text-sm font-semibold uppercase tracking-wide text-brand-500">
                      {job.dept}
                    </p>
                  )}
                </div>

                <p className="max-w-xl leading-relaxed text-navy-900/60">{job.desc}</p>

                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-900/50">
                    {job.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
                        {job.location}
                      </span>
                    )}
                    {job.type && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
                        {job.type}
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:info@manokamanahirepurchase.com.np?subject=${encodeURIComponent(
                      `Application: ${job.title}`,
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-brand-500"
                  >
                    Apply now
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
