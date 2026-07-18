import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Convert Statistics heading/description from plain text (varchar) to rich text (jsonb).
  // Old plain-text values are not valid Lexical JSON, so drop and re-add the columns.
  await db.execute(sql`
    ALTER TABLE "pages_blocks_statistics" DROP COLUMN IF EXISTS "section_heading";
    ALTER TABLE "pages_blocks_statistics" ADD COLUMN "section_heading" jsonb;
    ALTER TABLE "pages_blocks_statistics" DROP COLUMN IF EXISTS "section_description";
    ALTER TABLE "pages_blocks_statistics" ADD COLUMN "section_description" jsonb;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_statistics" DROP COLUMN IF EXISTS "section_heading";
    ALTER TABLE "pages_blocks_statistics" ADD COLUMN "section_heading" varchar;
    ALTER TABLE "pages_blocks_statistics" DROP COLUMN IF EXISTS "section_description";
    ALTER TABLE "pages_blocks_statistics" ADD COLUMN "section_description" varchar;
  `)
}
