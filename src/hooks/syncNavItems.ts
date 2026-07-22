import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

async function syncNavToHeader(payload: any) {
  // 1. Fetch current header to preserve manual items and submenus
  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  const existingNav = header.navItems || []
  const hiddenPageUrls = new Set(
    (header.navSyncHiddenPageUrls || [])
      .map((item: { url?: string }) => item?.url)
      .filter((url: unknown): url is string => typeof url === 'string' && url.length > 0),
  )
  const lastSyncedPageUrls = new Set(
    (header.navSyncLastSyncedPageUrls || [])
      .map((item: { url?: string }) => item?.url)
      .filter((url: unknown): url is string => typeof url === 'string' && url.length > 0),
  )

  // 2. Fetch all pages so we can distinguish between page links and manual external links
  const allPages = await payload.find({ collection: 'pages', limit: 1000, depth: 0 })
  const allPageIds = new Set(allPages.docs.map((p: any) => p.id))
  const allPageUrls = new Set(allPages.docs.map((p: any) => p.slug === 'home' ? '/' : `/${p.slug}`))

  // 3. Filter out existing nav items that belong to pages (we will rebuild them). 
  // This leaves behind completely manual/external links so they don't get deleted!
  const manualNavItems = existingNav.filter((item: any) => !allPageUrls.has(item.url))

  const sanitizeChildren = (children: any[] | null | undefined) => {
    if (!Array.isArray(children)) return []
    return children.filter((child) => {
      const pageRef = child?.page
      if (typeof pageRef === 'number') return allPageIds.has(pageRef)
      if (typeof pageRef === 'string') return allPageIds.has(Number(pageRef)) || allPageIds.has(pageRef)
      if (pageRef && typeof pageRef === 'object' && 'id' in pageRef) return allPageIds.has(pageRef.id)
      return false
    })
  }

  // 4. Fetch the pages that SHOULD be in the nav
  const activePages = await payload.find({
    collection: 'pages',
    where: { showInNav: { equals: true }, status: { equals: 'published' } },
    sort: ['navOrder', 'createdAt'],
    limit: 1000,
    depth: 0
  })
  const activePageUrls = new Set(
    activePages.docs.map((page: any) => (page.slug === 'home' ? '/' : `/${page.slug}`)),
  )

  // Detect page links removed manually from Header nav after previous sync and persist them as hidden.
  const currentPageUrlsInNav = new Set(
    existingNav
      .map((item: any) => item?.url)
      .filter((url: unknown): url is string => typeof url === 'string' && activePageUrls.has(url)),
  )

  for (const url of lastSyncedPageUrls) {
    if (activePageUrls.has(url) && !currentPageUrlsInNav.has(url)) {
      hiddenPageUrls.add(url)
    }
  }

  // If admin adds a previously hidden page URL back manually, unhide it.
  for (const url of currentPageUrlsInNav) {
    hiddenPageUrls.delete(url)
  }

  // If a page is newly eligible for sync, do not keep stale hidden state.
  for (const url of activePageUrls) {
    if (!lastSyncedPageUrls.has(url)) {
      hiddenPageUrls.delete(url)
    }
  }

  // Keep hidden list clean by retaining only currently active page URLs.
  const nextHiddenUrls = [...hiddenPageUrls].filter((url) => activePageUrls.has(url))
  const nextHiddenSet = new Set(nextHiddenUrls)

  // 5. Build the new page links, but PRESERVE their existing `children` submenus
  // AND preserve the admin's manual ordering from the Header nav.
  const existingPageOrder = new Map<string, number>()
  existingNav.forEach((item: any, index: number) => {
    if (typeof item.url === 'string' && allPageUrls.has(item.url)) {
      existingPageOrder.set(item.url, index)
    }
  })

  const pageNavItems = activePages.docs.map((page: any) => {
    const url = page.slug === 'home' ? '/' : `/${page.slug}`
    const previousItem = existingNav.find((item: any) => item.url === url)
    return {
      label: page.title,
      url: url,
      children: sanitizeChildren(previousItem?.children), // Keep valid submenus only.
      _navOrder: page.navOrder ?? 0,
      _existingIndex: existingPageOrder.has(url) ? existingPageOrder.get(url)! : Infinity,
    }
  }).filter((item: any) => !nextHiddenSet.has(item.url))

  // If items already existed in the nav, preserve the admin's manual order.
  // Only newly added pages get sorted by navOrder and appended.
  const existingItems = pageNavItems.filter((item: any) => item._existingIndex !== Infinity)
  const newItems = pageNavItems.filter((item: any) => item._existingIndex === Infinity)

  existingItems.sort((a: any, b: any) => a._existingIndex - b._existingIndex)
  newItems.sort((a: any, b: any) => (a._navOrder - b._navOrder) || 0)

  // Clean up internal sort keys
  const sortedPageItems = [...existingItems, ...newItems].map(({ _navOrder, _existingIndex, ...rest }: any) => rest)

  // Combine them: Page links (preserving admin order), then any manual links at the end
  const navItems = [...sortedPageItems, ...manualNavItems]

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems,
      navSyncHiddenPageUrls: nextHiddenUrls.map((url) => ({ url })),
      navSyncLastSyncedPageUrls: sortedPageItems.map((item: any) => ({ url: item.url })),
    },
    overrideAccess: true,
  })
}

// Fields that affect the navigation. A resync only makes sense when one of
// these changes — content/layout edits should not rebuild the whole nav.
const NAV_RELEVANT_FIELDS = ['title', 'slug', 'status', 'showInNav', 'navOrder'] as const

export const syncNavAfterChange: CollectionAfterChangeHook = async ({
  req,
  doc,
  previousDoc,
  operation,
}) => {
  try {
    // Always sync on create; on update only when a nav-relevant field changed.
    if (operation === 'update' && previousDoc) {
      const changed = NAV_RELEVANT_FIELDS.some((field) => doc?.[field] !== previousDoc?.[field])
      if (!changed) return
    }
    await syncNavToHeader(req.payload)
  } catch (err) {
    req.payload.logger.error(`Failed to sync nav after change: ${err}`)
  }
}

export const syncNavAfterDelete: CollectionAfterDeleteHook = async ({ req }) => {
  try {
    await syncNavToHeader(req.payload)
  } catch (err) {
    req.payload.logger.error(`Failed to sync nav after delete: ${err}`)
  }
}
