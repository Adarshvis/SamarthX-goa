import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_stats_bar_items_color_theme" AS ENUM('blue', 'green', 'purple', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_stats_bar_columns" AS ENUM('auto', '2', '3', '4');
  CREATE TABLE "pages_blocks_stats_bar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"value" varchar,
  	"label" varchar NOT NULL,
  	"color_theme" "enum_pages_blocks_stats_bar_items_color_theme" DEFAULT 'blue'
  );
  
  CREATE TABLE "pages_blocks_stats_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_stats_bar_columns" DEFAULT 'auto',
  	"show_dividers" boolean DEFAULT true,
  	"background_color" varchar DEFAULT '',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_stats_bar_items" ADD CONSTRAINT "pages_blocks_stats_bar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_bar" ADD CONSTRAINT "pages_blocks_stats_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_stats_bar_items_order_idx" ON "pages_blocks_stats_bar_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_bar_items_parent_id_idx" ON "pages_blocks_stats_bar_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_bar_order_idx" ON "pages_blocks_stats_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_bar_parent_id_idx" ON "pages_blocks_stats_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_bar_path_idx" ON "pages_blocks_stats_bar" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_stats_bar_items" CASCADE;
  DROP TABLE "pages_blocks_stats_bar" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_stats_bar_items_color_theme";
  DROP TYPE "public"."enum_pages_blocks_stats_bar_columns";`)
}
