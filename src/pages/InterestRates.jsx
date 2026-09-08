import { useEffect, useState } from 'react'
import { ArrowUpRight, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import Eyebrow from '../components/Eyebrow'
import Seo from '../components/Seo'
import { FALLBACK_RATES, getRates } from '../lib/rateStore'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Trim trailing zeros so 2.00 prints as 2 but 9.99 stays 9.99. */
const pct = (n) => String(Number(n) || 0)

/**
 * Fixed page copy — deliberately not admin-editable: it explains how the
 * figures are read rather than stating any figure, so it doesn't change when
 * the board revises the schedule. Edit it here.
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
  // Paint the bundled schedule immediately, then swap in whatever the admin
  // has published. No spinner: the sheet is never blank.
  const [rates, setRates] = useState(FALLBACK_RATES)

  useEffect(() => {
    let alive = true
    getRates().then((r) => alive && setRates(r))
    return () => {
      alive = false
    }
  }, [])

  const { publishRate, maxPremium, effectiveFrom, effectiveFromBs, schedule } =
    rates
  const maxRate = pct(Number(publishRate) + Number(maxPremium))
  const dateline = effectiveFromBs || effectiveFrom

  return (
    <>
      <Seo path="/interest-rates" />

      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 pb-24 pt-36 sm:px-10 lg:pb-32 lg:pt-44">
        {/* Paper grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-4xl">
          {/* ── Masthead ── */}
          <div className="text-center">
            <Eyebrow className="animate-fade-up">Interest Rates</Eyebrow>
            <h1
              className="animate-fade-up mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-navy-900 sm:text-6xl"
              style={{ animationDelay: '70ms' }}
            >
              Rates and charges,
              <br />
              <span className="text-brand-500">printed plainly.</span>
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-lg text-lg leading-relaxed text-navy-900/60"
              style={{ animationDelay: '140ms' }}
            >
              Our published rate is {pct(publishRate)}% per annum. Interest is
              never charged above {maxRate}% — the publish rate plus a maximum{' '}
              {pct(maxPremium)}% premium.
            </p>
          </div>

          {/* ── The schedule ─────────────────────────────────────
              A rate sheet, not a spreadsheet: the two interest rows carry
              display-scale figures, the three charge rows sit below a heavy
              rule in compact mono, and dotted leaders close the gap between
              a particular and its value. `tier` in src/data/rates.js drives
              the split; the published order and wording are untouched. */}
          <div
            className="animate-fade-up mt-12 lg:mt-14"
            style={{ animationDelay: '210ms' }}
          >
            <div className="bg-white pb-2 shadow-[0_36px_70px_-32px_rgba(10,28,52,0.4)]">
              {/* Dateline — a reader's first question of any rate sheet is
                  "is this current?", so it rides on the sheet itself and
                  travels with it wherever the table is printed or shared.
                  Set on the paper rather than in a coloured band: a third
                  bar of chrome above the red header fought the masthead,
                  where a printed date line reads as the document's own
                  issue date. Centred on one baseline: red mono label, BS
                  date at display scale, AD date trailing it.
                  Hidden entirely when no effective date has been published. */}
              {dateline && (
                <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 px-5 pb-4 pt-5 text-center">
                  <p className="flex items-baseline gap-3">
                    <span className="whitespace-nowrap font-mono text-[12px] font-bold uppercase tracking-[0.24em] text-brand-500 sm:text-[13px]">
                      Effective from
                    </span>
                    <span className="flex items-baseline gap-2">
                      <span className="font-display text-xl font-extrabold leading-none tracking-tight text-navy-900 sm:text-2xl">
                        {dateline}
                      </span>
                      {/* Only meaningful once both calendars are shown —
                          without the AD date beside it there is nothing to
                          tell it apart from. */}
                      {effectiveFrom && effectiveFromBs && (
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900/40">
                          BS
                        </span>
                      )}
                    </span>
                  </p>
                  {effectiveFrom && effectiveFromBs && (
                    <p className="flex items-baseline gap-4">
                      {/* Hairline rule between the two calendars — they are
                          the same date in two systems, so they carry equal
                          size and colour and the divider does all of the
                          separating. Self-centre keeps it on the cap
                          height. */}
                      <span
                        aria-hidden="true"
                        className="h-6 w-px shrink-0 self-center bg-navy-900/20 sm:h-7"
                      />
                      <span className="flex items-baseline gap-2">
                        <time
                          dateTime={effectiveFrom}
                          className="font-display text-xl font-extrabold leading-none tracking-tight text-navy-900 [font-variant-numeric:tabular-nums] sm:text-2xl"
                        >
                          {new Date(effectiveFrom).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900/40">
                          AD
                        </span>
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* The column header collapses away below `sm`, so the sheet
                  keeps its red masthead there in a single line. */}
              <p
                aria-hidden="true"
                className="bg-brand-500 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white sm:hidden"
              >
                Rates &amp; charges
              </p>

              {/* One table, two layouts: real table columns from `sm` up,
                  stacked blocks below it, so narrow screens never need a
                  sideways scroll to reach the figure. */}
              <table className="block w-full border-collapse sm:table">
                <caption className="sr-only">
                  Published interest rate and charges schedule
                  {dateline ? `, effective from ${dateline}` : ''}
                </caption>

                <thead className="hidden sm:table-header-group">
                  <tr className="bg-brand-500 text-white">
                    <th
                      scope="col"
                      className="w-16 py-3.5 pl-5 pr-2 text-left font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/70"
                    >
                      S.No.
                    </th>
                    <th
                      scope="col"
                      className="w-full py-3.5 pr-4 text-left font-mono text-[10px] font-bold uppercase tracking-[0.22em]"
                    >
                      Particulars
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-6 text-right font-mono text-[10px] font-bold uppercase tracking-[0.22em]"
                    >
                      Rates / Charges
                    </th>
                  </tr>
                </thead>

                <tbody className="block sm:table-row-group">
                  {schedule.map((row, i) => {
                    const isRate = row.tier === 'rate'
                    // The first charge row opens a new block in the sheet.
                    const opensCharges =
                      !isRate && schedule[i - 1]?.tier === 'rate'
                    const num = String(i + 1).padStart(2, '0')

                    return (
                      <tr
                        key={row.particular}
                        className={`group block px-5 py-5 sm:table-row sm:px-0 ${
                          opensCharges
                            ? 'border-t-2 border-navy-900'
                            : 'border-t border-navy-900/10'
                        } ${isRate ? 'sm:[&>*]:py-7' : ''}`}
                      >
                        {/* The pseudo-element rule spans the row height, so
                            hovering marks the line the way a finger would
                            without tinting the paper. */}
                        <td className="relative hidden py-5 pl-5 pr-2 align-baseline font-mono text-xs text-navy-900/35 transition-colors duration-200 [font-variant-numeric:tabular-nums] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:origin-top before:scale-y-0 before:bg-brand-500 before:transition-transform before:duration-300 before:ease-out group-hover:text-navy-900/70 group-hover:before:scale-y-100 sm:table-cell">
                          {num}
                        </td>

                        <th
                          scope="row"
                          className="block text-left align-baseline font-normal sm:table-cell sm:py-5 sm:pr-4"
                        >
                          <span className="flex items-baseline gap-3">
                            <span
                              className="font-mono text-xs text-navy-900/35 [font-variant-numeric:tabular-nums] sm:hidden"
                              aria-hidden="true"
                            >
                              {num}
                            </span>
                            <span
                              className={`font-display font-extrabold tracking-tight text-navy-900 ${
                                isRate
                                  ? 'text-lg sm:text-xl'
                                  : 'text-[15px] sm:text-base'
                              }`}
                            >
                              {row.particular}
                            </span>
                            <span
                              aria-hidden="true"
                              className="hidden min-w-6 flex-1 self-center border-b border-dotted border-navy-900/25 transition-colors duration-300 group-hover:border-brand-500 sm:block"
                            />
                          </span>
                        </th>

                        <td className="block pl-7 pt-1.5 align-baseline sm:table-cell sm:whitespace-nowrap sm:py-5 sm:pl-4 sm:pr-6 sm:pt-0 sm:text-right">
                          <span
                            className={
                              isRate
                                ? 'font-display text-2xl font-extrabold tracking-tight text-brand-500 [font-variant-numeric:tabular-nums] sm:text-3xl'
                                : 'font-mono text-[13px] font-bold text-navy-900 [font-variant-numeric:tabular-nums] sm:text-sm'
                            }
                          >
                            {row.value}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Sheet foot: how to read the figures above */}
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
          </div>

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
