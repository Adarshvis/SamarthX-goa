'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import RichText from '../ui/RichText'
import ScrollReveal from '../ui/ScrollReveal'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'

interface ArticleData {
  title: string
  excerpt?: string | null
  image?: any
  category?: string | null
  author?: string | null
  readTime?: string | null
  date?: string | null
  url?: string | null
  icon?: string | null
  categoryColor?: string | null
  id?: string | null
}

interface BlogPostsBlockProps {
  sectionHeading?: any
  sectionDescription?: any
  headingAlignment?: 'left' | 'center' | 'right' | null
  layout?: 'cards' | 'spotlight' | null
  entryType?: 'manual' | 'collection' | null
  articles?: ArticleData[]
  collectionSource?: {
    limit?: number | null
    sortBy?: 'latest' | 'oldest' | null
    category?: string | null
    featuredOnly?: boolean | null
  } | null
  columns?: '2' | '3' | '4' | null
  bottomLink?: {
    enabled?: boolean | null
    label?: string | null
    url?: string | null
  } | null
  backgroundColor?: string | null
}

interface BlogCollectionDoc {
  id?: string | number
  title: string
  excerpt?: string | null
  featuredImage?: any
  category?: string | null
  author?: string | null
  readTime?: string | null
  publishedDate?: string | null
  slug?: string | null
}

const columnClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).toUpperCase()
  } catch {
    return dateStr
  }
}

function buildBlogApiUrl(collectionSource?: BlogPostsBlockProps['collectionSource']) {
  const params = new URLSearchParams()
  const limit =
    typeof collectionSource?.limit === 'number' && collectionSource.limit > 0
      ? collectionSource.limit
      : 6
  params.set('limit', String(limit))
  params.set('depth', '1')
  params.set('where[status][equals]', 'published')
  params.set('sort', collectionSource?.sortBy === 'oldest' ? 'publishedDate' : '-publishedDate')
  if (collectionSource?.featuredOnly) params.set('where[isFeatured][equals]', 'true')
  if (collectionSource?.category?.trim()) params.set('where[category][equals]', collectionSource.category.trim())
  return `/api/blogs?${params.toString()}`
}

function mapBlogDocToArticle(doc: BlogCollectionDoc): ArticleData {
  return {
    id: typeof doc.id === 'string' || typeof doc.id === 'number' ? String(doc.id) : null,
    title: doc.title,
    excerpt: doc.excerpt || null,
    image: doc.featuredImage,
    category: doc.category || null,
    author: doc.author || null,
    readTime: doc.readTime || null,
    date: doc.publishedDate || null,
    url: doc.slug ? `/blogs/${doc.slug}` : null,
  }
}

function BlogCard({ article }: { article: ArticleData }) {
  const imgUrl = typeof article.image === 'object' && article.image?.url ? article.image.url : null
  const imgAlt = typeof article.image === 'object' && article.image?.alt ? article.image.alt : article.title

  const content = (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-slate-50/50 transition-all duration-500 hover:bg-white hover:shadow-2xl cursor-pointer h-full">
      {/* Image with category badge */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={imgAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-slate-200" />
        )}
        {article.category && (
          <div className="absolute left-4 top-4">
            <span className="inline-block rounded-full bg-white/80 px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-slate-800 backdrop-blur-md">
              {article.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
        <div>
          {/* Date + Read Time */}
          <div className="mb-4 flex items-center gap-4 text-slate-400">
            {article.date && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                <Clock className="h-3 w-3" />
                {formatDate(article.date)}
              </span>
            )}
            {article.readTime && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                <BookOpen className="h-3 w-3" />
                {article.readTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-4 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mb-6 text-sm leading-relaxed text-slate-500 line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Read More */}
        <span className="inline-flex items-center gap-2 self-start text-sm font-bold text-blue-600">
          Read More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  )

  if (article.url) {
    return <a href={article.url} className="block h-full">{content}</a>
  }
  return content
}

function SpotlightLayout({ articles }: { articles: ArticleData[] }) {
  if (articles.length === 0) return null

  const featured = articles[0]
  const sideArticles = articles.slice(1, 5)
  const featuredImg =
    typeof featured.image === 'object' && featured.image?.url ? featured.image.url : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <ScrollReveal>
          <div className="group relative overflow-hidden rounded-3xl h-full min-h-[400px] cursor-pointer">
            {featuredImg && (
              <Image
                src={featuredImg}
                alt={typeof featured.image === 'object' ? featured.image.alt || featured.title : featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              {featured.category && (
                <span className="mb-3 inline-block rounded-full bg-white/80 px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-slate-800 backdrop-blur-md">
                  {featured.category}
                </span>
              )}
              <h3 className="text-white text-2xl font-bold leading-tight mb-2">
                {featured.url ? (
                  <a href={featured.url} className="hover:underline">{featured.title}</a>
                ) : featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-white/80 text-sm line-clamp-2">{featured.excerpt}</p>
              )}
              <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-wider mt-3">
                {featured.date && (
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{formatDate(featured.date)}</span>
                )}
                {featured.readTime && (
                  <span className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" />{featured.readTime}</span>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-4">
        {sideArticles.map((article, i) => {
          const imgUrl = typeof article.image === 'object' && article.image?.url ? article.image.url : null
          return (
            <ScrollReveal key={article.id || i} delay={i * 100}>
              <div className="group flex min-h-[116px] gap-4 rounded-2xl bg-slate-50/50 p-5 transition-all duration-300 hover:bg-white hover:shadow-lg cursor-pointer">
                {imgUrl && (
                  <div className="relative w-24 h-20 shrink-0 overflow-hidden rounded-xl">
                    <Image src={imgUrl} alt={article.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {article.date && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {formatDate(article.date)}
                    </div>
                  )}
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.url ? <a href={article.url}>{article.title}</a> : article.title}
                  </h4>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </div>
  )
}

export default function BlogPostsBlock(props: BlogPostsBlockProps) {
  const {
    sectionHeading,
    sectionDescription,
    headingAlignment,
    layout = 'cards',
    entryType = 'manual',
    articles,
    collectionSource,
    columns = '4',
    bottomLink,
    backgroundColor = '#ffffff',
  } = props

  const [fetchedArticles, setFetchedArticles] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (entryType !== 'collection') {
      setFetchedArticles([])
      return
    }
    let active = true
    async function fetchBlogs() {
      try {
        setLoading(true)
        const res = await fetch(buildBlogApiUrl(collectionSource), { credentials: 'same-origin' })
        if (!res.ok) throw new Error('Failed to fetch blogs')
        const data = await res.json()
        const docs = Array.isArray(data?.docs) ? (data.docs as BlogCollectionDoc[]) : []
        if (active) setFetchedArticles(docs.map(mapBlogDocToArticle))
      } catch {
        if (active) setFetchedArticles([])
      } finally {
        if (active) setLoading(false)
      }
    }
    void fetchBlogs()
    return () => { active = false }
  }, [entryType, collectionSource?.category, collectionSource?.featuredOnly, collectionSource?.limit, collectionSource?.sortBy])

  const displayArticles = useMemo(() => {
    if (entryType === 'collection') return fetchedArticles
    return articles || []
  }, [articles, entryType, fetchedArticles])

  const align = headingAlignment || 'center'
  const hasHeading = sectionHeading?.root?.children?.length > 0
  const hasDescription = sectionDescription?.root?.children?.length > 0

  if (loading && entryType === 'collection' && displayArticles.length === 0) {
    return (
      <section className="py-24 px-6" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          {hasHeading && (
            <div className={`mb-20 max-w-3xl ${alignClasses[align]}`}>
              <RichText data={sectionHeading} />
            </div>
          )}
          <p className="text-slate-500">Loading blog posts...</p>
        </div>
      </section>
    )
  }

  if (!displayArticles || displayArticles.length === 0) return null

  const style = layout || 'cards'
  const cols = columns || '4'

  return (
    <section className="py-24 px-6" style={{ backgroundColor: backgroundColor || '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        {(hasHeading || hasDescription) && (
          <div className={`mb-20 max-w-3xl ${alignClasses[align]}`}>
            {hasHeading && <RichText data={sectionHeading} />}
            {hasDescription && <RichText data={sectionDescription} className="mt-4 text-lg text-slate-500 leading-relaxed" />}
          </div>
        )}

        {style === 'spotlight' ? (
          <SpotlightLayout articles={displayArticles} />
        ) : (
          <div className={`grid ${columnClasses[cols] || columnClasses['4']} gap-8`}>
            {displayArticles.map((article, i) => (
              <ScrollReveal key={article.id || i} delay={i * 100}>
                <BlogCard article={article} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {bottomLink?.enabled && bottomLink.label && bottomLink.url && (
          <div className="mt-20 text-center">
            <a
              href={bottomLink.url}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-12 py-4 text-lg font-semibold text-slate-800 transition-all hover:border-slate-400 hover:shadow-md"
            >
              {bottomLink.label}
              <ArrowRight size={20} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
