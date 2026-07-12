import { useMemo, useState } from 'react'
import { ArrowUpRight, Check, Phone } from 'lucide-react'
import Eyebrow from '../components/Eyebrow'
import { Link } from 'react-router-dom'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const npr = (n) =>
  'Rs. ' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

/* ── Page ──────────────────────────────────────────────────────── */

export default function EmiCalculator() {
  const [amount, setAmount] = useState(1500000)
  const [rate, setRate] = useState(12)
  const [months, setMonths] = useState(36)

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const p = Number(amount) || 0
    const n = Number(months) || 0
    const r = (Number(rate) || 0) / 12 / 100
    if (p <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayable: 0 }
    const emi = r === 0 ? p / n : (p * r * (1 + r) ** n) / ((1 + r) ** n - 1)
    return { emi, totalInterest: emi * n - p, totalPayable: emi * n }
  }, [amount, rate, months])

  const interestPct = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const tenureLabel =
    (years > 0 ? `${years} yr` : '') +
    (years > 0 && remMonths > 0 ? ' ' : '') +
    (remMonths > 0 ? `${remMonths} mo` : years === 0 ? '0 mo' : '')

  return (
    <>
      {/* ══ Calculator ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#fdfdfb] px-6 pb-20 pt-36 sm:px-10 lg:pb-28 lg:pt-44">
        {/* Paper grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: grain }}
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="animate-fade-up">EMI Calculator</Eyebrow>
            <h1
              className="animate-fade-up mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-navy-900 sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '70ms' }}
            >
              Know your
              <br />
              monthly <span className="text-brand-500">number.</span>
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-md text-lg leading-relaxed text-navy-900/60"
              style={{ animationDelay: '140ms' }}
            >
              Drag the sliders. The receipt keeps up. When the figure feels
              right, bring it to us and we&apos;ll make it official.
            </p>
          </div>

          {/* Calculator body */}
          <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* ── Left: oversized input rows ── */}
            <div
              className="animate-fade-up self-center"
              style={{ animationDelay: '210ms' }}
            >
              <ControlRow
                index="A"
                label="Loan amount"
                display={npr(amount)}
                hint="How much do you want to borrow?"
                value={amount}
                min={50000}
                max={10000000}
                step={50000}
                onChange={setAmount}
                minLabel="Rs. 50 K"
                maxLabel="Rs. 1 Cr"
              />
              <ControlRow
                index="B"
                label="Interest rate"
                display={`${rate}%`}
                hint="Per annum, reducing balance"
                value={rate}
                min={5}
                max={25}
                step={0.25}
                onChange={setRate}
                minLabel="5%"
                maxLabel="25%"
              />
              <ControlRow
                index="C"
                label="Tenure"
                display={tenureLabel}
                hint={`${months} monthly instalments`}
                value={months}
                min={6}
                max={84}
                step={6}
                onChange={setMonths}
                minLabel="6 mo"
                maxLabel="7 yrs"
                last
              />
            </div>

            {/* ── Right: the receipt ── */}
            <div
              className="animate-fade-up lg:pl-6 lg:pt-8"
              style={{ animationDelay: '280ms' }}
            >
              <div className="mx-auto max-w-lg rotate-[1.25deg] transition-transform duration-500 hover:rotate-0 lg:sticky lg:top-32">
                <div className="bg-white px-9 pb-9 pt-10 shadow-[0_30px_60px_-20px_rgba(10,28,52,0.35)] sm:px-12">
                  {/* Receipt header */}
                  <div className="border-b-2 border-dashed border-navy-900/15 pb-5 text-center">
                    <p className="font-display text-sm font-extrabold uppercase tracking-[0.3em] text-navy-900">
                      Manokamana
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-navy-900/40">
                      Hire Purchase · Loan estimate
                    </p>
                  </div>

                  {/* Inputs echo */}
                  <dl className="space-y-2.5 border-b-2 border-dashed border-navy-900/15 py-5 font-mono text-[13px] text-navy-900/70">
                    <ReceiptLine k="Principal" v={npr(amount)} />
                    <ReceiptLine k="Interest rate" v={`${rate}% p.a.`} />
                    <ReceiptLine k="Tenure" v={`${months} months`} />
                  </dl>

                  {/* EMI */}
                  <div className="border-b-2 border-dashed border-navy-900/15 py-6 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-navy-900/40">
                      Your monthly EMI
                    </p>
                    <p className="mt-2 font-display text-5xl font-extrabold tracking-tight text-brand-500 [font-variant-numeric:tabular-nums] sm:text-[3.4rem]">
                      {npr(emi)}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-navy-900/45">
                      for {months} months
                    </p>
                  </div>

                  {/* Totals */}
                  <dl className="space-y-2.5 py-5 font-mono text-[13px] text-navy-900/70">
                    <ReceiptLine k="Total interest" v={npr(totalInterest)} />
                    <ReceiptLine
                      k="Total payable"
                      v={npr(totalPayable)}
                      strong
                    />
                  </dl>

                  {/* Split bar */}
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-navy-900/10">
                    <div
                      className="rounded-full bg-navy-700 transition-all duration-300"
                      style={{ width: `${100 - interestPct}%` }}
                    />
                    <div className="flex-1 rounded-r-full bg-brand-500 transition-all duration-300" />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[11px] text-navy-900/50">
                    <span>principal {Math.round(100 - interestPct)}%</span>
                    <span>interest {Math.round(interestPct)}%</span>
                  </div>

                  {/* Barcode */}
                  <div className="barcode mt-6 h-10 w-full text-navy-900/80" />
                  <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-navy-900/35">
                    Estimate only · final terms at approval
                  </p>
                </div>
                {/* Torn edge */}
                <div className="receipt-tear drop-shadow-[0_14px_10px_rgba(10,28,52,0.12)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA band ═════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-navy-900 px-6 py-16 sm:px-10 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
          style={{ backgroundImage: grain }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Like the number?{' '}
              <span className="text-brand-500">Make it official.</span>
            </h2>
            <p className="mt-3 max-w-lg text-white/60">
              A free, no-pressure consultation with an advisor turns this
              estimate into an approved plan — usually within one business day.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/70">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-400" strokeWidth={2.5} />
                Tailored loan options
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-400" strokeWidth={2.5} />
                No obligation
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full border border-white/50 bg-transparent py-3.5 pl-7 pr-3.5 text-base font-semibold text-white transition-colors duration-300 hover:border-brand-500 hover:bg-brand-500"
            >
              Book a free consultation
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white transition-all duration-300 group-hover:bg-white group-hover:text-brand-500 group-hover:translate-x-1">
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Link>
            <a
              href="tel:+9771800256258"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-navy-900"
            >
              <Phone className="h-4 w-4" strokeWidth={2.2} />
              Call us instead
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Helpers ───────────────────────────────────────────────────── */

function ControlRow({
  index,
  label,
  display,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
  last = false,
}) {
  const fill = ((value - min) / (max - min)) * 100
  return (
    <div
      className={`border-t border-navy-900/10 py-8 lg:py-9 ${
        last ? 'border-b' : ''
      }`}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-navy-900/40">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-navy-900/20 font-display text-[11px] font-extrabold text-navy-900/60">
              {index}
            </span>
            {label}
          </p>
          <p className="mt-3 font-display text-4xl font-extrabold tracking-tight text-navy-900 [font-variant-numeric:tabular-nums] sm:text-5xl">
            {display}
          </p>
          <p className="mt-1.5 text-sm text-navy-900/45">{hint}</p>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="emi-range mt-6 w-full"
        style={{ '--fill': `${fill}%` }}
      />
      <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-navy-900/35">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

function ReceiptLine({ k, v, strong = false }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className={strong ? 'font-bold text-navy-900' : ''}>{k}</dt>
      <span
        aria-hidden="true"
        className="mb-1 flex-1 border-b border-dotted border-navy-900/25"
      />
      <dd
        className={`whitespace-nowrap [font-variant-numeric:tabular-nums] ${
          strong ? 'font-bold text-navy-900' : ''
        }`}
      >
        {v}
      </dd>
    </div>
  )
}
