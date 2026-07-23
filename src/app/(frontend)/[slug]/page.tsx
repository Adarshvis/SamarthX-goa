import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

// CMS pages now live under /goa/<slug>. Permanently redirect any old
// root-level page link to its new location so existing URLs keep working.
export default async function LegacyPageRedirect({ params }: PageProps) {
  const { slug } = await params
  permanentRedirect(`/goa/${slug}`)
}
