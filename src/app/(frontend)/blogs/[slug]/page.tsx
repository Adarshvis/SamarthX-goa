import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import config from '@/payload.config'
import { getPayload } from '@/lib/payload'
import RichText from '../../components/ui/RichText'
import PageBanner from '../../components/PageBanner'

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

  return (
    <div className="cms-page-shell">
      <PageBanner title={article.title} slug={slug} />
      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            {article.category && (
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                {article.category}
              </p>
            )}
            {article.author && (
              <p className="text-sm text-gray-500">by {article.author}</p>
            )}
          </div>
          {article.publishedDate && (
            <p className="text-sm text-gray-500 mb-6">{formatDate(article.publishedDate)}</p>
          )}

          {featuredImageUrl && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <Image src={featuredImageUrl} alt={featuredImageAlt} fill className="object-cover" />
            </div>
          )}

          {article.excerpt && (
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{article.excerpt}</p>
          )}

          {article.content ? <RichText data={article.content} /> : null}
        </div>
      </section>
    </div>
  )
}
