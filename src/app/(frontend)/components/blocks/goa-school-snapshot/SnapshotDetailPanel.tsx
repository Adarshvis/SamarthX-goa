import React from 'react'
import type { SnapshotDataRow } from './types'

interface SnapshotDetailPanelProps {
  item: SnapshotDataRow | null
  total: number
  themeColor?: string
}

export default function SnapshotDetailPanel({ item, total, themeColor = '#1e3a8a' }: SnapshotDetailPanelProps) {
  if (!item) {
    return (
      <div className="h-[420px] rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Select a row or marker to view details.</p>
      </div>
    )
  }

  const value = item.totalSchools ?? 0
  const percent = item.percentage ?? (total > 0 ? (value / total) * 100 : 0)

  return (
    <div className="h-[420px] rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-3xl font-bold text-slate-800">{item.name}</h3>
      <p className="mt-3 text-slate-600">
        Schools: <span className="text-4xl font-extrabold" style={{ color: themeColor }}>{value.toLocaleString('en-IN')}</span>
      </p>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%`, backgroundColor: themeColor }}
        />
      </div>
      <div className="mt-2 text-right text-sm font-semibold" style={{ color: themeColor }}>{percent.toFixed(1)}%</div>
    </div>
  )
}
