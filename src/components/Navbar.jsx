import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import manokamanaLogo from '../assets/images/manokamana-logo.png'
import dugarLogo from '../assets/images/dugar-logo.png'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  {
    label: 'About',
    children: [
      { label: 'About Us', path: '/about', desc: 'Who we are & what we stand for' },
      { label: 'Leadership', path: '/leadership', desc: 'The people behind the promise' },
    ],
  },
  { label: 'Blog', path: '/blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 ${isHome
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
            className={`h-11 w-px ${isHome ? 'bg-white/40 transition-colors group-hover:bg-gray-300' : 'bg-gray-300'
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
          {navItems.map((item) => {
            const className = `flex items-center gap-1.5 text-[17px] font-medium transition-colors ${isHome
                ? 'text-white/90 group-hover:text-gray-700 group-hover:hover:text-brand-600'
                : 'text-gray-700 hover:text-brand-600'
              }`
            if (item.children) {
              return (
                <li key={item.label} className="group/drop relative">
                  <button className={className} aria-haspopup="true">
                    {item.label}
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-300 group-hover/drop:rotate-180"
                      strokeWidth={2.5}
                    />
                  </button>

                  {/* Dropdown panel */}
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-300 group-hover/drop:visible group-hover/drop:translate-y-0 group-hover/drop:opacity-100">
                    <div className="w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_24px_60px_-16px_rgba(10,28,52,0.3)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          className="group/item block rounded-xl px-4 py-3.5 transition-colors hover:bg-gray-50"
                        >
                          <span className="flex items-center justify-between text-[15px] font-semibold text-navy-900 transition-colors group-hover/item:text-brand-600">
                            {child.label}
                            <span className="h-1.5 w-1.5 scale-0 rounded-full bg-brand-500 transition-transform duration-300 group-hover/item:scale-100" />
                          </span>
                          <span className="mt-0.5 block text-[13px] text-gray-500">
                            {child.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              )
            }
            return (
              <li key={item.label}>
                {item.path ? (
                  <Link to={item.path} className={className}>
                    {item.label}
                  </Link>
                ) : (
                  <button className={className}>{item.label}</button>
                )}
              </li>
            )
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden rounded-full bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:inline-block"
          >
            Contact Us
          </Link>
          <Link
            to="/emi-calculator"
            className={`hidden rounded-full border px-5 py-3 text-[15px] font-semibold transition-colors sm:inline-block ${
              isHome
                ? 'border-white/50 text-white group-hover:border-brand-500 group-hover:text-brand-600'
                : 'border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white'
            }`}
          >
            EMI Calculator
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
                className={`block h-0.5 w-6 transition-colors ${i > 0 ? 'mt-1.5' : ''} ${isHome ? 'bg-white group-hover:bg-gray-800' : 'bg-gray-800'
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
              {item.children ? (
                <div>
                  <span className="block px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {item.label}
                  </span>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      onClick={() => setOpen(false)}
                      className="block w-full rounded px-3 py-2 pl-5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : item.path ? (
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="block w-full rounded px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              ) : (
                <button className="w-full rounded px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100">
                  {item.label}
                </button>
              )}
            </li>
          ))}
          <li>
            <Link
              to="/emi-calculator"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded border border-brand-500 px-3 py-2 text-center text-sm font-semibold text-brand-600"
            >
              EMI Calculator
            </Link>
          </li>
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
