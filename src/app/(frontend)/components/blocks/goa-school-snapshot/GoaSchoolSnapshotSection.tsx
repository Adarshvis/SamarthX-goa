'use client'

import React, { useMemo, useState } from 'react'
import SnapshotFilters from './SnapshotFilters'
import SnapshotTable from './SnapshotTable'
import SnapshotDetailPanel from './SnapshotDetailPanel'
import GoaMapPanel from './GoaMapPanel'
import DynamicIcon from '../../ui/DynamicIcon'
import { normalizeSnapshotData, rowsForView } from './defaults'
import type {
  GoaSchoolSnapshotBlockData,
  SnapshotDataRow,
  SnapshotSummaryCardValueSource,
  SnapshotView,
} from './types'

interface GoaSchoolSnapshotSectionProps {
  data: GoaSchoolSnapshotBlockData
}

function findRowByName(rows: SnapshotDataRow[], name: string | null): SnapshotDataRow | null {
  if (!name) return null
  return rows.find((row) => row.name === name) || null
}

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(30, 58, 138, ${alpha})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getCardShadow(shadow: 'none' | 'soft' | 'medium' | 'strong'): string {
  if (shadow === 'none') return 'none'
  if (shadow === 'medium') return '0 10px 20px rgba(15, 23, 42, 0.08)'
  if (shadow === 'strong') return '0 14px 28px rgba(15, 23, 42, 0.14)'
  return '0 4px 14px rgba(15, 23, 42, 0.08)'
}

function sumSchools(rows: SnapshotDataRow[]): number {
  return rows.reduce((sum, row) => sum + (row.totalSchools ?? 0), 0)
}

function statValueForSource(
  source: SnapshotSummaryCardValueSource,
  customValue: number | null,
  args: {
    currentViewTotalSchools: number
    districtCount: number
    talukaCount: number
    currentViewItems: number
    minoritySchools: number
    girlsOnlySchools: number
    boysOnlySchools: number
    englishMedium: number
    konkaniMedium: number
    marathiMedium: number
  },
): number {
  if (source === 'totalSchools') return args.currentViewTotalSchools
  if (source === 'districtCount') return args.districtCount
  if (source === 'talukaCount') return args.talukaCount
  if (source === 'currentViewItems') return args.currentViewItems
  if (source === 'minoritySchools') return args.minoritySchools
  if (source === 'girlsOnlySchools') return args.girlsOnlySchools
  if (source === 'boysOnlySchools') return args.boysOnlySchools
  if (source === 'englishMedium') return args.englishMedium
  if (source === 'konkaniMedium') return args.konkaniMedium
  if (source === 'marathiMedium') return args.marathiMedium
  return customValue ?? 0
}

export default function GoaSchoolSnapshotSection({ data }: GoaSchoolSnapshotSectionProps) {
  const normalized = useMemo(() => normalizeSnapshotData(data), [data])
  const [view, setView] = useState<SnapshotView>(normalized.currentView)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoveredName, setHoveredName] = useState<string | null>(null)

  const activeRows = useMemo(() => rowsForView(view, normalized), [view, normalized])
  const selected = activeRows[selectedIndex] ?? activeRows[0] ?? null
  const selectedName = selected?.name ?? null

  const total = useMemo(
    () => activeRows.reduce((sum, row) => sum + (row.totalSchools ?? 0), 0),
    [activeRows],
  )
  const summaryCards = useMemo(() => {
    const valueArgs = {
      currentViewTotalSchools: sumSchools(activeRows),
      districtCount: normalized.districtRows.length,
      talukaCount: normalized.talukaRows.length,
      currentViewItems: activeRows.length,
      minoritySchools: normalized.stats.minoritySchools ?? 0,
      girlsOnlySchools: normalized.stats.girlsOnlySchools ?? 0,
      boysOnlySchools: normalized.stats.boysOnlySchools ?? 0,
      englishMedium: normalized.stats.englishMedium ?? 0,
      konkaniMedium: normalized.stats.konkaniMedium ?? 0,
      marathiMedium: normalized.stats.marathiMedium ?? 0,
    }

    return normalized.summaryCards.cards
      .filter((card) => card.isEnabled)
      .map((card) => ({
        key: card.id || card.label,
        label: card.label,
        iconName: card.iconName,
        value: statValueForSource(card.valueSource, card.customValue, valueArgs),
      }))
  }, [activeRows, normalized])

  const wrapperStyle: React.CSSProperties = {
    fontFamily: normalized.style.fontFamily,
    ['--snapshot-card-bg' as string]: normalized.style.cardBackground,
    ['--snapshot-title-color' as string]: normalized.style.titleColor,
    ['--snapshot-header-bg' as string]: normalized.style.tableHeaderBackground,
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: `${normalized.layout.cardBorderRadius}px`,
    boxShadow: getCardShadow(normalized.layout.cardShadow),
    background: normalized.style.cardBackground,
  }

  const shouldAnimateSummary = normalized.summaryCards.animateScroll && summaryCards.length > 4
  const marqueeDuration = `${normalized.summaryCards.scrollDurationSeconds}s`
  const summaryGap = `${normalized.layout.cardSpacing}px`

  return (
    <section className="px-6 py-10" style={wrapperStyle}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">Data Overview</p>
          <h2 className="text-4xl font-extrabold" style={{ color: normalized.style.titleColor }}>
            {normalized.sectionTitle}
          </h2>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {normalized.layout.showFilterPanel && data.filterSettings?.enableFilters !== false && (
            <div className="shrink-0">
              <SnapshotFilters
                availableViews={normalized.availableViews}
                currentView={view}
                onViewChange={(nextView) => {
                  setView(nextView)
                  setSelectedIndex(0)
                  setHoveredIndex(null)
                  setHoveredName(null)
                }}
                applyLabel={data.filterSettings?.applyFilterButton || 'Apply Filter'}
                showApplyButton={data.filterSettings?.showApplyButton !== false}
              />
            </div>
          )}

          {normalized.summaryCards.enabled && summaryCards.length > 0 && (
            <div className="min-w-0 flex-1">
              {shouldAnimateSummary ? (
                <div className="group overflow-hidden">
                  <div
                    className="flex w-max items-center [animation:goa-summary-marquee_var(--summary-duration)_linear_infinite] group-hover:[animation-play-state:paused]"
                    style={{
                      gap: summaryGap,
                      ['--summary-duration' as string]: marqueeDuration,
                    }}
                  >
                    {[...summaryCards, ...summaryCards].map((stat, index) => (
                      <article
                        key={`${stat.key}-${index}`}
                        className="flex min-h-[56px] min-w-[220px] items-center gap-3 border border-slate-200 px-4 py-3"
                        style={cardStyle}
                      >
                        {stat.iconName && (
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: hexToRgba(normalized.style.tableHeaderBackground, 0.12),
                              color: normalized.style.tableHeaderBackground,
                            }}
                          >
                            <DynamicIcon name={stat.iconName} size={22} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[16px] leading-none font-extrabold text-slate-900">
                            {Number(stat.value ?? 0).toLocaleString('en-IN')}
                          </div>
                          <div className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {stat.label}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                  {summaryCards.map((stat) => (
                    <article
                      key={stat.key}
                      className="flex min-h-[56px] min-w-[220px] items-center gap-3 border border-slate-200 px-4 py-3"
                      style={cardStyle}
                    >
                      {stat.iconName && (
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: hexToRgba(normalized.style.tableHeaderBackground, 0.12),
                            color: normalized.style.tableHeaderBackground,
                          }}
                        >
                          <DynamicIcon name={stat.iconName} size={22} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-[16px] leading-none font-extrabold text-slate-900">
                          {Number(stat.value ?? 0).toLocaleString('en-IN')}
                        </div>
                        <div className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {stat.label}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {normalized.layout.showLeftPanel && (
            <div className="lg:col-span-3">
              <SnapshotTable
                title={view === 'taluka' ? 'Talukas' : view === 'district' ? 'Districts' : 'School Type & Management'}
                rows={activeRows}
                selectedIndex={selectedIndex}
                hoveredIndex={hoveredIndex}
                onSelect={setSelectedIndex}
                onHover={setHoveredIndex}
                headerBackground={normalized.style.tableHeaderBackground}
                activeRowColor={normalized.style.activeRowColor}
              />
            </div>
          )}

          {normalized.layout.showMiddlePanel && (
            <div className="lg:col-span-3">
              <SnapshotDetailPanel item={selected} total={total} themeColor={normalized.style.tableHeaderBackground} />
            </div>
          )}

          {normalized.layout.showRightPanel && (
            <div className="lg:col-span-6">
              <GoaMapPanel
                rows={activeRows}
                selectedName={selectedName}
                hoveredName={hoveredName}
                onSelect={(name) => {
                  const idx = activeRows.findIndex((r) => r.name === name)
                  setSelectedIndex(idx >= 0 ? idx : 0)
                }}
                onHover={setHoveredName}
                markerColor={normalized.map.markerColor}
                activeMarkerColor={normalized.map.activeMarkerColor}
                markerSize={normalized.map.markerSize}
                activeMarkerSize={normalized.map.activeMarkerSize}
                showPulse={normalized.map.showPulse}
                mapBackground={normalized.map.mapBackground}
                centerLat={normalized.map.centerLat}
                centerLng={normalized.map.centerLng}
                zoom={normalized.map.zoom}
                mergedTalukaMap={normalized.mergedTalukaMap}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes goa-summary-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
