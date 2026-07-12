import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug, posts } from '../data/posts'
import { getPost } from '../lib/blogStore'

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export default function BlogPost() {
  const { slug } = useParams()
  // Built-in articles resolve instantly; API-published ones load async.
  const [post, setPost] = useState(() => getPostBySlug(slug))
  const [loading, setLoading] = useState(() => !getPostBySlug(slug))

  useEffect(() => {
    const local = getPostBySlug(slug)
    setPost(local)
    if (!local) {
      setLoading(true)
      let alive = true
      getPost(slug).then((p) => {
        if (!alive) return
        setPost(p)
        setLoading(false)
      })
      return () => {
        alive = false
      }
    }
    setLoading(false)
  }, [slug])

  // Start each article at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#fdfdfb]">
        <p className="text-sm font-semibold text-navy-900/40">Loading article…</p>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center bg-[#fdfdfb] px-6 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-500">404</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy-900">
          Article not found
        </h1>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          Back to the blog
        </Link>
      </section>
    )
  }

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <article className="relative overflow-hidden bg-[#fdfdfb]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: grain }}
      />

      {/* Header */}
      <header className="relative mx-auto max-w-3xl px-6 pt-28 sm:px-10 lg:pt-32">
        <Link
          to="/blog"
          className="animate-fade-up inline-flex items-center gap-2 text-[13px] font-semibold text-navy-900/60 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          Back to the blog
        </Link>

        <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.22em] text-navy-900/45">
          <span className="text-brand-500">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.date}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>

        <h1
          className="animate-fade-up mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-navy-900 sm:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          {post.title}
        </h1>
        <p
          className="animate-fade-up mt-6 text-lg leading-relaxed text-navy-900/65"
          style={{ animationDelay: '140ms' }}
        >
          {post.excerpt}
        </p>
      </header>

      {/* Cover */}
      <div
        className="animate-fade-up relative mx-auto mt-12 max-w-5xl px-6 sm:px-10"
        style={{ animationDelay: '200ms' }}
      >
        <img
          src={post.image}
          alt={post.title}
          className="aspect-[16/9] w-full rounded-2xl object-cover shadow-[0_24px_60px_-30px_rgba(10,28,52,0.4)]"
        />
      </div>

      {/* Body */}
      <div className="relative mx-auto max-w-3xl px-6 py-16 sm:px-10 lg:py-20">
        <div className="space-y-6">
          {post.body.map((block, i) =>
            block.type === 'h2' ? (
              <h2
                key={i}
                className="pt-4 font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl"
              >
                {block.text}
              </h2>
            ) : (
              <p key={i} className="text-lg leading-relaxed text-navy-900/70">
                {block.text}
              </p>
            ),
          )}
        </div>

        {/* Share / back */}
        <div className="mt-14 border-t border-navy-900/15 pt-8">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-brand-500 py-3.5 pl-7 pr-4 text-base font-semibold text-white transition-colors duration-300 hover:bg-brand-600"
          >
            Talk to an advisor
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="relative mx-auto max-w-6xl px-6 pb-24 sm:px-10">
          <div className="flex items-baseline justify-between gap-6 border-t border-navy-900/40 pt-6">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
              Keep reading
            </h2>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group block">
                <div className="overflow-hidden rounded-2xl shadow-[0_16px_36px_-22px_rgba(10,28,52,0.35)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_32px_60px_-26px_rgba(10,28,52,0.5)]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-500">
                  {p.category}
                </p>
                <h3 className="mt-2 font-display text-xl font-extrabold leading-snug tracking-tight text-navy-900 transition-colors duration-300 group-hover:text-brand-600 sm:text-2xl">
                  {p.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
