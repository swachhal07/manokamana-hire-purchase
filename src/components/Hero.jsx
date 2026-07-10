import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import bg1 from '../assets/images/vitaly-gariev-0kWem6X0Mc8-unsplash.jpg'
import bg2 from '../assets/images/vitaly-gariev-LS5dCL0NkhE-unsplash.jpg'
import bg3 from '../assets/images/vitaly-gariev-M5k978V3qBc-unsplash.jpg'
import bg4 from '../assets/images/photo-1628348068343-c6a848d2b6dd.avif'
import Marquee from './Marquee'

const backgrounds = [bg1, bg2, bg3, bg4]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % backgrounds.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  // GSAP load-in: staggered reveal of the hero headline and CTAs
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-anim', {
        opacity: 0,
        y: 34,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.16,
        delay: 0.15,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-navy-700">
      {/* Rotating background slideshow */}
      {backgrounds.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col justify-center px-6 lg:px-10">
        <div ref={contentRef} className="max-w-2xl">
          <h1 className="hero-anim text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Drive Your
            <span className="ml-5 inline-block h-px w-24 bg-brand-500 align-middle sm:w-32" />
            <br />
            Dreams Forward
          </h1>

          <div className="hero-anim mt-10 flex items-center gap-2">
            <Link
              to="/contact"
              className="rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Free Consultation
            </Link>
            <Link
              to="/contact"
              aria-label="Free Consultation"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <Marquee />
      </div>
    </section>
  )
}
