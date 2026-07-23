import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { getPayload } from '@/lib/payload'
import PageBanner from '../../components/PageBanner'
import BlockRenderer from '../../components/BlockRenderer'

async function getTeamPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'team-page' as any,
    where: { status: { equals: 'active' } },
    limit: 1,
    depth: 2,
  })
  return docs[0] || null
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getTeamPage()
  const pt = (page as any)?.pageTitle || {}
  return {
    title: pt.title || 'Our Team',
    description: pt.description || undefined,
  }
}

export default async function TeamListingPage() {
  const page = await getTeamPage()
  if (!page) notFound()

  const pt = (page as any).pageTitle || {}

  return (
    <div className="cms-page-shell">
      <PageBanner title={pt.title || 'Our Team'} slug={(page as any).slug || 'team'} />
      <BlockRenderer blocks={(page as any).layout} />
    </div>
  )
}
