import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { api } from '../lib/api'
import manokamanaLogo from '../assets/images/manokamana-logo.png'

/**
 * Site-wide notice popup, managed from /admin → Notice.
 *
 * Shows the uploaded notice artwork over a dimmed backdrop shortly after the
 * first page load. Dismissal is remembered per browser session and keyed to
 * the notice's updatedAt stamp, so publishing a new notice shows it again to
 * everyone while re-editing the same one doesn't nag people who closed it.
 */
const SEEN_KEY = 'mhp_notice_seen'

export default function NoticePopup() {
  const [notice, setNotice] = useState(null)
  const [open, setOpen] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let timer

    api
      .getNotice()
      .then((n) => {
        if (cancelled || !n?.live) return
        if (sessionStorage.getItem(SEEN_KEY) === n.updatedAt) return
        setNotice(n)
        // Let the page paint first — an instant modal reads as an ad blocker.
        timer = setTimeout(() => setOpen(true), 700)
      })
      .catch(() => {
        // Backend unreachable — the site simply shows no notice.
      })

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  // Lock background scroll, close on Escape, and park focus on the close button.
  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, notice])

  function close() {
    setOpen(false)
    if (notice?.updatedAt) sessionStorage.setItem(SEEN_KEY, notice.updatedAt)
  }

  if (!open || !notice) return null

  const published = notice.updatedAt
    ? new Date(notice.updatedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  // As large as the viewport allows — the notice's own text has to be legible
  // without opening the image separately.
  const artwork = (
    <img
      src={notice.image}
      alt="Notice from Manokamana Hire Purchase"
      className="block max-h-[68vh] w-full object-contain sm:max-h-[74vh]"
    />
  )

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-900/70 px-3 py-5 backdrop-blur-sm animate-fade-in sm:px-6 sm:py-8"
      onClick={close}
    >
      {/* Wide enough to read the notice itself, capped so the frame still
          holds whatever shape the artwork is. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Notice from Manokamana Hire Purchase"
        onClick={(e) => e.stopPropagation()}
        className="animate-notice-pop flex max-h-full w-full max-w-5xl flex-col overflow-auto bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
      >
        {/* Masthead — one slim line saying who sent this and when. The
            artwork carries the message itself. */}
        <div className="flex items-center gap-3 border-b-2 border-brand-500 px-4 py-3 sm:gap-5 sm:px-7">
          <img
            src={manokamanaLogo}
            alt="Manokamana Hire Purchase"
            className="h-9 w-auto shrink-0 object-contain sm:h-11"
          />
          <span className="h-8 w-px shrink-0 bg-navy-900/10" />

          <p className="flex min-w-0 flex-1 items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-brand-500 sm:text-xs">
            Notice
            {/* The date would wrap this onto two lines on a phone. */}
            {published && (
              <span className="hidden items-center gap-2.5 sm:inline-flex">
                <span aria-hidden="true" className="text-navy-900/20">
                  /
                </span>
                <span className="font-medium tracking-[0.14em] text-navy-900/45">
                  {published}
                </span>
              </span>
            )}
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close notice"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900/5 text-navy-900/60 ring-1 ring-navy-900/10 transition-colors hover:bg-navy-900 hover:text-white"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Artwork */}
        <div className="bg-navy-900/[0.04] p-2 sm:p-3">
          {notice.linkUrl ? (
            <a
              href={notice.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white ring-1 ring-navy-900/5 transition-shadow hover:shadow-lg"
            >
              {artwork}
            </a>
          ) : (
            <div className="bg-white ring-1 ring-navy-900/5">{artwork}</div>
          )}
        </div>

        {/* Footer — an explicit way out, and the link if there is one. */}
        <div className="flex items-center justify-end gap-3 border-t border-navy-900/10 px-4 py-3 sm:justify-between sm:px-7 sm:py-3.5">
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-navy-900/35 sm:block">
            Manokamana Hire Purchase Pvt. Ltd.
          </p>
          <div className="flex items-center gap-2">
            {notice.linkUrl && (
              <a
                href={notice.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Read the full notice
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.5}
                />
              </a>
            )}
            <button
              type="button"
              onClick={close}
              className="rounded-full px-4 py-2 text-sm font-semibold text-navy-900/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
