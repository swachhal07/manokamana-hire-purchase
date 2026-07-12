import { ChevronUp } from 'lucide-react'

/**
 * Section label: a small up-chevron above an uppercase, brand-red caption.
 * `align` controls horizontal alignment ('center' | 'left'); pass extra
 * classes (e.g. 'animate-fade-up') via `className`.
 */
export default function Eyebrow({ children, align = 'center', className = '' }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-brand-500 ${
        align === 'left' ? 'justify-start' : 'justify-center'
      } ${className}`}
    >
      <ChevronUp className="h-4 w-4" strokeWidth={3} />
      <span>{children}</span>
    </div>
  )
}
