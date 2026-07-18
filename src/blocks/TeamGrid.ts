import type { Block } from 'payload'
import { sectionHeadingFields } from './shared'

export const TeamGrid: Block = {
  slug: 'teamGrid',
  labels: { singular: 'Team / Faculty Grid', plural: 'Team / Faculty Grids' },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Social Links on Cards',
    },
    {
      name: 'members',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Profile Photo',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          admin: {
            description: 'URL slug for the profile page. Auto-generated from name if left empty.',
          },
          hooks: {
            beforeValidate: [
              ({ value, data }: any) => {
                if (!value && data?.name) {
                  return data.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                }
                return value
              },
            ],
          },
        },
        {
          name: 'role',
          type: 'text',
          label: 'Specialty / Designation',
          admin: { description: 'e.g. "Principal", "Math Teacher", "HOD Science"' },
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Short Description',
        },
        {
          name: 'profileLink',
          type: 'text',
          admin: {
            description: 'External profile URL. Leave empty to auto-link to /team/{slug}.',
          },
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Social Links',
          maxRows: 6,
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter / X', value: 'twitter-x' },
                { label: 'GitHub', value: 'github' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Google Scholar', value: 'google' },
                { label: 'Website', value: 'globe' },
                { label: 'Email', value: 'envelope' },
              ],
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
        {
          type: 'collapsible',
          label: 'Profile Page Details',
          admin: { initCollapsed: true },
          fields: [
            { name: 'biography', type: 'textarea', label: 'Full Biography' },
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text' },
            { name: 'office', type: 'text', label: 'Office Location' },
            {
              name: 'researchInterests',
              type: 'array',
              fields: [{ name: 'interest', type: 'text', required: true }],
            },
            {
              name: 'education',
              type: 'array',
              fields: [
                { name: 'degree', type: 'text', required: true },
                { name: 'institution', type: 'text', required: true },
                { name: 'year', type: 'text' },
              ],
            },
            {
              name: 'experience',
              type: 'array',
              fields: [
                { name: 'position', type: 'text', required: true },
                { name: 'organization', type: 'text', required: true },
                { name: 'duration', type: 'text' },
                { name: 'expDescription', type: 'textarea', label: 'Description' },
              ],
            },
            {
              name: 'awards',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'year', type: 'text' },
                { name: 'organization', type: 'text' },
              ],
            },
            {
              name: 'courses',
              type: 'array',
              fields: [
                { name: 'courseName', type: 'text', required: true },
                { name: 'courseCode', type: 'text' },
                { name: 'semester', type: 'text' },
                { name: 'courseDescription', type: 'textarea', label: 'Description' },
              ],
            },
            {
              name: 'publications',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'journal', type: 'text' },
                { name: 'year', type: 'text' },
                { name: 'link', type: 'text' },
              ],
            },
            {
              name: 'academicLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Google Scholar', value: 'google-scholar' },
                    { label: 'ResearchGate', value: 'researchgate' },
                    { label: 'ORCID', value: 'orcid' },
                    { label: 'Academia.edu', value: 'academia' },
                    { label: 'Scopus', value: 'scopus' },
                    { label: 'Web of Science', value: 'wos' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
