import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import config from '@/payload.config'
import { getPayload } from '@/lib/payload'
import PageBanner from '../components/PageBanner'

async function getBlogsList() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'blogs',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 100,
  })
  return docs
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Blogs', description: 'Latest blog posts and articles' }
}

export default async function BlogsListingPage() {
  const blogsList = await getBlogsList()

  return (
    <div className="cms-page-shell">
      <PageBanner title="Blogs" slug="blogs" />
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsList.map((item: any) => {
            const imageUrl =
              typeof item.featuredImage === 'object' && item.featuredImage?.url
                ? item.featuredImage.url
                : null

            return (
              <Link
                key={item.id}
                href={`/blogs/${item.slug}`}
                className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                {imageUrl && (
                  <div className="relative h-48">
                    <Image src={imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  {item.category && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">
                      {item.category}
                    </p>
                  )}
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h2>
                  {item.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {item.publishedDate && <span>{formatDate(item.publishedDate)}</span>}
                    {item.author && <span>by {item.author}</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
