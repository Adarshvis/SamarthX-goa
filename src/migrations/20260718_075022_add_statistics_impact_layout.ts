import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_statistics_layout" ADD VALUE 'impact' BEFORE 'circularRings';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_statistics" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_statistics" ALTER COLUMN "layout" SET DEFAULT 'cardGrid'::text;
  DROP TYPE "public"."enum_pages_blocks_statistics_layout";
  CREATE TYPE "public"."enum_pages_blocks_statistics_layout" AS ENUM('cardGrid', 'circularRings', 'interlockingRings');
  ALTER TABLE "pages_blocks_statistics" ALTER COLUMN "layout" SET DEFAULT 'cardGrid'::"public"."enum_pages_blocks_statistics_layout";
  ALTER TABLE "pages_blocks_statistics" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_pages_blocks_statistics_layout" USING "layout"::"public"."enum_pages_blocks_statistics_layout";`)
}
