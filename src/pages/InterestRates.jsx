import { useEffect, useState } from 'react'
import { ArrowUpRight, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import Eyebrow from '../components/Eyebrow'
import Seo from '../components/Seo'
import {
  FALLBACK_RATES,
  formatAdDate,
  formatBsDate,
  formatRate,
  getRates,
} from '../lib/rateStore'

/**
 * Fixed page copy — deliberately not admin-editable: it explains how the
 * figures are read rather than stating any figure. Edit it here.
 */
const FOOT_NOTES = [
  'Rates per annum',
  'Reducing balance',
  'Charges exclusive of government taxes',
]

const FINE_PRINT =
  'Your sanctioned rate is fixed in the loan agreement after appraisal and stays with that agreement for its tenure.'

/* ── Page ──────────────────────────────────────────────────────── */

export default function InterestRates() {
  // Paint the bundled list immediately, then swap in whatever the admin has
  // published. No spinner: the table is never blank.
  const [rates, setRates] = useState(FALLBACK_RATES)

  useEffect(() => {
    let alive = true
    getRates().then((r) => alive && setRates(r))
    return () => {
      alive = false
    }
  }, [])

  // Newest first, as sorted by rateStore.
  const rows = rates.baseRates

  return (
    <>
      <Seo path="/interest-rates" />

      <section className="bg-[#fdfdfb] px-4 pb-24 pt-36 sm:px-10 lg:pb-32 lg:pt-44">
        <div className="mx-auto max-w-5xl">
          {/* ── Masthead ── */}
          <div className="text-center">
            <Eyebrow className="animate-fade-up">Interest Rates</Eyebrow>
            <h1
              className="animate-fade-up mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-navy-900 sm:text-6xl"
              style={{ animationDelay: '70ms' }}
            >
              Our base rate,
              <br />
              <span className="text-brand-500">month by month.</span>
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-md text-lg leading-relaxed text-navy-900/60"
              style={{ animationDelay: '140ms' }}
            >
              Our monthly base rate, listed by the date it was published.
              The newest rate is at the top.
            </p>
          </div>

          {/* ── The table ── */}
          <div
            className="animate-fade-up mt-12 overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-[0_24px_50px_-30px_rgba(10,28,52,0.3)] lg:mt-14"
            style={{ animationDelay: '210ms' }}
          >
            {/* Fixed layout: S.N. keeps its narrow width and the other
                columns share the rest equally, so the spacing stays even
                whatever the dates say. */}
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Base rate by published date, newest first
              </caption>

              <thead>
                <tr className="bg-navy-900 text-white">
                  <th
                    scope="col"
                    className="hidden w-24 px-8 py-5 font-display text-base font-semibold sm:table-cell"
                  >
                    S.N.
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-5 font-display text-base font-semibold sm:px-8 sm:text-lg"
                  >
                    Published date<span className="hidden sm:inline"> (BS)</span>
                  </th>
                  <th
                    scope="col"
                    className="hidden px-8 py-5 text-center font-display text-lg font-semibold md:table-cell"
                  >
                    Published date (AD)
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-5 text-right font-display text-base font-semibold sm:px-8 sm:text-lg"
                  >
                    Base rate
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => {
                  const isCurrent = i === 0
                  const ad = formatAdDate(row.adDate)
                  return (
                    <tr
                      key={`${row.year}-${row.month}-${row.day}`}
                      className="border-t border-navy-900/[0.08] text-base sm:text-lg text-navy-900/80 first:border-t-0 even:bg-navy-900/[0.025]"
                    >
                      <td className="hidden px-8 py-7 text-navy-900/45 [font-variant-numeric:tabular-nums] sm:table-cell">
                        {i + 1}
                      </td>

                      <th scope="row" className="px-5 py-6 font-normal sm:px-8 sm:py-7">
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className="font-semibold text-navy-900 [font-variant-numeric:tabular-nums]">
                            {formatBsDate(row)}
                          </span>
                          {isCurrent && (
                            <span className="rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                              Current
                            </span>
                          )}
                        </span>
                        {/* Below `md` the AD column folds in under the BS date. */}
                        {ad && (
                          <span className="mt-0.5 block text-sm sm:text-base text-navy-900/50 md:hidden">
                            {ad} AD
                          </span>
                        )}
                      </th>

                      <td className="hidden px-8 py-7 text-center [font-variant-numeric:tabular-nums] md:table-cell">
                        {ad ? (
                          <time dateTime={row.adDate}>{ad}</time>
                        ) : (
                          <span className="text-navy-900/30">—</span>
                        )}
                      </td>

                      <td
                        className={`px-5 py-6 text-right font-display text-xl font-extrabold [font-variant-numeric:tabular-nums] sm:px-8 sm:py-7 sm:text-2xl ${
                          isCurrent ? 'text-brand-500' : 'text-navy-900'
                        }`}
                      >
                        {formatRate(row.rate)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* How to read the figures above */}
          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-navy-900/40">
            {FOOT_NOTES.map((note, i) => (
              <span key={note} className="flex items-center gap-x-3">
                {i > 0 && (
                  <span aria-hidden="true" className="text-brand-500">
                    •
                  </span>
                )}
                {note}
              </span>
            ))}
          </p>

          {/* ── Fine print & where to go next ── */}
          <div className="mt-8 flex flex-col gap-6 border-t-2 border-navy-900 pt-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-navy-900/55">
              {FINE_PRINT}
            </p>

            <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
              <Link
                to="/emi-calculator"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-brand-500"
              >
                <Calculator className="h-4 w-4" strokeWidth={2.2} />
                Work out your instalment
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-brand-500"
              >
                Ask an advisor about your rate
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
