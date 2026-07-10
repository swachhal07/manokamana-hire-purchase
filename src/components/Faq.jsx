import { useState, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, ChevronUp, ArrowRight } from 'lucide-react'

const faqs = [
  {
    q: 'What can I finance with Manokamana?',
    a: 'We finance two-wheelers, cars and SUVs, commercial vehicles, agricultural equipment, and construction machinery — including new, used, and electric options.',
  },
  {
    q: 'How long does loan approval take?',
    a: 'Most applications are approved within 24 hours once your documents are submitted. Our team keeps you updated at every step.',
  },
  {
    q: 'What documents do I need to apply?',
    a: 'Typically a citizenship/ID, proof of income, and basic KYC documents. We will share the exact checklist based on your loan type when you apply.',
  },
  {
    q: 'What is the minimum down payment?',
    a: 'Down payment depends on the asset type and your profile, and usually starts from a small percentage of the vehicle value. Contact us for a tailored quote.',
  },
  {
    q: 'Can I repay my loan early?',
    a: 'Yes. Early repayment is allowed, with terms based on your agreement. Our advisors will clearly explain any applicable conditions before you sign.',
  },
]

const pad = (n) => String(n + 1).padStart(2, '0')

export default function Faq() {
  const [open, setOpen] = useState(0)
  const contentRefs = useRef([])
  // Populate refs before first paint so the initially-open item measures correctly
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => setReady(true), [])

  return (
    <section className="bg-navy-900 pb-24 pt-14 text-white lg:pb-32 lg:pt-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
        {/* Left — sticky heading + contact */}
        <div className="self-start lg:sticky lg:top-28">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-500">
            <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
            FAQ
          </div>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Questions?
            <br />
            Answered.
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-white/60">
            Everything you need to know about financing with Manokamana. Can’t find your
            answer? Our team is here to help.
          </p>

          <div className="mt-8 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <p className="font-display text-xl font-bold">Still have questions?</p>
            <p className="mt-1 text-base text-white/60">Talk to our financing team directly.</p>
            <Link
              to="/contact"
              className="group mt-5 inline-flex items-center gap-3 rounded-full bg-brand-500 py-3 pl-6 pr-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Contact Us
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>

        {/* Right — accordion */}
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-2xl transition-colors duration-300 ${
                  isOpen
                    ? 'bg-white ring-1 ring-black/5'
                    : 'bg-white/5 ring-1 ring-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-5 p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display text-sm font-bold tabular-nums transition-colors ${
                      isOpen ? 'text-brand-500' : 'text-white/40'
                    }`}
                  >
                    {pad(i)}
                  </span>
                  <span
                    className={`flex-1 font-display text-xl font-bold tracking-tight transition-colors sm:text-2xl ${
                      isOpen ? 'text-navy-700' : 'text-white'
                    }`}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isOpen ? 'bg-brand-500 text-white' : 'bg-white/10 text-white'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </span>
                </button>

                <div
                  ref={(el) => {
                    contentRefs.current[i] = el
                  }}
                  className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                  style={{
                    maxHeight: isOpen
                      ? ready
                        ? `${contentRefs.current[i]?.scrollHeight ?? 0}px`
                        : 'none'
                      : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-6 pb-6 pl-[3.25rem] text-lg leading-relaxed text-gray-600">
                    {item.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
