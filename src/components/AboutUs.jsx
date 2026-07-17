import { Link } from 'react-router-dom'
import { Phone, Handshake, Wallet, Zap, ChevronUp, ArrowRight } from 'lucide-react'
import img1 from '../assets/images/650h zaxis.webp'
import img2 from '../assets/images/john-deere-tractor-and-harvesters-8vy92xu1qcrorfub.webp'
import img3 from '../assets/images/wp9212100.webp'

const features = [
  {
    title: 'Flexible Installments',
    desc: 'Easy, affordable repayment plans tailored to your budget and cash flow.',
    icon: Wallet,
  },
  {
    title: 'Fast Approvals',
    desc: 'Quick, hassle-free loan approvals so you can get on the road sooner.',
    icon: Zap,
  },
]

// Subtle dotted texture
const dots =
  'radial-gradient(circle, rgba(20,49,95,0.12) 1px, transparent 1px)'

export default function AboutUs() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-28">
      {/* Dotted backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ backgroundImage: dots, backgroundSize: '18px 18px' }}
      />

      <div className="relative mx-auto grid max-w-[90rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.7fr_0.8fr] lg:gap-12 lg:pl-4 lg:pr-10">
        {/* Left collage */}
        <div className="grid grid-cols-2 items-stretch gap-5">
          {/* Column A (staggered down) */}
          <div className="mt-24 flex flex-col gap-5">
            {/* Consultation card */}
            <div className="rounded-3xl bg-navy-800 p-6 text-white shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Request a free consultation
              </p>
              <p className="mt-2 text-xl font-bold">Just Give A Missed Call</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full">
                  <Phone className="h-5 w-5 text-white" />
                </span>
                <span className="text-lg font-semibold">01-4163533</span>
              </div>
            </div>
            {/* Image */}
            <img
              src={img2}
              alt="John Deere tractor and harvesters we finance"
              className="min-h-[20rem] w-full flex-1 rounded-3xl object-cover shadow-lg"
            />
          </div>

          {/* Column B (starts at top) */}
          <div className="flex flex-col gap-5">
            {/* Portrait image */}
            <img
              src={img1}
              alt="ZAXIS excavator we finance"
              className="h-96 w-full rounded-3xl object-cover shadow-lg lg:h-[30rem]"
            />
            {/* Info card over image */}
            <div className="relative min-h-[16rem] flex-1 overflow-hidden rounded-3xl shadow-lg">
              <img src={img3} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-navy-800/80" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 shadow-lg backdrop-blur-md">
                  <Handshake className="h-6 w-6 text-white" />
                </span>
                <h3 className="text-lg font-bold">Driven By Your Ambitions</h3>
                <p className="mt-1 text-sm text-white/80">
                  From your first bike to a full commercial fleet, we finance every milestone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-500">
            <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
            About Manokamana
          </div>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-navy-700 sm:text-5xl">
            Driving Dreams Forward With Trusted Financing
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            We provide reliable hire purchase and financing solutions designed to help
            individuals and businesses own the vehicles and equipment they need to move forward.
          </p>

          <div className="mt-10 space-y-8">
            {features.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="flex gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-navy-700 shadow-sm ring-1 ring-gray-100">
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-navy-700">{title}</h3>
                  <p className="mt-1.5 max-w-md text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-brand-500 py-3.5 pl-7 pr-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Reach Us
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-500 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
