import { useState, useRef, useEffect } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Navigation,
} from 'lucide-react'
import Eyebrow from '../components/Eyebrow'
import OfficeMap from '../components/OfficeMap'
import brandImage from '../assets/images/vitaly-gariev-M5k978V3qBc-unsplash.webp'
import consultImage from '../assets/images/vitaly-gariev-0kWem6X0Mc8-unsplash.webp'

// Web3Forms access key (https://web3forms.com). Comes from VITE_WEB3FORMS_KEY,
// set in .env.local (dev) and in the host's environment (prod). It ships in the
// client bundle by nature, so it must NOT be committed as a hardcoded fallback:
// harden it in the Web3Forms dashboard (allowed-domains + hCaptcha) to prevent
// abuse. If the var is unset the form is disabled and shows a fallback message.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || ''

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const inquiryTypes = [
  { id: 'new', label: 'New loan' },
  { id: 'existing', label: 'Existing loan' },
  { id: 'general', label: 'General enquiry' },
  { id: 'partner', label: 'Partnership' },
]

const loanTypes = [
  'Vehicle Finance',
  'Two-Wheeler Finance',
  'Commercial Vehicle Finance',
  'Agricultural Equipment',
  'Construction Equipment',
  'Not sure yet',
]

const channels = [
  { icon: Phone, label: 'Call us', value: '01-4163533', href: 'tel:+977014163533' },
  {
    icon: Mail,
    label: 'Email us',
    value: 'info@manokamanahirepurchase.com.np',
    href: 'mailto:info@manokamanahirepurchase.com.np',
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: 'Manokamana Hire Purchase Pvt. Ltd., Kathmandu',
    href: 'https://www.google.com/maps/place/Manakamana+Hire+Purchase+Pvt+Ltd/@27.7108334,85.31344,17z',
  },
]

// Official Google Maps directions URL — opens turn-by-turn directions to the
// office (launches the Maps app on mobile). `destination_place_id` labels the
// destination as the business; the coordinates guarantee the exact location.
const directionsHref =
  'https://www.google.com/maps/dir/?api=1&destination=27.7108334%2C85.31344&destination_place_id=0x39eb1936cb09b9c9%3A0xe2e7a0fb45896ea4'

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

export default function Contact() {
  const [inquiry, setInquiry] = useState('new')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    loan: loanTypes[0],
    message: '',
    consent: false,
  })

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!WEB3FORMS_KEY) {
      setError('The contact form is not configured yet. Please call or email us in the meantime.')
      return
    }

    setSending(true)
    try {
      const inquiryLabel = inquiryTypes.find((t) => t.id === inquiry)?.label || inquiry
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New enquiry (${inquiryLabel}) — ${form.name}`,
          from_name: 'Manokamana Hire Purchase Website',
          replyto: form.email, // reply goes straight to the customer
          // Field order + labels below control how the notification email reads.
          'Enquiry type': inquiryLabel,
          'Full name': form.name,
          'Phone number': form.phone,
          'Email address': form.email,
          'Interested in': form.loan,
          Message: form.message,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not send your message.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again or call us.')
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setError('')
    setForm({ name: '', phone: '', email: '', loan: loanTypes[0], message: '', consent: false })
    setInquiry('new')
  }

  const [mapRef, mapIn] = useReveal()

  return (
    <>
      <section id="get-in-touch" className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* ══ LEFT — photographic brand panel ══════════════════════ */}
        <aside className="relative flex min-h-[560px] flex-col overflow-hidden bg-navy-900 lg:sticky lg:top-0 lg:h-screen">
          <img
            src={brandImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/88 via-navy-900/82 to-navy-900/96" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
            style={{ backgroundImage: grain }}
          />

          <div className="relative flex h-full flex-col justify-between px-8 pb-10 pt-32 text-white sm:px-12 lg:px-14 lg:pt-36">
            <div>
              <div className="animate-fade-up flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-500">
                <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                Get in touch
              </div>
              <h1
                className="animate-fade-up mt-7 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl"
                style={{ animationDelay: '80ms' }}
              >
                Let&apos;s drive
                <br />
                it <span className="text-brand-500">forward.</span>
              </h1>
              <p
                className="animate-fade-up mt-6 max-w-sm text-lg leading-relaxed text-white/70"
                style={{ animationDelay: '150ms' }}
              >
                From your first two-wheeler to a full commercial fleet, tell us what you
                need and our financing team takes it from there.
              </p>

              <div
                className="animate-fade-up mt-8 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-sm"
                style={{ animationDelay: '210ms' }}
              >
                <ShieldCheck className="h-4 w-4 text-brand-400" strokeWidth={2.2} />
                We reply within one business day
              </div>
            </div>

            {/* Channels */}
            <div className="animate-fade-up mt-12" style={{ animationDelay: '280ms' }}>
              <div className="border-t border-white/15">
                {channels.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="group flex items-center gap-4 border-b border-white/15 py-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-brand-400 ring-1 ring-white/15 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                      <c.icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block truncate font-display text-lg font-bold leading-snug tracking-tight text-white">
                        {c.value}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="ml-auto h-5 w-5 shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-400"
                      strokeWidth={2}
                    />
                  </a>
                ))}
              </div>

              {/* Hours */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2.5 text-sm text-white/60">
                  <Clock className="h-4 w-4 text-brand-400" strokeWidth={2} />
                  Sun to Fri, 9:00 AM to 6:00 PM
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ══ RIGHT — light form ═══════════════════════════════════ */}
        <div className="bg-[#fdfdfb] px-6 pb-14 pt-32 sm:px-12 lg:px-16 lg:pb-16 lg:pt-52">
          <div className="mx-auto w-full max-w-2xl">
            {submitted ? (
              <div className="animate-fade-up flex min-h-[60vh] flex-col items-start justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30">
                  <Check className="h-9 w-9" strokeWidth={3} />
                </span>
                <h2 className="mt-8 font-display text-4xl font-extrabold tracking-tight text-navy-700 sm:text-5xl">
                  Message sent.
                </h2>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-gray-600">
                  Thanks, {form.name ? form.name.split(' ')[0] : 'there'}. Our financing
                  team will reach out within one business day. Keep your phone close.
                </p>
                <button
                  onClick={resetForm}
                  className="mt-10 inline-flex items-center gap-2 rounded-full border border-navy-700/20 px-6 py-3 text-sm font-semibold text-navy-700 transition-all hover:border-navy-700 hover:bg-navy-700 hover:text-white active:scale-[0.98]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-center font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-700 sm:text-[2.75rem]">
                  Tell us what you&apos;re after.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-gray-500">
                  Fill in a few details and the right advisor will pick it up. No call
                  centres, no runaround.
                </p>

                {/* Inquiry type pills */}
                <p className="mt-7 text-center text-sm font-semibold text-gray-500">
                  I&apos;m reaching out about
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                  {inquiryTypes.map((t) => {
                    const active = inquiry === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setInquiry(t.id)}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.97] ${
                          active
                            ? 'bg-navy-700 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        {t.label}
                      </button>
                    )
                  })}
                </div>

                {/* Fields */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name">
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Ram Bahadur"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Phone number" htmlFor="phone">
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="+977 98XXXXXXXX"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email address" htmlFor="email">
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update('email')}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Interested in" htmlFor="loan">
                    <div className="relative">
                      <select
                        id="loan"
                        value={form.loan}
                        onChange={update('loan')}
                        className={`${inputClass} cursor-pointer appearance-none pr-10`}
                      >
                        {loanTypes.map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="How can we help?" htmlFor="message">
                    <textarea
                      id="message"
                      rows={3}
                      required
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Tell us about the vehicle or equipment you'd like to finance, your budget, and timeline."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>

                {/* Consent */}
                <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    required
                    checked={form.consent}
                    onChange={update('consent')}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-brand-500"
                  />
                  <span>
                    I agree to be contacted by Manokamana Hire Purchase regarding my
                    enquiry and accept the{' '}
                    <a href="#" className="font-semibold text-brand-500 underline-offset-2 hover:underline">
                      privacy policy
                    </a>
                    .
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600 ring-1 ring-red-100">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <div className="mt-7 flex justify-center">
                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-500 py-3.5 pl-8 pr-4 text-base font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {sending ? 'Sending…' : 'Send message'}
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══ Find-us — centered map ══════════════════════════════ */}
      <section ref={mapRef} className="border-t-4 border-navy-900 bg-[#fdfdfb] px-6 py-16 lg:py-24">
        <div className={`mx-auto max-w-7xl ${mapIn ? 'animate-fade-up' : 'opacity-0'}`}>
          {/* Eyebrow */}
          <Eyebrow>Find us</Eyebrow>

          {/* Heading */}
          <h2 className="mx-auto mt-6 max-w-4xl text-center font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-700 sm:text-5xl lg:text-6xl">
            Come say hello.{' '}
            <span className="whitespace-nowrap text-brand-500">In Kathmandu.</span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-relaxed text-gray-500">
            Visit the Manokamana Hire Purchase office in Kathmandu for a face to face consultation.
            Open Sunday to Friday, 9:00 AM to 6:00 PM.
          </p>

          {/* Map */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 shadow-xl shadow-navy-900/5 lg:mt-12">
            <OfficeMap className="h-[380px] w-full sm:h-[460px] lg:h-[520px]" />
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <a
              href={directionsHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 rounded-none border border-navy-700/20 bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.13em] text-navy-700 transition-colors duration-300 hover:border-brand-500 hover:bg-brand-500 hover:text-white"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-700 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-brand-500">
                <Navigation className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              Get directions on Google Maps
            </a>
          </div>

          {/* Consultation CTA */}
          <div className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-2">
            {/* Photo */}
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={consultImage}
                alt="A Manokamana financing advisor meeting a customer"
                className="h-72 w-full object-cover sm:h-96 lg:h-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-navy-700 shadow-sm backdrop-blur">
                <MapPin className="h-4 w-4 text-brand-500" strokeWidth={2.2} />
                Manokamana Hire Purchase, Kathmandu
              </div>
            </div>

            {/* Brand card */}
            <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl bg-brand-500 p-8 lg:min-h-[440px] lg:p-10">
              {/* Texture + depth */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-soft-light"
                style={{ backgroundImage: grain }}
              />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <span className="inline-flex rounded-full border border-white/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  Free consultation
                </span>
                <h3 className="mt-7 max-w-md font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl">
                  Schedule a free consultation at your preferred time
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
                  Sit down with an advisor who maps out the right financing for your
                  vehicle or equipment. No obligation, no pressure.
                </p>
              </div>

              <div className="relative mt-8">
                <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-5 text-sm font-medium text-white/90">
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Tailored loan options
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Reply within one business day
                  </span>
                </div>

                <a
                  href="#get-in-touch"
                  className="group mt-6 inline-flex items-center gap-3 self-start rounded-full bg-navy-900 py-3 pl-6 pr-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-navy-900 hover:shadow-xl hover:shadow-navy-900/30 active:translate-y-0"
                >
                  Free Consultation
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy-900 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-navy-900 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Helpers ───────────────────────────────────────────────────── */

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:bg-white'

function Field({ label, htmlFor, children }) {
  return (
    <div className="group">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-brand-600"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
