import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import manokamanaLogo from '../assets/images/manokamana-logo.png'
import dugarLogo from '../assets/images/dugar-logo.png'

const navItems = [
  { label: 'Home', hasDropdown: true },
  { label: 'Services', hasDropdown: true },
  { label: 'Industries', hasDropdown: true },
  { label: 'About', hasDropdown: true },
  { label: 'Insights', hasDropdown: false },
]

function Caret() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 ${
        isHome
          ? 'group transition-colors duration-300 hover:bg-white hover:shadow-[0_10px_30px_-12px_rgba(10,28,52,0.25)]'
          : 'border-b border-gray-100 bg-white shadow-[0_10px_30px_-12px_rgba(10,28,52,0.25)]'
      }`}
    >
      <nav className="relative mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 lg:px-10">
        {/* Logos side by side, separated by a divider */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src={dugarLogo}
            alt="MV Dugar Group"
            className="h-14 w-auto object-contain"
          />
          <span
            className={`h-11 w-px ${
              isHome ? 'bg-white/40 transition-colors group-hover:bg-gray-300' : 'bg-gray-300'
            }`}
          />
          <img
            src={manokamanaLogo}
            alt="Manokamana Hire Purchase"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Center nav */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={`flex items-center gap-1.5 text-[17px] font-medium transition-colors ${
                  isHome
                    ? 'text-white/90 group-hover:text-gray-700 group-hover:hover:text-brand-600'
                    : 'text-gray-700 hover:text-brand-600'
                }`}
              >
                {item.label}
                {item.hasDropdown && <Caret />}
              </button>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden rounded-full bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:inline-block"
          >
            Contact Us
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 w-6 transition-colors ${i > 0 ? 'mt-1.5' : ''} ${
                  isHome ? 'bg-white group-hover:bg-gray-800' : 'bg-gray-800'
                }`}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="mx-6 flex flex-col gap-1 rounded-xl bg-white p-3 shadow-lg lg:hidden">
          {navItems.map((item) => (
            <li key={item.label}>
              <button className="w-full rounded px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded bg-brand-500 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}
