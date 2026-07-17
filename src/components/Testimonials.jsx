import { Star } from 'lucide-react'
import Eyebrow from './Eyebrow'
import useOffscreenPaused from '../hooks/useOffscreenPaused'

const reviews = [
  {
    name: 'Manoj Gurung',
    company: 'Gurung Traders, Pokhara',
    quote:
      'Manokamana financed my delivery van in just two days. The installments fit my business perfectly and the team explained every term clearly.',
  },
  {
    name: 'Bishal Shrestha',
    company: 'Himalayan Agro Farm',
    quote:
      'We financed three tractors through Manokamana. Fast approval, fair rates, and genuine support throughout the entire process.',
  },
  {
    name: 'Ramesh Patel',
    company: 'Patel Construction Pvt. Ltd.',
    quote:
      'Getting our excavator loan was smooth and transparent. No hidden charges, and the paperwork was refreshingly minimal.',
  },
  {
    name: 'Sunita Rai',
    company: 'Biratnagar',
    quote:
      'I bought my scooter on easy EMIs with almost no paperwork. The whole experience was quick, clear, and friendly.',
  },
  {
    name: 'Dipendra Thapa',
    company: 'Thapa Stone Industries',
    quote:
      'Manokamana delivered financing for our heavy equipment within the committed window. The after-sales follow-up is genuine.',
  },
]

function Stars() {
  return (
    <div className="flex gap-1 text-brand-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [marqueeRef, paused] = useOffscreenPaused()

  return (
    <section className="relative bg-gray-50 pb-24 pt-14 lg:pb-32 lg:pt-16">
<div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="text-center">
          <Eyebrow>What Our Customers Say</Eyebrow>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-700 sm:text-5xl">
            Real Reviews. Real Customers.
          </h2>
        </div>
      </div>

      {/* Auto-scrolling marquee (left → right) */}
      <div ref={marqueeRef} className="relative mt-14 overflow-hidden">
        <div
          className={`animate-marquee-reverse flex w-max py-10 ${
            paused ? '[animation-play-state:paused]' : ''
          }`}
        >
          {/* Reviews are duplicated on purpose: the marquee translates by 50%,
              so a second identical copy makes the loop seamless (no visible jump
              when it wraps). This is not an accidental double render. */}
          {[...reviews, ...reviews].map((r, i) => (
            <article
              key={i}
              className="mr-6 w-[340px] shrink-0 rounded-2xl bg-white p-8 ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(20,49,95,0.18)]"
            >
              <Stars />
              <p className="mt-5 font-serif text-lg italic leading-relaxed text-gray-700">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className="font-bold uppercase tracking-wide text-navy-900">{r.name}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-brand-500">
                  Google Review
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
