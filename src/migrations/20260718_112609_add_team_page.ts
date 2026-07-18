import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_team_grid_members_social_links_platform" AS ENUM('linkedin', 'twitter-x', 'github', 'instagram', 'facebook', 'youtube', 'google', 'globe', 'envelope');
  CREATE TYPE "public"."enum_pages_blocks_team_grid_members_academic_links_platform" AS ENUM('google-scholar', 'researchgate', 'orcid', 'academia', 'scopus', 'wos', 'other');
  CREATE TYPE "public"."enum_team_page_blocks_team_grid_members_social_links_platform" AS ENUM('linkedin', 'twitter-x', 'github', 'instagram', 'facebook', 'youtube', 'google', 'globe', 'envelope');
  CREATE TYPE "public"."enum_team_page_blocks_team_grid_members_academic_links_platform" AS ENUM('google-scholar', 'researchgate', 'orcid', 'academia', 'scopus', 'wos', 'other');
  CREATE TYPE "public"."enum_team_page_blocks_team_grid_heading_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_team_page_blocks_team_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_team_page_blocks_rich_content_heading_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_team_page_blocks_rich_content_max_width" AS ENUM('narrow', 'medium', 'full');
  CREATE TYPE "public"."enum_team_page_blocks_call_to_action_buttons_variant" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_team_page_blocks_call_to_action_heading_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_team_page_blocks_call_to_action_background_type" AS ENUM('color', 'image');
  CREATE TYPE "public"."enum_team_page_blocks_banner_alert_heading_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_team_page_blocks_banner_alert_type" AS ENUM('info', 'success', 'warning', 'error');
  CREATE TYPE "public"."enum_team_page_status" AS ENUM('active', 'inactive');
  CREATE TABLE "pages_blocks_team_grid_members_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_team_grid_members_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_team_grid_members_research_interests" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"interest" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_team_grid_members_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"degree" varchar NOT NULL,
  	"institution" varchar NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid_members_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" varchar NOT NULL,
  	"organization" varchar NOT NULL,
  	"duration" varchar,
  	"exp_description" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid_members_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"year" varchar,
  	"organization" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid_members_courses" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"course_name" varchar NOT NULL,
  	"course_code" varchar,
  	"semester" varchar,
  	"course_description" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid_members_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"journal" varchar,
  	"year" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_team_grid_members_academic_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_team_grid_members_academic_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_team_page_blocks_team_grid_members_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_research_interests" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"interest" varchar NOT NULL
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"degree" varchar NOT NULL,
  	"institution" varchar NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" varchar NOT NULL,
  	"organization" varchar NOT NULL,
  	"duration" varchar,
  	"exp_description" varchar
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"year" varchar,
  	"organization" varchar
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_courses" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"course_name" varchar NOT NULL,
  	"course_code" varchar,
  	"semester" varchar,
  	"course_description" varchar
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"journal" varchar,
  	"year" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members_academic_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_team_page_blocks_team_grid_members_academic_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "team_page_blocks_team_grid_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"role" varchar,
  	"bio" varchar,
  	"profile_link" varchar,
  	"biography" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"office" varchar
  );
  
  CREATE TABLE "team_page_blocks_team_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_heading" varchar,
  	"section_description" varchar,
  	"heading_alignment" "enum_team_page_blocks_team_grid_heading_alignment" DEFAULT 'center',
  	"columns" "enum_team_page_blocks_team_grid_columns" DEFAULT '3',
  	"show_social_links" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "team_page_blocks_rich_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_heading" varchar,
  	"section_description" varchar,
  	"heading_alignment" "enum_team_page_blocks_rich_content_heading_alignment" DEFAULT 'center',
  	"content" jsonb NOT NULL,
  	"max_width" "enum_team_page_blocks_rich_content_max_width" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "team_page_blocks_call_to_action_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_team_page_blocks_call_to_action_buttons_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "team_page_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_heading" varchar,
  	"section_description" varchar,
  	"heading_alignment" "enum_team_page_blocks_call_to_action_heading_alignment" DEFAULT 'center',
  	"heading" varchar NOT NULL,
  	"description" varchar,
  	"background_type" "enum_team_page_blocks_call_to_action_background_type" DEFAULT 'color',
  	"background_color" varchar DEFAULT '#1E40AF',
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "team_page_blocks_banner_alert" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_heading" varchar,
  	"section_description" varchar,
  	"heading_alignment" "enum_team_page_blocks_banner_alert_heading_alignment" DEFAULT 'center',
  	"type" "enum_team_page_blocks_banner_alert_type" DEFAULT 'info' NOT NULL,
  	"message" varchar NOT NULL,
  	"dismissible" boolean DEFAULT false,
  	"link_label" varchar,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "team_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_name" varchar NOT NULL,
  	"status" "enum_team_page_status" DEFAULT 'active' NOT NULL,
  	"page_title_title" varchar NOT NULL,
  	"page_title_eyebrow" varchar,
  	"page_title_description" varchar,
  	"slug" varchar DEFAULT 'team' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_team_grid_members" ADD COLUMN "slug" varchar;
  ALTER TABLE "pages_blocks_team_grid_members" ADD COLUMN "profile_link" varchar;
  ALTER TABLE "pages_blocks_team_grid_members" ADD COLUMN "biography" varchar;
  ALTER TABLE "pages_blocks_team_grid_members" ADD COLUMN "email" varchar;
  ALTER TABLE "pages_blocks_team_grid_members" ADD COLUMN "phone" varchar;
  ALTER TABLE "pages_blocks_team_grid_members" ADD COLUMN "office" varchar;
  ALTER TABLE "pages_blocks_team_grid" ADD COLUMN "show_social_links" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_page_id" integer;
  ALTER TABLE "pages_blocks_team_grid_members_social_links" ADD CONSTRAINT "pages_blocks_team_grid_members_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_members_research_interests" ADD CONSTRAINT "pages_blocks_team_grid_members_research_interests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_members_education" ADD CONSTRAINT "pages_blocks_team_grid_members_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_members_experience" ADD CONSTRAINT "pages_blocks_team_grid_members_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_members_awards" ADD CONSTRAINT "pages_blocks_team_grid_members_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_members_courses" ADD CONSTRAINT "pages_blocks_team_grid_members_courses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_members_publications" ADD CONSTRAINT "pages_blocks_team_grid_members_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_grid_members_academic_links" ADD CONSTRAINT "pages_blocks_team_grid_members_academic_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_social_links" ADD CONSTRAINT "team_page_blocks_team_grid_members_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_research_interests" ADD CONSTRAINT "team_page_blocks_team_grid_members_research_interests_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_education" ADD CONSTRAINT "team_page_blocks_team_grid_members_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_experience" ADD CONSTRAINT "team_page_blocks_team_grid_members_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_awards" ADD CONSTRAINT "team_page_blocks_team_grid_members_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_courses" ADD CONSTRAINT "team_page_blocks_team_grid_members_courses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_publications" ADD CONSTRAINT "team_page_blocks_team_grid_members_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members_academic_links" ADD CONSTRAINT "team_page_blocks_team_grid_members_academic_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members" ADD CONSTRAINT "team_page_blocks_team_grid_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid_members" ADD CONSTRAINT "team_page_blocks_team_grid_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_team_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_team_grid" ADD CONSTRAINT "team_page_blocks_team_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_rich_content" ADD CONSTRAINT "team_page_blocks_rich_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_call_to_action_buttons" ADD CONSTRAINT "team_page_blocks_call_to_action_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page_blocks_call_to_action"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_call_to_action" ADD CONSTRAINT "team_page_blocks_call_to_action_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_page_blocks_call_to_action" ADD CONSTRAINT "team_page_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_page_blocks_banner_alert" ADD CONSTRAINT "team_page_blocks_banner_alert_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_team_grid_members_social_links_order_idx" ON "pages_blocks_team_grid_members_social_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_social_links_parent_id_idx" ON "pages_blocks_team_grid_members_social_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_members_research_interests_order_idx" ON "pages_blocks_team_grid_members_research_interests" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_research_interests_parent_id_idx" ON "pages_blocks_team_grid_members_research_interests" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_members_education_order_idx" ON "pages_blocks_team_grid_members_education" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_education_parent_id_idx" ON "pages_blocks_team_grid_members_education" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_members_experience_order_idx" ON "pages_blocks_team_grid_members_experience" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_experience_parent_id_idx" ON "pages_blocks_team_grid_members_experience" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_members_awards_order_idx" ON "pages_blocks_team_grid_members_awards" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_awards_parent_id_idx" ON "pages_blocks_team_grid_members_awards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_members_courses_order_idx" ON "pages_blocks_team_grid_members_courses" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_courses_parent_id_idx" ON "pages_blocks_team_grid_members_courses" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_members_publications_order_idx" ON "pages_blocks_team_grid_members_publications" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_publications_parent_id_idx" ON "pages_blocks_team_grid_members_publications" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_grid_members_academic_links_order_idx" ON "pages_blocks_team_grid_members_academic_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_grid_members_academic_links_parent_id_idx" ON "pages_blocks_team_grid_members_academic_links" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_social_links_order_idx" ON "team_page_blocks_team_grid_members_social_links" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_social_links_parent_id_idx" ON "team_page_blocks_team_grid_members_social_links" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_research_interests_order_idx" ON "team_page_blocks_team_grid_members_research_interests" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_research_interests_parent_id_idx" ON "team_page_blocks_team_grid_members_research_interests" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_education_order_idx" ON "team_page_blocks_team_grid_members_education" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_education_parent_id_idx" ON "team_page_blocks_team_grid_members_education" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_experience_order_idx" ON "team_page_blocks_team_grid_members_experience" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_experience_parent_id_idx" ON "team_page_blocks_team_grid_members_experience" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_awards_order_idx" ON "team_page_blocks_team_grid_members_awards" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_awards_parent_id_idx" ON "team_page_blocks_team_grid_members_awards" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_courses_order_idx" ON "team_page_blocks_team_grid_members_courses" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_courses_parent_id_idx" ON "team_page_blocks_team_grid_members_courses" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_publications_order_idx" ON "team_page_blocks_team_grid_members_publications" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_publications_parent_id_idx" ON "team_page_blocks_team_grid_members_publications" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_academic_links_order_idx" ON "team_page_blocks_team_grid_members_academic_links" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_academic_links_parent_id_idx" ON "team_page_blocks_team_grid_members_academic_links" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_order_idx" ON "team_page_blocks_team_grid_members" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_members_parent_id_idx" ON "team_page_blocks_team_grid_members" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_members_photo_idx" ON "team_page_blocks_team_grid_members" USING btree ("photo_id");
  CREATE INDEX "team_page_blocks_team_grid_order_idx" ON "team_page_blocks_team_grid" USING btree ("_order");
  CREATE INDEX "team_page_blocks_team_grid_parent_id_idx" ON "team_page_blocks_team_grid" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_team_grid_path_idx" ON "team_page_blocks_team_grid" USING btree ("_path");
  CREATE INDEX "team_page_blocks_rich_content_order_idx" ON "team_page_blocks_rich_content" USING btree ("_order");
  CREATE INDEX "team_page_blocks_rich_content_parent_id_idx" ON "team_page_blocks_rich_content" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_rich_content_path_idx" ON "team_page_blocks_rich_content" USING btree ("_path");
  CREATE INDEX "team_page_blocks_call_to_action_buttons_order_idx" ON "team_page_blocks_call_to_action_buttons" USING btree ("_order");
  CREATE INDEX "team_page_blocks_call_to_action_buttons_parent_id_idx" ON "team_page_blocks_call_to_action_buttons" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_call_to_action_order_idx" ON "team_page_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "team_page_blocks_call_to_action_parent_id_idx" ON "team_page_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_call_to_action_path_idx" ON "team_page_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "team_page_blocks_call_to_action_background_image_idx" ON "team_page_blocks_call_to_action" USING btree ("background_image_id");
  CREATE INDEX "team_page_blocks_banner_alert_order_idx" ON "team_page_blocks_banner_alert" USING btree ("_order");
  CREATE INDEX "team_page_blocks_banner_alert_parent_id_idx" ON "team_page_blocks_banner_alert" USING btree ("_parent_id");
  CREATE INDEX "team_page_blocks_banner_alert_path_idx" ON "team_page_blocks_banner_alert" USING btree ("_path");
  CREATE UNIQUE INDEX "team_page_slug_idx" ON "team_page" USING btree ("slug");
  CREATE INDEX "team_page_updated_at_idx" ON "team_page" USING btree ("updated_at");
  CREATE INDEX "team_page_created_at_idx" ON "team_page" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_page_fk" FOREIGN KEY ("team_page_id") REFERENCES "public"."team_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_team_page_id_idx" ON "payload_locked_documents_rels" USING btree ("team_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_grid_members_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_members_research_interests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_members_education" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_members_experience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_members_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_members_courses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_members_publications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_grid_members_academic_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_research_interests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_education" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_experience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_courses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_publications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members_academic_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_team_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_rich_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_call_to_action_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_call_to_action" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page_blocks_banner_alert" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_team_grid_members_social_links" CASCADE;
  DROP TABLE "pages_blocks_team_grid_members_research_interests" CASCADE;
  DROP TABLE "pages_blocks_team_grid_members_education" CASCADE;
  DROP TABLE "pages_blocks_team_grid_members_experience" CASCADE;
  DROP TABLE "pages_blocks_team_grid_members_awards" CASCADE;
  DROP TABLE "pages_blocks_team_grid_members_courses" CASCADE;
  DROP TABLE "pages_blocks_team_grid_members_publications" CASCADE;
  DROP TABLE "pages_blocks_team_grid_members_academic_links" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_social_links" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_research_interests" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_education" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_experience" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_awards" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_courses" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_publications" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members_academic_links" CASCADE;
  DROP TABLE "team_page_blocks_team_grid_members" CASCADE;
  DROP TABLE "team_page_blocks_team_grid" CASCADE;
  DROP TABLE "team_page_blocks_rich_content" CASCADE;
  DROP TABLE "team_page_blocks_call_to_action_buttons" CASCADE;
  DROP TABLE "team_page_blocks_call_to_action" CASCADE;
  DROP TABLE "team_page_blocks_banner_alert" CASCADE;
  DROP TABLE "team_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_page_fk";
  
  DROP INDEX "payload_locked_documents_rels_team_page_id_idx";
  ALTER TABLE "pages_blocks_team_grid_members" DROP COLUMN "slug";
  ALTER TABLE "pages_blocks_team_grid_members" DROP COLUMN "profile_link";
  ALTER TABLE "pages_blocks_team_grid_members" DROP COLUMN "biography";
  ALTER TABLE "pages_blocks_team_grid_members" DROP COLUMN "email";
  ALTER TABLE "pages_blocks_team_grid_members" DROP COLUMN "phone";
  ALTER TABLE "pages_blocks_team_grid_members" DROP COLUMN "office";
  ALTER TABLE "pages_blocks_team_grid" DROP COLUMN "show_social_links";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_page_id";
  DROP TYPE "public"."enum_pages_blocks_team_grid_members_social_links_platform";
  DROP TYPE "public"."enum_pages_blocks_team_grid_members_academic_links_platform";
  DROP TYPE "public"."enum_team_page_blocks_team_grid_members_social_links_platform";
  DROP TYPE "public"."enum_team_page_blocks_team_grid_members_academic_links_platform";
  DROP TYPE "public"."enum_team_page_blocks_team_grid_heading_alignment";
  DROP TYPE "public"."enum_team_page_blocks_team_grid_columns";
  DROP TYPE "public"."enum_team_page_blocks_rich_content_heading_alignment";
  DROP TYPE "public"."enum_team_page_blocks_rich_content_max_width";
  DROP TYPE "public"."enum_team_page_blocks_call_to_action_buttons_variant";
  DROP TYPE "public"."enum_team_page_blocks_call_to_action_heading_alignment";
  DROP TYPE "public"."enum_team_page_blocks_call_to_action_background_type";
  DROP TYPE "public"."enum_team_page_blocks_banner_alert_heading_alignment";
  DROP TYPE "public"."enum_team_page_blocks_banner_alert_type";
  DROP TYPE "public"."enum_team_page_status";`)
}
