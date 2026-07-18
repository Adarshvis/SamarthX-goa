import type { CollectionConfig } from 'payload'
import { editorAccess, schoolAdminAccess, publishedOrEditor } from '../access/roles'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'status', 'publishedDate', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: publishedOrEditor,
    create: editorAccess,
    update: editorAccess,
    delete: schoolAdminAccess,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Blog post headline' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL-friendly version of title (e.g. "my-first-blog-post")' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: { description: 'Brief summary shown on blog listing pages' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Main image for the blog post' },
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      admin: { description: 'Category label (e.g. Technology, Education, Policy)' },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: { description: 'Main blog post content' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: { description: 'Publication date' },
    },
    {
      name: 'author',
      type: 'text',
      admin: { description: 'Author name' },
    },
    {
      name: 'readTime',
      type: 'text',
      admin: { description: 'Estimated read time (e.g. "5 min read")' },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: { description: 'Related tags/keywords for this blog post' },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Mark as featured blog post' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
