import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Step 1: Convert column to text and drop default
  await db.execute(sql`
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" DROP DEFAULT;
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" SET DATA TYPE text;
  `)

  // Step 2: Recreate enum with '4' included
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_blog_posts_columns";
    CREATE TYPE "public"."enum_pages_blocks_blog_posts_columns" AS ENUM('2', '3', '4');
  `)

  // Step 3: Cast back to enum and set new default
  await db.execute(sql`
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" SET DATA TYPE "public"."enum_pages_blocks_blog_posts_columns" USING "columns"::"public"."enum_pages_blocks_blog_posts_columns";
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" SET DEFAULT '4';
  `)

  // Step 4: Add new columns
  await db.execute(sql`
    ALTER TABLE "pages_blocks_blog_posts_articles" ADD COLUMN IF NOT EXISTS "read_time" varchar;
    ALTER TABLE "blogs" ADD COLUMN IF NOT EXISTS "read_time" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" DROP DEFAULT;
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_blog_posts_columns";
    CREATE TYPE "public"."enum_pages_blocks_blog_posts_columns" AS ENUM('2', '3');
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" SET DATA TYPE "public"."enum_pages_blocks_blog_posts_columns" USING "columns"::"public"."enum_pages_blocks_blog_posts_columns";
    ALTER TABLE "pages_blocks_blog_posts" ALTER COLUMN "columns" SET DEFAULT '3';
    ALTER TABLE "pages_blocks_blog_posts_articles" DROP COLUMN IF EXISTS "read_time";
    ALTER TABLE "blogs" DROP COLUMN IF EXISTS "read_time";
  `)
}
