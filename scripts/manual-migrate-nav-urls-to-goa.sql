-- ============================================================================
-- One-time data migration: move existing Header nav page links to /goa/<slug>
--
-- Run this in pgAdmin on PRODUCTION AFTER deploying the code that serves CMS
-- pages under /goa. It only rewrites nav links that point to a REAL page slug,
-- so external links and the home link ("/") are left untouched. It is safe to
-- run more than once (already-prefixed URLs are skipped).
--
-- Submenu children (header_nav_items_children) use page_id, not a URL, and the
-- app already prefixes them at render time — so they need no change here.
-- ============================================================================

BEGIN;

-- Top-level nav items: prefix "/slug" -> "/goa/slug" only when it matches a page
UPDATE "header_nav_items" hni
SET "url" = '/goa' || hni."url"
WHERE hni."url" LIKE '/%'
  AND hni."url" <> '/'
  AND hni."url" NOT LIKE '/goa/%'
  AND EXISTS (
    SELECT 1 FROM "pages" p
    WHERE '/' || p."slug" = hni."url"
  );

-- Sync-tracking lists (self-heal on next sync too, but update for consistency).
-- These tables only ever store page URLs. Guarded so re-runs are harmless.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_name = 'header_nav_sync_last_synced_page_urls') THEN
    UPDATE "header_nav_sync_last_synced_page_urls"
    SET "url" = '/goa' || "url"
    WHERE "url" LIKE '/%' AND "url" <> '/' AND "url" NOT LIKE '/goa/%';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_name = 'header_nav_sync_hidden_page_urls') THEN
    UPDATE "header_nav_sync_hidden_page_urls"
    SET "url" = '/goa' || "url"
    WHERE "url" LIKE '/%' AND "url" <> '/' AND "url" NOT LIKE '/goa/%';
  END IF;
END $$;

COMMIT;
