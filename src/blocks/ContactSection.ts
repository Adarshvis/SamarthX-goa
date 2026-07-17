import type { Block } from 'payload'
import { iconField, colorField } from './shared'

export const ContactSection: Block = {
  slug: 'contactSection',
  labels: { singular: 'Contact Section', plural: 'Contact Sections' },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'modern',
      required: true,
      options: [
        { label: 'Modern (heading + contact cards + form)', value: 'modern' },
        { label: 'Classic (logos + org info + form)', value: 'classic' },
        { label: 'Centered (heading top, cards + form below)', value: 'centered' },
        { label: 'Form Only', value: 'formOnly' },
      ],
      admin: { description: 'Choose the layout style for this contact section' },
    },

    // ── Section Heading (rich text for styling flexibility) ──
    {
      name: 'sectionHeading',
      type: 'richText',
      label: 'Section Heading',
      admin: {
        description: 'Rich text heading (e.g. "Get in <italic>Touch</italic>")',
        condition: (_, siblingData) => siblingData?.layout !== 'formOnly',
      },
    },
    {
      name: 'sectionDescription',
      type: 'richText',
      label: 'Section Description',
      admin: {
        description: 'Description text below the heading',
        condition: (_, siblingData) => siblingData?.layout !== 'formOnly',
      },
    },

    // ── Contact Info Items (repeatable) ──
    {
      name: 'contactItems',
      type: 'array',
      label: 'Contact Info Items',
      admin: {
        description: 'Add contact details like location, phone, email, etc.',
        condition: (_, siblingData) =>
          siblingData?.layout === 'modern' || siblingData?.layout === 'centered',
      },
      fields: [
        iconField('icon', 'Icon'),
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Our Location"' } },
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "Goa Education Complex, Alto, Porvorim"' } },
        colorField('iconColor', 'Icon Color', '#3B82F6'),
      ],
    },

    // ── Classic Layout: Logos + Org Info ──
    {
      name: 'logos',
      type: 'array',
      label: 'Organization Logos',
      admin: {
        description: 'Upload logos to display (classic layout)',
        condition: (_, siblingData) => siblingData?.layout === 'classic',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', admin: { description: 'Alt text for the logo' } },
      ],
    },
    {
      name: 'organizationName',
      type: 'text',
      admin: {
        description: 'e.g. "GOVERNMENT OF GOA"',
        condition: (_, siblingData) => siblingData?.layout === 'classic',
      },
    },
    {
      name: 'organizationDetails',
      type: 'textarea',
      admin: {
        description: 'Additional org details (address, phone, email)',
        condition: (_, siblingData) => siblingData?.layout === 'classic',
      },
    },

    // ── Form Configuration ──
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Select a Form Builder form to embed in this section',
      },
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      defaultValue: 'Send Message',
      admin: { description: 'Override the submit button text' },
    },

    // ── Styling ──
    colorField('backgroundColor', 'Section Background Color', '#ffffff'),
    colorField('buttonColor', 'Submit Button Color', ''),
  ],
}
