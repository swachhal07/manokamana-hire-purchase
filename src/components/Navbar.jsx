import { useEffect, useState } from 'react'
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
  { label: 'Careers', path: '/careers' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Fixed navbar: transparent over the home hero, solid once scrolled.
  // Hides when scrolling down, reveals when scrolling back up.
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (y > lastY && y > 80) setHidden(true)
      else if (y < lastY) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // "Solid" = white background with dark text. Always solid off the home
  // page; on home it turns solid as soon as the user scrolls or hovers the bar.
  const solid = !isHome || scrolled || hovered
  // Keep the bar visible whenever the mobile menu is open.
  const shouldHide = hidden && !open

  return (
    <header
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        shouldHide ? '-translate-y-full' : 'translate-y-0'
      } ${
        solid
          ? 'border-b border-gray-100 bg-white shadow-[0_10px_30px_-12px_rgba(10,28,52,0.25)]'
          : 'border-b border-transparent bg-transparent'
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
            className={`h-11 w-px transition-colors ${solid ? 'bg-gray-300' : 'bg-white/40'}`}
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
            const className = `flex items-center gap-1.5 text-[17px] font-medium transition-colors ${solid
                ? 'text-gray-700 hover:text-brand-600'
                : 'text-white/90 hover:text-white'
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
              solid
                ? 'border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white'
                : 'border-white/50 text-white hover:bg-white/10'
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
                className={`block h-0.5 w-6 transition-colors ${i > 0 ? 'mt-1.5' : ''} ${solid ? 'bg-gray-800' : 'bg-white'
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
