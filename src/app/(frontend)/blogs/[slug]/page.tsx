import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { getPayload } from '@/lib/payload'
import ArticleLayout from '../../components/ArticleLayout'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlogBySlug(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'blogs',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 1,
  })
  return docs[0] || null
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getBlogBySlug(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph:
      article.featuredImage &&
      typeof article.featuredImage === 'object' &&
      article.featuredImage.url
        ? { images: [{ url: article.featuredImage.url }] }
        : undefined,
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const article = await getBlogBySlug(slug)

  if (!article) notFound()

  const featuredImageUrl =
    article.featuredImage &&
    typeof article.featuredImage === 'object' &&
    article.featuredImage.url
      ? article.featuredImage.url
      : null

  const featuredImageAlt =
    article.featuredImage &&
    typeof article.featuredImage === 'object' &&
    article.featuredImage.alt
      ? article.featuredImage.alt
      : article.title

  const base = process.env.NEXT_PUBLIC_APP_URL || ''
  const shareUrl = base ? `${base}/blogs/${slug}` : ''

  return (
    <div className="cms-page-shell">
      <ArticleLayout
        title={article.title}
        category={article.category}
        date={formatDate(article.publishedDate)}
        author={article.author}
        readTime={article.readTime}
        imageUrl={featuredImageUrl}
        imageAlt={featuredImageAlt}
        excerpt={article.excerpt}
        content={article.content}
        tags={article.tags}
        backHref="/blogs"
        backLabel="Back to Blogs"
        shareUrl={shareUrl}
      />
    </div>
  )
}
