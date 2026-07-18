'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Lottie from 'lottie-react'
import DynamicIcon from '../ui/DynamicIcon'
import RichText from '../ui/RichText'
import SchoolIllustration from './hero/SchoolIllustration'

const mediaFillStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

const mediaCoverStyle: React.CSSProperties = {
  ...mediaFillStyle,
  objectFit: 'cover',
  objectPosition: 'center',
}

// ── Types ──
interface SlideData {
  mediaType?: string | null
  image?: any
  videoUrl?: string | null
  videoPoster?: any
  externalVideoUrl?: string | null
  animationUrl?: string | null
  dataVizEmbed?: string | null
  showText?: boolean | null
  heading?: string | null
  headingColor?: string | null
  subtitle?: string | null
  subtitleColor?: string | null
  buttons?: {
    label: string
    url: string
    variant?: 'primary' | 'secondary' | 'outline' | null
    icon?: string | null
    id?: string | null
  }[] | null
  id?: string | null
}

type ColorTheme = 'blue' | 'green' | 'purple' | 'orange'

interface ShowcaseMediaSlide {
  mediaType?: string | null
  image?: any
  videoUrl?: string | null
  videoPoster?: any
  externalVideoUrl?: string | null
  animationUrl?: string | null
  id?: string | null
}

interface ShowcaseData {
  eyebrow?: { enabled?: boolean | null; icon?: string | null; text?: string | null } | null
  title?: any
  subtitle?: any
  buttons?: {
    label: string
    url: string
    variant?: 'primary' | 'secondary' | 'outline' | null
    icon?: string | null
    openInNewTab?: boolean | null
    id?: string | null
  }[] | null
  trustBadges?: { icon?: string | null; label: string; colorTheme?: ColorTheme | null; id?: string | null }[] | null
  visualType?: 'illustration' | 'mediaSlider' | null
  visualSlides?: ShowcaseMediaSlide[] | null
  sliderSettings?: {
    autoPlay?: boolean | null
    autoPlayInterval?: number | null
    showArrows?: boolean | null
    showDots?: boolean | null
  } | null
  showFloatingCards?: boolean | null
  floatingCards?: {
    icon?: string | null
    label: string
    value: string
    suffix?: string | null
    colorTheme?: ColorTheme | null
    position?: 'topLeft' | 'midLeft' | 'topRight' | 'bottomRight' | null
    id?: string | null
  }[] | null
}

interface HeroBlockProps {
  mode?: 'single' | 'carousel' | null
  layout?: 'fullWidth' | 'fullscreenOverlayCarousel' | 'split' | 'splitShowcase' | 'contained' | null
  splitDirection?: 'textLeft' | 'textRight' | null
  showcaseEyebrow?: ShowcaseData['eyebrow']
  showcaseTitle?: any
  showcaseSubtitle?: any
  showcaseButtons?: ShowcaseData['buttons']
  showcaseTrustBadges?: ShowcaseData['trustBadges']
  showcaseVisualType?: ShowcaseData['visualType']
  showcaseVisualSlides?: ShowcaseData['visualSlides']
  showcaseSliderSettings?: ShowcaseData['sliderSettings']
  showcaseShowFloatingCards?: boolean | null
  showcaseFloatingCards?: ShowcaseData['floatingCards']
  height?: number | null
  textAlignment?: 'left' | 'center' | 'right' | null
  textVerticalPosition?: 'top' | 'center' | 'bottom' | null
  contentMaxWidth?: number | null
  contentPaddingX?: number | null
  contentPaddingY?: number | null
  constantOverlayContent?: boolean | null
  overlay?: { enabled?: boolean | null; color?: string | null; opacity?: number | null } | null
  headerGlass?: {
    enabled?: boolean | null
    fillColor?: string | null
    fillOpacity?: number | null
    blurAmount?: number | null
    showDivider?: boolean | null
  } | null
  carouselSettings?: {
    autoPlay?: boolean | null
    autoPlayInterval?: number | null
    showArrows?: boolean | null
    showDots?: boolean | null
  } | null
  singleSlide?: SlideData | null
  slides?: SlideData[] | null
}

function hexToRgba(hex: string, opacity: number): string {
  const normalized = hex.replace('#', '').trim()
  const valid = normalized.length === 3 || normalized.length === 6
  if (!valid) return `rgba(255, 255, 255, ${opacity})`

  const full =
    normalized.length === 3
      ? `${normalized[0]}${normalized[0]}${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}`
      : normalized

  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

function LottieFromUrl({ url }: { url: string }) {
  const [animationData, setAnimationData] = useState<any | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setAnimationData(null)
    setHasError(false)

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load Lottie JSON')
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  if (hasError) {
    return <iframe src={url} className="border-0" style={mediaFillStyle} loading="lazy" />
  }

  if (!animationData) {
    return <div className="absolute inset-0 animate-pulse bg-slate-800/40" />
  }

  return (
    <div className="absolute inset-0 w-full h-full p-4 sm:p-6">
      <Lottie animationData={animationData} loop autoplay className="w-full h-full" />
    </div>
  )
}

const alignClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

const verticalPositionClasses = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

const horizontalPositionClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const btnVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
  secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-gray-900',
}

// ── Helper: parse YouTube/Vimeo URL to embed ──
function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&controls=0&playlist=${ytMatch[1]}`
  const vmMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}?autoplay=1&muted=1&loop=1&background=1`
  return null
}

function hasTextContent(slide: SlideData): boolean {
  if (slide.showText === false) return false
  const hasButtons = Array.isArray(slide.buttons) && slide.buttons.length > 0
  return Boolean(slide.heading || slide.subtitle || hasButtons)
}

function hasMediaContent(slide: SlideData): boolean {
  const type = slide.mediaType || 'textOnly'

  if (type === 'image') {
    return Boolean(typeof slide.image === 'object' && slide.image?.url)
  }

  if (type === 'video') {
    return Boolean(slide.videoUrl)
  }

  if (type === 'externalVideo') {
    return Boolean(slide.externalVideoUrl && getEmbedUrl(slide.externalVideoUrl))
  }

  if (type === 'animation') {
    return Boolean(slide.animationUrl)
  }

  if (type === 'dataViz') {
    return Boolean(slide.dataVizEmbed)
  }

  return false
}

// ── Slide Media Renderer ──
function SlideMedia({ slide }: { slide: SlideData }) {
  const type = slide.mediaType || 'textOnly'

  if (type === 'image') {
    const url = typeof slide.image === 'object' && slide.image?.url ? slide.image.url : null
    if (!url) return null
    return (
      <img
        src={url}
        alt={typeof slide.image === 'object' ? slide.image.alt || '' : ''}
        style={mediaCoverStyle}
        loading="eager"
      />
    )
  }

  if (type === 'video') {
    const posterUrl = typeof slide.videoPoster === 'object' && slide.videoPoster?.url ? slide.videoPoster.url : undefined
    return (
      <video
        src={slide.videoUrl || undefined}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        style={mediaCoverStyle}
      />
    )
  }

  if (type === 'externalVideo' && slide.externalVideoUrl) {
    const embedUrl = getEmbedUrl(slide.externalVideoUrl)
    if (!embedUrl) return null
    return (
      <iframe
        src={embedUrl}
        className="border-0"
        style={mediaFillStyle}
        allow="autoplay; fullscreen"
        loading="lazy"
      />
    )
  }

  if (type === 'animation' && slide.animationUrl) {
    const isGif = slide.animationUrl.endsWith('.gif')
    const isLottieJson = slide.animationUrl.endsWith('.json')

    if (isLottieJson) {
      return <LottieFromUrl url={slide.animationUrl} />
    }

    if (isGif) {
      return <img src={slide.animationUrl} alt="" style={mediaCoverStyle} />
    }
    return (
      <iframe src={slide.animationUrl} className="border-0" style={mediaFillStyle} loading="lazy" />
    )
  }

  if (type === 'dataViz' && slide.dataVizEmbed) {
    return (
      <div style={mediaFillStyle} dangerouslySetInnerHTML={{ __html: slide.dataVizEmbed }} />
    )
  }

  return null
}

// ── Slide Text Content ──
function SlideContent({
  slide,
  align,
}: {
  slide: SlideData
  align: 'left' | 'center' | 'right'
}) {
  if (slide.showText === false) return null

  return (
    <div className={`relative z-10 flex flex-col gap-5 ${alignClasses[align]}`}>
      {slide.heading && (
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight break-words [overflow-wrap:anywhere] max-w-[22ch] animate-fade-in-up"
          style={slide.headingColor ? { color: slide.headingColor } : undefined}
        >
          {slide.heading}
        </h1>
      )}
      {slide.subtitle && (
        <p
          className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl animate-fade-in-up animation-delay-200"
          style={slide.subtitleColor ? { color: slide.subtitleColor } : undefined}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.buttons && slide.buttons.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2 animate-fade-in-up animation-delay-400">
          {slide.buttons.map((btn) => (
            <a
              key={btn.id || btn.url}
              href={btn.url}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${btnVariants[btn.variant || 'primary']}`}
            >
              {btn.label}
              {btn.icon && <DynamicIcon name={btn.icon} size={18} />}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Hero Block ──
export default function HeroBlock(props: HeroBlockProps) {
  const {
    mode = 'single',
    layout = 'fullWidth',
    showcaseEyebrow,
    showcaseTitle,
    showcaseSubtitle,
    showcaseButtons,
    showcaseTrustBadges,
    showcaseVisualType,
    showcaseVisualSlides,
    showcaseSliderSettings,
    showcaseShowFloatingCards,
    showcaseFloatingCards,
    splitDirection = 'textLeft',
    height = 600,
    textAlignment = 'center',
    textVerticalPosition = 'center',
    contentMaxWidth = 1200,
    contentPaddingX = 24,
    contentPaddingY = 32,
    constantOverlayContent = false,
    overlay,
    headerGlass,
    carouselSettings,
    singleSlide,
    slides,
  } = props

  const allSlides: SlideData[] =
    mode === 'carousel' && slides && slides.length > 0 ? slides : singleSlide ? [singleSlide] : []

  const [current, setCurrent] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const currentRef = useRef(0)

  useEffect(() => {
    if (allSlides.length === 0) {
      setCurrent(0)
      return
    }

    setCurrent((prev) => (prev >= allSlides.length ? 0 : prev))
  }, [allSlides.length])

  useEffect(() => {
    if (currentRef.current === current) return

    setPrevious(currentRef.current)
    currentRef.current = current

    const timer = window.setTimeout(() => {
      setPrevious(null)
    }, 750)

    return () => {
      window.clearTimeout(timer)
    }
  }, [current])

  const next = useCallback(() => {
    setCurrent((prev) => {
      if (allSlides.length === 0) return 0
      return (prev + 1) % allSlides.length
    })
  }, [allSlides.length])

  const prev = useCallback(() => {
    setCurrent((prev) => {
      if (allSlides.length === 0) return 0
      return (prev - 1 + allSlides.length) % allSlides.length
    })
  }, [allSlides.length])

  // Auto-play
  useEffect(() => {
    if (mode !== 'carousel' || !carouselSettings?.autoPlay || allSlides.length <= 1) return
    const interval = setInterval(next, carouselSettings.autoPlayInterval || 5000)
    return () => clearInterval(interval)
  }, [mode, carouselSettings, allSlides.length, next])

  useEffect(() => {
    if (layout !== 'fullscreenOverlayCarousel') return

    const headerEl = document.querySelector<HTMLElement>('.site-header')
    if (!headerEl) return

    const glassEnabled = headerGlass?.enabled !== false
    const fillOpacity = Math.min(Math.max((headerGlass?.fillOpacity ?? 20) / 100, 0), 1)
    const blurAmount = Math.min(Math.max(headerGlass?.blurAmount ?? 16, 0), 40)
    const fillColor = headerGlass?.fillColor || '#FFFFFF'
    const showDivider = headerGlass?.showDivider !== false

    const onScroll = () => {
      const solid = window.scrollY > 12
      headerEl.classList.toggle('hero-header-solid', solid)
      headerEl.classList.toggle('hero-header-transparent', !solid)
    }

    headerEl.classList.add('hero-header-overlay')
    headerEl.classList.toggle('header-glass', glassEnabled)
    headerEl.classList.toggle('hero-header-no-divider', !showDivider)
    if (glassEnabled) {
      headerEl.style.setProperty('--header-glass-bg', hexToRgba(fillColor, fillOpacity))
      headerEl.style.setProperty('--header-glass-blur', `${blurAmount}px`)
    } else {
      headerEl.style.removeProperty('--header-glass-bg')
      headerEl.style.removeProperty('--header-glass-blur')
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      headerEl.classList.remove('hero-header-overlay')
      headerEl.classList.remove('hero-header-solid')
      headerEl.classList.remove('hero-header-transparent')
      headerEl.classList.remove('header-glass')
      headerEl.classList.remove('hero-header-no-divider')
      headerEl.style.removeProperty('--header-glass-bg')
      headerEl.style.removeProperty('--header-glass-blur')
    }
  }, [layout, headerGlass])

  // Split Showcase renders its own self-contained layout (does not use base slides).
  if (layout === 'splitShowcase') {
    const showcase: ShowcaseData = {
      eyebrow: showcaseEyebrow,
      title: showcaseTitle,
      subtitle: showcaseSubtitle,
      buttons: showcaseButtons,
      trustBadges: showcaseTrustBadges,
      visualType: showcaseVisualType,
      visualSlides: showcaseVisualSlides,
      sliderSettings: showcaseSliderSettings,
      showFloatingCards: showcaseShowFloatingCards,
      floatingCards: showcaseFloatingCards,
    }
    return <SplitShowcaseHero showcase={showcase} />
  }

  if (allSlides.length === 0) return null

  const currentSlide = allSlides[current]
  const fallbackTextSlide = allSlides.find(hasTextContent) || allSlides[0]
  const fallbackMediaSlide = allSlides.find(hasMediaContent) || allSlides[0]
  const fullscreenContentSlide =
    mode === 'carousel' && layout === 'fullscreenOverlayCarousel' && constantOverlayContent
      ? fallbackTextSlide
      : currentSlide
  const align = textAlignment || 'center'
  const heroHeight = height || 600
  const showArrows = mode === 'carousel' && carouselSettings?.showArrows !== false && allSlides.length > 1
  const showDots = mode === 'carousel' && carouselSettings?.showDots !== false && allSlides.length > 1
  const autoPlayInterval = carouselSettings?.autoPlayInterval || 5000

  // Overlay
  const overlayEnabled = overlay?.enabled !== false
  const overlayColor = overlay?.color || '#000000'
  const overlayOpacity = (overlay?.opacity ?? 50) / 100

  if (layout === 'fullscreenOverlayCarousel') {
    const align = textAlignment || 'center'
    const vertical = textVerticalPosition || 'center'

    return (
      <section
        className="hero-fs-carousel"
        style={
          {
            '--hero-slide-fade-ms': '700ms',
            '--hero-kenburns-duration-ms': `${Math.max(autoPlayInterval + 1800, 9000)}ms`,
            marginTop: 'calc(var(--site-header-height, 140px) * -1)',
            paddingTop: 'var(--site-header-height, 140px)',
            minHeight: '100svh',
          } as React.CSSProperties
        }
        role="region"
        aria-label="Hero"
      >
        {allSlides.map((slide, i) => (
          <div
            key={slide.id || `fullscreen-slide-${i}`}
            className={`hero-fs-slide ${i === current ? 'is-active' : i === previous ? 'is-leaving' : 'is-idle'}`}
          >
            <div className="hero-fs-slide-media">
              <SlideMedia slide={slide} />
            </div>
          </div>
        ))}

        {overlayEnabled && (
          <div className="hero-fs-overlay" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
        )}

        <div
          className={`hero-fs-content-wrap ${verticalPositionClasses[vertical]} ${horizontalPositionClasses[align]}`}
        >
          <div
            className="hero-fs-content"
            style={{
              maxWidth: `${contentMaxWidth}px`,
              paddingInline: `${contentPaddingX}px`,
              paddingBlock: `${contentPaddingY}px`,
            }}
          >
            <SlideContent slide={fullscreenContentSlide} align={align} />
          </div>
        </div>

        {showArrows && <CarouselArrows prev={prev} next={next} />}
        {showDots && <CarouselDots total={allSlides.length} current={current} setCurrent={setCurrent} />}
      </section>
    )
  }

  // ── Split layout ──
  if (layout === 'split') {
    const isTextLeft = splitDirection !== 'textRight'
    return (
      <section className="bg-gray-900" style={{ minHeight: `${heroHeight}px` }}>
        <div
          className={`max-w-7xl mx-auto flex flex-col ${isTextLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} min-h-[inherit]`}
          style={{ minHeight: `${heroHeight}px` }}
        >
          <div className="flex-1 relative px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16 min-h-[320px] lg:min-h-0">
            {allSlides.map((slide, i) => {
              const textSlide = hasTextContent(slide) ? slide : fallbackTextSlide
              return (
                <div
                  key={slide.id || `split-text-${i}`}
                  className={`absolute inset-0 flex items-start px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16 transition-opacity duration-700 ease-in-out ${
                    i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="w-full">
                    <SlideContent slide={textSlide} align="left" />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex-1 relative overflow-hidden min-h-[320px] lg:min-h-0">
            {allSlides.map((slide, i) => {
              const mediaSlide = hasMediaContent(slide) ? slide : fallbackMediaSlide
              return (
                <div
                  key={slide.id || `split-media-${i}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <SlideMedia slide={mediaSlide} />
                </div>
              )
            })}
            {overlayEnabled && (
              <div className="absolute inset-0 z-[1]" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
            )}

            {showArrows && <CarouselArrows prev={prev} next={next} />}
            {showDots && <CarouselDots total={allSlides.length} current={current} setCurrent={setCurrent} />}
          </div>
        </div>
      </section>
    )
  }

  // ── Contained layout ──
  if (layout === 'contained') {
    return (
      <section className="py-12 px-6">
        <div
          className="relative max-w-6xl mx-auto rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ minHeight: `${heroHeight}px` }}
        >
          <SlideMedia slide={currentSlide} />
          {overlayEnabled && (
            <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
          )}
          <div className="relative z-10 px-8 py-16 w-full max-w-4xl mx-auto">
            <SlideContent slide={currentSlide} align={align} />
          </div>
          {showArrows && <CarouselArrows prev={prev} next={next} />}
          {showDots && <CarouselDots total={allSlides.length} current={current} setCurrent={setCurrent} />}
        </div>
      </section>
    )
  }

  // ── Full-width layout (default) ──
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center bg-gray-900"
      style={{ minHeight: `${heroHeight}px` }}
      role="region"
      aria-label="Hero"
    >
      {/* Slides */}
      {allSlides.map((slide, i) => (
        <div
          key={slide.id || i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <SlideMedia slide={slide} />
        </div>
      ))}

      {/* Overlay */}
      {overlayEnabled && (
        <div className="absolute inset-0 z-[1]" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
      )}

      {/* Text */}
      <div className="relative z-10 px-6 py-16 w-full max-w-4xl mx-auto">
        <SlideContent slide={currentSlide} align={align} />
      </div>

      {showArrows && <CarouselArrows prev={prev} next={next} />}
      {showDots && <CarouselDots total={allSlides.length} current={current} setCurrent={setCurrent} />}
    </section>
  )
}

// ── Carousel navigation ──
function CarouselArrows({ prev, next }: { prev: () => void; next: () => void }) {
  return (
    <>
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </>
  )
}

function CarouselDots({
  total,
  current,
  setCurrent,
}: {
  total: number
  current: number
  setCurrent: (i: number) => void
}) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrent(i)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i === current ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
          }`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  )
}

// ── Split Showcase layout ──

const showcaseThemeMap: Record<ColorTheme, { circle: string; icon: string; value: string }> = {
  blue: { circle: 'bg-blue-50', icon: 'text-[#2563eb]', value: 'text-[#2563eb]' },
  green: { circle: 'bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-600' },
  purple: { circle: 'bg-violet-50', icon: 'text-violet-600', value: 'text-violet-600' },
  orange: { circle: 'bg-orange-50', icon: 'text-orange-500', value: 'text-orange-500' },
}

const showcaseBtnVariants: Record<string, string> = {
  primary: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]',
  secondary: 'bg-white hover:bg-slate-50 text-[#2563eb] border border-slate-200 shadow-sm',
  outline: 'bg-transparent hover:bg-blue-50 text-[#2563eb] border-2 border-[#2563eb]',
}

const floatingPositionClasses: Record<string, string> = {
  topLeft: 'top-2 -left-2 md:top-4 md:left-0',
  midLeft: 'top-[38%] -left-4 md:left-0',
  topRight: 'top-6 -right-2 md:right-0',
  bottomRight: 'bottom-8 right-0 md:-right-2',
}

function hasShowcaseRichText(data: any): boolean {
  return Boolean(data?.root?.children?.length)
}

function ShowcaseMediaSliderView({
  slides,
  settings,
}: {
  slides: ShowcaseMediaSlide[]
  settings?: ShowcaseData['sliderSettings']
}) {
  const [current, setCurrent] = useState(0)
  const total = slides.length
  const autoPlay = settings?.autoPlay !== false
  const interval = settings?.autoPlayInterval || 5000
  const showArrows = settings?.showArrows !== false && total > 1
  const showDots = settings?.showDots !== false && total > 1

  useEffect(() => {
    if (!autoPlay || total <= 1) return
    const t = setInterval(() => setCurrent((p) => (p + 1) % total), interval)
    return () => clearInterval(t)
  }, [autoPlay, interval, total])

  if (total === 0) return null

  const blobRadius = '1.25rem'

  return (
    <div className="relative -mx-[5px]">
      <div
        className="relative aspect-[3/2] w-full overflow-hidden shadow-[0_24px_64px_rgba(15,23,42,0.12)]"
        style={{ borderRadius: blobRadius }}
      >
      {slides.map((slide, i) => {
        const isImage = (slide.mediaType || 'image') === 'image'
        const imgUrl = typeof slide.image === 'object' && slide.image?.url ? slide.image.url : null
        return (
          <div
            key={slide.id || i}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {isImage && imgUrl ? (
              <img
                src={imgUrl}
                alt={typeof slide.image === 'object' ? slide.image.alt || '' : ''}
                className="h-full w-full object-contain"
              />
            ) : (
              <SlideMedia slide={slide as SlideData} />
            )}
          </div>
        )
      })}

      {showArrows && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + total) % total)}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow backdrop-blur transition hover:bg-white"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % total)}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-700 shadow backdrop-blur transition hover:bg-white"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${i === current ? 'scale-110 bg-[#2563eb]' : 'bg-white/70'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

function FloatingStatCard({
  card,
}: {
  card: NonNullable<ShowcaseData['floatingCards']>[number]
}) {
  const theme = showcaseThemeMap[(card.colorTheme as ColorTheme) || 'blue']
  const pos = floatingPositionClasses[card.position || 'topLeft']
  return (
    <div
      className={`absolute ${pos} z-20 flex animate-float items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.1)]`}
    >
      <div>
        <p className="text-[12px] font-medium text-slate-500">{card.label}</p>
        <p className="font-heading mt-0.5 text-[22px] font-extrabold text-[#0f172a]">
          {card.value}
          {card.suffix ? <span className={`ml-1 align-middle text-[12px] font-semibold ${theme.value}`}>{card.suffix}</span> : null}
        </p>
      </div>
      {card.icon ? (
        <span className={`flex h-11 w-11 items-center justify-center rounded-full ${theme.circle}`}>
          <DynamicIcon name={card.icon} size={20} className={theme.icon} />
        </span>
      ) : null}
    </div>
  )
}

function SplitShowcaseHero({ showcase }: { showcase?: ShowcaseData }) {
  if (!showcase) return null

  const eyebrow = showcase.eyebrow
  const buttons = showcase.buttons || []
  const trustBadges = showcase.trustBadges || []
  const visualType = showcase.visualType || 'illustration'
  const visualSlides = showcase.visualSlides || []
  const floatingEnabled = showcase.showFloatingCards !== false
  const floatingCards = showcase.floatingCards || []

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#eef4fd] via-[#f2f7fd] to-[#f8fbfe]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 pt-14 pb-20 lg:grid-cols-2 lg:px-12">
        {/* Left */}
        <div className="animate-fade-up">
          {eyebrow?.enabled !== false && (eyebrow?.text || eyebrow?.icon) && (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              {eyebrow?.icon ? <DynamicIcon name={eyebrow.icon} size={16} className="text-[#2563eb]" /> : null}
              {eyebrow?.text ? <span className="text-[13px] font-medium text-[#0f172a]">{eyebrow.text}</span> : null}
            </div>
          )}

          {hasShowcaseRichText(showcase.title) && (
            <div className="cms-richtext mt-7 [&_h1]:font-heading [&_h1]:text-[40px] [&_h1]:font-extrabold [&_h1]:leading-[1.08] [&_h1]:tracking-tight [&_h1]:text-[#0f172a] md:[&_h1]:text-[56px] [&_h2]:font-heading [&_h2]:text-[34px] [&_h2]:font-extrabold [&_h2]:leading-[1.1] [&_h2]:text-[#0f172a]">
              <RichText data={showcase.title} />
            </div>
          )}

          {hasShowcaseRichText(showcase.subtitle) && (
            <div className="cms-richtext mt-6 max-w-md text-[17px] leading-relaxed text-[#475569] [&_p]:text-[#475569]">
              <RichText data={showcase.subtitle} />
            </div>
          )}

          {buttons.length > 0 && (
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {buttons.map((btn) => (
                <a
                  key={btn.id || btn.url}
                  href={btn.url}
                  target={btn.openInNewTab ? '_blank' : undefined}
                  rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={`group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold transition-colors duration-200 ${showcaseBtnVariants[btn.variant || 'primary']}`}
                >
                  {btn.label}
                  {btn.icon ? (
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      <DynamicIcon name={btn.icon} size={16} />
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
          )}

          {trustBadges.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {trustBadges.map((badge, i) => {
                const theme = showcaseThemeMap[(badge.colorTheme as ColorTheme) || 'blue']
                return (
                  <div
                    key={badge.id || i}
                    className="flex items-center gap-2 rounded-full border border-slate-100 bg-white/90 py-1.5 pl-1.5 pr-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.circle} ${theme.icon}`}>
                      {badge.icon ? <DynamicIcon name={badge.icon} size={16} /> : null}
                    </span>
                    <span className="text-[12.5px] font-semibold text-[#0f172a]">{badge.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="relative animate-fade-up" style={{ animationDelay: '0.15s' }}>
          {visualType === 'mediaSlider' && visualSlides.length > 0 ? (
            <ShowcaseMediaSliderView slides={visualSlides} settings={showcase.sliderSettings} />
          ) : (
            <div className="relative">
              <div
                className="absolute inset-0 -m-8 bg-gradient-to-br from-[#dbeafe] to-[#eff6ff]"
                style={{ borderRadius: '50%' }}
              />
              <div className="relative">
                <SchoolIllustration />
              </div>
            </div>
          )}

          {floatingEnabled &&
            floatingCards.map((card, i) => <FloatingStatCard key={card.id || i} card={card} />)}
        </div>
      </div>
    </section>
  )
}
