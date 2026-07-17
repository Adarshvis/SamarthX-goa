import React from 'react'
import type { SnapshotView } from './types'

const viewLabels: Record<SnapshotView, string> = {
  district: 'District',
  taluka: 'Taluka',
  schoolTypeManagement: 'School Type & Management',
  minoritySchools: 'Minority Schools',
  girlsOnlySchools: 'Only Girls Schools',
  boysOnlySchools: 'Only Boys Schools',
  mediumOfInstruction: 'Medium of Instruction',
}

interface SnapshotFiltersProps {
  availableViews: SnapshotView[]
  currentView: SnapshotView
  onViewChange: (view: SnapshotView) => void
  applyLabel: string
  showApplyButton?: boolean
}

export default function SnapshotFilters({
  availableViews,
  currentView,
  onViewChange,
  applyLabel,
  showApplyButton = true,
}: SnapshotFiltersProps) {
  if (!availableViews.length) return null

  return (
    <div className="flex flex-wrap items-center gap-[calc(var(--spacing)*1)]">
      <label className="text-sm font-semibold text-slate-700" htmlFor="snapshot-view-select">
        View by:
      </label>
      <select
        id="snapshot-view-select"
        value={currentView}
        onChange={(e) => onViewChange(e.target.value as SnapshotView)}
        className="w-[calc(var(--spacing)*60)] appearance-none rounded-xl border border-slate-200 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23334155%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-8 py-2 text-sm font-semibold text-slate-700"
      >
        {availableViews.map((view) => (
          <option key={view} value={view}>
            {viewLabels[view]}
          </option>
        ))}
      </select>
      {showApplyButton && (
        <button
          type="button"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {applyLabel}
        </button>
      )}
    </div>
  )
}
