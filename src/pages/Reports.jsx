import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, ShieldCheck } from 'lucide-react'
import { getReports } from '../lib/reportStore'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function fmtDate(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const periodLabel = (p) => (p === 'Annual' ? 'Annual report' : `${p} · Quarterly`)

/* ── Page ──────────────────────────────────────────────────────── */

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    getReports()
      .then((data) => alive && setReports(data))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  // Group reports by fiscal year, newest year first.
  const byYear = useMemo(() => {
    const groups = new Map()
    for (const r of reports) {
      if (!groups.has(r.year)) groups.set(r.year, [])
      groups.get(r.year).push(r)
    }
    return [...groups.entries()].sort((a, b) => b[0] - a[0])
  }, [reports])

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fdfdfb] px-6 pb-24 pt-32 sm:px-10 lg:pt-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: grain }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-brand-500">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
            Transparency
          </div>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            Financial <span className="text-brand-500">reports.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-navy-900/60 sm:text-lg">
            Our audited earnings and financial performance, published quarterly
            and at year end. We believe in showing our numbers openly to the
            people who trust us with theirs.
          </p>
        </div>

        {/* Reports, grouped by year */}
        {loading ? (
          <div className="mt-14 rounded-3xl border border-dashed border-navy-900/20 bg-white/50 px-8 py-20 text-center">
            <p className="text-sm font-semibold text-navy-900/40">Loading reports…</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="mt-14 rounded-3xl border border-dashed border-navy-900/20 bg-white/50 px-8 py-20 text-center">
            <FileText className="mx-auto h-9 w-9 text-navy-900/25" strokeWidth={1.6} />
            <p className="mt-4 font-display text-lg font-bold text-navy-900">
              No reports published yet
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-navy-900/50">
              Quarterly and annual financial reports will appear here once
              published.
            </p>
          </div>
        ) : (
          <div className="mt-14 space-y-14">
            {byYear.map(([year, items]) => (
              <div key={year}>
                <div className="flex items-center gap-5">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
                    FY {year}
                  </h2>
                  <span className="h-px flex-1 bg-navy-900/15" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-navy-900/40">
                    {items.length} report{items.length > 1 ? 's' : ''}
                  </span>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {items.map((r) => (
                    <ReportCard key={r.id} report={r} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Single report card ────────────────────────────────────────── */

function ReportCard({ report }) {
  return (
    <li className="group flex items-start gap-5 rounded-2xl border border-black/5 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-22px_rgba(10,28,52,0.28)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
        <FileText className="h-5 w-5" strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-500">
          {periodLabel(report.period)}
        </p>
        <p className="mt-1 font-display text-lg font-bold leading-snug tracking-tight text-navy-900">
          {report.title}
        </p>
        {report.publishedAt && (
          <p className="mt-0.5 text-xs font-semibold text-navy-900/40">
            Published {fmtDate(report.publishedAt)}
          </p>
        )}
        {report.notes && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy-900/65">
            {report.notes}
          </p>
        )}
        {report.fileUrl && (
          <a
            href={report.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-navy-900/15 px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600"
          >
            <Download className="h-4 w-4" strokeWidth={2.2} />
            Download
          </a>
        )}
      </div>
    </li>
  )
}
