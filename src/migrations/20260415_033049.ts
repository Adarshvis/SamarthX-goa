import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Goa Snapshot summary cards (may already exist from earlier migrations)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_goa_snapshot_summary_cards_cards_value_source" AS ENUM('totalSchools', 'districtCount', 'talukaCount', 'currentViewItems', 'minoritySchools', 'girlsOnlySchools', 'boysOnlySchools', 'englishMedium', 'konkaniMedium', 'marathiMedium', 'custom');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  // Blog Posts enums
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_blog_posts_heading_alignment" AS ENUM('left', 'center', 'right');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_blog_posts_layout" AS ENUM('cards', 'spotlight');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_blog_posts_entry_type" AS ENUM('manual', 'collection');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_blog_posts_collection_source_sort_by" AS ENUM('latest', 'oldest');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_blog_posts_columns" AS ENUM('2', '3');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_blogs_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  // Goa Snapshot summary cards table (may already exist)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_goa_snapshot_summary_cards_cards" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "is_enabled" boolean DEFAULT true,
      "label" varchar NOT NULL,
      "icon_name" varchar DEFAULT 'School',
      "value_source" "enum_pages_blocks_goa_snapshot_summary_cards_cards_value_source" DEFAULT 'custom' NOT NULL,
      "custom_value" numeric DEFAULT 0
    );
  `)

  // Blog Posts tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_blog_posts_articles" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "excerpt" varchar,
      "image_id" integer,
      "category" varchar,
      "author" varchar,
      "date" timestamp(3) with time zone,
      "url" varchar,
      "icon" varchar,
      "category_color" varchar DEFAULT '#3B82F6'
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_blog_posts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_heading" jsonb,
      "section_description" jsonb,
      "heading_alignment" "enum_pages_blocks_blog_posts_heading_alignment" DEFAULT 'center',
      "layout" "enum_pages_blocks_blog_posts_layout" DEFAULT 'cards' NOT NULL,
      "entry_type" "enum_pages_blocks_blog_posts_entry_type" DEFAULT 'manual' NOT NULL,
      "collection_source_limit" numeric DEFAULT 6,
      "collection_source_sort_by" "enum_pages_blocks_blog_posts_collection_source_sort_by" DEFAULT 'latest',
      "collection_source_category" varchar,
      "collection_source_featured_only" boolean DEFAULT false,
      "columns" "enum_pages_blocks_blog_posts_columns" DEFAULT '3',
      "bottom_link_enabled" boolean DEFAULT false,
      "bottom_link_label" varchar DEFAULT 'View All Blogs',
      "bottom_link_url" varchar,
      "background_color" varchar DEFAULT '#F9FAFB',
      "block_name" varchar
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "blogs_tags" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "tag" varchar NOT NULL
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "blogs" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "excerpt" varchar NOT NULL,
      "featured_image_id" integer NOT NULL,
      "category" varchar NOT NULL,
      "content" jsonb NOT NULL,
      "published_date" timestamp(3) with time zone NOT NULL,
      "author" varchar,
      "is_featured" boolean DEFAULT false,
      "status" "enum_blogs_status" DEFAULT 'draft' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // ALTER TABLE columns (safe with IF NOT EXISTS pattern)
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_slides" ADD COLUMN IF NOT EXISTS "heading_color" varchar DEFAULT '#FFFFFF';
    ALTER TABLE "pages_blocks_hero_slides" ADD COLUMN IF NOT EXISTS "subtitle_color" varchar DEFAULT '#E5E7EB';
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "constant_overlay_content" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "header_glass_enabled" boolean DEFAULT true;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "header_glass_fill_color" varchar DEFAULT '#FFFFFF';
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "header_glass_fill_opacity" numeric DEFAULT 20;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "header_glass_blur_amount" numeric DEFAULT 16;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "header_glass_show_divider" boolean DEFAULT true;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "single_slide_heading_color" varchar DEFAULT '#FFFFFF';
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "single_slide_subtitle_color" varchar DEFAULT '#E5E7EB';
    ALTER TABLE "pages_blocks_goa_snapshot" ADD COLUMN IF NOT EXISTS "filter_settings_show_apply_button" boolean DEFAULT true;
    ALTER TABLE "pages_blocks_goa_snapshot" ADD COLUMN IF NOT EXISTS "summary_cards_enabled" boolean DEFAULT true;
    ALTER TABLE "pages_blocks_goa_snapshot" ADD COLUMN IF NOT EXISTS "summary_cards_animate_scroll" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_goa_snapshot" ADD COLUMN IF NOT EXISTS "summary_cards_scroll_duration_seconds" numeric DEFAULT 22;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "blogs_id" integer;
  `)

  // Foreign keys (use DO block to skip if already exists)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_goa_snapshot_summary_cards_cards" ADD CONSTRAINT "pages_blocks_goa_snapshot_summary_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_goa_snapshot"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_blog_posts_articles" ADD CONSTRAINT "pages_blocks_blog_posts_articles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_blog_posts_articles" ADD CONSTRAINT "pages_blocks_blog_posts_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_blog_posts"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_blog_posts" ADD CONSTRAINT "pages_blocks_blog_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "blogs_tags" ADD CONSTRAINT "blogs_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "blogs" ADD CONSTRAINT "blogs_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  // Indexes (CREATE INDEX IF NOT EXISTS)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "pages_blocks_goa_snapshot_summary_cards_cards_order_idx" ON "pages_blocks_goa_snapshot_summary_cards_cards" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_goa_snapshot_summary_cards_cards_parent_id_idx" ON "pages_blocks_goa_snapshot_summary_cards_cards" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_blog_posts_articles_order_idx" ON "pages_blocks_blog_posts_articles" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_blog_posts_articles_parent_id_idx" ON "pages_blocks_blog_posts_articles" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_blog_posts_articles_image_idx" ON "pages_blocks_blog_posts_articles" USING btree ("image_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_blog_posts_order_idx" ON "pages_blocks_blog_posts" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_blog_posts_parent_id_idx" ON "pages_blocks_blog_posts" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_blog_posts_path_idx" ON "pages_blocks_blog_posts" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "blogs_tags_order_idx" ON "blogs_tags" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "blogs_tags_parent_id_idx" ON "blogs_tags" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "blogs_slug_idx" ON "blogs" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "blogs_featured_image_idx" ON "blogs" USING btree ("featured_image_id");
    CREATE INDEX IF NOT EXISTS "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_goa_snapshot_summary_cards_cards" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "pages_blocks_blog_posts_articles" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "pages_blocks_blog_posts" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "blogs_tags" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "blogs" DISABLE ROW LEVEL SECURITY;
    DROP TABLE IF EXISTS "pages_blocks_goa_snapshot_summary_cards_cards" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_blog_posts_articles" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_blog_posts" CASCADE;
    DROP TABLE IF EXISTS "blogs_tags" CASCADE;
    DROP TABLE IF EXISTS "blogs" CASCADE;
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_blogs_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_blogs_id_idx";
    ALTER TABLE "pages_blocks_hero_slides" DROP COLUMN IF EXISTS "heading_color";
    ALTER TABLE "pages_blocks_hero_slides" DROP COLUMN IF EXISTS "subtitle_color";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "constant_overlay_content";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "header_glass_enabled";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "header_glass_fill_color";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "header_glass_fill_opacity";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "header_glass_blur_amount";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "header_glass_show_divider";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "single_slide_heading_color";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "single_slide_subtitle_color";
    ALTER TABLE "pages_blocks_goa_snapshot" DROP COLUMN IF EXISTS "filter_settings_show_apply_button";
    ALTER TABLE "pages_blocks_goa_snapshot" DROP COLUMN IF EXISTS "summary_cards_enabled";
    ALTER TABLE "pages_blocks_goa_snapshot" DROP COLUMN IF EXISTS "summary_cards_animate_scroll";
    ALTER TABLE "pages_blocks_goa_snapshot" DROP COLUMN IF EXISTS "summary_cards_scroll_duration_seconds";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "blogs_id";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_goa_snapshot_summary_cards_cards_value_source";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_blog_posts_heading_alignment";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_blog_posts_layout";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_blog_posts_entry_type";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_blog_posts_collection_source_sort_by";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_blog_posts_columns";
    DROP TYPE IF EXISTS "public"."enum_blogs_status";
  `)
}
