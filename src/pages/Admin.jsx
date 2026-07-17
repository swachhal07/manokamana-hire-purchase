import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Newspaper,
  Users,
  Briefcase,
  LogOut,
  Trash2,
  UploadCloud,
  Plus,
  Loader2,
  CheckCircle2,
  Star,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { api, getToken, setToken, clearToken } from '../lib/api'
import { PERIODS } from '../lib/reportStore'
import manokamanaLogo from '../assets/images/manokamana-logo.png'
import loginBackdrop from '../assets/images/zaxis-140h-ultra.webp'
import vivekImg from '../assets/images/vivek-dugar.webp'
import sarojImg from '../assets/images/saroj-bhattarai.jpeg'
import rajeshwarImg from '../assets/images/rajeshwar-neupane.webp'
import mgmt1 from '../assets/images/vitaly-gariev-0kWem6X0Mc8-unsplash.webp'
import mgmt2 from '../assets/images/vitaly-gariev-LS5dCL0NkhE-unsplash.webp'
import mgmt3 from '../assets/images/vitaly-gariev-M5k978V3qBc-unsplash.webp'
import mgmt4 from '../assets/images/photo-1628348068343-c6a848d2b6dd.webp'

// Same bundled portraits the public Leadership page falls back to, so the
// admin cards preview what the site actually shows until a photo is uploaded.
const FALLBACK_IMAGES = {
  board: [vivekImg, sarojImg, rajeshwarImg],
  management: [mgmt1, mgmt2, mgmt3, mgmt4],
}

/**
 * Hidden admin dashboard (not linked in the nav) at /admin.
 * Publish financial reports, write blog posts, and edit the BOD /
 * management roster — names, roles, bios and photos.
 */

/* ── Small shared UI ───────────────────────────────────────────── */

const inputCls =
  'w-full rounded-xl border border-navy-900/15 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-brand-500'
const labelCls = 'block text-[11px] font-bold uppercase tracking-[0.18em] text-navy-900/50'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function Button({ children, busy, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50 ${className}`}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

function Notice({ msg }) {
  if (!msg) return null
  const isError = msg.type === 'error'
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
        isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {!isError && <CheckCircle2 className="h-4 w-4" />}
      {msg.text}
    </div>
  )
}

function useNotice() {
  const [msg, setMsg] = useState(null)
  const notify = (text, type = 'ok') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 4000)
  }
  return [msg, notify]
}

/* In-app confirmation dialog — replaces the browser's native window.confirm()
   so destructive actions match the dashboard's look and feel. */
function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/40 px-6 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-7 shadow-[0_24px_60px_-20px_rgba(10,28,52,0.4)]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-xl font-extrabold tracking-tight text-navy-900">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-navy-900/60">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy-900/70 transition-colors hover:bg-navy-900/5"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Promise-based confirm: `await confirm(...)` resolves true/false when the user
   picks an option. Returns the dialog element to drop into the component tree. */
function useConfirm() {
  const [state, setState] = useState(null)

  const confirm = ({ title = 'Are you sure?', message, confirmLabel = 'Delete' }) =>
    new Promise((resolve) => {
      setState({ title, message, confirmLabel, resolve })
    })

  const settle = (result) => {
    setState((s) => {
      s?.resolve(result)
      return null
    })
  }

  const dialog = state ? (
    <ConfirmDialog
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  ) : null

  return [dialog, confirm]
}

/* ── Login ─────────────────────────────────────────────────────── */

function Login({ onDone }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [capsOn, setCapsOn] = useState(false)

  const checkCaps = (e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token } = await api.login(password)
      setToken(token)
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const areas = [
    { icon: FileText, label: 'Financial reports', blurb: 'Quarterly and annual disclosures' },
    { icon: Newspaper, label: 'Blog posts', blurb: 'News, guides and notices' },
    { icon: Users, label: 'Team roster', blurb: 'Board and management profiles' },
    { icon: Briefcase, label: 'Job openings', blurb: 'Careers page listings' },
  ]

  return (
    <section className="relative min-h-dvh lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Red seal seam with traveling sheen, across the whole viewport */}
      <div
        className="animate-seam absolute inset-x-0 top-0 z-20 h-1"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #a10f13, #e11b22 45%, #ff6b6f 50%, #e11b22 55%, #a10f13)',
          backgroundSize: '220% 100%',
        }}
      />

      {/* ── Brand panel (desktop) ────────────────────────────────── */}
      <aside className="relative hidden overflow-hidden bg-navy-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Machinery backdrop, duotoned into the navy */}
        <img
          src={loginBackdrop}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.16] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-navy-900/30" />
        {/* Faint blueprint grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        {/* Top: brand */}
        <div className="animate-fade-up relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-lg">
              <img src={manokamanaLogo} alt="Manokamana Hire Purchase" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-display text-base font-extrabold leading-tight text-white">
                Manokamana
              </span>
              <span className="block text-[11px] font-semibold text-white/50">
                Hire Purchase Pvt. Ltd.
              </span>
            </span>
          </div>
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to the website
          </Link>
        </div>

        {/* Bottom: what this console does */}
        <div className="relative z-10">
          <p
            className="animate-fade-up text-[11px] font-bold uppercase tracking-[0.24em] text-brand-400"
            style={{ animationDelay: '120ms' }}
          >
            Admin console
          </p>
          <h2
            className="animate-fade-up mt-3 max-w-md font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white"
            style={{ animationDelay: '180ms', textWrap: 'balance' }}
          >
            Everything the site publishes, managed from one desk.
          </h2>

          <ul className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-5">
            {areas.map(({ icon: Icon, label, blurb }, i) => (
              <li
                key={label}
                className="animate-fade-up flex items-start gap-3"
                style={{ animationDelay: `${260 + i * 70}ms` }}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] ring-1 ring-white/10">
                  <Icon className="h-4 w-4 text-brand-400" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">{label}</span>
                  <span className="block text-xs leading-snug text-white/45">{blurb}</span>
                </span>
              </li>
            ))}
          </ul>

          <p
            className="animate-fade-up mt-12 flex items-center gap-2 border-t border-white/10 pt-6 text-[11px] font-medium text-white/35"
            style={{ animationDelay: '560ms' }}
          >
            <Lock className="h-3 w-3" />
            Authorized personnel only · Encrypted session
          </p>
        </div>
      </aside>

      {/* ── Sign-in form: "access pass" ticket ───────────────────── */}
      <main className="relative flex min-h-dvh items-center justify-center bg-[#fdfdfb] px-6 py-16">
        {/* Faint dot texture so the column isn't dead flat */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(10,28,52,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative w-full max-w-[400px]">
          {/* Mobile-only brand row (the aside carries it on desktop) */}
          <div className="animate-fade-up mb-8 flex items-center justify-between lg:hidden">
            <img src={manokamanaLogo} alt="Manokamana Hire Purchase" className="h-10 w-auto object-contain" />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900/50 transition-colors hover:text-navy-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to the website
            </Link>
          </div>

          <form
            onSubmit={submit}
            className="animate-fade-up relative rounded-[22px] bg-white shadow-[0_36px_80px_-40px_rgba(10,28,52,0.4)] ring-1 ring-navy-900/10"
            style={{ animationDelay: '80ms' }}
          >
            {/* Pass header */}
            <div className="flex items-center justify-between px-7 pb-5 pt-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-navy-900/55">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                Access pass
              </span>
              <span className="rounded-md bg-navy-900 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                Admin
              </span>
            </div>

            {/* Perforation */}
            <div aria-hidden className="relative">
              <div className="mx-6 border-t-2 border-dashed border-navy-900/10" />
              <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#fdfdfb]" />
              <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#fdfdfb]" />
            </div>

            {/* Pass body */}
            <div className="px-7 py-7">
              <h1 className="font-display text-[34px] font-extrabold leading-none tracking-tight text-navy-900">
                Sign in<span className="text-brand-500">.</span>
              </h1>
              <p className="mt-2.5 text-sm leading-relaxed text-navy-900/55">
                Enter the admin password to manage reports, posts and the team roster.
              </p>

              {/* Password field */}
              <div className="mt-6">
                <span className={labelCls}>Password</span>
                <div className="group relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35 transition-colors group-focus-within:text-navy-900/70" />
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={checkCaps}
                    onKeyUp={checkCaps}
                    onBlur={() => setCapsOn(false)}
                    className="w-full rounded-xl border border-navy-900/15 bg-navy-900/[0.02] py-3.5 pl-10 pr-11 text-sm text-navy-900 outline-none transition-colors placeholder:text-navy-900/30 focus:border-navy-900/40 focus:bg-white focus:ring-4 focus:ring-navy-900/5"
                    placeholder="••••••••••"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    tabIndex={-1}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-navy-900/40 transition-colors hover:bg-navy-900/5 hover:text-navy-900/70"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {capsOn && !error && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-navy-900/60">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Caps Lock is on
                </p>
              )}
              {error && (
                <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(225,27,34,0.7)] transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-[0_20px_40px_-14px_rgba(225,27,34,0.75)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>

            {/* Perforation */}
            <div aria-hidden className="relative">
              <div className="mx-6 border-t-2 border-dashed border-navy-900/10" />
              <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#fdfdfb]" />
              <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#fdfdfb]" />
            </div>

            {/* Ticket stub */}
            <div className="flex items-center justify-between gap-4 px-7 pb-6 pt-5">
              <div aria-hidden className="barcode h-7 w-32 text-navy-900/70" />
              <div className="text-right">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-navy-900/55">
                  MHP · Admin console
                </p>
                <p className="mt-0.5 text-[10px] text-navy-900/40">Kamaladi, Kathmandu</p>
              </div>
            </div>
          </form>

          {/* Under the pass */}
          <div className="animate-fade-up mt-6 space-y-1.5 text-center" style={{ animationDelay: '300ms' }}>
            <p className="flex items-center justify-center gap-2 text-[11px] font-medium text-navy-900/40">
              <Lock className="h-3 w-3" />
              Authorized personnel only · Encrypted session
            </p>
            <p className="text-xs text-navy-900/45">
              Forgot the password? Ask the site maintainer to reset it.
            </p>
          </div>
        </div>
      </main>
    </section>
  )
}

/* ── Reports panel ─────────────────────────────────────────────── */

const emptyReport = {
  title: '',
  year: new Date().getFullYear(),
  period: 'Annual',
  notes: '',
  publishedAt: new Date().toISOString().slice(0, 10),
}

function ReportsPanel({ onAuthFail }) {
  const [reports, setReports] = useState([])
  const [form, setForm] = useState(emptyReport)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, notify] = useNotice()
  const [confirmDialog, confirm] = useConfirm()

  const refresh = () => api.getReports().then(setReports).catch(() => {})
  useEffect(() => {
    refresh()
  }, [])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (file) fd.append('file', file)
      await api.createReport(fd)
      setForm(emptyReport)
      setFile(null)
      e.target.reset()
      notify('Report published')
      refresh()
    } catch (err) {
      if (/log in/i.test(err.message)) return onAuthFail()
      notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id) {
    const ok = await confirm({
      title: 'Delete this report?',
      message: 'This financial report will be removed from the site. This cannot be undone.',
    })
    if (!ok) return
    try {
      await api.deleteReport(id)
      notify('Report deleted')
      refresh()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
      {confirmDialog}
      {/* Publish form */}
      <form
        onSubmit={submit}
        className="h-fit space-y-4 rounded-3xl border border-black/5 bg-white p-6"
      >
        <h2 className="font-display text-lg font-extrabold text-navy-900">Publish a report</h2>
        <Field label="Title">
          <input value={form.title} onChange={set('title')} className={inputCls} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fiscal year">
            <input type="number" value={form.year} onChange={set('year')} className={inputCls} required />
          </Field>
          <Field label="Period">
            <select value={form.period} onChange={set('period')} className={inputCls}>
              {PERIODS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Published on">
          <input type="date" value={form.publishedAt} onChange={set('publishedAt')} className={inputCls} />
        </Field>
        <Field label="Notes (optional)">
          <textarea value={form.notes} onChange={set('notes')} rows={3} className={inputCls} />
        </Field>
        <Field label="PDF file">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="text-sm text-navy-900/70 file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
          />
        </Field>
        <Notice msg={msg} />
        <Button type="submit" busy={busy}>
          <UploadCloud className="h-4 w-4" /> Publish
        </Button>
      </form>

      {/* Existing */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-extrabold text-navy-900">
          Published ({reports.length})
        </h2>
        {reports.length === 0 && (
          <p className="text-sm text-navy-900/50">Nothing published yet.</p>
        )}
        {reports.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-5 py-4"
          >
            <FileText className="h-5 w-5 shrink-0 text-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy-900">{r.title}</p>
              <p className="text-xs text-navy-900/50">
                FY {r.year} · {r.period} · {r.publishedAt}
                {r.fileUrl ? ' · PDF attached' : ' · no file'}
              </p>
            </div>
            <button
              onClick={() => remove(r.id)}
              className="rounded-full p-2 text-navy-900/40 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Blog panel ────────────────────────────────────────────────── */

const emptyPost = { title: '', category: 'Guides', date: '', excerpt: '', content: '', featured: false }

/**
 * The body editor is plain text: blank lines split paragraphs and lines
 * starting with "## " become section headings.
 */
function contentToBlocks(content) {
  return content
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) =>
      chunk.startsWith('## ')
        ? { type: 'h2', text: chunk.slice(3).trim() }
        : { type: 'p', text: chunk.replace(/\n/g, ' ') },
    )
}

function BlogPanel({ onAuthFail }) {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(emptyPost)
  const [image, setImage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, notify] = useNotice()
  const [confirmDialog, confirm] = useConfirm()

  const refresh = () => api.getPosts().then(setPosts).catch(() => {})
  useEffect(() => {
    refresh()
  }, [])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const blocks = contentToBlocks(form.content)
      if (blocks.length === 0) throw new Error('Write some article content first')
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('category', form.category)
      fd.append('date', form.date)
      fd.append('excerpt', form.excerpt)
      fd.append('body', JSON.stringify(blocks))
      fd.append('featured', String(form.featured))
      if (image) fd.append('image', image)
      await api.createPost(fd)
      setForm(emptyPost)
      setImage(null)
      e.target.reset()
      notify('Post published')
      refresh()
    } catch (err) {
      if (/log in/i.test(err.message)) return onAuthFail()
      notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function remove(slug) {
    const ok = await confirm({
      title: 'Delete this post?',
      message: 'This blog post will be removed from the site. This cannot be undone.',
    })
    if (!ok) return
    try {
      await api.deletePost(slug)
      notify('Post deleted')
      refresh()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,480px)_1fr]">
      {confirmDialog}
      {/* Write form */}
      <form onSubmit={submit} className="h-fit space-y-4 rounded-3xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-lg font-extrabold text-navy-900">Write a post</h2>
        <Field label="Title">
          <input value={form.title} onChange={set('title')} className={inputCls} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <input value={form.category} onChange={set('category')} className={inputCls} />
          </Field>
          <Field label="Display date (e.g. Asar 26, 2083)">
            <input value={form.date} onChange={set('date')} className={inputCls} placeholder="Optional" />
          </Field>
        </div>
        <Field label="Excerpt (shown on the blog page)">
          <textarea value={form.excerpt} onChange={set('excerpt')} rows={2} className={inputCls} required />
        </Field>
        <Field label="Article — blank line = new paragraph, start a line with '## ' for a heading">
          <textarea
            value={form.content}
            onChange={set('content')}
            rows={10}
            className={`${inputCls} font-mono text-[13px]`}
            placeholder={'Intro paragraph…\n\n## First heading\n\nMore text…'}
            required
          />
        </Field>
        <Field label="Cover image">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
            className="text-sm text-navy-900/70 file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} />
          Make this the featured story
        </label>
        <Notice msg={msg} />
        <Button type="submit" busy={busy}>
          <UploadCloud className="h-4 w-4" /> Publish post
        </Button>
      </form>

      {/* Existing */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-extrabold text-navy-900">
          Published ({posts.length})
        </h2>
        {posts.length === 0 && (
          <p className="text-sm text-navy-900/50">
            No posts published from the dashboard yet. The starter articles bundled with the
            site stay visible either way.
          </p>
        )}
        {posts.map((p) => (
          <div key={p.slug} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-5 py-4">
            {p.image ? (
              <img src={p.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
            ) : (
              <Newspaper className="h-5 w-5 shrink-0 text-brand-500" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy-900">
                {p.featured && <Star className="mr-1 inline h-3.5 w-3.5 text-brand-500" />}
                {p.title}
              </p>
              <p className="text-xs text-navy-900/50">
                {p.category} · {p.date} · /blog/{p.slug}
              </p>
            </div>
            <button
              onClick={() => remove(p.slug)}
              className="rounded-full p-2 text-navy-900/40 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Team panel ────────────────────────────────────────────────── */

function MemberCard({ section, index, member, fallback, onSaved, onAuthFail, onRemoved }) {
  const [form, setForm] = useState({ name: member.name, role: member.role, bio: member.bio || '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, notify] = useNotice()
  const [confirmDialog, confirm] = useConfirm()

  useEffect(() => {
    setForm({ name: member.name, role: member.role, bio: member.bio || '' })
    setImage(null)
    setPreview('')
  }, [member])

  function pickImage(e) {
    const f = e.target.files[0] || null
    setImage(f)
    setPreview(f ? URL.createObjectURL(f) : '')
  }

  async function save() {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('role', form.role)
      fd.append('bio', form.bio)
      if (image) fd.append('image', image)
      await api.updateTeamMember(section, index, fd)
      notify('Saved')
      onSaved()
    } catch (err) {
      if (/log in/i.test(err.message)) return onAuthFail()
      notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    const ok = await confirm({
      title: `Remove ${member.name}?`,
      message: 'This profile will be removed from the Leadership page. This cannot be undone.',
      confirmLabel: 'Remove',
    })
    if (!ok) return
    try {
      await api.deleteTeamMember(section, index)
      onRemoved()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const shownImage = preview || member.image || fallback

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5">
      {confirmDialog}
      <div className="flex items-start gap-4">
        <label className="group relative block h-24 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-navy-900/5">
          {shownImage ? (
            <img src={shownImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[10px] font-bold uppercase tracking-wider text-navy-900/40">
              No photo
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-navy-900/60 opacity-0 transition-opacity group-hover:opacity-100">
            <UploadCloud className="h-5 w-5 text-white" />
          </span>
          <input type="file" accept="image/*" onChange={pickImage} className="hidden" />
        </label>

        <div className="min-w-0 flex-1 space-y-2.5">
          <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Full name" />
          <input value={form.role} onChange={set('role')} className={inputCls} placeholder="Role / title" />
          <input value={form.bio} onChange={set('bio')} className={inputCls} placeholder="Short bio (optional)" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Notice msg={msg} />
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={remove}
            className="rounded-full p-2 text-navy-900/40 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Remove member"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <Button onClick={save} busy={busy} className="!px-5 !py-2">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

function AddMemberModal({ section, onClose, onAdded, onAuthFail }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const label = section === 'board' ? 'board member' : 'team member'

  async function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('name', name.trim())
      fd.append('role', section === 'board' ? 'Director' : 'Role')
      await api.addTeamMember(section, fd)
      onAdded()
      onClose()
    } catch (err) {
      if (/log in/i.test(err.message)) return onAuthFail()
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-7 shadow-[0_24px_60px_-20px_rgba(10,28,52,0.4)]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Plus className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-xl font-extrabold tracking-tight text-navy-900">
          Add a {label}
        </h2>
        <p className="mt-1.5 text-sm text-navy-900/60">
          Enter their name — you can set the role, bio and photo right after.
        </p>
        <div className="mt-5">
          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="e.g. Ram Bahadur"
              autoFocus
            />
          </Field>
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-navy-900/15 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900/5"
          >
            Cancel
          </button>
          <Button type="submit" busy={busy} disabled={!name.trim()} className="flex-1">
            Add member
          </Button>
        </div>
      </form>
    </div>
  )
}

function TeamPanel({ onAuthFail }) {
  const [team, setTeam] = useState(null)
  const [addingSection, setAddingSection] = useState(null)
  const [msg, notify] = useNotice()

  const refresh = () => api.getTeam().then(setTeam).catch(() => {})
  useEffect(() => {
    refresh()
  }, [])

  if (!team) return <p className="text-sm text-navy-900/50">Loading team…</p>

  const Section = ({ title, section }) => (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold text-navy-900">{title}</h2>
        <button
          onClick={() => setAddingSection(section)}
          className="inline-flex items-center gap-1.5 rounded-full border border-navy-900/15 px-4 py-1.5 text-xs font-semibold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {(team[section] || []).map((m, i) => (
          <MemberCard
            key={`${section}-${i}-${m.name}`}
            section={section}
            index={i}
            member={m}
            fallback={FALLBACK_IMAGES[section]?.[i % FALLBACK_IMAGES[section].length]}
            onSaved={refresh}
            onRemoved={refresh}
            onAuthFail={onAuthFail}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-10">
      <Notice msg={msg} />
      <Section title="Board of Directors" section="board" />
      <Section title="Management team" section="management" />
      <p className="text-xs text-navy-900/45">
        Changes appear on the Leadership page immediately. Members without an uploaded photo
        fall back to the site&apos;s built-in placeholder images.
      </p>

      {addingSection && (
        <AddMemberModal
          section={addingSection}
          onClose={() => setAddingSection(null)}
          onAdded={refresh}
          onAuthFail={onAuthFail}
        />
      )}
    </div>
  )
}

/* ── Careers panel ─────────────────────────────────────────────── */

const emptyOpening = { title: '', dept: '', location: 'Kamaladi, Kathmandu', type: 'Full-time', desc: '' }

function CareersPanel({ onAuthFail }) {
  const [openings, setOpenings] = useState([])
  const [form, setForm] = useState(emptyOpening)
  const [busy, setBusy] = useState(false)
  const [msg, notify] = useNotice()
  const [confirmDialog, confirm] = useConfirm()

  const refresh = () => api.getOpenings().then(setOpenings).catch(() => {})
  useEffect(() => {
    refresh()
  }, [])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await api.createOpening(form)
      setForm(emptyOpening)
      notify('Opening published')
      refresh()
    } catch (err) {
      if (/log in/i.test(err.message)) return onAuthFail()
      notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id) {
    const ok = await confirm({
      title: 'Delete this opening?',
      message: 'This job opening will be removed from the Careers page. This cannot be undone.',
    })
    if (!ok) return
    try {
      await api.deleteOpening(id)
      notify('Opening deleted')
      refresh()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
      {confirmDialog}
      {/* Publish form */}
      <form onSubmit={submit} className="h-fit space-y-4 rounded-3xl border border-black/5 bg-white p-6">
        <h2 className="font-display text-lg font-extrabold text-navy-900">Post an opening</h2>
        <Field label="Job title">
          <input value={form.title} onChange={set('title')} className={inputCls} required />
        </Field>
        <Field label="Department (optional)">
          <input value={form.dept} onChange={set('dept')} className={inputCls} placeholder="e.g. Credit & Risk" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Location">
            <input value={form.location} onChange={set('location')} className={inputCls} />
          </Field>
          <Field label="Type">
            <input value={form.type} onChange={set('type')} className={inputCls} placeholder="Full-time" />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.desc} onChange={set('desc')} rows={4} className={inputCls} required />
        </Field>
        <Notice msg={msg} />
        <Button type="submit" busy={busy}>
          <UploadCloud className="h-4 w-4" /> Publish opening
        </Button>
      </form>

      {/* Existing */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-extrabold text-navy-900">
          Published ({openings.length})
        </h2>
        {openings.length === 0 && (
          <p className="text-sm text-navy-900/50">
            No openings posted yet. Until you publish one, the Careers page shows its
            &ldquo;No open positions right now&rdquo; message.
          </p>
        )}
        {openings.map((o) => (
          <div key={o.id} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-5 py-4">
            <Briefcase className="h-5 w-5 shrink-0 text-brand-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-navy-900">{o.title}</p>
              <p className="text-xs text-navy-900/50">
                {[o.dept, o.location, o.type].filter(Boolean).join(' · ')}
              </p>
            </div>
            <button
              onClick={() => remove(o.id)}
              className="rounded-full p-2 text-navy-900/40 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Shell ─────────────────────────────────────────────────────── */

const NAV = [
  { id: 'reports', label: 'Reports', icon: FileText, blurb: 'Publish financial disclosures' },
  { id: 'blog', label: 'Blog', icon: Newspaper, blurb: 'Write and manage articles' },
  { id: 'team', label: 'Team', icon: Users, blurb: 'Board & management roster' },
  { id: 'careers', label: 'Careers', icon: Briefcase, blurb: 'Post & manage job openings' },
]

export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(getToken()))
  const [tab, setTab] = useState('reports')
  const [confirmOut, setConfirmOut] = useState(false)

  // Silent — used when a request fails auth (expired token).
  function clearAuth() {
    clearToken()
    setAuthed(false)
  }

  // Explicit sign-out — confirmed via the in-app modal below.
  function logout() {
    setConfirmOut(false)
    clearAuth()
  }

  if (!authed) return <Login onDone={() => setAuthed(true)} />

  const active = NAV.find((n) => n.id === tab)

  return (
    <div className="min-h-screen bg-[#f4f5f7] lg:grid lg:grid-cols-[260px_1fr]">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="flex flex-col border-r border-white/5 bg-navy-900 lg:sticky lg:top-0 lg:h-screen">
        <div className="px-6 py-6">
          <p className="font-display text-lg font-extrabold leading-tight tracking-tight text-white">
            Manokamana
          </p>
          <p className="text-[11px] font-semibold text-white/50">Hire Purchase Pvt. Ltd.</p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
            Admin panel
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map(({ id, label, icon: Icon, blurb }) => {
            const isActive = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-brand-400' : ''}`} />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block truncate text-[11px] text-white/35">{blurb}</span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          <button
            onClick={() => setConfirmOut(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/55 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────── */}
      <div className="flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/5 bg-white/80 px-6 py-4 backdrop-blur sm:px-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-500">
              {active?.label}
            </p>
            <h1 className="mt-0.5 font-display text-xl font-extrabold tracking-tight text-navy-900">
              {active?.blurb}
            </h1>
          </div>
          <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
          </span>
        </header>

        {/* Active panel */}
        <main className="flex-1 px-6 py-8 sm:px-10">
          {tab === 'reports' && <ReportsPanel onAuthFail={clearAuth} />}
          {tab === 'blog' && <BlogPanel onAuthFail={clearAuth} />}
          {tab === 'team' && <TeamPanel onAuthFail={clearAuth} />}
          {tab === 'careers' && <CareersPanel onAuthFail={clearAuth} />}
        </main>
      </div>

      {/* ── Sign-out confirmation modal ─────────────────────────── */}
      {confirmOut && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 px-6 backdrop-blur-sm"
          onClick={() => setConfirmOut(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-7 shadow-[0_24px_60px_-20px_rgba(10,28,52,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <LogOut className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold tracking-tight text-navy-900">
              Sign out?
            </h2>
            <p className="mt-1.5 text-sm text-navy-900/60">
              You&apos;ll need to enter the admin password again to get back in.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmOut(false)}
                className="flex-1 rounded-full border border-navy-900/15 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900/5"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
