import type { CollectionConfig } from 'payload'
import { publicAccess, editorAccess, schoolAdminAccess } from '../access/roles'
import { TeamGrid } from '../blocks/TeamGrid'
import { RichContent } from '../blocks/RichContent'
import { CallToAction } from '../blocks/CallToAction'
import { BannerAlert } from '../blocks/BannerAlert'

export const TeamPage: CollectionConfig = {
  slug: 'team-page',
  labels: { singular: 'Team Page', plural: 'Team Pages' },
  admin: {
    useAsTitle: 'pageName',
    group: 'Content',
    defaultColumns: ['pageName', 'slug', 'status', 'updatedAt'],
    description: 'Team / Faculty listing pages with member profiles',
  },
  access: {
    read: publicAccess,
    create: editorAccess,
    update: editorAccess,
    delete: schoolAdminAccess,
  },
  fields: [
    {
      name: 'pageName',
      type: 'text',
      required: true,
      admin: { description: 'Internal identifier (e.g. "Main Team Page")' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'group',
      name: 'pageTitle',
      label: 'Page Title & Banner',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { description: 'Page heading (e.g. "Our Team")' } },
        { name: 'eyebrow', type: 'text', admin: { description: 'Small badge text above the title' } },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      defaultValue: 'team',
      admin: { description: 'URL path (e.g. "team" → /team)' },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Layout',
      blocks: [TeamGrid, RichContent, CallToAction, BannerAlert],
    },
  ],
}
