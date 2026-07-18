import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_showcase_buttons_variant" AS ENUM('primary', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_showcase_trust_badges_color_theme" AS ENUM('blue', 'green', 'purple', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_hero_showcase_visual_slides_media_type" AS ENUM('image', 'video', 'externalVideo', 'animation');
  CREATE TYPE "public"."enum_pages_blocks_hero_showcase_floating_cards_color_theme" AS ENUM('blue', 'green', 'purple', 'orange');
  CREATE TYPE "public"."enum_pages_blocks_hero_showcase_floating_cards_position" AS ENUM('topLeft', 'midLeft', 'topRight', 'bottomRight');
  CREATE TYPE "public"."enum_pages_blocks_hero_showcase_visual_type" AS ENUM('illustration', 'mediaSlider');
  ALTER TYPE "public"."enum_pages_blocks_hero_layout" ADD VALUE 'splitShowcase' BEFORE 'contained';
  CREATE TABLE "pages_blocks_hero_showcase_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"variant" "enum_pages_blocks_hero_showcase_buttons_variant" DEFAULT 'primary',
  	"icon" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_hero_showcase_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"color_theme" "enum_pages_blocks_hero_showcase_trust_badges_color_theme" DEFAULT 'blue'
  );
  
  CREATE TABLE "pages_blocks_hero_showcase_visual_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_type" "enum_pages_blocks_hero_showcase_visual_slides_media_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_url" varchar,
  	"video_poster_id" integer,
  	"external_video_url" varchar,
  	"animation_url" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_showcase_floating_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"label" varchar,
  	"value" varchar,
  	"suffix" varchar,
  	"color_theme" "enum_pages_blocks_hero_showcase_floating_cards_color_theme" DEFAULT 'blue',
  	"position" "enum_pages_blocks_hero_showcase_floating_cards_position" DEFAULT 'topLeft'
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_eyebrow_enabled" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_eyebrow_icon" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_eyebrow_text" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_title" jsonb;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_subtitle" jsonb;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_visual_type" "enum_pages_blocks_hero_showcase_visual_type" DEFAULT 'illustration';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_slider_settings_auto_play" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_slider_settings_auto_play_interval" numeric DEFAULT 5000;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_slider_settings_show_arrows" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_slider_settings_show_dots" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "showcase_show_floating_cards" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_hero_showcase_buttons" ADD CONSTRAINT "pages_blocks_hero_showcase_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_showcase_trust_badges" ADD CONSTRAINT "pages_blocks_hero_showcase_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_showcase_visual_slides" ADD CONSTRAINT "pages_blocks_hero_showcase_visual_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_showcase_visual_slides" ADD CONSTRAINT "pages_blocks_hero_showcase_visual_slides_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_showcase_visual_slides" ADD CONSTRAINT "pages_blocks_hero_showcase_visual_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_showcase_floating_cards" ADD CONSTRAINT "pages_blocks_hero_showcase_floating_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_showcase_buttons_order_idx" ON "pages_blocks_hero_showcase_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_showcase_buttons_parent_id_idx" ON "pages_blocks_hero_showcase_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_showcase_trust_badges_order_idx" ON "pages_blocks_hero_showcase_trust_badges" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_showcase_trust_badges_parent_id_idx" ON "pages_blocks_hero_showcase_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_showcase_visual_slides_order_idx" ON "pages_blocks_hero_showcase_visual_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_showcase_visual_slides_parent_id_idx" ON "pages_blocks_hero_showcase_visual_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_showcase_visual_slides_image_idx" ON "pages_blocks_hero_showcase_visual_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_showcase_visual_slides_video_poster_idx" ON "pages_blocks_hero_showcase_visual_slides" USING btree ("video_poster_id");
  CREATE INDEX "pages_blocks_hero_showcase_floating_cards_order_idx" ON "pages_blocks_hero_showcase_floating_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_showcase_floating_cards_parent_id_idx" ON "pages_blocks_hero_showcase_floating_cards" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_showcase_buttons" CASCADE;
  DROP TABLE "pages_blocks_hero_showcase_trust_badges" CASCADE;
  DROP TABLE "pages_blocks_hero_showcase_visual_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_showcase_floating_cards" CASCADE;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "layout" SET DEFAULT 'fullWidth'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_layout";
  CREATE TYPE "public"."enum_pages_blocks_hero_layout" AS ENUM('fullWidth', 'fullscreenOverlayCarousel', 'split', 'contained');
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "layout" SET DEFAULT 'fullWidth'::"public"."enum_pages_blocks_hero_layout";
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_pages_blocks_hero_layout" USING "layout"::"public"."enum_pages_blocks_hero_layout";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_eyebrow_enabled";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_eyebrow_icon";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_eyebrow_text";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_title";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_subtitle";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_visual_type";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_slider_settings_auto_play";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_slider_settings_auto_play_interval";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_slider_settings_show_arrows";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_slider_settings_show_dots";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "showcase_show_floating_cards";
  DROP TYPE "public"."enum_pages_blocks_hero_showcase_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_showcase_trust_badges_color_theme";
  DROP TYPE "public"."enum_pages_blocks_hero_showcase_visual_slides_media_type";
  DROP TYPE "public"."enum_pages_blocks_hero_showcase_floating_cards_color_theme";
  DROP TYPE "public"."enum_pages_blocks_hero_showcase_floating_cards_position";
  DROP TYPE "public"."enum_pages_blocks_hero_showcase_visual_type";`)
}
