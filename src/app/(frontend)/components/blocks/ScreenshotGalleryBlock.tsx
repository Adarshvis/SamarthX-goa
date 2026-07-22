'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import SectionHeading from '../ui/SectionHeading'
import ScrollReveal from '../ui/ScrollReveal'
import { X, ZoomIn } from 'lucide-react'

interface ScreenshotData {
  image?: any
  title?: string | null
  caption?: string | null
  category?: string | null
  id?: string | null
}

interface ScreenshotGalleryBlockProps {
  sectionHeading?: string | null
  sectionDescription?: string | null
  headingAlignment?: 'left' | 'center' | 'right' | null
  screenshots: ScreenshotData[]
  columns?: '2' | '3' | '4' | null
  enableLightbox?: boolean | null
  showDeviceFrame?: boolean | null
  deviceType?: 'laptop' | 'tablet' | 'phone' | null
  backgroundColor?: string | null
}

const columnClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

// ── Realistic device mockups ──
// Each frame renders a screen area (relative + overflow-hidden) into which the
// image is placed with `fill`, so the screenshot looks like it is displayed
// inside the device.

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[290px]">
      <div className="relative rounded-[2.9rem] bg-[#1b1b1d] p-[11px] shadow-[0_22px_60px_rgba(0,0,0,0.45)] ring-1 ring-black/50">
        {/* side buttons */}
        <span className="absolute -left-[3px] top-[104px] h-8 w-[3px] rounded-l bg-[#2c2c2f]" />
        <span className="absolute -left-[3px] top-[150px] h-12 w-[3px] rounded-l bg-[#2c2c2f]" />
        <span className="absolute -left-[3px] top-[206px] h-12 w-[3px] rounded-l bg-[#2c2c2f]" />
        <span className="absolute -right-[3px] top-[168px] h-16 w-[3px] rounded-r bg-[#2c2c2f]" />
        {/* screen */}
        <div
          className="relative overflow-hidden rounded-[2.15rem] bg-white"
          style={{ aspectRatio: '290 / 600' }}
        >
          {/* dynamic island */}
          <div className="absolute left-1/2 top-[9px] z-20 h-[24px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  )
}

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* lid / screen */}
      <div className="relative rounded-[14px] bg-[#1b1b1d] p-[11px] shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
        {/* camera */}
        <div className="absolute left-1/2 top-[4px] z-20 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#3a3a3d]" />
        <div
          className="relative overflow-hidden rounded-[6px] bg-white"
          style={{ aspectRatio: '16 / 10' }}
        >
          {children}
        </div>
      </div>
      {/* base / hinge */}
      <div className="relative mx-auto h-[15px] w-[114%] rounded-b-[10px] bg-gradient-to-b from-[#cfd3d9] to-[#a4a8af]">
        <div className="absolute left-1/2 top-0 h-[7px] w-[84px] -translate-x-1/2 rounded-b-[8px] bg-[#888c93]" />
      </div>
    </div>
  )
}

function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="relative rounded-[1.9rem] bg-[#1b1b1d] p-[14px] shadow-[0_20px_55px_rgba(0,0,0,0.42)] ring-1 ring-black/50">
        {/* camera */}
        <div className="absolute left-1/2 top-[6px] z-20 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#3a3a3d]" />
        <div
          className="relative overflow-hidden rounded-[1rem] bg-white"
          style={{ aspectRatio: '4 / 3' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function DeviceFrame({
  deviceType,
  children,
}: {
  deviceType: string
  children: React.ReactNode
}) {
  if (deviceType === 'phone') return <PhoneFrame>{children}</PhoneFrame>
  if (deviceType === 'tablet') return <TabletFrame>{children}</TabletFrame>
  return <LaptopFrame>{children}</LaptopFrame>
}

// ── Lightbox Modal ──
function Lightbox({
  screenshot,
  onClose,
}: {
  screenshot: ScreenshotData
  onClose: () => void
}) {
  const img = typeof screenshot.image === 'object' && screenshot.image ? screenshot.image : null
  const imgUrl = img?.url || null
  if (!imgUrl) return null

  const naturalW = img?.width || 1200
  const naturalH = img?.height || 800

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[210] flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-900 shadow-xl transition-colors duration-200 hover:bg-gray-200"
        aria-label="Close"
      >
        <X size={26} strokeWidth={2.5} />
      </button>
      <div className="relative flex max-h-[90vh] max-w-[92vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <Image
          src={imgUrl}
          alt={img?.alt || screenshot.title || ''}
          width={naturalW}
          height={naturalH}
          className="h-auto max-h-[82vh] w-auto max-w-full rounded-lg object-contain"
        />
        {(screenshot.title || screenshot.caption) && (
          <div className="text-center mt-4">
            {screenshot.title && <h3 className="text-white font-semibold text-lg">{screenshot.title}</h3>}
            {screenshot.caption && <p className="text-gray-400 text-sm mt-1">{screenshot.caption}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Screenshot Card ──
function ScreenshotCard({
  screenshot,
  showDeviceFrame,
  deviceType,
  onLightbox,
}: {
  screenshot: ScreenshotData
  showDeviceFrame: boolean
  deviceType: string
  onLightbox?: () => void
}) {
  const imgUrl = typeof screenshot.image === 'object' && screenshot.image?.url ? screenshot.image.url : null
  const alt = typeof screenshot.image === 'object' ? screenshot.image.alt || screenshot.title || '' : ''

  // Screen content: the screenshot sits inside the device screen (or card) plus
  // the hover-zoom overlay and category badge.
  // - Framed: `object-contain` so any image (QR, logo, portrait/landscape
  //   screenshot) shows fully centered without cropping or distortion.
  // - Unframed card: `object-cover` from the top for a clean thumbnail crop.
  const imgFitClass = showDeviceFrame
    ? 'object-contain'
    : 'object-cover object-top'
  const screenContent = (
    <>
      {imgUrl && (
        <Image
          src={imgUrl}
          alt={alt}
          fill
          className={`${imgFitClass} transition-transform duration-500 group-hover:scale-[1.03]`}
        />
      )}
      {onLightbox && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
          <ZoomIn
            size={32}
            className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      )}
      {screenshot.category && (
        <span className="absolute top-2 right-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
          {screenshot.category}
        </span>
      )}
    </>
  )

  return (
    <div className="group">
      {showDeviceFrame ? (
        <div className="cursor-pointer" onClick={onLightbox}>
          <DeviceFrame deviceType={deviceType}>{screenContent}</DeviceFrame>
        </div>
      ) : (
        <div
          className="relative cursor-pointer overflow-hidden rounded-xl bg-gray-50 shadow-md transition-shadow duration-300 hover:shadow-xl"
          onClick={onLightbox}
        >
          <div className="relative aspect-video">{screenContent}</div>
        </div>
      )}
      {(screenshot.title || screenshot.caption) && (
        <div className="mt-3 text-center">
          {screenshot.title && (
            <h3 className="font-semibold text-gray-900 text-sm">{screenshot.title}</h3>
          )}
          {screenshot.caption && (
            <p className="text-gray-500 text-xs mt-1">{screenshot.caption}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Block ──
export default function ScreenshotGalleryBlock(props: ScreenshotGalleryBlockProps) {
  const {
    sectionHeading,
    sectionDescription,
    headingAlignment,
    screenshots,
    columns = '3',
    enableLightbox = true,
    showDeviceFrame = false,
    deviceType = 'laptop',
    backgroundColor = '#F9FAFB',
  } = props

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!screenshots || screenshots.length === 0) return null

  const cols = columns || '3'
  const device = deviceType || 'laptop'
  const frame = showDeviceFrame === true

  return (
    <section className="py-16 px-6" style={{ backgroundColor: backgroundColor || '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          heading={sectionHeading}
          description={sectionDescription}
          alignment={headingAlignment}
        />

        <div className={`grid ${columnClasses[cols]} gap-8`}>
          {screenshots.map((screenshot, i) => (
            <ScrollReveal key={screenshot.id || i} delay={i * 100}>
              <ScreenshotCard
                screenshot={screenshot}
                showDeviceFrame={frame}
                deviceType={device}
                onLightbox={enableLightbox !== false ? () => setLightboxIndex(i) : undefined}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && screenshots[lightboxIndex] && (
        <Lightbox
          screenshot={screenshots[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  )
}
