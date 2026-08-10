import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { api } from '../lib/api'

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

  const artwork = (
    <img
      src={notice.image}
      alt={notice.title || 'Notice from Manokamana Hire Purchase'}
      className="block max-h-[82vh] w-auto max-w-full object-contain"
    />
  )

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-900/70 px-4 py-8 backdrop-blur-sm animate-fade-in"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={notice.title || 'Notice'}
        onClick={(e) => e.stopPropagation()}
        className="animate-notice-pop relative max-h-full overflow-auto bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close notice"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-md ring-1 ring-black/5 transition-colors hover:bg-navy-900 hover:text-white"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {notice.linkUrl ? (
          <a href={notice.linkUrl} target="_blank" rel="noopener noreferrer">
            {artwork}
          </a>
        ) : (
          artwork
        )}
      </div>
    </div>
  )
}
