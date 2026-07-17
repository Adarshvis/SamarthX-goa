import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_contact_section_layout" AS ENUM('modern', 'classic', 'centered', 'formOnly');
  CREATE TABLE "pages_blocks_contact_section_contact_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"value" varchar,
  	"icon_color" varchar DEFAULT '#3B82F6'
  );
  
  CREATE TABLE "pages_blocks_contact_section_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_contact_section_layout" DEFAULT 'modern' NOT NULL,
  	"section_heading" jsonb,
  	"section_description" jsonb,
  	"organization_name" varchar,
  	"organization_details" varchar,
  	"form_id" integer NOT NULL,
  	"submit_button_label" varchar DEFAULT 'Send Message',
  	"background_color" varchar DEFAULT '#ffffff',
  	"button_color" varchar DEFAULT '',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_contact_section_contact_items" ADD CONSTRAINT "pages_blocks_contact_section_contact_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section_logos" ADD CONSTRAINT "pages_blocks_contact_section_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section_logos" ADD CONSTRAINT "pages_blocks_contact_section_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_section" ADD CONSTRAINT "pages_blocks_contact_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_contact_section_contact_items_order_idx" ON "pages_blocks_contact_section_contact_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_section_contact_items_parent_id_idx" ON "pages_blocks_contact_section_contact_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_logos_order_idx" ON "pages_blocks_contact_section_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_section_logos_parent_id_idx" ON "pages_blocks_contact_section_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_logos_image_idx" ON "pages_blocks_contact_section_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_contact_section_order_idx" ON "pages_blocks_contact_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_section_parent_id_idx" ON "pages_blocks_contact_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_section_path_idx" ON "pages_blocks_contact_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_section_form_idx" ON "pages_blocks_contact_section" USING btree ("form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_contact_section_contact_items" CASCADE;
  DROP TABLE "pages_blocks_contact_section_logos" CASCADE;
  DROP TABLE "pages_blocks_contact_section" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_contact_section_layout";`)
}
