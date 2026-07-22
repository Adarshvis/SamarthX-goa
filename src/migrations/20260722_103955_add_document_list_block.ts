import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_document_list_heading_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_document_list_columns" AS ENUM('1', '2');
  CREATE TABLE "pages_blocks_document_list_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"file_id" integer NOT NULL,
  	"icon" varchar,
  	"badge" varchar
  );
  
  CREATE TABLE "pages_blocks_document_list" (
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
  
  ALTER TABLE "pages_blocks_document_list_documents" ADD CONSTRAINT "pages_blocks_document_list_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_document_list_documents" ADD CONSTRAINT "pages_blocks_document_list_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_document_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_document_list" ADD CONSTRAINT "pages_blocks_document_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_document_list_documents_order_idx" ON "pages_blocks_document_list_documents" USING btree ("_order");
  CREATE INDEX "pages_blocks_document_list_documents_parent_id_idx" ON "pages_blocks_document_list_documents" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_document_list_documents_file_idx" ON "pages_blocks_document_list_documents" USING btree ("file_id");
  CREATE INDEX "pages_blocks_document_list_order_idx" ON "pages_blocks_document_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_document_list_parent_id_idx" ON "pages_blocks_document_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_document_list_path_idx" ON "pages_blocks_document_list" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_document_list_documents" CASCADE;
  DROP TABLE "pages_blocks_document_list" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_document_list_heading_alignment";
  DROP TYPE "public"."enum_pages_blocks_document_list_columns";`)
}
