'use client'

import React, { useState } from 'react'
import { X, Eye, Download, FileText } from 'lucide-react'
import DynamicIcon from '../ui/DynamicIcon'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'

interface DocItem {
  title: string
  description?: string | null
  file?: any
  icon?: string | null
  badge?: string | null
  id?: string | null
}

interface DocumentListBlockProps {
  sectionHeading?: string | null
  sectionDescription?: string | null
  headingAlignment?: 'left' | 'center' | 'right' | null
  documents: DocItem[]
  columns?: '1' | '2' | null
  enableView?: boolean | null
  enableDownload?: boolean | null
  accentColor?: string | null
  backgroundColor?: string | null
}

function fileUrl(file: any): string | null {
  return typeof file === 'object' && file?.url ? file.url : null
}

function fileName(file: any, fallback: string): string {
  if (typeof file === 'object' && file?.filename) return file.filename
  return `${fallback}.pdf`
}

// ── PDF Viewer Modal ──
function PdfViewer({
  doc,
  accent,
  onClose,
}: {
  doc: DocItem
  accent: string
  onClose: () => void
}) {
  const url = fileUrl(doc.file)
  if (!url) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-3 md:p-6" onClick={onClose}>
      <div
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText size={18} style={{ color: accent }} className="shrink-0" />
            <h3 className="truncate text-[15px] font-semibold text-slate-900">{doc.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download={fileName(doc.file, doc.title)}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold sm:inline-flex"
              style={{ color: accent, backgroundColor: `${accent}14` }}
            >
              <Download size={15} />
              Download
            </a>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {/* viewer */}
        <iframe src={`${url}#toolbar=1&view=FitH`} title={doc.title} className="h-full w-full flex-1" />
      </div>
    </div>
  )
}

// ── Document Card ──
function DocumentCard({
  doc,
  accent,
  enableView,
  enableDownload,
  onView,
}: {
  doc: DocItem
  accent: string
  enableView: boolean
  enableDownload: boolean
  onView: () => void
}) {
  const url = fileUrl(doc.file)

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex min-w-0 items-start gap-3.5">
        <span
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}14`, color: accent }}
        >
          {doc.icon ? <DynamicIcon name={doc.icon} size={20} /> : <FileText size={20} />}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-[16px] font-bold leading-snug text-slate-900">{doc.title}</h3>
            {doc.badge && (
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: `${accent}14`, color: accent }}
              >
                {doc.badge}
              </span>
            )}
          </div>
          {doc.description && (
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-500">{doc.description}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {enableView && url && (
          <button
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-transform duration-200 hover:scale-[1.03]"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            <Eye size={15} />
            <span className="hidden sm:inline">View</span>
          </button>
        )}
        {enableDownload && url && (
          <a
            href={url}
            download={fileName(doc.file, doc.title)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-transform duration-200 hover:scale-[1.03]"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Download</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default function DocumentListBlock(props: DocumentListBlockProps) {
  const {
    sectionHeading,
    sectionDescription,
    headingAlignment,
    documents,
    columns = '1',
    enableView = true,
    enableDownload = true,
    accentColor,
    backgroundColor,
  } = props

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!documents || documents.length === 0) return null

  const accent = accentColor || '#1E40AF'
  const gridCols = columns === '2' ? 'sm:grid-cols-2' : 'grid-cols-1'

  return (
    <section className="px-6 py-14" style={{ backgroundColor: backgroundColor || undefined }}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          heading={sectionHeading}
          description={sectionDescription}
          alignment={headingAlignment}
        />

        <div className={`grid gap-4 ${gridCols}`}>
          {documents.map((doc, i) => (
            <ScrollReveal key={doc.id || i} delay={i * 80}>
              <DocumentCard
                doc={doc}
                accent={accent}
                enableView={enableView !== false}
                enableDownload={enableDownload !== false}
                onView={() => setActiveIndex(i)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {activeIndex !== null && documents[activeIndex] && (
        <PdfViewer doc={documents[activeIndex]} accent={accent} onClose={() => setActiveIndex(null)} />
      )}
    </section>
  )
}
