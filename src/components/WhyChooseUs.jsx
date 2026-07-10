import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronUp, ArrowRight, Users, Award, Layers, Building2, Timer } from 'lucide-react'

const stats = [
  { value: '5,000+', label: 'Happy Customers', icon: Users },
  { value: '15+', label: 'Years of Experience', icon: Award },
  { value: '5', label: 'Finance Categories', icon: Layers },
  { value: '25+', label: 'Branches Nationwide', icon: Building2 },
  { value: '24 hrs', label: 'Average Approval Time', icon: Timer },
]

function useInView() {
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

export default function WhyChooseUs() {
  const [ref, inView] = useInView()
  const rv = (base, delay) => ({
    className: `${base} ${inView ? 'animate-fade-up' : 'opacity-0'}`,
    style: { animationDelay: `${delay}ms` },
  })

  return (
    <section ref={ref} className="bg-gray-100 pb-24 pt-14 lg:pb-32 lg:pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div {...rv('mx-auto max-w-2xl text-center', 0)}>
          <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-500">
            <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
            Why Choose Us
          </div>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-700 sm:text-5xl">
            The numbers speak
            <br className="hidden sm:block" /> for themselves
          </h2>
        </div>

        {/* Stat tiles */}
        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <div
              key={label}
              {...rv(
                'group flex min-h-[220px] w-full flex-col justify-between rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition-colors duration-300 hover:bg-brand-500 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]',
                100 + i * 90,
              )}
            >
              <Icon
                className="h-8 w-8 text-brand-500 transition-colors duration-300 group-hover:text-white"
                strokeWidth={1.6}
              />
              <div className="mt-10">
                <p className="font-display text-5xl font-extrabold leading-none tracking-tight text-navy-700 transition-colors duration-300 group-hover:text-white">
                  {value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-white/80">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div {...rv('mt-10 flex justify-center', 600)}>
          <Link
            to="/about"
            className="group inline-flex items-center gap-3 rounded-full bg-brand-500 py-3.5 pl-7 pr-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Know More
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
