import * as migration_20260407_060924_add_feature_cards_layout from './20260407_060924_add_feature_cards_layout';
import * as migration_20260407_063000_cleanup_invalid_header_child_pages from './20260407_063000_cleanup_invalid_header_child_pages';
import * as migration_20260407_115828 from './20260407_115828';
import * as migration_20260408_010000_add_flexible_row_card_blocks from './20260408_010000_add_flexible_row_card_blocks';
import * as migration_20260408_020000_add_flex_buttons_subblock from './20260408_020000_add_flex_buttons_subblock';
import * as migration_20260408_030000_add_flex_dashboard_mock_subblock from './20260408_030000_add_flex_dashboard_mock_subblock';
import * as migration_20260408_040000_update_flex_dashboard_mock_typography from './20260408_040000_update_flex_dashboard_mock_typography';
import * as migration_20260408_050000_cleanup_invalid_page_relationships from './20260408_050000_cleanup_invalid_page_relationships';
import * as migration_20260408_060000_update_flex_dashboard_mock_badge_animations from './20260408_060000_update_flex_dashboard_mock_badge_animations';
import * as migration_20260408_070000_convert_flex_feature_cards_text_to_richtext from './20260408_070000_convert_flex_feature_cards_text_to_richtext';
import * as migration_20260408_080000_add_highlight_cards_style_controls from './20260408_080000_add_highlight_cards_style_controls';
import * as migration_20260408_090000_add_dashboard_mock_layout_variant from './20260408_090000_add_dashboard_mock_layout_variant';
import * as migration_20260411_120000_add_hero_fullscreen_overlay_fields from './20260411_120000_add_hero_fullscreen_overlay_fields';
import * as migration_20260411_183827_add_goa_snapshot_block from './20260411_183827_add_goa_snapshot_block';
import * as migration_20260412_220000_add_goa_snapshot_summary_cards from './20260412_220000_add_goa_snapshot_summary_cards';
import * as migration_20260413_110000_add_hero_header_glass_fields from './20260413_110000_add_hero_header_glass_fields';
import * as migration_20260413_120000_add_hero_constant_overlay_content from './20260413_120000_add_hero_constant_overlay_content';
import * as migration_20260413_130000_add_hero_text_color_fields from './20260413_130000_add_hero_text_color_fields';
import * as migration_20260413_131000_fix_hero_single_slide_color_columns from './20260413_131000_fix_hero_single_slide_color_columns';
import * as migration_20260413_140000_add_goa_snapshot_show_apply_button from './20260413_140000_add_goa_snapshot_show_apply_button';
import * as migration_20260415_033049 from './20260415_033049';
import * as migration_20260415_034422 from './20260415_034422';
import * as migration_20260415_041922 from './20260415_041922';
import * as migration_20260717_184132_add_hero_split_showcase from './20260717_184132_add_hero_split_showcase';
import * as migration_20260718_055723_verify_showcase_flatten from './20260718_055723_verify_showcase_flatten';
import * as migration_20260718_072604_add_stats_bar_block from './20260718_072604_add_stats_bar_block';
import * as migration_20260718_075022_add_statistics_impact_layout from './20260718_075022_add_statistics_impact_layout';
import * as migration_20260718_091328_statistics_richtext_heading from './20260718_091328_statistics_richtext_heading';
import * as migration_20260718_095951_add_stats_bar_description from './20260718_095951_add_stats_bar_description';
import * as migration_20260718_100312_newsupdates_richtext_heading from './20260718_100312_newsupdates_richtext_heading';
import * as migration_20260718_112609_add_team_page from './20260718_112609_add_team_page';

export const migrations = [
  {
    up: migration_20260407_060924_add_feature_cards_layout.up,
    down: migration_20260407_060924_add_feature_cards_layout.down,
    name: '20260407_060924_add_feature_cards_layout',
  },
  {
    up: migration_20260407_063000_cleanup_invalid_header_child_pages.up,
    down: migration_20260407_063000_cleanup_invalid_header_child_pages.down,
    name: '20260407_063000_cleanup_invalid_header_child_pages',
  },
  {
    up: migration_20260407_115828.up,
    down: migration_20260407_115828.down,
    name: '20260407_115828',
  },
  {
    up: migration_20260408_010000_add_flexible_row_card_blocks.up,
    down: migration_20260408_010000_add_flexible_row_card_blocks.down,
    name: '20260408_010000_add_flexible_row_card_blocks',
  },
  {
    up: migration_20260408_020000_add_flex_buttons_subblock.up,
    down: migration_20260408_020000_add_flex_buttons_subblock.down,
    name: '20260408_020000_add_flex_buttons_subblock',
  },
  {
    up: migration_20260408_030000_add_flex_dashboard_mock_subblock.up,
    down: migration_20260408_030000_add_flex_dashboard_mock_subblock.down,
    name: '20260408_030000_add_flex_dashboard_mock_subblock',
  },
  {
    up: migration_20260408_040000_update_flex_dashboard_mock_typography.up,
    down: migration_20260408_040000_update_flex_dashboard_mock_typography.down,
    name: '20260408_040000_update_flex_dashboard_mock_typography',
  },
  {
    up: migration_20260408_050000_cleanup_invalid_page_relationships.up,
    down: migration_20260408_050000_cleanup_invalid_page_relationships.down,
    name: '20260408_050000_cleanup_invalid_page_relationships',
  },
  {
    up: migration_20260408_060000_update_flex_dashboard_mock_badge_animations.up,
    down: migration_20260408_060000_update_flex_dashboard_mock_badge_animations.down,
    name: '20260408_060000_update_flex_dashboard_mock_badge_animations',
  },
  {
    up: migration_20260408_070000_convert_flex_feature_cards_text_to_richtext.up,
    down: migration_20260408_070000_convert_flex_feature_cards_text_to_richtext.down,
    name: '20260408_070000_convert_flex_feature_cards_text_to_richtext',
  },
  {
    up: migration_20260408_080000_add_highlight_cards_style_controls.up,
    down: migration_20260408_080000_add_highlight_cards_style_controls.down,
    name: '20260408_080000_add_highlight_cards_style_controls',
  },
  {
    up: migration_20260408_090000_add_dashboard_mock_layout_variant.up,
    down: migration_20260408_090000_add_dashboard_mock_layout_variant.down,
    name: '20260408_090000_add_dashboard_mock_layout_variant',
  },
  {
    up: migration_20260411_120000_add_hero_fullscreen_overlay_fields.up,
    down: migration_20260411_120000_add_hero_fullscreen_overlay_fields.down,
    name: '20260411_120000_add_hero_fullscreen_overlay_fields',
  },
  {
    up: migration_20260411_183827_add_goa_snapshot_block.up,
    down: migration_20260411_183827_add_goa_snapshot_block.down,
    name: '20260411_183827_add_goa_snapshot_block',
  },
  {
    up: migration_20260412_220000_add_goa_snapshot_summary_cards.up,
    down: migration_20260412_220000_add_goa_snapshot_summary_cards.down,
    name: '20260412_220000_add_goa_snapshot_summary_cards',
  },
  {
    up: migration_20260413_110000_add_hero_header_glass_fields.up,
    down: migration_20260413_110000_add_hero_header_glass_fields.down,
    name: '20260413_110000_add_hero_header_glass_fields',
  },
  {
    up: migration_20260413_120000_add_hero_constant_overlay_content.up,
    down: migration_20260413_120000_add_hero_constant_overlay_content.down,
    name: '20260413_120000_add_hero_constant_overlay_content',
  },
  {
    up: migration_20260413_130000_add_hero_text_color_fields.up,
    down: migration_20260413_130000_add_hero_text_color_fields.down,
    name: '20260413_130000_add_hero_text_color_fields',
  },
  {
    up: migration_20260413_131000_fix_hero_single_slide_color_columns.up,
    down: migration_20260413_131000_fix_hero_single_slide_color_columns.down,
    name: '20260413_131000_fix_hero_single_slide_color_columns',
  },
  {
    up: migration_20260413_140000_add_goa_snapshot_show_apply_button.up,
    down: migration_20260413_140000_add_goa_snapshot_show_apply_button.down,
    name: '20260413_140000_add_goa_snapshot_show_apply_button',
  },
  {
    up: migration_20260415_033049.up,
    down: migration_20260415_033049.down,
    name: '20260415_033049',
  },
  {
    up: migration_20260415_034422.up,
    down: migration_20260415_034422.down,
    name: '20260415_034422',
  },
  {
    up: migration_20260415_041922.up,
    down: migration_20260415_041922.down,
    name: '20260415_041922',
  },
  {
    up: migration_20260717_184132_add_hero_split_showcase.up,
    down: migration_20260717_184132_add_hero_split_showcase.down,
    name: '20260717_184132_add_hero_split_showcase',
  },
  {
    up: migration_20260718_055723_verify_showcase_flatten.up,
    down: migration_20260718_055723_verify_showcase_flatten.down,
    name: '20260718_055723_verify_showcase_flatten',
  },
  {
    up: migration_20260718_072604_add_stats_bar_block.up,
    down: migration_20260718_072604_add_stats_bar_block.down,
    name: '20260718_072604_add_stats_bar_block',
  },
  {
    up: migration_20260718_075022_add_statistics_impact_layout.up,
    down: migration_20260718_075022_add_statistics_impact_layout.down,
    name: '20260718_075022_add_statistics_impact_layout',
  },
  {
    up: migration_20260718_091328_statistics_richtext_heading.up,
    down: migration_20260718_091328_statistics_richtext_heading.down,
    name: '20260718_091328_statistics_richtext_heading',
  },
  {
    up: migration_20260718_095951_add_stats_bar_description.up,
    down: migration_20260718_095951_add_stats_bar_description.down,
    name: '20260718_095951_add_stats_bar_description',
  },
  {
    up: migration_20260718_100312_newsupdates_richtext_heading.up,
    down: migration_20260718_100312_newsupdates_richtext_heading.down,
    name: '20260718_100312_newsupdates_richtext_heading',
  },
  {
    up: migration_20260718_112609_add_team_page.up,
    down: migration_20260718_112609_add_team_page.down,
    name: '20260718_112609_add_team_page'
  },
];
