-- ============================================================================
-- Manual migration: Document / PDF List block
-- Migration name: 20260722_103955_add_document_list_block
--
-- Safe to run on PRODUCTION via pgAdmin. It is idempotent: every statement is
-- guarded, so running it more than once will not error or duplicate anything.
--
-- It also inserts a row into "payload_migrations" so that a future
-- `pnpm migrate` recognises this migration as already applied and skips it.
-- ============================================================================

BEGIN;

-- 1) ENUM types (CREATE TYPE has no IF NOT EXISTS, so guard with a DO block) ---
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_document_list_heading_alignment') THEN
    CREATE TYPE "public"."enum_pages_blocks_document_list_heading_alignment" AS ENUM('left', 'center', 'right');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_blocks_document_list_columns') THEN
    CREATE TYPE "public"."enum_pages_blocks_document_list_columns" AS ENUM('1', '2');
  END IF;
END $$;

-- 2) Tables --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "pages_blocks_document_list_documents" (
	"_order" integer NOT NULL,
	"_parent_id" varchar NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"file_id" integer NOT NULL,
	"icon" varchar,
	"badge" varchar
);

CREATE TABLE IF NOT EXISTS "pages_blocks_document_list" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"section_heading" varchar,
	"section_description" varchar,
	"heading_alignment" "enum_pages_blocks_document_list_heading_alignment" DEFAULT 'center',
	"columns" "enum_pages_blocks_document_list_columns" DEFAULT '1',
	"enable_view" boolean DEFAULT true,
	"enable_download" boolean DEFAULT true,
	"accent_color" varchar DEFAULT '',
	"background_color" varchar DEFAULT '',
	"block_name" varchar
);

-- 3) Foreign keys (guard each so re-runs don't error) --------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pages_blocks_document_list_documents_file_id_media_id_fk'
  ) THEN
    ALTER TABLE "pages_blocks_document_list_documents"
      ADD CONSTRAINT "pages_blocks_document_list_documents_file_id_media_id_fk"
      FOREIGN KEY ("file_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pages_blocks_document_list_documents_parent_id_fk'
  ) THEN
    ALTER TABLE "pages_blocks_document_list_documents"
      ADD CONSTRAINT "pages_blocks_document_list_documents_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_document_list"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pages_blocks_document_list_parent_id_fk'
  ) THEN
    ALTER TABLE "pages_blocks_document_list"
      ADD CONSTRAINT "pages_blocks_document_list_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;

-- 4) Indexes -------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "pages_blocks_document_list_documents_order_idx"
  ON "pages_blocks_document_list_documents" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "pages_blocks_document_list_documents_parent_id_idx"
  ON "pages_blocks_document_list_documents" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "pages_blocks_document_list_documents_file_idx"
  ON "pages_blocks_document_list_documents" USING btree ("file_id");
CREATE INDEX IF NOT EXISTS "pages_blocks_document_list_order_idx"
  ON "pages_blocks_document_list" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "pages_blocks_document_list_parent_id_idx"
  ON "pages_blocks_document_list" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "pages_blocks_document_list_path_idx"
  ON "pages_blocks_document_list" USING btree ("_path");

-- 5) Record the migration so `pnpm migrate` skips it ---------------------------
INSERT INTO "payload_migrations" ("name", "batch", "updated_at", "created_at")
SELECT
  '20260722_103955_add_document_list_block',
  COALESCE((SELECT MAX("batch") FROM "payload_migrations"), 0) + 1,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM "payload_migrations"
  WHERE "name" = '20260722_103955_add_document_list_block'
);

COMMIT;
