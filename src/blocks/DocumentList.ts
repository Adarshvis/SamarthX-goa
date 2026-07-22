import type { Block } from 'payload'
import { sectionHeadingFields, iconField, colorField } from './shared'

export const DocumentList: Block = {
  slug: 'documentList',
  labels: { singular: 'Document / PDF List', plural: 'Document / PDF Lists' },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'documents',
      type: 'array',
      required: true,
      label: 'Documents',
      labels: { singular: 'Document', plural: 'Documents' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Short line shown below the title' },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Upload a PDF (or any downloadable file)' },
        },
        iconField('icon', 'Icon (optional)'),
        {
          name: 'badge',
          type: 'text',
          admin: { description: 'Optional small badge, e.g. "New" or "2024-25"' },
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '1 Column (list)', value: '1' },
        { label: '2 Columns', value: '2' },
      ],
    },
    {
      name: 'enableView',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show "View" button (opens in-page PDF viewer)',
    },
    {
      name: 'enableDownload',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show "Download" button',
    },
    colorField('accentColor', 'Accent Color', ''),
    colorField('backgroundColor', 'Section Background', ''),
  ],
}
