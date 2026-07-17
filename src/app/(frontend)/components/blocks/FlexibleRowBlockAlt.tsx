'use client'

/**
 * FlexibleRowBlockAlt
 * -------------------
 * An ALTERNATE visual renderer for the exact same `flexibleRow` block data.
 * It consumes identical props to FlexibleRowBlock (same blocks, same data) but
 * applies a distinct "editorial / bento" design language. Used only on the
 * About page so the shared block components stay untouched for other projects.
 */

import React from 'react'
import Image from 'next/image'
import RichText from '../ui/RichText'
import DynamicIcon from '../ui/DynamicIcon'
import ScrollReveal from '../ui/ScrollReveal'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// ── Shared helpers ──

function getMediaUrl(media: unknown): string | null {
  if (typeof media === 'object' && media && 'url' in media) {
    return (media as { url: string }).url
  }
  return null
}

function getMediaAlt(media: unknown): string {
  if (typeof media === 'object' && media && 'alt' in media) {
    return (media as { alt: string }).alt || ''
  }
  return ''
}

function isLexicalData(value: unknown): value is { root: unknown } {
  return Boolean(value && typeof value === 'object' && 'root' in (value as Record<string, unknown>))
}

function altAnimationClass(animation?: string | null): string {
  switch (animation) {
    case 'hoverLift':
      return 'transition-all duration-500 hover:-translate-y-2'
    case 'pulse':
      return 'animate-pulse-slow'
    case 'float':
      return 'animate-bounce-slow'
    default:
      return 'transition-all duration-500'
  }
}

function responsiveGrid(columns: number): string {
  if (columns <= 1) return 'grid-cols-1'
  if (columns === 2) return 'grid-cols-1 md:grid-cols-2'
  if (columns === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
}

// ── Rich Text (alt): larger, tighter headings, no boxed background ──

function AltRichText({
  content,
  fontFamily = 'inherit',
  fontSize = 'base',
  textColor = '#1F2937',
}: {
  content: unknown
  fontFamily?: string | null
  fontSize?: string | null
  textColor?: string | null
}) {
  const sizeClass: Record<string, string> = {
    sm: 'text-sm [&_p]:text-sm [&_li]:text-sm',
    base: 'text-base [&_p]:text-base [&_li]:text-base',
    lg: 'text-lg [&_p]:text-lg [&_li]:text-lg',
    xl: 'text-xl [&_p]:text-xl [&_li]:text-xl',
    '2xl': 'text-2xl [&_p]:text-xl [&_li]:text-xl',
  }
  return (
    <div
      className={`cms-richtext max-w-none ${sizeClass[fontSize || 'base'] || sizeClass.base}
        [&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:font-extrabold [&_h1]:leading-[1.08] [&_h1]:tracking-tight [&_h1]:mb-4
        [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:leading-[1.12] [&_h2]:tracking-tight [&_h2]:mb-3
        [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:tracking-tight
        [&_p]:leading-relaxed [&_p]:text-slate-600`}
      style={{
        fontFamily: fontFamily && fontFamily !== 'inherit' ? `"${fontFamily}", sans-serif` : undefined,
        color: textColor || undefined,
      }}
    >
      <RichText data={content as SerializedEditorState} />
    </div>
  )
}

// ── Image (alt): asymmetric rounded corners + ring ──

function AltImage({
  image,
  caption,
  captionColor = '#6B7280',
  objectFit = 'cover',
}: {
  image: unknown
  caption?: string | null
  captionColor?: string | null
  objectFit?: string | null
  rounded?: string | null
}) {
  const url = getMediaUrl(image)
  if (!url) return null
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-lg rounded-bl-lg ring-1 ring-slate-200 shadow-xl">
        <Image
          src={url}
          alt={getMediaAlt(image)}
          fill
          className="transition-transform duration-700 hover:scale-105"
          style={{ objectFit: (objectFit as React.CSSProperties['objectFit']) || 'cover' }}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm italic" style={{ color: captionColor || '#6B7280' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ── Buttons (alt): pill with gradient + arrow slide ──

function AltButtons({
  alignment = 'left',
  buttons,
}: {
  alignment?: string | null
  buttons?: {
    id?: string
    label?: string | null
    url?: string | null
    variant?: string | null
    size?: string | null
    icon?: string | null
    openInNewTab?: boolean | null
  }[]
}) {
  if (!buttons?.length) return null

  const alignClass =
    alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'

  const variantClass: Record<string, string> = {
    primary:
      'text-white border-transparent shadow-lg shadow-[var(--brand-primary)]/25 bg-[var(--brand-primary)] hover:shadow-xl hover:shadow-[var(--brand-primary)]/30',
    secondary:
      'text-white border-transparent shadow-lg bg-[var(--brand-secondary)] hover:shadow-xl',
    outline:
      'bg-white/60 backdrop-blur text-[var(--brand-primary)] border-[var(--brand-primary)]/30 hover:border-[var(--brand-primary)] hover:bg-white',
    ghost: 'bg-transparent text-[var(--brand-primary)] border-transparent hover:bg-[var(--brand-primary)]/8',
  }

  const sizeClass: Record<string, string> = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-9 py-4 text-lg',
  }

  return (
    <div className={`flex flex-wrap gap-4 ${alignClass}`}>
      {buttons.map((button, index) => {
        if (!button.url || !button.label) return null
        const variant = button.variant || 'primary'
        const size = button.size || 'md'
        return (
          <a
            key={button.id || index}
            href={button.url}
            target={button.openInNewTab ? '_blank' : undefined}
            rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
            className={`group inline-flex items-center gap-2 rounded-full border font-semibold transition-all duration-300 ${variantClass[variant] || variantClass.primary} ${sizeClass[size] || sizeClass.md}`}
          >
            <span>{button.label}</span>
            {button.icon ? (
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <DynamicIcon name={button.icon} size={18} />
              </span>
            ) : null}
          </a>
        )
      })}
    </div>
  )
}

// ── Stats Cards (alt): big numbers, accent underline, hover glow ──

function AltStatsCards({
  columns = '4',
  cards,
}: {
  columns?: string | null
  cardStyle?: string | null
  cards?: {
    id?: string
    label?: string | null
    value?: string | null
    trend?: string | null
    trendLabel?: string | null
    icon?: string | null
    iconColor?: string | null
    animation?: string | null
  }[]
}) {
  if (!cards?.length) return null
  const cols = Number(columns || '4')
  const safeCols = Number.isFinite(cols) ? Math.min(4, Math.max(1, cols)) : 4

  return (
    <div className={`grid gap-5 ${responsiveGrid(safeCols)}`}>
      {cards.map((card, index) => {
        const accent = card.iconColor || '#1d4ed8'
        return (
          <ScrollReveal key={card.id || index} delay={index * 80}>
            <article
              className="group relative h-full overflow-hidden rounded-2xl bg-white p-7 ring-1 ring-slate-200/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-300/40"
            >
              {/* top accent bar */}
              <span
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ backgroundColor: accent }}
              />
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{card.label}</p>
                {card.icon ? (
                  <span
                    className="inline-flex rounded-xl p-2.5 transition-colors"
                    style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, white)` }}
                  >
                    <DynamicIcon name={card.icon} size={20} color={accent} />
                  </span>
                ) : null}
              </div>
              <p className="text-4xl font-black leading-none tracking-tight text-slate-900">{card.value}</p>
              <span className="mt-4 block h-px w-10 bg-slate-200 transition-all duration-500 group-hover:w-16" style={{ backgroundColor: `color-mix(in srgb, ${accent} 40%, #e2e8f0)` }} />
              {(card.trend || card.trendLabel) && (
                <p className="mt-4 text-sm text-slate-500">
                  {card.trend ? <span className="font-bold text-emerald-600">{card.trend}</span> : null}
                  {card.trendLabel ? <span className={card.trend ? 'ml-2' : ''}>{card.trendLabel}</span> : null}
                </p>
              )}
            </article>
          </ScrollReveal>
        )
      })}
    </div>
  )
}

// ── Feature Cards (alt): left accent bar, gradient icon chip, check bullets ──

function AltFeatureCards({
  columns = '3',
  cards,
}: {
  columns?: string | null
  cardStyle?: string | null
  cards?: {
    id?: string
    icon?: string | null
    iconColor?: string | null
    accentColor?: string | null
    title?: unknown
    subtitle?: string | null
    description?: unknown
    points?: { text?: string | null; id?: string }[]
    animation?: string | null
  }[]
}) {
  if (!cards?.length) return null
  const cols = Number(columns || '3')
  const safeCols = Number.isFinite(cols) ? Math.min(4, Math.max(1, cols)) : 3
  const accentPalette = ['#2563eb', '#f59e0b', '#0f172a', '#16a34a', '#7c3aed', '#dc2626']

  return (
    <div className={`grid gap-6 ${responsiveGrid(safeCols)}`}>
      {cards.map((card, index) => {
        const accent = card.accentColor || accentPalette[index % accentPalette.length]
        return (
          <ScrollReveal key={card.id || index} delay={index * 90}>
            <article
              className={`group relative h-full overflow-hidden rounded-2xl bg-white pl-7 pr-6 py-7 ring-1 ring-slate-200/70 ${altAnimationClass(card.animation)} hover:shadow-2xl hover:shadow-slate-300/40`}
            >
              {/* left accent bar */}
              <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: accent }} />

              {card.icon ? (
                <div
                  className="mb-5 inline-flex rounded-2xl p-3.5 shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 18%, white), color-mix(in srgb, ${accent} 4%, white))`,
                  }}
                >
                  <DynamicIcon name={card.icon} size={24} color={card.iconColor || accent} />
                </div>
              ) : null}

              {card.subtitle ? <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">{card.subtitle}</p> : null}

              {isLexicalData(card.title) ? (
                <div className="mb-3 cms-richtext text-slate-900 [&_p]:my-0 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold">
                  <RichText data={card.title as any} />
                </div>
              ) : (
                <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">{(card.title as string) || ''}</h3>
              )}

              {isLexicalData(card.description) ? (
                <div className="mb-5 cms-richtext text-slate-500 [&_p]:my-0 [&_p]:leading-relaxed">
                  <RichText data={card.description as any} />
                </div>
              ) : card.description ? (
                <p className="mb-5 text-sm leading-relaxed text-slate-500">{card.description as string}</p>
              ) : null}

              {card.points?.length ? (
                <ul className="space-y-2.5">
                  {card.points.map((point, pointIndex) =>
                    point.text ? (
                      <li key={point.id || pointIndex} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                        <span
                          className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `color-mix(in srgb, ${accent} 15%, white)` }}
                        >
                          <DynamicIcon name="Check" size={12} color={accent} />
                        </span>
                        <span>{point.text}</span>
                      </li>
                    ) : null,
                  )}
                </ul>
              ) : null}
            </article>
          </ScrollReveal>
        )
      })}
    </div>
  )
}

// ── Highlight Cards (alt): centered icon medallion, minimal, hover underline ──

function AltHighlightCards({
  columns = '2',
  theme = 'light',
  titleSize = 'base',
  iconBgColor = '#EEF2FF',
  cards,
}: {
  columns?: string | null
  theme?: string | null
  titleSize?: string | null
  iconBgColor?: string | null
  iconAlignment?: string | null
  cards?: {
    id?: string
    icon?: string | null
    iconColor?: string | null
    title?: string | null
    description?: string | null
    animation?: string | null
  }[]
}) {
  if (!cards?.length) return null
  const cols = Number(columns || '2')
  const safeCols = Number.isFinite(cols) ? Math.min(3, Math.max(1, cols)) : 2
  const isDark = theme === 'dark'
  const cardStyle = isDark
    ? 'bg-white/5 ring-1 ring-white/10 text-slate-100 hover:bg-white/10'
    : 'bg-white ring-1 ring-slate-200/70 text-slate-900 hover:shadow-xl hover:shadow-slate-300/40'
  const titleSizeClass: Record<string, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  return (
    <div className={`grid gap-5 ${responsiveGrid(safeCols)}`}>
      {cards.map((card, index) => (
        <ScrollReveal key={card.id || index} delay={index * 70}>
          <article className={`group flex h-full flex-col items-center rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-1 ${cardStyle}`}>
            {card.icon ? (
              <div
                className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-4 ring-white/40 transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : iconBgColor || '#EEF2FF' }}
              >
                <DynamicIcon name={card.icon} size={26} color={card.iconColor || '#f59e0b'} />
              </div>
            ) : null}
            <h3 className={`font-bold tracking-tight ${titleSizeClass[titleSize || 'base'] || 'text-base'}`}>{card.title}</h3>
            <span className={`mt-2 h-0.5 w-6 rounded-full transition-all duration-500 group-hover:w-10 ${isDark ? 'bg-amber-400/70' : 'bg-[var(--brand-primary)]/60'}`} />
            {card.description ? <p className="mt-3 text-sm leading-relaxed opacity-80">{card.description}</p> : null}
          </article>
        </ScrollReveal>
      ))}
    </div>
  )
}

// ── Dashboard Mock (alt): framed device panel with tilt + glow ──

function AltDashboardMock({
  layoutVariant = 'floatingCards',
  theme = 'light',
  chartCount = 3,
  topBadgeLabel = 'ACTIVE SCHOOLS',
  topBadgeValue = '1,500+',
  topBadgeLabelColor = '#64748b',
  topBadgeValueColor = '#4338ca',
  bottomChipPrimary = 'Goa Live',
  bottomChipSecondary = 'National Rollout',
  bottomSummary = '',
  bottomSummaryColor = '#334155',
  syncFooterText = 'SYNCING WITH UDISE+ CLOUD',
}: {
  layoutVariant?: string | null
  theme?: string | null
  chartCount?: number | null
  topBadgeLabel?: string | null
  topBadgeLabelSize?: string | null
  topBadgeLabelColor?: string | null
  topBadgeValue?: string | null
  topBadgeAnimation?: string | null
  topBadgeValueSize?: string | null
  topBadgeValueColor?: string | null
  bottomChipPrimary?: string | null
  bottomChipSecondary?: string | null
  bottomSummary?: string | null
  bottomBadgeAnimation?: string | null
  bottomSummarySize?: string | null
  bottomSummaryColor?: string | null
  syncFooterText?: string | null
}) {
  const count = Math.max(1, Math.min(4, Number(chartCount || 3)))
  const isDark = theme === 'dark'

  if (layoutVariant === 'syncStatusPanel') {
    return (
      <div className="relative">
        {/* glow */}
        <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-amber-400/10 via-indigo-400/10 to-transparent blur-2xl" />
        <div className={`relative overflow-hidden rounded-[2rem] p-6 md:p-8 shadow-2xl ring-1 ${isDark ? 'bg-slate-900 ring-white/10' : 'bg-white ring-slate-200'}`}>
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={`flex items-center justify-between rounded-2xl px-4 py-4 ring-1 ${isDark ? 'bg-white/5 ring-white/10' : 'bg-slate-50 ring-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex rounded-xl p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                    <DynamicIcon name="School" size={22} color="#6366f1" />
                  </span>
                  <div>
                    <div className={`mb-2 h-2.5 w-24 rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
                    <div className={`h-2 w-36 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  </div>
                </div>
                <span className="inline-flex h-7 items-center rounded-full bg-amber-400/20 px-3 text-[10px] font-bold uppercase tracking-wider text-amber-500">Live</span>
              </div>
            ))}
          </div>
          <div className={`my-6 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className="flex items-center justify-center gap-2">
            <p className={`text-center text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{syncFooterText}</p>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse animation-delay-200" />
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse animation-delay-400" />
          </div>
        </div>
      </div>
    )
  }

  // floatingCards / default
  return (
    <div className="relative py-8">
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-[var(--brand-primary)]/10 via-indigo-400/10 to-transparent blur-2xl" />
      <div className={`relative overflow-hidden rounded-[2rem] p-6 shadow-2xl ring-1 ${isDark ? 'bg-slate-900 ring-white/10' : 'bg-white ring-slate-200'} rotate-[-1.2deg] transition-transform duration-500 hover:rotate-0`}>
        <div className="mb-6 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div className="mb-6 h-6 w-32 rounded-full bg-[var(--brand-primary)]/15" />
        <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={`flex h-24 items-center justify-center rounded-2xl ${isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
              <DynamicIcon name="ChartColumn" size={26} />
            </div>
          ))}
        </div>
        <div className={`rounded-2xl p-5 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
          <div className={`mb-3 h-4 w-full rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className={`mb-3 h-4 w-3/4 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
          <div className={`h-4 w-1/2 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
        </div>
      </div>

      {/* Top floating badge */}
      <div className="absolute right-[-0.6rem] top-[0.4rem] rounded-2xl bg-white px-5 py-3 shadow-xl ring-1 ring-slate-200">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: topBadgeLabelColor || '#64748b' }}>{topBadgeLabel}</p>
        <p className="text-3xl font-black leading-none" style={{ color: topBadgeValueColor || '#4338ca' }}>{topBadgeValue}</p>
      </div>

      {/* Bottom floating badge */}
      {(bottomChipPrimary || bottomChipSecondary || bottomSummary) && (
        <div className="absolute bottom-[-0.4rem] left-[-0.8rem] max-w-[18rem] rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
          <div className="mb-2 flex items-center gap-2">
            {bottomChipPrimary ? <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-500 ring-1 ring-amber-200">{bottomChipPrimary}</span> : null}
            {bottomChipSecondary ? <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{bottomChipSecondary}</span> : null}
          </div>
          {bottomSummary ? <p className="text-sm font-semibold leading-snug" style={{ color: bottomSummaryColor || '#334155' }}>{bottomSummary}</p> : null}
        </div>
      )}
    </div>
  )
}
