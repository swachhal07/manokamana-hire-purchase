import { ShieldCheck } from 'lucide-react'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * Shared reading layout for the site's legal pages (Privacy Policy, Terms &
 * Conditions). Renders a title block plus a list of `sections`, each with a
 * `heading` and `body` — where every body entry is either a paragraph string
 * or an array of strings rendered as a bulleted list.
 */
export default function LegalLayout({ eyebrow, title, intro, lastUpdated, sections }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fdfdfb] px-6 pb-24 pt-32 sm:px-10 lg:pt-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: grain }}
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-500">
          <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
          {eyebrow}
        </div>
        <h1 className="mt-5 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 text-base leading-relaxed text-navy-900/60 sm:text-lg">
            {intro}
          </p>
        )}
        {lastUpdated && (
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-navy-900/40">
            Last updated {lastUpdated}
          </p>
        )}

        {/* Sections */}
        <div className="mt-14 space-y-12">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.body.map((block, i) =>
                  Array.isArray(block) ? (
                    <ul key={i} className="space-y-2.5">
                      {block.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-base leading-relaxed text-navy-900/70"
                        >
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i} className="text-base leading-relaxed text-navy-900/70">
                      {block}
                    </p>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
