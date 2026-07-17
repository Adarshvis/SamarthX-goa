import React from 'react'
import type { SnapshotDataRow } from './types'

interface SnapshotTableProps {
  title: string
  rows: SnapshotDataRow[]
  selectedIndex: number
  hoveredIndex: number | null
  onSelect: (index: number) => void
  onHover: (index: number | null) => void
  headerBackground: string
  activeRowColor?: string
}

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(30, 58, 138, ${alpha})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function SnapshotTable({
  title,
  rows,
  selectedIndex,
  hoveredIndex,
  onSelect,
  onHover,
  headerBackground,
  activeRowColor,
}: SnapshotTableProps) {
  const activeBg = activeRowColor || hexToRgba(headerBackground, 0.12)
  const hoverBg = hexToRgba(headerBackground, 0.05)
  return (
    <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div
        className="grid shrink-0 grid-cols-[1fr_auto] gap-2 px-5 py-4 text-sm font-bold uppercase tracking-wider text-white"
        style={{ backgroundColor: headerBackground }}
      >
        <span>{title}</span>
        <span>Schools</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {rows.map((row, index) => {
          const isSelected = selectedIndex === index
          const isHovered = !isSelected && hoveredIndex === index
          const schools = row.totalSchools ?? 0
          return (
            <button
              key={row.id || `${row.name}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(null)}
              className="grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-2 border-b border-slate-100 px-5 text-left transition-colors"
              style={{
                minHeight: '56px',
                backgroundColor: isSelected
                  ? activeBg
                  : isHovered
                    ? hoverBg
                    : 'transparent',
              }}
            >
              <span className="flex items-center gap-2 font-semibold text-slate-700">
                {isSelected && <span className="text-teal-600">●</span>}
                {row.name}
              </span>
              <span className="font-bold text-slate-900">{schools.toLocaleString('en-IN')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
