import type { Block } from 'payload'

function slideFields() {
  return [
    {
      name: 'mediaType',
      type: 'select' as const,
      defaultValue: 'image',
      required: true,
      options: [
        { label: 'Text Content (No Media)', value: 'textOnly' },
        { label: 'Image Media', value: 'image' },
        { label: 'Video Media (Upload)', value: 'video' },
        { label: 'YouTube / Vimeo', value: 'externalVideo' },
        { label: 'Animation (Lottie / GIF)', value: 'animation' },
        { label: 'Data Visualization / Map', value: 'dataViz' },
      ],
    },
    {
      name: 'image',
      type: 'upload' as const,
      relationTo: 'media' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'image',
      },
    },
    {
      name: 'videoUrl',
      type: 'text' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'video',
        description: 'URL to self-hosted video file (mp4, webm)',
      },
    },
    {
      name: 'videoPoster',
      type: 'upload' as const,
      relationTo: 'media' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'video',
        description: 'Poster/thumbnail image for the video',
      },
    }, 
    {
      name: 'externalVideoUrl',
      type: 'text' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'externalVideo',
        description: 'YouTube or Vimeo URL (e.g. https://youtube.com/watch?v=...)',
      },
    },
    {
      name: 'animationUrl',
      type: 'text' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'animation',
        description: 'URL to Lottie JSON file or GIF image',
      },
    },
    { 
      name: 'dataVizEmbed',
      type: 'code' as const,
      admin: {
        language: 'html',
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'dataViz',
        description: 'Embed code for map, chart, or data visualization',
      },
    },
    {
      name: 'showText',
      type: 'checkbox' as const,
      defaultValue: true,
      label: 'Show text overlay',
    },
    {
      name: 'heading', 
      type: 'text' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.showText !== false,
      },
    },
    {
      name: 'headingColor',
      type: 'text' as const,
      defaultValue: '#FFFFFF',
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.showText !== false,
        components: {
          Field: '@/components/admin/ColorPickerField#ColorPickerField',
        },
        description: 'Heading text color',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.showText !== false,
      },
    },
    {
      name: 'subtitleColor',
      type: 'text' as const,
      defaultValue: '#E5E7EB',
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.showText !== false,
        components: {
          Field: '@/components/admin/ColorPickerField#ColorPickerField',
        },
        description: 'Description text color',
      },
    },
    {
      name: 'buttons',
      type: 'array' as const,
      maxRows: 3,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.showText !== false,
      },
      fields: [
        { name: 'label', type: 'text' as const, required: true },
        { name: 'url', type: 'text' as const, required: true },
        {
          name: 'variant',
          type: 'select' as const,
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Filled)', value: 'primary' },
            { label: 'Secondary (Filled)', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
        {
          name: 'icon',
          type: 'text' as const,
          admin: {
            components: {
              Field: '@/components/admin/IconPickerField#IconPickerField',
            },
            description: 'Select button icon',
          },
        },
      ],
    },
  ]
}

// Media-only fields (no text overlay) reused for the Split Showcase right-side slider.
function showcaseMediaSlideFields() {
  return [
    {
      name: 'mediaType',
      type: 'select' as const,
      defaultValue: 'image',
      required: true,
      options: [
        { label: 'Image Media', value: 'image' },
        { label: 'Video Media (Upload)', value: 'video' },
        { label: 'YouTube / Vimeo', value: 'externalVideo' },
        { label: 'Animation (Lottie / GIF)', value: 'animation' },
      ],
    },
    {
      name: 'image',
      type: 'upload' as const,
      relationTo: 'media' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'image',
      },
    },
    {
      name: 'videoUrl',
      type: 'text' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'video',
        description: 'URL to self-hosted video file (mp4, webm)',
      },
    },
    {
      name: 'videoPoster',
      type: 'upload' as const,
      relationTo: 'media' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'video',
        description: 'Poster/thumbnail image for the video',
      },
    },
    {
      name: 'externalVideoUrl',
      type: 'text' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'externalVideo',
        description: 'YouTube or Vimeo URL',
      },
    },
    {
      name: 'animationUrl',
      type: 'text' as const,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.mediaType === 'animation',
        description: 'URL to Lottie JSON file or GIF image',
      },
    },
  ]
}

const colorThemeField = {
  name: 'colorTheme',
  type: 'select' as const,
  defaultValue: 'blue',
  options: [
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Purple', value: 'purple' },
    { label: 'Orange', value: 'orange' },
  ],
}

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'single',
      required: true,
      options: [
        { label: 'Single Slide', value: 'single' },
        { label: 'Carousel (Multiple Slides)', value: 'carousel' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layout !== 'splitShowcase',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'fullWidth',
      required: true,
      options: [
        { label: 'Full-Width Background', value: 'fullWidth' },
        { label: 'Fullscreen Overlay Carousel', value: 'fullscreenOverlayCarousel' },
        { label: '50/50 Split (Text + Media)', value: 'split' },
        { label: 'Split Showcase (Text + Media + Cards)', value: 'splitShowcase' },
        { label: 'Contained', value: 'contained' },
      ],
    },
    {
      name: 'splitDirection',
      type: 'select',
      defaultValue: 'textLeft',
      options: [
        { label: 'Text Left, Media Right', value: 'textLeft' },
        { label: 'Text Right, Media Left', value: 'textRight' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'split',
      },
    },
    {
      name: 'height',
      type: 'number',
      defaultValue: 600,
      admin: { description: 'Hero height in pixels (e.g. 600)' },
    },
    {
      name: 'textAlignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'textVerticalPosition',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
    },
    {
      name: 'contentMaxWidth',
      type: 'number',
      defaultValue: 1200,
      admin: {
        description: 'Maximum content width in pixels for hero text container',
      },
    },
    {
      name: 'contentPaddingX',
      type: 'number',
      defaultValue: 24,
      admin: {
        description: 'Horizontal content padding in pixels',
      },
    },
    {
      name: 'contentPaddingY',
      type: 'number',
      defaultValue: 32,
      admin: {
        description: 'Vertical content padding in pixels',
      },
    },
    {
      name: 'constantOverlayContent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout === 'fullscreenOverlayCarousel' && siblingData?.mode === 'carousel',
        description: 'Keep text/buttons constant while only the background slide changes',
      },
    },
    {
      type: 'group',
      name: 'overlay',
      label: 'Overlay Settings',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        {
          name: 'color',
          type: 'text',
          defaultValue: '#000000',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            components: {
              Field: '@/components/admin/ColorPickerField#ColorPickerField',
            },
            description: 'Pick overlay color',
          },
        }, 
        {
          name: 'opacity',
          type: 'number',
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            components: {
              Field: '@/components/admin/OpacitySliderField#OpacitySliderField',
            },
            description: 'Overlay opacity (0-100)',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'headerGlass',
      label: 'Header Glass (Fullscreen Overlay)',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'fullscreenOverlayCarousel',
      },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        {
          name: 'fillColor',
          type: 'text',
          defaultValue: '#FFFFFF',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            components: {
              Field: '@/components/admin/ColorPickerField#ColorPickerField',
            },
            description: 'Glass overlay tint color for the fixed header',
          },
        },
        {
          name: 'fillOpacity',
          type: 'number',
          defaultValue: 20,
          min: 0,
          max: 100,
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            description: 'Glass tint opacity in percent',
          },
        },
        {
          name: 'blurAmount',
          type: 'number',
          defaultValue: 16,
          min: 0,
          max: 40,
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            description: 'Background blur amount in pixels',
          },
        },
        {
          name: 'showDivider',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            description: 'Show thin divider under header while hero is active',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'carouselSettings',
      label: 'Carousel Settings',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.mode === 'carousel' && siblingData?.layout !== 'splitShowcase',
      },
      fields: [
        { name: 'autoPlay', type: 'checkbox', defaultValue: true },
        {
          name: 'autoPlayInterval',
          type: 'number',
          defaultValue: 5000,
          admin: { 
            description: 'Interval in milliseconds (e.g. 5000 = 5 seconds)',
            condition: (_, siblingData) => siblingData?.autoPlay,
          },
        },
        { name: 'showArrows', type: 'checkbox', defaultValue: true },
        { name: 'showDots', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      type: 'group',
      name: 'showcaseEyebrow',
      label: 'Split Showcase — Eyebrow Badge',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'splitShowcase',
      },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        {
          name: 'icon',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            components: { Field: '@/components/admin/IconPickerField#IconPickerField' },
            description: 'Badge icon (Lucide)',
          },
        },
        {
          name: 'text',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
            description: 'e.g. "Building Better Education, Together"',
          },
        },
      ],
    },
    {
      name: 'showcaseTitle',
      type: 'richText',
      label: 'Split Showcase — Title',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'splitShowcase',
        description: 'Main heading. Use the color tool to highlight words.',
      },
    },
    {
      name: 'showcaseSubtitle',
      type: 'richText',
      label: 'Split Showcase — Subtitle',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'splitShowcase',
        description: 'Supporting text below the heading.',
      },
    },
    {
      name: 'showcaseButtons',
      type: 'array',
      label: 'Split Showcase — Buttons',
      maxRows: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'splitShowcase',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Filled)', value: 'primary' },
            { label: 'Secondary (White)', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            components: { Field: '@/components/admin/IconPickerField#IconPickerField' },
            description: 'Button icon (Lucide)',
          },
        },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'showcaseTrustBadges',
      type: 'array',
      label: 'Split Showcase — Trust Badges',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'splitShowcase',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            components: { Field: '@/components/admin/IconPickerField#IconPickerField' },
            description: 'Badge icon (Lucide)',
          },
        },
        { name: 'label', type: 'text', required: true },
        { ...colorThemeField },
      ],
    },
    {
      name: 'showcaseVisualType',
      type: 'select',
      defaultValue: 'illustration',
      label: 'Split Showcase — Right Visual Type',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'splitShowcase',
      },
      options: [
        { label: 'Built-in School Illustration', value: 'illustration' },
        { label: 'Media Slider (images / video / animation)', value: 'mediaSlider' },
      ],
    },
    {
      name: 'showcaseVisualSlides',
      type: 'array',
      label: 'Split Showcase — Media Slides',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout === 'splitShowcase' && siblingData?.showcaseVisualType === 'mediaSlider',
        description: 'Add one or more media items. Multiple items become a slider.',
      },
      fields: showcaseMediaSlideFields(),
    },
    {
      type: 'group',
      name: 'showcaseSliderSettings',
      label: 'Split Showcase — Slider Settings',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout === 'splitShowcase' && siblingData?.showcaseVisualType === 'mediaSlider',
      },
      fields: [
        { name: 'autoPlay', type: 'checkbox', defaultValue: true },
        {
          name: 'autoPlayInterval',
          type: 'number',
          defaultValue: 5000,
          admin: {
            condition: (_, siblingData) => siblingData?.autoPlay,
            description: 'Interval in milliseconds',
          },
        },
        { name: 'showArrows', type: 'checkbox', defaultValue: true },
        { name: 'showDots', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'showcaseShowFloatingCards',
      type: 'checkbox',
      defaultValue: true,
      label: 'Split Showcase — Show floating cards',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'splitShowcase',
      },
    },
    {
      name: 'showcaseFloatingCards',
      type: 'array',
      label: 'Split Showcase — Floating Stat Cards',
      maxRows: 4,
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout === 'splitShowcase' && siblingData?.showcaseShowFloatingCards !== false,
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            components: { Field: '@/components/admin/IconPickerField#IconPickerField' },
            description: 'Card icon (Lucide)',
          },
        },
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'suffix', type: 'text', admin: { description: 'e.g. "↑ 12.5%" or "New"' } },
        { ...colorThemeField },
        {
          name: 'position',
          type: 'select',
          defaultValue: 'topLeft',
          options: [
            { label: 'Top Left', value: 'topLeft' },
            { label: 'Middle Left', value: 'midLeft' },
            { label: 'Top Right', value: 'topRight' },
            { label: 'Bottom Right', value: 'bottomRight' },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'singleSlide',
      label: 'Slide Content',
      admin: { condition: (_, siblingData) => siblingData?.mode === 'single' && siblingData?.layout !== 'splitShowcase' },
      fields: slideFields(),
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.mode === 'carousel' && siblingData?.layout !== 'splitShowcase',
      },
      fields: slideFields(),
    },
  ],
}
