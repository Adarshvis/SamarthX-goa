import type { Block } from 'payload'
import { iconField, colorField } from './shared'

export const StatsBar: Block = {
  slug: 'statsBar',
  labels: { singular: 'Stats Bar', plural: 'Stats Bars' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Stat Items',
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Each item can show a value + label, or just a label (leave value empty).',
      },
      fields: [
        iconField('icon', 'Icon'),
        {
          name: 'value',
          type: 'text',
          admin: {
            description: 'Big stat value, e.g. "368+". Leave empty to show only the label.',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'Label / title, e.g. "Schools Onboarded" or "Data-Driven Decisions"' },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Optional supporting line shown below the label (e.g. "Actionable insights for better governance")',
          },
        },
        {
          name: 'colorTheme',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Purple', value: 'purple' },
            { label: 'Orange', value: 'orange' },
          ],
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'auto',
      label: 'Columns (desktop)',
      options: [
        { label: 'Auto (match item count)', value: 'auto' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      name: 'showDividers',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show dividers between items',
    },
    colorField('backgroundColor', 'Section Background Color', ''),
  ],
}
