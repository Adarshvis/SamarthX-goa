import React from 'react'
import DynamicIcon from '../ui/DynamicIcon'
import ScrollReveal from '../ui/ScrollReveal'

type ColorTheme = 'blue' | 'green' | 'purple' | 'orange'

interface StatItem {
  icon?: string | null
  value?: string | null
  label: string
  description?: string | null
  colorTheme?: ColorTheme | null
  id?: string | null
}

interface StatsBarBlockProps {
  items?: StatItem[] | null
  columns?: 'auto' | '2' | '3' | '4' | null
  showDividers?: boolean | null
  backgroundColor?: string | null
}

const themeMap: Record<ColorTheme, { circle: string; fg: string }> = {
  blue: { circle: 'bg-blue-100', fg: '#2563eb' },
  green: { circle: 'bg-emerald-100', fg: '#059669' },
  purple: { circle: 'bg-violet-100', fg: '#7c3aed' },
  orange: { circle: 'bg-orange-100', fg: '#ea580c' },
}

const colClass: Record<string, string> = {
  '1': 'lg:grid-cols-1',
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
  '5': 'lg:grid-cols-5',
  '6': 'lg:grid-cols-6',
}

export default function StatsBarBlock({
  items,
  columns = 'auto',
  showDividers = true,
  backgroundColor,
}: StatsBarBlockProps) {
  if (!items || items.length === 0) return null

  const desktopCols =
    columns && columns !== 'auto' ? columns : String(Math.min(6, Math.max(1, items.length)))
  const gridCols = colClass[desktopCols] || 'lg:grid-cols-4'

  return (
    <section className="px-6 py-12" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="mx-auto max-w-[1440px]">
        <div
          className={`grid grid-cols-1 gap-x-4 gap-y-8 rounded-3xl bg-white px-5 py-9 shadow-[0_16px_48px_rgba(15,23,42,0.07)] sm:grid-cols-2 sm:px-6 ${gridCols}`}
        >
          {items.map((item, i) => {
            const theme = themeMap[(item.colorTheme as ColorTheme) || 'blue']
            const hasValue = Boolean(item.value && item.value.trim())
            return (
              <ScrollReveal
                key={item.id || i}
                delay={i * 120}
                className={showDividers && i !== 0 ? 'lg:border-l lg:border-slate-100' : ''}
              >
                <div className="group flex cursor-default items-center justify-start gap-4 px-2 transition-transform duration-300 ease-out hover:-translate-y-1.5 sm:justify-center sm:gap-5">
                  {item.icon && (
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${theme.circle} animate-float transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg sm:h-16 sm:w-16`}
                      style={{ animationDelay: `${i * 0.4}s`, boxShadow: `0 8px 20px -8px ${theme.fg}55` }}
                    >
                      <DynamicIcon name={item.icon} size={26} color={theme.fg} />
                    </span>
                  )}
                  <div className="min-w-0">
                    {hasValue ? (
                      <>
                        <p
                          className="font-heading text-[30px] font-extrabold leading-none transition-transform duration-300 group-hover:scale-105"
                          style={{ color: theme.fg }}
                        >
                          {item.value}
                        </p>
                        <p className="mt-1.5 text-[14px] font-medium text-slate-500">{item.label}</p>
                        {item.description && (
                          <p className="mt-1 text-[12.5px] leading-snug text-slate-400">{item.description}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p
                          className="font-heading text-[16px] font-bold leading-snug transition-transform duration-300 group-hover:scale-105"
                          style={{ color: theme.fg }}
                        >
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="mt-1 text-[13px] leading-snug text-slate-500">{item.description}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
