import { Link } from 'react-router-dom'
import dugarLogo from '../assets/images/dugar-logo.png'
import manokamanaLogo from '../assets/images/manokamana-logo.png'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/' },
  { label: 'Why Us', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
]

function Dot() {
  return <span className="hidden text-brand-500 sm:inline">•</span>
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-[#f2f0ea] text-gray-900">
      {/* Topographic contour texture */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="topo">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009"
              numOctaves="4"
              seed="11"
              stitchTiles="stitch"
              result="t"
            />
            <feColorMatrix
              in="t"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.33 0.33 0.33 0 0"
              result="g"
            />
            <feComponentTransfer in="g" result="bands">
              <feFuncA type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
            </feComponentTransfer>
            <feMorphology in="bands" operator="dilate" radius="0.6" result="d" />
            <feComposite in="d" in2="bands" operator="xor" result="lines" />
            <feFlood floodColor="#c4bdad" result="col" />
            <feComposite in="col" in2="lines" operator="in" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#topo)" />
      </svg>

      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center lg:py-20">
        {/* Logos */}
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <img src={dugarLogo} alt="MV Dugar Group" className="h-10 w-auto object-contain" />
            <span className="h-9 w-px bg-gray-300" />
            <img
              src={manokamanaLogo}
              alt="Manokamana Hire Purchase"
              className="h-9 w-auto object-contain"
            />
          </div>
        </div>

        {/* Headline */}
        <h2 className="mt-8 font-display text-5xl font-extrabold tracking-tight text-navy-700 sm:text-6xl">
          Driving Nepal <span className="text-brand-500">Forward.</span>
        </h2>

        {/* Nav */}
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg font-medium">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-gray-600 transition-colors hover:text-brand-500"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Contact */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg text-gray-600">
          <span>Kathmandu, Nepal</span>
          <Dot />
          <a href="tel:+97718002562 58" className="transition-colors hover:text-brand-500">
            +977-1-800-256-258
          </a>
          <Dot />
          <a href="mailto:info@manokamana.com.np" className="transition-colors hover:text-brand-500">
            info@manokamana.com.np
          </a>
        </div>

        {/* Divider */}
        <hr className="mx-auto mt-12 max-w-2xl border-gray-200" />

        {/* Legal */}
        <div className="mt-8 flex items-center justify-center gap-6 text-base">
          <a href="#" className="text-gray-500 transition-colors hover:text-navy-700">
            Privacy Policy
          </a>
          <Dot />
          <a href="#" className="text-gray-500 transition-colors hover:text-navy-700">
            Terms &amp; Conditions
          </a>
        </div>
        <p className="mt-4 text-base text-gray-500">
          © {new Date().getFullYear()} Manokamana Hire Purchase Pvt. Ltd. All rights reserved.
        </p>
        <p className="mt-2 text-base text-gray-500">
          Developed by{' '}
          <a
            href="https://swachhalportfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-500 transition-colors hover:text-brand-600 hover:underline"
          >
            Swachhal Lamsal
          </a>
        </p>
      </div>
    </footer>
  )
}
