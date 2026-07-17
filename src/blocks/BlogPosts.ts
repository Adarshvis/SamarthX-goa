import type { Block } from 'payload'
import { iconField, colorField } from './shared'

export const BlogPosts: Block = {
  slug: 'blogPosts',
  labels: { singular: 'Blog Posts', plural: 'Blog Posts' },
  fields: [
    {
      name: 'sectionHeading',
      type: 'richText',
      label: 'Section Heading',
      admin: {
        description: 'Rich text heading displayed above this block',
      },
    },
    {
      name: 'sectionDescription',
      type: 'richText',
      label: 'Section Description',
      admin: {
        description: 'Rich text description below the heading',
      },
    },
    {
      name: 'headingAlignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      required: true,
      options: [
        { label: 'Blog Cards Grid', value: 'cards' },
        { label: 'Spotlight (featured + side list)', value: 'spotlight' },
      ],
      admin: {
        description: 'Choose between a card grid or a featured spotlight layout',
      },
    },
    {
      name: 'entryType',
      type: 'select',
      defaultValue: 'manual',
      required: true,
      label: 'Blog Source',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Fetch from Blogs Collection', value: 'collection' },
      ],
      admin: {
        description: 'Choose manual card entry or automatic fetch from Blogs collection.',
      },
    },
    {
      name: 'articles',
      type: 'array',
      required: false,
      label: 'Blog Posts',
      admin: {
        condition: (_, siblingData) => siblingData?.entryType !== 'collection',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'excerpt',
          type: 'textarea',
          admin: { description: 'Short summary or excerpt' },
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'category',
          type: 'text',
          admin: { description: 'Category label (e.g. "Technology", "Education")' },
        },
        { name: 'author', type: 'text', admin: { description: 'Author name' } },
        { name: 'readTime', type: 'text', admin: { description: 'Estimated read time (e.g. "5 min read")' } },
        { name: 'date', type: 'date', admin: { description: 'Published date' } },
        { name: 'url', type: 'text', admin: { description: 'Link to the full blog post' } },
        iconField('icon', 'Category Icon'),
        colorField('categoryColor', 'Category Badge Color', '#3B82F6'),
      ],
    },
    {
      name: 'collectionSource',
      type: 'group',
      label: 'Collection Fetch Settings',
      admin: {
        condition: (_, siblingData) => siblingData?.entryType === 'collection',
      },
      fields: [
        {
          name: 'limit',
          type: 'number',
          defaultValue: 6,
          min: 1,
          max: 24,
          required: true,
          admin: { description: 'Maximum number of posts to fetch' },
        },
        {
          name: 'sortBy',
          type: 'select',
          defaultValue: 'latest',
          options: [
            { label: 'Latest First', value: 'latest' },
            { label: 'Oldest First', value: 'oldest' },
          ],
        },
        {
          name: 'category',
          type: 'text',
          admin: { description: 'Optional category filter (exact match)' },
        },
        {
          name: 'featuredOnly',
          type: 'checkbox',
          defaultValue: false,
          label: 'Fetch only featured blog posts',
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'cards',
      },
    },
    {
      type: 'group',
      name: 'bottomLink',
      label: 'View All Link',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'View All Blogs',
          admin: { condition: (_, siblingData) => siblingData?.enabled },
        },
        {
          name: 'url',
          type: 'text',
          admin: { condition: (_, siblingData) => siblingData?.enabled },
        },
      ],
    },
    colorField('backgroundColor', 'Section Background Color', '#F9FAFB'),
  ],
}
