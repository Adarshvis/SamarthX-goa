import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// CMS pages are served under this base path (e.g. /goa/about-us). Home stays at /.
const PAGE_PREFIX = '/goa'
const pageUrlFor = (slug: string) => (slug === 'home' ? '/' : `${PAGE_PREFIX}/${slug}`)
const legacyUrlFor = (slug: string) => (slug === 'home' ? '/' : `/${slug}`)

async function syncNavToHeader(payload: any) {
  // 1. Fetch current header to preserve manual items and submenus
  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  const rawExistingNav = header.navItems || []

  // 2. Fetch all pages so we can distinguish between page links and manual external links
  const allPages = await payload.find({ collection: 'pages', limit: 1000, depth: 0 })
  const allPageIds = new Set(allPages.docs.map((p: any) => p.id))

  // Map both the new (/goa/slug) and legacy (/slug) page URLs to the canonical
  // /goa URL. This lets us transition existing nav items from the old scheme to
  // the new one without treating them as external links.
  const urlNormalizeMap = new Map<string, string>()
  for (const p of allPages.docs) {
    const canonical = pageUrlFor(p.slug)
    urlNormalizeMap.set(legacyUrlFor(p.slug), canonical)
    urlNormalizeMap.set(canonical, canonical)
  }
  const normalizeUrl = (u: unknown): unknown =>
    typeof u === 'string' && urlNormalizeMap.has(u) ? urlNormalizeMap.get(u) : u

  // Normalise existing nav so any legacy /slug page links become /goa/slug.
  const existingNav = rawExistingNav.map((item: any) => ({ ...item, url: normalizeUrl(item.url) }))
  const allPageUrls = new Set(allPages.docs.map((p: any) => pageUrlFor(p.slug)))

  const hiddenPageUrls = new Set(
    (header.navSyncHiddenPageUrls || [])
      .map((item: { url?: string }) => normalizeUrl(item?.url))
      .filter((url: unknown): url is string => typeof url === 'string' && url.length > 0),
  )
  const lastSyncedPageUrls = new Set(
    (header.navSyncLastSyncedPageUrls || [])
      .map((item: { url?: string }) => normalizeUrl(item?.url))
      .filter((url: unknown): url is string => typeof url === 'string' && url.length > 0),
  )

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
  const activePageUrls = new Set(activePages.docs.map((page: any) => pageUrlFor(page.slug)))

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
    const url = pageUrlFor(page.slug)
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

// Run the sync WITHOUT blocking the save response. It kicks off just after the
// document's transaction commits, so it reliably sees the change, while the
// admin "Save" returns immediately instead of waiting for the nav rebuild.
function scheduleNavSync(payload: any) {
  setTimeout(() => {
    syncNavToHeader(payload).catch((err) => {
      payload.logger.error(`Failed to sync nav: ${err}`)
    })
  }, 0)
}

export const syncNavAfterChange: CollectionAfterChangeHook = ({
  req,
  doc,
  previousDoc,
  operation,
}) => {
  // Always sync on create; on update only when a nav-relevant field changed.
  if (operation === 'update' && previousDoc) {
    const changed = NAV_RELEVANT_FIELDS.some((field) => doc?.[field] !== previousDoc?.[field])
    if (!changed) return
  }
  scheduleNavSync(req.payload)
}

export const syncNavAfterDelete: CollectionAfterDeleteHook = ({ req }) => {
  scheduleNavSync(req.payload)
}
