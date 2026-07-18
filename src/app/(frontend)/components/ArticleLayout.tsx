import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  UserRound,
  Clock,
  Tag,
  FolderOpen,
  Twitter,
  Linkedin,
  Facebook,
  Share2,
} from 'lucide-react'
import RichText from './ui/RichText'

interface ArticleLayoutProps {
  title: string
  category?: string | null
  date?: string | null
  author?: string | null
  readTime?: string | null
  imageUrl?: string | null
  imageAlt?: string
  excerpt?: string | null
  content?: unknown
  tags?: { tag?: string | null; id?: string | null }[] | null
  backHref: string
  backLabel: string
  shareUrl?: string | null
}

export default function ArticleLayout({
  title,
  category,
  date,
  author,
  readTime,
  imageUrl,
  imageAlt,
  excerpt,
  content,
  tags,
  backHref,
  backLabel,
  shareUrl,
}: ArticleLayoutProps) {
  const validTags = (tags || []).filter((t) => t?.tag)
  const hasAuthor = Boolean(author && author.trim())
  const authorInitial = (author || '').trim().charAt(0).toUpperCase()

  const u = encodeURIComponent(shareUrl || '')
  const t = encodeURIComponent(title)
  const shareLinks = shareUrl
    ? [
        { icon: Twitter, label: 'Share on X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
        { icon: Linkedin, label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
        { icon: Facebook, label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
      ]
    : []

  return (
    <article className="bg-white">
      {/* ── Cinematic full-bleed hero ── */}
      <header className="relative flex min-h-[68vh] items-end overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={imageAlt || title} fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1d4ed8] to-[#2563eb]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />

        <div className="relative z-10 w-full">
          <div className="mx-auto max-w-[1360px] px-6 pb-24 pt-32 md:pt-44 lg:px-10">
            <Link
              href={backHref}
              className="mb-7 flex w-fit items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              {backLabel}
            </Link>

            {category && (
              <span className="inline-block rounded-full bg-[#2563eb] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                {category}
              </span>
            )}

            <h1 className="mt-5 max-w-5xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-[3.6rem]">
              {title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
              {date && (
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {date}
                </span>
              )}
              {author && (
                <span className="flex items-center gap-2">
                  <UserRound size={16} />
                  {author}
                </span>
              )}
              {readTime && (
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {readTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Full-width body: share rail · article · sidebar ── */}
      <div className="mx-auto max-w-[1360px] px-6 pb-28 pt-14 lg:px-10 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          {/* Left region: share rail + article */}
          <div className="flex gap-6 lg:gap-10">
            {/* Sticky share rail */}
            {shareLinks.length > 0 && (
              <div className="hidden shrink-0 lg:block">
                <div className="sticky top-28 flex flex-col items-center gap-3">
                  <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Share2 size={16} />
                  </span>
                  {shareLinks.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:-translate-y-0.5 hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Article */}
            <div className="min-w-0 flex-1">
              {excerpt && (
                <p className="mb-10 border-l-4 border-[#2563eb] pl-5 text-xl font-medium leading-relaxed text-slate-700 md:text-2xl">
                  {excerpt}
                </p>
              )}

              {content ? (
                <div className="cms-richtext max-w-[760px] text-slate-600 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:mt-1 [&>p:first-of-type]:first-letter:text-[3.75rem] [&>p:first-of-type]:first-letter:font-extrabold [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:text-[#2563eb] [&_a]:text-[#2563eb] [&_a]:underline [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2563eb]/30 [&_blockquote]:bg-slate-50 [&_blockquote]:py-3 [&_blockquote]:pl-6 [&_blockquote]:pr-4 [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-[1.7rem] [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:md:text-3xl [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 [&_img]:my-10 [&_img]:w-full [&_img]:rounded-2xl [&_img]:shadow-lg [&_li]:mb-2.5 [&_ol]:mb-7 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-7 [&_p]:text-[18px] [&_p]:leading-[1.95] [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-6">
                  <RichText data={content as any} />
                </div>
              ) : null}

              {/* Mobile share + tags */}
              <div className="mt-14 border-t border-slate-100 pt-8">
                {validTags.length > 0 && (
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <Tag size={16} className="text-slate-400" />
                    {validTags.map((tg, i) => (
                      <span
                        key={tg.id || i}
                        className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {tg.tag}
                      </span>
                    ))}
                  </div>
                )}
                {shareLinks.length > 0 && (
                  <div className="flex items-center gap-3 lg:hidden">
                    <span className="text-sm font-semibold text-slate-500">Share:</span>
                    {shareLinks.map(({ icon: Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="space-y-5">
              {(hasAuthor || date || readTime) && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                  {hasAuthor ? (
                    <div className="flex items-center gap-3">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] text-xl font-bold text-white">
                        {authorInitial}
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Written by</p>
                        <p className="text-base font-bold text-slate-900">{author}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Published</p>
                  )}
                  {(date || readTime) && (
                    <div
                      className={
                        hasAuthor
                          ? 'mt-4 space-y-2 border-t border-slate-100 pt-4'
                          : 'mt-3 space-y-2'
                      }
                    >
                      {date && (
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                          <CalendarDays size={15} />
                          {date}
                        </p>
                      )}
                      {readTime && (
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock size={15} />
                          {readTime}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {category && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <FolderOpen size={14} />
                    Category
                  </p>
                  <Link
                    href={backHref}
                    className="inline-block rounded-full bg-[#2563eb]/10 px-4 py-2 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#2563eb]/15"
                  >
                    {category}
                  </Link>
                </div>
              )}

              {validTags.length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <Tag size={14} />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {validTags.map((tg, i) => (
                      <span
                        key={tg.id || i}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                      >
                        {tg.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={backHref}
                className="group flex items-center justify-between rounded-2xl bg-slate-900 p-5 text-white transition-colors hover:bg-slate-800"
              >
                <span className="text-sm font-semibold">{backLabel}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  )
}
