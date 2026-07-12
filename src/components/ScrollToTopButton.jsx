import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/** Floating button that appears after scrolling down and jumps back to top. */
export default function ScrollToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_12px_30px_-8px_rgba(225,27,34,0.6)] transition-all duration-300 hover:bg-brand-600 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
    </button>
  )
}
